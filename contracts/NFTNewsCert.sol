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
    mapping(uint256 => Team) tokenTeam;
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
        tokenTeam[newTokenId] = _team;
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
      
        string[4] memory metaData;

        //flare parameter create
        uint256 redSize = circleSize(Team.Red);
        uint256 yellowSize = circleSize(Team.Yellow);
        uint256 blueSize = circleSize(Team.Blue);
        uint256 redX = circleXposition(Team.Red);
        uint256 yellowX = circleXposition(Team.Yellow);
        uint256 blueX = circleXposition(Team.Blue);
        string memory redFlareColor = tokenTeam[tokenId] == Team.Red ? "fff" : "333";
        string memory yellowFlareColor = tokenTeam[tokenId] == Team.Yellow ? "fff" : "333";
        string memory blueFlareColor = tokenTeam[tokenId] == Team.Blue ? "fff" : "333";

        string memory svg; //block to avoid Stack too deep, try removing local variables. error
        {
            string[29] memory p;
            p[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 300 300"><style>.base { fill: white; font-family: serif; font-size: 14px;}</style>';
            p[1] = '<rect width="100%" height="100%" fill="black"/><defs><filter id="f1"><feGaussianBlur in="SourceGraphic" stdDeviation="3" /></filter>';
            p[2] = '<linearGradient id="R"><stop offset="0%" stop-color="red"/><stop offset="100%"/></linearGradient><linearGradient id="Y"><stop offset="0%" stop-color="yellow"/><stop offset="100%"/></linearGradient><linearGradient id="B"><stop offset="0%" stop-color="blue"/><stop offset="100%"/></linearGradient></defs>';
            p[3] = '<text x="10" y="20" class="base">NFT News Certification #75</text><text x="10" y="40" class="base"> ID: ';
            p[4] = Strings.toString(tokenId);
            p[5] = '</text>';

            p[6] = string(abi.encodePacked('<circle cx="',
                            Strings.toString(redX),
                            '" cy="150" r="',
                            Strings.toString(redSize + 1),
                            '" fill="#', redFlareColor,
                            '" filter="url(#f1)"/><circle cx="'));   
            p[7] = Strings.toString(circleXposition(Team.Red));
            p[8] = '" cy="150" r="';
            p[9] = Strings.toString(redSize);
            p[10] = '" fill="url(#R)"/>';

            p[11] = string(abi.encodePacked('<circle cx="',
                            Strings.toString(yellowX),
                            '" cy="150" r="',
                            Strings.toString(yellowSize + 1),
                            '" fill="#', yellowFlareColor,
                            '" filter="url(#f1)"/><circle cx="'));
            p[12] = Strings.toString(circleXposition(Team.Yellow));
            p[13] = '" cy="150" r="';
            p[14] = Strings.toString(yellowSize);
            p[15] = '" fill="url(#Y)"/>';

            p[16] = string(abi.encodePacked('<circle cx="',
                            Strings.toString(blueX),
                            '" cy="150" r="',
                            Strings.toString(blueSize + 1),
                            '" fill="#', blueFlareColor,
                            '" filter="url(#f1)"/><circle cx="'));
            p[17] = Strings.toString(blueX);
            p[18] = '" cy="150" r="';
            p[19] = Strings.toString(blueSize);
            p[20] = '" fill="url(#B)"/><text x="10" y="220" fill="';

            p[21] =  teamString[lastTeam];
            p[22] = '" font-family="serif" font-size="10px">';
            p[23] = message;
            p[24] = '</text><text x="10" y="240" fill="';
            p[25] = teamString[lastTeam];
            p[26] = '" font-family="serif" font-size="10px">';
            p[27] = Strings.toHexString(uint256(uint160(ownerOf(currentTokenId))));
            p[28] = '</text></svg>';
            svg = string(abi.encodePacked(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]));
            svg = string(abi.encodePacked(svg, p[10], p[11], p[12], p[13], p[14], p[15], p[16], p[17], p[18], p[19])); 
            svg = string(abi.encodePacked(svg, p[20], p[21], p[22], p[23], p[24], p[25], p[26], p[27], p[28]));     
        }

        metaData[0] = '{"name": "NFTNewsCert #';
        metaData[1] = Strings.toString(tokenId);
        metaData[2] = '", "description": "NFT News Reading Certification.",';
        metaData[3] = '"image": "data:image/svg+xml;base64,';
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