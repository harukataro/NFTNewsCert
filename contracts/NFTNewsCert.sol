// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

contract NFTNewsCert is ERC721, Ownable {
    uint256 private currentTokenId = 0;
    string public message = "defailt message";
    bool sw = false;
    uint256 nftAmount = 1000;
    uint256 eachNftAmount = 3;
    bytes32 keyword;

    enum Team {Red, Yellow, Blue}
    mapping(Team => string) teamString;
    mapping(Team => uint256) teamScore;
    Team lastTeam = Team.Red;

    mapping(address => Team) myTeam;
    mapping(address => uint256) myNFTs;
    mapping(address => bool) usedBonus;
    event Mint(address indexed minter, string indexed team,string indexed message, uint256 scoreRed, uint256 scoreYellow, uint256 scoreBlue);
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        teamString[Team.Red] = "Red";
        teamString[Team.Yellow] = "Yellow";
        teamString[Team.Blue] = "Blue";
        teamScore[Team.Red] = 1;
        teamScore[Team.Yellow] = 1;
        teamScore[Team.Blue] = 1;
        setkeyword("shibuya");
    }

    //Utility
    function circleSize(Team _team) internal view returns (uint256) {
        uint256 totalScore = teamScore[Team.Red] + teamScore[Team.Yellow] + teamScore[Team.Blue];

        if(totalScore < 15 ){
            return teamScore[_team] * 10;
        }
        else{
            return  150 * teamScore[_team] / totalScore;
        }
    }
        function circleXposition(Team _team) internal view returns (uint256) {
        uint256 totalScore = teamScore[Team.Red] + teamScore[Team.Yellow] + teamScore[Team.Blue];
        
        uint256 ret = 0;
        if(totalScore < 15 ){
            if(_team == Team.Red){ ret = 50;}
            else if(_team == Team.Yellow){ ret = 150;}
            else if(_team == Team.Blue) { ret = 250;}
        }
        else{
            if(_team == Team.Red){
                ret = circleSize(Team.Red);
            }
            else if(_team == Team.Yellow){
                ret = circleSize(Team.Red) *2 + circleSize(Team.Yellow);
            }
            else if(_team == Team.Blue) {
                ret = circleSize(Team.Red) *2 + circleSize(Team.Yellow) *2 + circleSize(Team.Blue);}
        }
        return ret;
    }

    //external function
    function getTeamScoreRed() public view returns (uint256) {
        return teamScore[Team.Red];
    }
    function getTeamScoreYellow() public view returns (uint256) {
        return teamScore[Team.Yellow];
    }
    function getTeamScoreBlue() public view returns (uint256) {
        return teamScore[Team.Blue];
    }
    function getNumberOfNfts(address _address) public view returns (uint256) {
        return myNFTs[_address];
    }

    function mintRed(string memory _keyword, string memory _message) public{
        mintTo(_keyword, _message, Team.Red);
    }
    function mintYellow(string memory _keyword, string memory _message) public{
        mintTo(_keyword, _message, Team.Yellow);
    }
    function mintBlue(string memory _keyword, string memory _message) public{
        mintTo(_keyword, _message, Team.Blue);
    }
    function mintTo(string memory _keyword, string memory _message, Team _team) private{
        address _to = msg.sender;
        require(bytes(_message).length <= 140, "Message is too long");
        require(currentTokenId < nftAmount -1, "Token amount is full)");
        require(keyword == keccak256(abi.encodePacked(_keyword)), "Keyword is not correct");
        require(myNFTs[_to] < eachNftAmount, "You have too many NFTs");
        uint256 newTokenId = _getNextTokenId();
        _mint(_to, newTokenId);
        
        message = _message;
        teamScore[_team] += 1;
        lastTeam = _team;
        myTeam[_to] = _team;
        myNFTs[_to] += 1;

        emit Mint(msg.sender, teamString[_team], message, teamScore[Team.Red], teamScore[Team.Yellow], teamScore[Team.Blue]);
        _incrementTokenId();
    }

    function _getNextTokenId() private view returns (uint256) {
        return currentTokenId+1;
    }
    function _incrementTokenId() private {
        currentTokenId++;
    }
    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        require(0 < tokenId && tokenId <= currentTokenId , "tokenId must be exist");        
        string[28] memory parts;
        string[4] memory metaData;

        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 300 300"><style>.base { fill: white; font-family: serif; font-size: 14px;}</style>';
        parts[1] = '<rect width="100%" height="100%" fill="black" />';
        parts[27] = '<defs><linearGradient id="R"><stop offset="0%" stop-color="red"/><stop offset="100%"/></linearGradient><linearGradient id="Y"><stop offset="0%" stop-color="yellow"/><stop offset="100%"/></linearGradient><linearGradient id="B"><stop offset="0%" stop-color="blue"/><stop offset="100%"/></linearGradient></defs>';
        parts[2] = '<text x="10" y="20" class="base">NFT News Certification #75';
        parts[3] = '</text><text x="10" y="40" class="base"> ID: ';
        parts[4] = Strings.toString(tokenId);
        parts[5] = '</text><circle cx="';
        parts[6] = Strings.toString(circleXposition(Team.Red));
        parts[7] = '" cy="150" r="';
        parts[8] = Strings.toString(circleSize(Team.Red));
        parts[9] = '" fill="url(#R)" /><circle cx="';
        parts[10] = Strings.toString(circleXposition(Team.Yellow));
        parts[12] = '" cy="150" r="';
        parts[13] = Strings.toString(circleSize(Team.Yellow));
        parts[14] = '" fill="url(#Y)" /><circle cx="';
        parts[15] = Strings.toString(circleXposition(Team.Blue));
        parts[16] = '" cy="150" r="';
        parts[17] = Strings.toString(circleSize(Team.Blue));
        parts[18] = '" fill="url(#B)" /><text x="10" y="220" fill="';
        parts[19] =  teamString[lastTeam];
        parts[20] = '" font-family="serif" font-size="10px">';
        parts[21] = message;
        parts[22] = '</text><text x="10" y="240" fill="';
        parts[23] = teamString[lastTeam];
        parts[24] = '" font-family="serif" font-size="10px">';
        parts[25] = Strings.toHexString(uint256(uint160(ownerOf(currentTokenId))));
        parts[26] = '</text></svg>';

        metaData[0] = '{"name": "NFTNewsCert #';
        metaData[1] = Strings.toString(tokenId);
        metaData[2] = '", "description": "NFT News Reading Certification.",';
        metaData[3] = '"image": "data:image/svg+xml;base64,';
        
        string memory svg = string(abi.encodePacked(parts[0], parts[1],parts[27], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9]));
        svg = string(abi.encodePacked(svg,  parts[10], parts[12], parts[13], parts[14], parts[15], parts[16], parts[17], parts[18], parts[19])); 
        svg = string(abi.encodePacked(svg, parts[20], parts[21], parts[22], parts[23], parts[24], parts[25], parts[26])); 
        
        string memory json = Base64.encode(bytes(string(abi.encodePacked(metaData[0], metaData[1], metaData[2], metaData[3], Base64.encode(bytes(svg)), '"}'))));
        string memory output = string(abi.encodePacked('data:application/json;base64,', json));

        return output;
    }
    function mintSwitch(bool _sw) onlyOwner() public {
        sw = _sw;
    }

    function setkeyword(string memory _keyword) onlyOwner() public {
        keyword = keccak256(abi.encodePacked(_keyword));
    }

    function getBonus(uint256 _t, uint256 _s) public{
        uint256 n = myNFTs[msg.sender];
        require(usedBonus[msg.sender] == false, "You have already used bonus");
        require((_s * n) % 3 == 1, "Bad s");
        require(_t %11 == 0, "Bad t");
        if(_t == 22){teamScore[Team.Red] += 1;}
        if(_t == 33){teamScore[Team.Yellow] += 1;}
        if(_t == 55){teamScore[Team.Blue] += 1;}
    }
}