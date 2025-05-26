// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface CharityNFT {
    function mintNFT(address to, uint256 tokenId, string memory campaignName) external;
}

/**
 * @title CharityCentral
 * @dev Main contract for the charity platform that manages charity organizations and campaign creation
 */
contract CharityCentral is Ownable {
    mapping(address => bool) public verifiedCharities;
    mapping(address => address[]) public charityCampaigns;
    address[] public allCampaigns;
    address public nftContractAddress;

    event CharityVerified(address indexed charityAddress, string name);
    event CampaignCreated(
        address indexed campaignAddress,
        address indexed charityAddress,
        string name,
        uint256 goal,
        string campaignImageURI
    );

    modifier onlyVerifiedCharity() {
        require(verifiedCharities[msg.sender], "Only verified charities can call this function");
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setNFTContractAddress(address _nftContractAddress) external onlyOwner {
        nftContractAddress = _nftContractAddress;
    }

    function verifyCharity(address _charityAddress, string memory _charityName) external onlyOwner {
        require(!verifiedCharities[_charityAddress], "Charity already verified");
        verifiedCharities[_charityAddress] = true;
        emit CharityVerified(_charityAddress, _charityName);
    }

    function unverifyCharity(address _charityAddress) external onlyOwner {
        require(verifiedCharities[_charityAddress], "Charity not verified");
        verifiedCharities[_charityAddress] = false;
    }

    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goal,
        string memory _campaignImageURI
    ) external onlyVerifiedCharity returns (address) {
        require(_goal > 0, "Goal must be greater than 0");
        CharityCampaign newCampaign = new CharityCampaign(
            msg.sender,
            _name,
            _description,
            _goal,
            nftContractAddress,
            address(this),
            _campaignImageURI
        );
        address campaignAddress = address(newCampaign);
        charityCampaigns[msg.sender].push(campaignAddress);
        allCampaigns.push(campaignAddress);
        emit CampaignCreated(campaignAddress, msg.sender, _name, _goal, _campaignImageURI);
        return campaignAddress;
    }

    function getCharityCampaigns(address _charityAddress) external view returns (address[] memory) {
        return charityCampaigns[_charityAddress];
    }

    function getAllCampaigns() external view returns (address[] memory) {
        return allCampaigns;
    }

    function isCharityVerified(address _charityAddress) external view returns (bool) {
        return verifiedCharities[_charityAddress];
    }
}

/**
 * @title CharityCampaign
 * @dev Contract for individual charity campaigns that handles donations and milestone tracking
 */
