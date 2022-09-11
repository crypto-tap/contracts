import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { getSignersConn } from './utils/accountSetup'

describe('Lock', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContracts() {
    const [owner, otherAccount] = await ethers.getSigners()

    const CTTMockFactory = await ethers.getContractFactory('ERC20Mock')
    const CTTMock = await CTTMockFactory.deploy(
      'Crypto Tap Token',
      'CTT',
      owner.address,
      0
    )
    await CTTMock.deployed()

    const BRZMockFactory = await ethers.getContractFactory('ERC20Mock')
    const BRZMock = await BRZMockFactory.deploy(
      'Brazilian Crypto',
      'BRZ',
      owner.address,
      100.0
    )
    await BRZMock.deployed()

    const CustodyFactory = await ethers.getContractFactory('Custody')
    const Custody = await CustodyFactory.deploy(
      owner.address,
      CTTMock.address,
      BRZMock.address
    )
    await Custody.deployed()

    const CryptoTapTokenSwapFactory = await ethers.getContractFactory(
      'CryptoTapTokenSwap'
    )
    const CryptoTapTokenSwap = await CryptoTapTokenSwapFactory.deploy(
      owner.address,
      CTTMock.address,
      BRZMock.address,
      Custody.address
    )
    await CryptoTapTokenSwap.deployed()

    // Give operator role to CryptoTapTokenSwap contract
    const OPERATOR_ROLE = await Custody.OPERATOR_ROLE()
    await Custody.connect(owner).grantRole(
      OPERATOR_ROLE,
      CryptoTapTokenSwap.address
    )

    return {
      Custody,
      CryptoTapTokenSwap,
      CTTMock,
      BRZMock,
      owner,
      otherAccount,
    }
  }

  describe('Testing transactionx', function () {
    it('should mint ctt to ctt swap contract', async function () {
      const amount = 100
      const { CryptoTapTokenSwap, CTTMock } = await loadFixture(deployContracts)
      const { conn } = await getSignersConn(CTTMock)

      await conn.creator.mint(CryptoTapTokenSwap.address, amount)
      expect(await CTTMock.balanceOf(CryptoTapTokenSwap.address)).to.equal(
        amount
      )
    })
    it('should exchange brz to ctt and send ctt to custody contract', async function () {
      const amount = 100
      const { CryptoTapTokenSwap, CTTMock, BRZMock, Custody } =
        await loadFixture(deployContracts)
      const { conn } = await getSignersConn(CTTMock)
      const { conn: connBRZ, creator } = await getSignersConn(BRZMock)
      const { conn: connSwap } = await getSignersConn(CryptoTapTokenSwap)

      // mint ctt to swap
      await conn.creator.mint(CryptoTapTokenSwap.address, amount)

      // mint brz to creator
      await connBRZ.creator.mint(creator.address, amount)
      await connBRZ.creator.approve(CryptoTapTokenSwap.address, amount)

      // call buyCTT
      await connSwap.creator.buyCTT(2, {
        value: amount,
      })

      expect(await CTTMock.balanceOf(Custody.address)).to.equal(amount)
      expect(await BRZMock.balanceOf(CryptoTapTokenSwap.address)).to.equal(
        amount
      )
    })
  })
})
