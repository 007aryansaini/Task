const abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hardCap",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "whiteListUsers",
            type: "address[]",
          },
        ],
        internalType: "struct IdoDetails",
        name: "_idoDetails",
        type: "tuple",
      },
    ],
    name: "createIDO",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fundIdo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "transferIdoFund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_investor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "Invested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "idoDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "hardCap",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "investorContribution",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isWhiteList",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalFundRaised",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contractAddress = "0x03A45564daEeE5F89D99A3F29608E66398437E76";
let defaultAccount;
let provider;
let contract;

// DOM Selectors
const walletConnectBtn = document.querySelector("#connect");
const walletAddress = document.querySelector("#wallet-address");
const startTime = document.querySelector("#startTime");
const endTime = document.querySelector("#endTime");
const hardCap = document.querySelector("#hardCap");
const whiteListUsers = document.querySelector("#whiteListUsers");
const createIDO = document.querySelector("#createIDO");
const createIDOTxHash = document.querySelector("#CreateHash");
const fund = document.querySelector("#fund");
const fundAmount = document.querySelector("#amountFund");
const fundHash = document.querySelector("#fundHash");
const to = document.querySelector("#To");
const amount = document.querySelector("#amount");
const transfer = document.querySelector("#transfer");
const transferhash = document.querySelector("#transferhash");

// Connect to Metamask function
async function connectWallet() {
  if (window.ethereum && window.ethereum.isMetaMask) {
    try {
      // Metasmak connect

      provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      defaultAccount = accounts[0];

      walletAddress.innerText = defaultAccount;
      walletConnectBtn.innerText = "Wallet connected";

      // Getting Signer
      const signer = provider.getSigner();

      // initializing Contract
      contract = new ethers.Contract(contractAddress, abi, signer);
    } catch (error) {
      alert(error.message);
    }
  } else {
    alert("You need to install metamask first");
  }
}

async function createIdoHandler(event) {
  event.preventDefault();

  const st = startTime.value * 1;
  const et = endTime.value * 1;
  const hc = hardCap.value * 1;
  const addresses = whiteListUsers.value;

  const stringArray = addresses; // Example string array
  const jsArray = JSON.parse(stringArray); // Convert string to JavaScript array

  const param = {
    startTime: st,
    endTime: et,
    hardCap: hc,
    whiteListUsers: jsArray,
  };

  try {
    const tx = await contract.createIDO(param);
    createIDOTxHash.innerText = tx.hash;
  } catch (error) {
    alert(error);
  }
}

async function fundHandler(event) {
  event.preventDefault();
  const amount = fundAmount.value * 1;

  try {
    const options = { value: amount };

    const tx = await contract.fundIdo(options);

    fundHash.innerText = tx.hash;
  } catch (error) {
    alert(error.message);
  }
}

async function transferHandler(event) {
  event.preventDefault();

  const _to = to.value;
  const _amount = amount.value * 1;

  try {
    const tx = await contract.transferIdoFund(_to, _amount);
    transferhash.innerText = tx.hash;
  } catch (error) {
    alert(error.message);
  }
}

// Event listners
walletConnectBtn.addEventListener("click", connectWallet);
createIDO.addEventListener("click", createIdoHandler);
fund.addEventListener("click", fundHandler);
transfer.addEventListener("click", transferHandler);