contract CharityCampaign is AutomationCompatibleInterface {
    enum CampaignState { Active, Completed, Deactivated }
    
    struct Milestone {
        uint256 target;
        bool reached;
        bool fundsReleased;
    }
    
    struct Donor {
        uint256 totalDonated;
        bool isTopDonor;
    }
    
    address public charityAddress;
    address public centralContractAddress;
    string public name;
    string public description;
    string public campaignImageURI;
    uint256 public goal;
    uint256 public totalDonated;
    CampaignState public state;
    address public nftContractAddress;
    uint256 public lastCheckTimestamp;
    
    Milestone[] public milestones;
    uint256 public currentMilestone;
    
    mapping(address => Donor) public donors;
    address[] public donorAddresses;
    address[] public topDonors;
    
    event DonationReceived(address indexed donor, uint256 amount, uint256 totalDonated);
    event MilestoneReached(uint256 milestoneIndex, uint256 amount);
    event FundsReleased(uint256 amount, uint256 milestoneIndex);
    event CampaignDeactivated();
    event CampaignCompleted();
    event TopDonorsAwarded();
    event CampaignDetailsUpdated(string newName, string newDescription, string newImageURI);
    
    modifier onlyCharity() {
        require(msg.sender == charityAddress, "Only the charity organization can call this function");
        _;
    }
    
    modifier campaignActive() {
        require(state == CampaignState.Active, "Campaign is not active");
        _;
    }
    
    constructor(
        address _charityAddress,
        string memory _name,
        string memory _description,
        uint256 _goal,
        address _nftContractAddress,
        address _centralContractAddress,
        string memory _campaignImageURI
    ) {
        charityAddress = _charityAddress;
        name = _name;
        description = _description;
        campaignImageURI = _campaignImageURI;
        goal = _goal;
        state = CampaignState.Active;
        nftContractAddress = _nftContractAddress;
        centralContractAddress = _centralContractAddress;
        lastCheckTimestamp = block.timestamp;
        
        uint256 firstMilestone = _goal / 3;
        uint256 secondMilestone = 2 * firstMilestone;
        
        milestones.push(Milestone(firstMilestone, false, false));
        milestones.push(Milestone(secondMilestone, false, false));
        milestones.push(Milestone(_goal, false, false));
        
        currentMilestone = 0;
    }

    function updateCampaignDetails(
        string memory _newName,
        string memory _newDescription,
        string memory _newImageURI
    ) external onlyCharity campaignActive {
        require(bytes(_newName).length > 0, "Name cannot be empty");
        require(bytes(_newDescription).length > 0, "Description cannot be empty");
        require(bytes(_newImageURI).length > 0, "Image URI cannot be empty");
        
        name = _newName;
        description = _newDescription;
        campaignImageURI = _newImageURI;
        emit CampaignDetailsUpdated(_newName, _newDescription, _newImageURI);
    }
    
    receive() external payable {
        donate();
    }
    
    function donate() public payable campaignActive {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        if (donors[msg.sender].totalDonated == 0) {
            donorAddresses.push(msg.sender);
        }
        
        donors[msg.sender].totalDonated += msg.value;
        totalDonated += msg.value;
        
        emit DonationReceived(msg.sender, msg.value, donors[msg.sender].totalDonated);
        
        checkMilestones();
        
        if (totalDonated >= goal) {
            completeAndRewardTopDonors();
        }
    }

    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        if (state != CampaignState.Active) return (false, "");

        bool[] memory milestoneUpdates = new bool[](milestones.length);
        bool hasUnreleased = false;
        bool campaignComplete = false;

        for (uint256 i = 0; i < milestones.length; i++) {
            if (!milestones[i].reached && totalDonated >= milestones[i].target) {
                milestoneUpdates[i] = true;
                upkeepNeeded = true;
            }
        }

        for (uint256 i = 0; i < milestones.length; i++) {
            if (milestones[i].reached && !milestones[i].fundsReleased) {
                hasUnreleased = true;
                upkeepNeeded = true;
            }
        }

        if (totalDonated >= goal && state == CampaignState.Active) {
            campaignComplete = true;
            upkeepNeeded = true;
        }

        return (upkeepNeeded, abi.encode(milestoneUpdates, campaignComplete, hasUnreleased));
    }
    
    function performUpkeep(bytes calldata performData) external override {
        (
            bool[] memory milestoneUpdates, 
            bool campaignComplete,
            bool hasUnreleased
        ) = abi.decode(performData, (bool[], bool, bool));
        
        for (uint256 i = 0; i < milestoneUpdates.length; i++) {
            if (milestoneUpdates[i]) {
                milestones[i].reached = true;
                emit MilestoneReached(i, milestones[i].target);
                if (i >= currentMilestone) {
                    currentMilestone = i + 1;
                    currentMilestone = currentMilestone > milestones.length ? milestones.length : currentMilestone;
                }
            }
        }
        
        if (hasUnreleased) {
            for (uint256 i = 0; i < milestones.length; i++) {
                if (milestones[i].reached && !milestones[i].fundsReleased) {
                    releaseMilestoneFunds(i);
                }
            }
        }
        
        if (campaignComplete) {
            completeAndRewardTopDonors();
        }
        
        lastCheckTimestamp = block.timestamp;
    }
        
    function checkMilestones() internal {
        for (uint256 i = 0; i < milestones.length; i++) {
            if (!milestones[i].reached && totalDonated >= milestones[i].target) {
                milestones[i].reached = true;
                emit MilestoneReached(i, milestones[i].target);
                if (i >= currentMilestone) {
                    currentMilestone = i + 1;
                    currentMilestone = currentMilestone > milestones.length ? milestones.length : currentMilestone;
                }
            }
        }
    }
    
    function releaseMilestoneFunds(uint256 _milestoneIndex) internal {
        require(_milestoneIndex < milestones.length, "Invalid milestone");
        require(milestones[_milestoneIndex].reached, "Milestone not reached");
        require(!milestones[_milestoneIndex].fundsReleased, "Funds already released");

        uint256 amountToRelease;
        if (_milestoneIndex == 0) {
            amountToRelease = milestones[0].target;
        } else {
            uint256 previousReleased = 0;
            for (uint256 i = 0; i < _milestoneIndex; i++) {
                if (milestones[i].fundsReleased) {
                    previousReleased += milestones[i].target;
                }
            }
            amountToRelease = milestones[_milestoneIndex].target - previousReleased;
        }

        uint256 available = address(this).balance;
        if (amountToRelease > available) {
            amountToRelease = available;
        }

        milestones[_milestoneIndex].fundsReleased = true;
        (bool success, ) = charityAddress.call{value: amountToRelease}("");
        require(success, "Payment failed");
        emit FundsReleased(amountToRelease, _milestoneIndex);
    }
        
    function releaseFunds(uint256 _milestoneIndex) external onlyCharity {
        require(_milestoneIndex < milestones.length, "Invalid milestone index");
        require(milestones[_milestoneIndex].reached, "Milestone not reached yet");
        require(!milestones[_milestoneIndex].fundsReleased, "Funds already released for this milestone");
        releaseMilestoneFunds(_milestoneIndex);
    }
    
    function deactivateCampaign() external onlyCharity campaignActive {
        state = CampaignState.Deactivated;
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(charityAddress).call{value: balance}("");
            require(success, "Transfer to charity failed");
            emit FundsReleased(balance, 999);
        }
        emit CampaignDeactivated();
    }
    
    function completeAndRewardTopDonors() internal {
        if (state != CampaignState.Active) return;
        
        state = CampaignState.Completed;
        emit CampaignCompleted();
        
        for (uint256 i = 0; i < milestones.length; i++) {
            if (milestones[i].reached && !milestones[i].fundsReleased) {
                releaseMilestoneFunds(i);
            }
        }
        
        determineTopDonors();
        
        if (nftContractAddress != address(0)) {
            for (uint256 i = 0; i < topDonors.length; i++) {
                CharityNFT(nftContractAddress).mintNFT(topDonors[i], i + 1, name);
            }
            emit TopDonorsAwarded();
        }
        
        uint256 remaining = address(this).balance;
        if (remaining > 0) {
            (bool success, ) = charityAddress.call{value: remaining}("");
            require(success, "Final transfer failed");
            emit FundsReleased(remaining, 999);
        }
    }
    
    function determineTopDonors() internal {
        address[] memory sortedDonors = new address[](donorAddresses.length);
        for (uint256 i = 0; i < donorAddresses.length; i++) {
            sortedDonors[i] = donorAddresses[i];
        }
        
        for (uint256 i = 0; i < sortedDonors.length; i++) {
            for (uint256 j = i + 1; j < sortedDonors.length; j++) {
                if (donors[sortedDonors[i]].totalDonated < donors[sortedDonors[j]].totalDonated) {
                    (sortedDonors[i], sortedDonors[j]) = (sortedDonors[j], sortedDonors[i]);
                }
            }
        }
        
        uint256 topDonorCount = sortedDonors.length < 3 ? sortedDonors.length : 3;
        topDonors = new address[](topDonorCount);
        
        for (uint256 i = 0; i < topDonorCount; i++) {
            topDonors[i] = sortedDonors[i];
            donors[sortedDonors[i]].isTopDonor = true;
        }
    }
    
    function getAllDonors() external view returns (address[] memory) {
        return donorAddresses;
    }
    
    function getTopDonors() external view returns (address[] memory) {
        return topDonors;
    }
    
    function getCampaignDetails() external view returns (
        string memory _name,
        string memory _description,
        string memory _campaignImageURI,
        uint256 _goal,
        uint256 _totalDonated,
        CampaignState _state,
        address _charityAddress
    ) {
        return (
            name,
            description,
            campaignImageURI,
            goal,
            totalDonated,
            state,
            charityAddress
        );
    }
    
    function getMilestones() external view returns (
        uint256[] memory targets,
        bool[] memory reached,
        bool[] memory fundsReleased
    ) {
        uint256[] memory _targets = new uint256[](milestones.length);
        bool[] memory _reached = new bool[](milestones.length);
        bool[] memory _fundsReleased = new bool[](milestones.length);
        
        for (uint256 i = 0; i < milestones.length; i++) {
            _targets[i] = milestones[i].target;
            _reached[i] = milestones[i].reached;
            _fundsReleased[i] = milestones[i].fundsReleased;
        }
        
        return (_targets, _reached, _fundsReleased);
    }
    
    function resetMilestoneFundsReleased(uint256 _milestoneIndex) external onlyCharity {
        require(_milestoneIndex < milestones.length, "Invalid milestone index");
        milestones[_milestoneIndex].fundsReleased = false;
    }
}