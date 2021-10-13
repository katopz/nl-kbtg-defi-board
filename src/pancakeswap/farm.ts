// Serialize
import BigNumber from "bignumber.js"

// SDK for call contract
import { Chain } from "@defillama/sdk/build/general"
import { api } from "@defillama/sdk"

// ABI
import pancakePairABI from '../pancake.PancakePair.abi.json'

const getAbiByName = (abi: any[], name: string) => abi.find(e => e.name === name)

// Interface
export interface IFarmInfo {
  reserve0: number
  reserve1: number
}

export const getFarmInfos = async (farmAddress: string, block = 'latest', chain: Chain = 'bsc') => {
  const calls = [{
    target: farmAddress,
    params: [],
  }]

  // ABI
  const reserveInfoABI = getAbiByName(pancakePairABI, 'getReserves')

  const reserveInfos = api.abi.multiCall({
    // @ts-ignore
    block,
    calls,
    abi: reserveInfoABI,
    chain,
  })

  const [reserveInfoOutput] = await Promise.all([reserveInfos])
  const { _reserve0, _reserve1 } = reserveInfoOutput.output[0].output

  return {
    reserve0: new BigNumber(_reserve0).toNumber() / Math.pow(10, 18),
    reserve1: new BigNumber(_reserve1).toNumber() / Math.pow(10, 18),
  } as IFarmInfo
}
