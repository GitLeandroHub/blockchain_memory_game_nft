import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import brain from '../brain.png'

const CARD_ARRAY = [
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  },
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  }
]

//client side of the application
//This is the Main file write for the client side code a "React.js" compoment based "class Name extends React.Component" extends is where is inherits its behaviors. Mixins 
//React is a framework for building user interfacer in javascript mixin wuth html. React have a state object that stores the state of the application. State is like a kind of small database that stores inside the website 
//Memory Tokens string write on the top and "brain" logo on the left imported on the top of the file 
//Layout - A Nav bar "the black navigation menu on the top of the page"
//Imported basic CSS from App.css that's using "boostrap" a UI framework for the nice style as in the site here "&nbsp;"

//The webbrowser is already connected to the blockchain using truffle and ganache with metamask
//It's time to connect the webApp to the blockchain using web3.js 

//Now the application is connected to the blockchain
//and Metamask is connected, React App is working and talking to the blockchain

//Now it's time to connect the Smart Contract from the blockchain and bring to the App as well
//So this is the token created on "MemoryToken.sol" and bring into the App and load that information and put
//into the state object as well. First import the Token on the on the top of the file. The "ABI" file.
//First thing to do is to determine the network(ID) we connect to with ganache, because this tells the specific location of the address from the contract 

//Fetch the token smart contract - ok
//now fetch the total supply

//Now, load all the tokens "for loop on test"
//Now all the blockchain data is loaded into the app
//Now, fill out the states of other part of the game and create the Card Array (CARD_ARRAY)
//then, at className div, create the map function that iterates over all the card array state over card and key
//the key is basically something that react need to know about whenever implement multiple itens html element on the page

//with all the logic for the game created, it's time to generate the tokens

//Component called App
class App extends Component {
  
  //React Life Cycle Methods hooks inform us of where the Component is in the life cycle and what we can and cannot do
  //Call the loadWeb3 function
  //Call function called loadBlockchainData
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.setState({ cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random()) })
  }

  //function loadWeb3 "given" by metamask "recomendation": "hey, here is how to connect webApp to web3 " to connect with the browser
  async loadWeb3 () {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying Metamask!')
    }
  }

  //Perform a task to ensure the WEb3 is connected into our App through
  //Define function called loadBlockchainData
  //Stash the web3 value
  //first thing is to fetch the account that will connect into Metamask and *login" into the page
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    //console.log("account", accounts[0])
    //Instead of logging into the console, it's time to use react and the state inside the html bar
    this.setState({ account: accounts[0] })

    //load smart contract
    const networkId = await web3.eth.net.getId()
    const networkData = MemoryToken.networks[networkId]
    //fetch the address only if it's depoloyed to the network
    if(networkData) {
      //to create a javascript version of the contract is also needed the ABI (jsonInterface)
      const abi = MemoryToken.abi
      const address = networkData.address
      //javascript version of the Smart Contract
      const token = new web3.eth.Contract(abi, address)
      //this.setState({ token: token })
      this.setState({ token })
      //web3 you also need to call the function ".call"
      const totalSupply = await token.methods.totalSupply().call()
      this.setState({ totalSupply })
      //Load Tokens 
      let balanceOf = await token.methods.balanceOf(accounts[0]).call()
      //for loop to go to the entire balance 
      for (let i = 0; i < balanceOf; i++) {
        let id = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call()
        let tokenURI = await token.methods.tokenURI(id).call()
        this.setState({
          tokenURIs: [...this.state.tokenURIs, tokenURI]
        })
      }
    } else {
      alert('Smart contract not deployed to detected network.')
    }
  }

  chooseImage = (cardId) => {
    cardId = cardId.toString()
    if(this.state.cardsWon.includes(cardId)) {
      return window.location.origin + '/images/white.png'
    }
    else if(this.state.cardsChosenId.includes(cardId)) {
      return CARD_ARRAY[cardId].img
    } else {
      return window.location.origin + '/images/blank.png'
    }
  }

  flipCard = async (cardId) => {
    let alreadyChosen  = this.state.cardsChosen.length

    this.setState({
      cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
      cardsChosenId: [...this.state.cardsChosenId, cardId]
    })

    if (alreadyChosen === 1) {
      setTimeout(this.checkForMatch, 100)
    }
  }

  checkForMatch = async () => {
    const optionOneId = this.state.cardsChosenId[0]
    const optionTwoId = this.state.cardsChosenId[1]

    if(optionOneId == optionTwoId) {
      alert('You have clicked the same image')
    } else if (this.state.cardsChosen[0] === this.state.cardsChosen[1]) {
      alert('You found a match')
      //call the function of the token, the mint function, takes the account, the token URI(window.location... + images.pizza.png)
      //web3.js .send to trigger a transaction a transaction on blockchain, saying who's sending the transaction from and wait for the transaction hash back from the blockchain (on) 
      //and then update the state
      this.state.token.methods.mint(
        this.state.account,
        window.location.origin + CARD_ARRAY[optionOneId].img.toString()
      )
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({
          cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId],
          tokenURIs: [...this.state.tokenURIs, CARD_ARRAY[optionOneId].img]
        })
      })
//      this.setState({
//        cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId]
//      })
    } else {
      alert('Sorry, try again')
    }
    this.setState({
      cardsChosen: [],
      cardsChosenId: []
    })
    if (this.state.cardsWon.length === CARD_ARRAY.length) {
      alert('Congratulations! You found them all!')
    }
  }

  
  //constructor function initializes the component

  //Now add to the State Object: token, total supply, and empty array thas is default for token URI
  //Fill out the other states of the page, like the list of cards, the card chosen
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      token: null,
      totalSupply: 0,
      tokenURIs: [],
      cardArray: [],
      cardsChosen: [],
      cardsChosenId: [],
      cardsWon: []
    }
  }

  //render function with all the html code with some javascript inside
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
          <img src={brain} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Memory Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-muted"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1 className="d-4">Edit this file in App.js!</h1>

                <div className="grid mb-4" >

                  { this.state.cardArray.map((card, key) => {
                    return(
                      <img
                        key={key}
                        src={this.chooseImage(key)}
                        data-id={key}
                        onClick={(event) => {
                          let cardId = event.target.getAttribute('data-id')
                          if(!this.state.cardsWon.includes(cardId.toString())) {
                            this.flipCard(cardId)
                          }
                        }}
                      />
                    ) 
                  })}

                </div>

                <div>

                  {/* Code goes here... */}

                  <div className="grid mb-4" >

                    { this.state.tokenURIs.map((tokenURI, key) => {
                      return(
                        <img
                          key={key}
                          src={tokenURI}
                        />
                      )
                    })}

                  </div>

                </div>

              </div>

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
