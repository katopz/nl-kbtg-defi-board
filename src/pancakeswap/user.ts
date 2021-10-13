// Serialize
import BigNumber from "bignumber.js"

// SDK for call contract
import { Chain } from "@defillama/sdk/build/general"
import { api } from "@defillama/sdk"

// ABI
import masterchefABI from '../pancake.masterchef.abi.json'

const getAbiByName = (abi: any[], name: string) => abi.find(e => e.name === name)


// Interface
export interface IUserInfo {
  amount: number
  rewardDebt: number
  pendingCake: number
}

export const getUserInfos = async (account: string, masterChefAddress: string, poolId: number, block = 'latest', chain: Chain = 'bsc') => {
  const calls = [{
    target: masterChefAddress,
    params: [poolId, account],
  }]

  // ABI
  const userInfoABI = getAbiByName(masterchefABI, 'userInfo')
  const pendingCakeABI = getAbiByName(masterchefABI, 'pendingCake')

  // Calls
  const userInfos = api.abi.multiCall({
    // @ts-ignore
    block,
    calls,
    abi: userInfoABI,
    chain,
  })

  const pendingCakes = api.abi.multiCall({
    // @ts-ignore
    block,
    calls,
    abi: pendingCakeABI,
    chain,
  })

  const [userInfosOutput, pendingCakeOutput] = await Promise.all([userInfos, pendingCakes])

  const { amount, rewardDebt } = userInfosOutput.output[0].output
  const pendingCakeAmount = pendingCakeOutput.output[0].output

  return {
    amount: new BigNumber(amount).toNumber() / Math.pow(10, 18),
    rewardDebt: new BigNumber(rewardDebt).toNumber() / Math.pow(10, 18),
    pendingCake: new BigNumber(pendingCakeAmount).toNumber() / Math.pow(10, 18),
  } as IUserInfo
}