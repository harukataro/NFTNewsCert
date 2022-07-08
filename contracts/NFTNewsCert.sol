// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

contract NFTNewsCert is ERC721, Ownable {
    uint256 private currentTokenId = 0;
    bool sw = false;
    uint256 totalNumer = 100;
    uint256 limit = 1;

    enum Color {Black, Red, Blue}
    mapping(Color => string) colorString;

    mapping(uint256 => Color) tokenColor;
    mapping(uint256 => address) tokenOwner;
    mapping(uint256 => string) tokenSignature;
    mapping(address => uint256) numOfMinted;

    event Mint(address indexed minter, string indexed color,string signature);
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        colorString[Color.Black] = "black";
        colorString[Color.Red] = "red";
        colorString[Color.Blue] = "blue";
    }
    function getNumberOfMinted(address _address) public view returns (uint256) {
        return numOfMinted[_address];
    }

    function mintRed( string memory yourName) public{
        mintTo( Color.Red, yourName);
    }
    function mintBlue(string memory yourName) public{
        mintTo(Color.Blue, yourName);
    }
    function mintTo(Color _color,string memory _name) private{
        address _to = msg.sender;
        require(currentTokenId < totalNumer, "Token amount is full)");
        require(numOfMinted[_to] < limit, "You reached mint limite");
        uint256 newTokenId = _getNextTokenId();
        _mint(_to, newTokenId);
        
        tokenSignature[newTokenId] = _name;
        tokenColor[newTokenId] = _color;        

        emit Mint(msg.sender, colorString[_color], _name);
        _incrementTokenId();
    }
    function _getNextTokenId() private view returns (uint256) {
        return currentTokenId+1;
    }
    function _incrementTokenId() private {
        currentTokenId++;
    }
        function isTokenExist(uint256 _tokenId) public view returns (bool) {
        if(_tokenId < 1 || currentTokenId < _tokenId){return false;}
        return tokenColor[_tokenId] != Color.Black;
    }
    function tokenURI(uint256 _tokenId) override public view returns (string memory) {
        require(isTokenExist(_tokenId), "tokenId must be exist");
        string[4] memory metaData;

        string memory svg; //block to avoid "Stack too deep error"
        {
            string[17] memory p;
            p[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 320 320"><style>.base { fill: white; font-family: serif; font-size: 14px;}</style>';
            p[1] = '<rect width="100%" height="100%" fill="black"/>';
            p[2] = '<defs><filter id="f"><feGaussianBlur in="SourceGraphic" stdDeviation="3" /></filter><linearGradient id="r"><stop offset="0%" stop-color="red"/><stop offset="100%"/></linearGradient><linearGradient id="b"><stop offset="0%" stop-color="blue"/><stop offset="100%"/></linearGradient>';
            p[3] = '<circle id="F" cx="0" cy="0" r="10" fill="#aaa" filter="url(#f)"/><circle id="R" cx="0" cy="0" r="9" fill="url(#r)"/><circle id="B" cx="0" cy="0" r="9" fill="url(#b)"/> </defs>';
            
            p[4] = string(abi.encodePacked(
                '<use href="#F" x="', 
                Strings.toString(((_tokenId- 1) % 10) * 22 + 40),
                '" y="',
                Strings.toString(((_tokenId- 1) / 10) * 22 + 95),
                '"/>'
            ));
            
            for(uint256 i = 0; i < 100; i++){
                string memory head;
                if(tokenColor[_tokenId] == Color.Black){continue;}
                if(tokenColor[_tokenId] == Color.Red){head = '<use href="#R" x="';}
                else if(tokenColor[_tokenId] == Color.Blue){head = '<use href="#B" x="';}

                p[5] = string(abi.encodePacked(
                    head,
                    Strings.toString((i % 10) * 22 + 40),
                    '" y="',
                    Strings.toString((i / 10) * 22 + 95),
                    '"/>'
                ));
            }
            p[6] = '<text x="30" y="20" class="base">NFT News Certification #75</text><text x="30" y="40" class="base"> ID: ';
            p[7] = Strings.toString(_tokenId);
            p[8] = '</text><text x="30" y="60" class="base"> for  ';
            p[9] = tokenSignature[_tokenId];
            p[10] = '</text>';
            p[11] = '</svg>';
            svg = string(abi.encodePacked(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9], p[10], p[11]));
        }

        metaData[0] = '{"name": "NFTNewsCert #';
        metaData[1] = Strings.toString(_tokenId);
        metaData[2] = '", "description": "NFT News Reading Certification.",';
        metaData[3] = '"image": "data:image/svg+xml;base64,';
        string memory json = Base64.encode(bytes(string(abi.encodePacked(metaData[0], metaData[1], metaData[2], metaData[3], Base64.encode(bytes(svg)), '"}'))));
        string memory output = string(abi.encodePacked('data:application/json;base64,', json));
        return output;
    }
    function mintSwitch(bool _sw) onlyOwner() public {
        sw = _sw;
    }

    function setLimit(uint256 _limit) onlyOwner() public {
        limit = _limit;
    }
}