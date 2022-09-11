import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'hardhat-watcher'
import 'solidity-coverage'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-contract-sizer'
import 'hardhat-docgen'

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const accounts = {
  mnemonic:
    process.env.MNEMONIC || 'abc abc abc abc abc abc abc abc abc abc abc abc',
}

const config: HardhatUserConfig = {
  solidity: '0.8.14',
  // defaultNetwork: 'matic',
  networks: {
    hardhat: {
      chainId: 1337,
      // gas: 10000000000,
      accounts: {
        accountsBalance: '10000000000000000000000',
      },
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 4,
      // @ts-ignore
      live: true,
      saveDeployments: true,
    },
    matic: {
      url: 'https://matic-mumbai.chainstacklabs.com',
      accounts,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true,
    },
  },
  contractSizer: {
    disambiguatePaths: false,
    runOnCompile: true,
    strict: process.env.CONTRACT_SIZER_STRICT_DISABLE ? false : true,
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  },
}

export default config
