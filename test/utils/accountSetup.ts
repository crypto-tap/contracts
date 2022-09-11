import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Contract } from 'ethers'
import { ethers } from 'hardhat'

let signers = [] as SignerWithAddress[]

export interface SignersReturn {
  signers: SignerWithAddress[]
  creator: SignerWithAddress
  bob: SignerWithAddress
  marcia: SignerWithAddress
  paul: SignerWithAddress
  seul: SignerWithAddress
  erik: SignerWithAddress
}

export interface Conn {
  creator: Contract
  bob: Contract
  marcia: Contract
  paul: Contract
  seul: Contract
  erik: Contract
}

export const getConn = (contract: Contract, signers: SignersReturn) => {
  const { creator, bob, marcia, paul, seul, erik } = signers
  return {
    creator: contract.connect(creator),
    bob: contract.connect(bob),
    marcia: contract.connect(marcia),
    paul: contract.connect(paul),
    seul: contract.connect(seul),
    erik: contract.connect(erik),
  }
}

export async function getSigners(): Promise<SignersReturn> {
  if (signers.length === 0) {
    signers = await ethers.getSigners()
  }
  const addresses = {
    signers,
    creator: signers[0],
    bob: signers[1],
    marcia: signers[2],
    paul: signers[3],
    seul: signers[4],
    erik: signers[5],
  }

  return addresses
}

type getSignersConnReturn = {
  conn: Conn
} & SignersReturn

export async function getSignersConn(
  contract: Contract
): Promise<getSignersConnReturn> {
  const addresses = await getSigners()
  const conn = getConn(contract, addresses)

  return {
    ...addresses,
    conn,
  }
}

export async function giveAddProjectRole(contract: Contract, address: string) {
  const CREATOR_ROLE = await contract.CREATOR_ROLE()
  await contract.grantRole(CREATOR_ROLE, address)
}
