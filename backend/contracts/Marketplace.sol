//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Marketplace is ERC721URIStorage,Ownable{
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    Counters.Counter public _itemSold;

    // uint256 listPrice = 0.01 ether;
    uint256 serviceFee = 0.01 ether;
    uint256 increFee = 1 ether;

    struct ListToken {
        uint256 tokenId;
        address payable seller;
        uint256 price;
    }

    event TokenDetail(
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );
    event TokenChange(
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );

    mapping(uint256 => ListToken) public idToListToken;

    ////////////////////////////////////////////////////////////////////////
    constructor() ERC721("NFTM","NFTM") Ownable(msg.sender){
    }
    function getListPrice() view external returns(uint256){
        return serviceFee;
    }
    function updateListPirce(uint256 _listPrice) public payable {
        serviceFee = _listPrice;
    }

    ////////////////////////////////////////////////////////////////////////
    function getCurrentIndex() public view returns(uint256){
        return _tokenIds.current();
    }
    function getCurrentToken() public view returns(ListToken memory){
        return idToListToken[_tokenIds.current()];
    }
    function getTokenById(uint256 _id) public view returns(ListToken memory){
        return idToListToken[_id];
    }
    ////////////////////////////////////////////////////////////////////////

    function createToken(uint256 price, string memory tokenURI) public payable {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId,tokenURI);
    
        require(msg.value>=serviceFee,"no send enougth eth value to create");
        require(price>0,"price can't negative");

        idToListToken[newTokenId] = ListToken(
            newTokenId,
            payable(msg.sender),
            price
        );

        emit TokenDetail(newTokenId,msg.sender,price);
    }
    function filterNFTDate(ListToken[] memory) private returns(ListToken[] memory){

    }
    function getALLNFTs() public view returns(ListToken[] memory){
        uint256 tokenCount = _tokenIds.current();
        ListToken[] memory tokens = new ListToken[](tokenCount);
        for(uint i=1; i<tokenCount+1; i++) {
            ListToken storage lt = idToListToken[i];
            tokens[i-1]=lt;
        }
        return tokens;
        //return filterNFTDate(tokens);
    }
    function getMyNFTs()  public view returns(ListToken[] memory){
        uint256 tokenCount = _tokenIds.current();
        uint itemCount = 0;
        for(uint i=1; i<tokenCount+1; i++) {
            if(idToListToken[i].seller == msg.sender) {
                itemCount++;
            }
        }
        ListToken[] memory tokens = new ListToken[](itemCount);
        uint index = 0;
        for(uint i=1; i<tokenCount+1; i++) {
            if(idToListToken[i].seller == msg.sender) {
                ListToken storage lt = idToListToken[i];
                tokens[index]=lt;
                index++;
            }
        }
        return tokens;
        // return filterNFTDate(tokens);
    }
    function executeSale(uint256 _tokenId) public payable {
        ListToken storage token = idToListToken[_tokenId];
        // uint256 price = token.price;
        address sellerOld = token.seller;
        require(msg.value >= token.price, "money no enought to purchase");
        

        _itemSold.increment();

        _transfer(address(sellerOld), msg.sender, _tokenId);
        approve(address(this),_tokenId);

        payable(owner()).transfer(serviceFee);
        uint256 remainMoney = msg.value-serviceFee;
        if(remainMoney>0){
            payable(sellerOld).transfer(remainMoney);
        }
        token.seller = payable(msg.sender);
        token.price = token.price+increFee;

        emit TokenChange(_tokenId,msg.sender,token.price);
    }
}