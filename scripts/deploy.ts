// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
import { ethers } from 'hardhat'

// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  let signers = await ethers.getSigners()
  let deployer = signers[0]
  const creatorAddr = process.env.ACCOUNT_ADDRESS || '' // hardcode do anonimo -> inserir endereco local

  console.log(
    `Deployer Address: ${deployer.address} Balance: ` +
      (await deployer.getBalance()).toString()
  )

  console.log('CTT Mock contract: Deploying')
  const CTTMockFactory = await ethers.getContractFactory('ERC20Mock')
  const CTTMock = await CTTMockFactory.deploy(
    'Crypto Tap Token',
    'CTT',
    deployer.address,
    0
  )
  await CTTMock.deployed()

  console.log('BRZ Mock contract: Deploying')
  const BRZMockFactory = await ethers.getContractFactory('ERC20Mock')
  const BRZMock = await BRZMockFactory.deploy(
    'Brazilian Crypto',
    'BRZ',
    deployer.address,
    100.0
  )
  await BRZMock.deployed()

  console.log('CryptoTapTokenSwap contract: Deploying')
  const CryptoTapTokenSwapFactory = await ethers.getContractFactory(
    'CryptoTapTokenSwap'
  )
  const CryptoTapTokenSwap = await CryptoTapTokenSwapFactory.deploy(
    deployer.address,
    CTTMock.address,
    BRZMock.address
  )
  await CryptoTapTokenSwap.deployed()

  console.table({
    network: 'mumbai',
    CryptoTapTokenSwap: CryptoTapTokenSwap.address,
    CTTMock: CTTMock.address,
    BRZMock: BRZMock.address,
    creatorAddr: creatorAddr,
    deployerAddress: deployer.address,
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
