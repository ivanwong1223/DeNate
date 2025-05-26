// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title CharityNFT
 * @dev NFT contract for rewarding top donors in charity campaigns
 */
contract CharityNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;
    
    address public charityCentralAddress;
    string public baseURI;
    uint256 private _tokenIdCounter;
    
    // Mapping to store image URIs for each rank (1, 2, 3)
    mapping(uint256 => string) public rankImageURIs;
    
    // NFT metadata structure
    struct NFTMetadata {
        uint256 rank;          // 1, 2, or 3
        address campaignAddress; // Address of the campaign
        string campaignName;   // Name of the campaign
        // string donorName;      // Name of the donor (optional)
    }
    
    // Mapping from tokenId to its metadata
    mapping(uint256 => NFTMetadata) public tokenMetadata;
    
    event NFTMinted(address indexed recipient, uint256 tokenId, address indexed campaignAddress, uint256 rank, string campaignName);
    
    constructor(address _charityCentralAddress, address _initialOwner) 
        ERC721("CharityDonorBadge", "CDB") 
        Ownable(_initialOwner)
    {
        charityCentralAddress = _charityCentralAddress;
        _tokenIdCounter = 1;
    }
    
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }
    
    function updateCentralAddress(address _newCentralAddress) external onlyOwner {
        charityCentralAddress = _newCentralAddress;
    }
    
    // Set image URIs for each rank
    function setRankImageURI(uint256 _rank, string memory _imageURI) external onlyOwner {
        require(_rank >= 1 && _rank <= 3, "Rank must be between 1 and 3");
        rankImageURIs[_rank] = _imageURI;
    }
    
    // Updated mint function that includes campaign name and sets token URI
    function mintNFT(
        address _recipient, 
        uint256 _rank,
        string memory _campaignName
        // string memory _donorName
    ) 
        external 
        returns (uint256) 
    {
        require(_rank >= 1 && _rank <= 3, "Rank must be between 1 and 3");
        require(bytes(rankImageURIs[_rank]).length > 0, "Image URI for this rank not set");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Save metadata
        tokenMetadata[tokenId] = NFTMetadata({
            rank: _rank,
            campaignAddress: msg.sender,
            campaignName: _campaignName
            // donorName: _donorName
        });
        
        _safeMint(_recipient, tokenId);
        
        // Generate and set the token URI using the tokenURI function
        string memory tokenMetadataURI = generateTokenURI(tokenId);
        _setTokenURI(tokenId, tokenMetadataURI);
        
        emit NFTMinted(_recipient, tokenId, msg.sender, _rank, _campaignName);
        return tokenId;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
    
    // Helper function to generate the metadata URI for a token
    function generateTokenURI(uint256 tokenId) internal view returns (string memory) {
        NFTMetadata memory metadata = tokenMetadata[tokenId];
        string memory rankStr = Strings.toString(metadata.rank);
        string memory imageURI = rankImageURIs[metadata.rank];
        
        // Generate JSON metadata
        string memory json = string(abi.encodePacked(
            '{"name": "Top ', rankStr, ' Donor for ', metadata.campaignName, ' Campaign",',  // Added " Campaign"
            '"description": "This NFT represents an honorary badge for being the top ', rankStr, ' donor for ', metadata.campaignName, ' Campaign",', // Added " Campaign"
            '"image": "', imageURI, '",',
            '"attributes": [{"trait_type": "Badge", "value": "Top ', rankStr, '"}]}'
        ));
        
        // Encode as base64
        string memory encodedJson = Base64.encode(bytes(json));
        return string(abi.encodePacked("data:application/json;base64,", encodedJson));
    }
    
    // Override tokenURI to use ERC721URIStorage implementation
    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function getCampaignAddress(uint256 tokenId) external view returns (address) {
        return tokenMetadata[tokenId].campaignAddress;
    }
    
    function getDonorRank(uint256 tokenId) external view returns (uint256) {
        return tokenMetadata[tokenId].rank;
    }
    
    // Get all tokens owned by an address
    function getTokensOfOwner(address _owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory tokens = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenIndex = 0;
            uint256 currentTokenId = 1;
            
            while (tokenIndex < i && currentTokenId < _tokenIdCounter) {
                if (ownerOf(currentTokenId) == _owner) {
                    tokenIndex++;
                }
                if (tokenIndex == i) {
                    tokens[i] = currentTokenId;
                    break;
                }
                currentTokenId++;
            }
        }
        return tokens;
    }
    
    // function updateDonorName(uint256 tokenId, string memory _newDonorName) external {
    //     require(
    //         msg.sender == ownerOf(tokenId) || 
    //         msg.sender == tokenMetadata[tokenId].campaignAddress || 
    //         msg.sender == owner(),
    //         "Not authorized"
    //     );
        
    //     tokenMetadata[tokenId].donorName = _newDonorName;
        
    //     // Update token URI when donor name changes
    //     string memory newTokenURI = generateTokenURI(tokenId);
    //     _setTokenURI(tokenId, newTokenURI);
    // }
}