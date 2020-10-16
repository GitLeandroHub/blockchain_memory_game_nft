const { assert, AssertionError } = require('chai')
const { Accordion } = require('react-bootstrap')

const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Memory Token', (accounts) => {
  let token

  before(async () => {
    token = await MemoryToken.deployed()
  })

  //when run (truffle test) it puts on the network and check the address
  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = token.address
      //make sure that the contract exist: not blank, empty string, null and undefined
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
    
    it('has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'Memory Token')
    })

    it('has a symbol', async () => {
      const symbol = await token.symbol()
      assert.equal(symbol, 'MEMORY')
    })
  })

  describe('token distribution', async () => {
    let result


    //call the mint function and "expect" the "result"
    it('mints tokens', async () => {
      //account [0] (the first account in that array) that was injected by truffle "contract('Memory Token', (accounts) => {"
      //that's the _to value, the person the token for
      await token.mint(accounts[0], 'https://www.token-uri.com/nft')
      
      //It should increase the total supply  
      result = await token.totalSupply()
      assert.equal(result.toString(), '1', 'total supply is correct')
      
      //It increments owner balance, so the person who the token has been minted for should have just 1 token
      result = await token.balanceOf(accounts[0])
      assert.equal(result.toString(), '1', 'balanceOf is correct')

      //to make sure that the token belongs to the owner, so "token of ID number 1..."
      result = await token.ownerOf('1')
      assert.equal(result.toString(), accounts[0].toString(), 'ownerOf is correct0')
      result = await token.tokenOfOwnerByIndex(accounts[0], 0)

      //Owner can see all tokens and loop to fetch out each individual token (IDs) that the person holds
      //for each of them it push to the array(empty list). tokenIds is the first array and expect is the second array ['1']
      let balanceOf = await token.balanceOf(accounts[0])
      let tokenIds = []
      for (let i=0; i < balanceOf; i++) {
        let id = await token.tokenOfOwnerByIndex(accounts[0], i)
        tokenIds.push(id.toString())
      }
      let expect = ['1']
      assert.equal(tokenIds.toString(), expect.toString(), 'tokenIds are correct')

      //Token URI correct for the first token ['1']
      let tokenURI = await token.tokenURI('1')
      assert.equal(tokenURI, 'https://www.token-uri.com/nft')
    })
  })
})
