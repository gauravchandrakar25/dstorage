import DStorage from '../abis/DStorage.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';
import { create } from 'ipfs-http-client'

const projectId = '2On1EQlIKJaMLELAfi7FlNKtXJk';
const projectSecret = '82bc4f6ba52671412089ee1c94ef2fbc';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
// const ipfs = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   apiPath: 'https://major-project.infura-ipfs.io',
//   headers: {
//     authorization: auth,
//   }
// })

// //Declare IPFS
const ipfsClient = require('ipfs-http-client')
// const projectId = "<YOUR PROJECT ID>";
// const projectSecret = "82bc4f6ba52671412089ee1c94ef2fbc";
// const authorization = "Basic " + btoa(projectId + ":" + projectSecret);
// // const ipfs = create({
// //   url: "https://ipfs.infura.io:5001/api/v0",
// //   headers:{
// //     authorization
// //   }
// // })

const ipfs = ipfsClient({
  host: 'ipfs.infura.io', port: 5001, protocol: 'https',
  headers: {
    authorization: auth,
  }
})


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    //Setting up Web3
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying Metamask')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3

    //Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    //Network ID
    const networkID = await web3.eth.net.getId()
    const networkData = DStorage.networks[networkID]
    if (networkData) {
      //Assign Contract
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address)
      this.setState({ dstorage })
      //Get files amount
      const fileCount = await dstorage.methods.fileCount().call()
      this.setState({ fileCount })

      //Load files & sort by the newest
      for (var i = fileCount; i >= 1; i--) {
        const file = await dstorage.methods.files(i).call()
        this.setState({ files: [...this.state.files, file] })
      }
    } else {
      window.alert('DStorage contract not deployed to detected network')
    }
    this.setState({ loading: false })

    //Else
    //alert Error
    this.setState({ loading: false });

  }

  // Get file from user
  captureFile = event => {
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
      console.log('buffer', this.state.buffer)
    }

  }

  //Upload File
  uploadFile = description => {
    console.log("Submitting file to IPFS...")

    //Add file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result)

      if (error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })

      //Assign value for the file without extension
      if (this.state.type === '') {
        this.setState({ type: 'none' })
      }

      this.state.dstorage.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
          loading: false,
          type: null,
          name: null
        })
        window.location.reload()
      }).on('error', (e) => {
        window.alert('Error')
        this.setState({ loading: false })
      })
    })

  }

  //Set states
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      dstorage: null,
      files: [],
      loading: false,
      type: null,
      name: null
    }

    //Bind functions
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
            files={this.state.files}
            captureFile={this.captureFile}
            uploadFile={this.uploadFile}
          />
        }
      </div>
    );
  }
}

export default App;