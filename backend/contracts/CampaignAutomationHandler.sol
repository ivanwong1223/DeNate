// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

interface ICampaign {
    function checkUpkeep(bytes calldata) external view returns (bool, bytes memory);
    function performUpkeep(bytes calldata) external;
}

interface CharityCentral {
    function getAllCampaigns() external view returns (address[] memory);
}

/**
 * @title CampaignAutomationHandler
 * @dev Central handler for Chainlink Automation to manage all charity campaigns
 * @notice Fixed to properly handle upkeep checks
 */
contract CampaignAutomationHandler is AutomationCompatibleInterface {
    address public owner;
    address public charityCentralAddress;
    uint256 public checkGasLimit;
    uint256 public performGasLimit;

    event UpkeepPerformed(address indexed campaignAddress);
    event UpkeepFailed(address indexed campaignAddress, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _charityCentralAddress) {
        require(_charityCentralAddress != address(0), "Invalid CharityCentral address");
        owner = msg.sender;
        charityCentralAddress = _charityCentralAddress;
        checkGasLimit = 500000;
        performGasLimit = 1000000;
    }

    function updateCharityCentralAddress(address _newAddress) external onlyOwner {
        require(_newAddress != address(0), "Invalid address");
        charityCentralAddress = _newAddress;
    }

    function updateGasLimits(uint256 _checkGasLimit, uint256 _performGasLimit) external onlyOwner {
        require(_checkGasLimit > 0 && _performGasLimit > 0, "Gas limits must be greater than 0");
        checkGasLimit = _checkGasLimit;
        performGasLimit = _performGasLimit;
    }

    function checkUpkeep(
        bytes calldata
    ) 
        external 
        view 
        override 
        returns (bool upkeepNeeded, bytes memory performData) 
    {
        address[] memory campaigns = CharityCentral(charityCentralAddress).getAllCampaigns();
        
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (gasleft() < checkGasLimit) {
                break;
            }
            
            try ICampaign(campaigns[i]).checkUpkeep("") returns (bool needsUpkeep, bytes memory campaignData) {
                if (needsUpkeep) {
                    return (true, abi.encode(campaigns[i], campaignData));
                }
            } catch {
                // If we hit an error checking this campaign, continue to the next one
                continue;
            }
        }
        
        return (false, "");
    }

    function performUpkeep(bytes calldata performData) external override {
        (address campaignAddress, bytes memory campaignData) = abi.decode(performData, (address, bytes));
        require(campaignAddress != address(0), "Invalid campaign address");
        require(gasleft() > performGasLimit, "Not enough gas to perform upkeep");
        
        try ICampaign(campaignAddress).performUpkeep(campaignData) {
            emit UpkeepPerformed(campaignAddress);
        } catch Error(string memory reason) {
            emit UpkeepFailed(campaignAddress, reason);
        } catch {
            emit UpkeepFailed(campaignAddress, "Unknown error during upkeep");
        }
    }
    
    // Helper function for manual debugging
    function debugCampaignUpkeep(address campaignAddress) external view returns (bool needsUpkeep, bytes memory campaignData) {
        try ICampaign(campaignAddress).checkUpkeep("") returns (bool _needsUpkeep, bytes memory _campaignData) {
            return (_needsUpkeep, _campaignData);
        } catch {
            return (false, "Error checking upkeep");
        }
    }
}