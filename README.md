# ETH Wallet UI with Web3.js

A simple Ethereum wallet UI built with React and Web3.js that allows users to connect their MetaMask wallet, send and receive ETH.

## Features

✅ **Connect MetaMask Wallet** - Easily connect your MetaMask wallet
✅ **View Wallet Info** - Display connected address and current balance
✅ **Send ETH** - Transfer ETH to any Ethereum address with validation
✅ **Receive ETH** - Display wallet address and QR code for easy sharing
✅ **Real-time Balance** - Auto-refresh balance every 15 seconds
✅ **Responsive Design** - Works on desktop 

## Prerequisites

- Node.js (v14 or higher)
- MetaMask browser extension
- Test ETH on a test network (Sepolia)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### Connect Wallet
1. Click "Connect MetaMask Wallet" button
2. MetaMask will prompt you to select an account
3. Approve the connection

### View Wallet Info
- See your Ethereum address and current ETH balance
- Click the copy button to copy address to clipboard
- Use "Refresh Balance" to manually update balance

### Send ETH
1. Go to "Send ETH" tab
2. Enter the recipient's Ethereum address
3. Enter the amount of ETH to send
4. Click "Send ETH"
5. Approve the transaction in MetaMask
6. Wait for confirmation

### Receive ETH
1. Go to "Receive ETH" tab
2. Share your address or QR code with others
3. Click "Copy" to copy your address
4. Download the QR code as an image

## Technologies Used

- **React** - UI library
- **Web3.js** - Ethereum JavaScript API
- **MetaMask** - Wallet provider
- **QR Code** - For sharing addresses

## Network Support

The wallet works on any Ethereum network where MetaMask is configured:
- Sepolia Testnet
- And any other EVM-compatible network


