pragma solidity ^0.5.0;

import "./ERC721Full.sol";

//"is" this is how inherit is made in solidity (So this is inheriting from ERC721Full SmartContract)
contract MemoryToken is ERC721Full{
  //state variable belongs to the entire Smart Contract and it's stored on the blockchain, public can read outside the smart contract  

    //Constructor is called when the contract is deployed, and to call ERC721Full Template, just put the words in front of the constructor
    //And it gives the features of the template like (Name, Token Symbol)
    constructor() ERC721Full("Memory Token", "MEMORY") public {

    }

    //function named mint accepts two arguments: address (or username) that will be given a token _to (variable name) 
    //and the second is the string for a tokenURI. These tokens have images associated with them. This images can be stored
    //somewhere like webserver or more decentralized in a distributed file system like IPFS.
    //and the URI is a place to reference each token
    //You can only set to memory in public and external function arguments, because storage pointers from outside the contract don't make a lot of sense.   
    function mint(address _to, string memory _tokenURI) public returns(bool) {
      //totalSupply function returns the number of tokens that already exists and add is to manually add 1 to this supply to get a new Token ID
      uint _tokenId = totalSupply().add(1);
      //to implemente the mint function inherited declare the function _mint (internal "_") 
      _mint(_to, _tokenId);
      _setTokenURI(_tokenId, _tokenURI);
      return true; 
    }


}
