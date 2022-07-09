// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

contract NFTNewsCert is ERC721, Ownable{
    uint256 private currentTokenId = 0;
    bool sw = false;
    uint256 totalNumer = 100;
    uint256 limit = 1;

    enum Color {Black, Red, Blue, Green, Yellow, White, Pink}
    string[] colorArray;
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
        colorArray = ["black","red", "blue", "green", "yellow", "white", "pink"];
        for(uint256 i=0; i<colorArray.length; i++){
            colorString[Color(i)] = colorArray[i];
        }
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
    function mintGreen(string memory yourName) public{
        mintTo(Color.Green, yourName);
    }
    function mintYellow(string memory yourName) public{
        mintTo(Color.Yellow, yourName);
    }
    function mintWhite(string memory yourName) public{
        mintTo(Color.White, yourName);
    }
    function mintPink(string memory yourName) public{
        mintTo(Color.Pink, yourName);
    }
    function mintTo(Color _color,string memory _name) private{
        address _to = msg.sender;
        require(currentTokenId < totalNumer, "Token amount is full)");
        require(numOfMinted[_to] < limit, "You reached mint limit");
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
        

        string[6] memory p;
        p[0] = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 320 320">',
            '<style>.base { fill: white; font-family: serif; font-size: 14px;}</style>',
            '<defs><filter id="f"><feGaussianBlur in="SourceGraphic" stdDeviation="3" /></filter>',
            '<circle id="F" cx="0" cy="0" r="15" fill="#aaa" filter="url(#f)"/>'
        ));

        for(uint256 i = 0; i< colorArray.length; i++){
            string memory color = colorArray[i];
            p[1] = string(abi.encodePacked(
                p[1],
                '<linearGradient id="', color, 'LG"><stop offset="0%" stop-color="',color,'"/><stop offset="100%"/>',
                '</linearGradient><circle id="',color, '" cx="0" cy="0" r="10" fill="url(#', color, 'LG)"/>'
            ));
        }

        p[2] = '</defs><rect width="100%" height="100%" fill="#222" rx="15" ry="15"/>';
        
        string memory xo = Strings.toString(((_tokenId- 1) % 10) * 26 + 13 + 30);
        string memory yo = Strings.toString(((_tokenId- 1) / 10) * 26 + 100);
        p[3] = string(abi.encodePacked('<use href="#F" x="', xo,'" y="',yo,'"/>'));

        for(uint256 i = 1; i <= 100; i++){
            if(tokenColor[i] == Color.Black){continue;}
            string memory ref = colorString[tokenColor[i]];
            string memory x = Strings.toString(((i-1) % 10) * 26 + 13 + 30);
            string memory y = Strings.toString(((i-1) / 10) * 26 + 100);
            p[4] = string(abi.encodePacked(p[4],'<use href="#',ref,'" x="',x,'" y="', y,'"/>'));
        }

        p[5] = string(abi.encodePacked(
            '<text x="30" y="30" class="base">NFT News Certification #75</text>',
            '<text x="30" y="50" class="base">ID: ',
            Strings.toString(_tokenId),
            '</text><text x="30" y="70" class="base"> Minter: ',
            tokenSignature[_tokenId],
            '</text></svg>'
        ));
        string memory svg = string(abi.encodePacked(p[0], p[1], p[2], p[3], p[4], p[5]));
        
        string memory meta = string(abi.encodePacked(
            '{"name": "NFTNewsCertfication #',
            Strings.toString(_tokenId),
            '","description": "NFT News Reading Certification.",',
            '"attributes": [{"trait_type":"color","display_type":"Color","value":"',
            colorString[tokenColor[_tokenId]],
            '"}],',
            '"image": "data:image/svg+xml;base64,'
        ));
        string memory json = Base64.encode(bytes(string(abi.encodePacked(meta, Base64.encode(bytes(svg)), '"}'))));
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