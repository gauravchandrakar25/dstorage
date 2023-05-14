## ``` Decentralized File Storage. ```


## 🔧 Project Diagram:
![Project Diagram](https://i.gyazo.com/2738ea6743a40036756b1b5714ab9fa8.png)


This repository contains a decentralized storage project developed using Truffle, IPFS, Solidity, and ReactJS. The project is deployed on the Polygon testnet.

## Overview
The Decentralized Storage Project aims to provide a decentralized and secure platform for storing files. It utilizes blockchain technology and the power of smart contracts to ensure transparency and immutability of stored data. The project consists of a backend implemented in Solidity and Truffle, and a frontend developed using ReactJS.

## Features
- File uploading: Users can upload files to the decentralized storage platform securely.
- Decentralized storage: The files are stored in a distributed manner across the network to ensure high availability and redundancy.
- Transparent and immutable: The use of smart contracts ensures that the storage operations are transparent and immutable, providing trust and security.

## Prerequisites
Make sure you have the following tools installed:

- Truffle: Installation Guide
- Node.js and npm: Download Page

## Getting Started
1. Clone the repository

```bash
git clone https://github.com/gauravchandrakar25/dstorage.git
```

2. Install Dependencies
```bash
npm install
```
3. Deploy the smart contracts to the Polygon testnet:

```bash
truffle compile
truffle migrate --network matic
```
4. Start the React development server:
```bash
npm run start
```

5. Access the application in your browser at http://localhost:3000.

## Configuration
To configure the project, you can modify the following files:

1. truffle-config.js: Update the network settings to match your Polygon testnet configuration.
2. src/config.js: Adjust the contract addresses and other settings based on your deployment.
