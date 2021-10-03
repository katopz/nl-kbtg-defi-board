// React
import React, { useEffect, useState } from 'react'

// Serialize
import BigNumber from "bignumber.js"

// SDK for call contract
import { Chain } from "@defillama/sdk/build/general"
import { api } from "@defillama/sdk"

// ABI
import abi from './pancake.masterchef.abi.json'
const getAbiByName = (name: string) => abi.find(e => e.name === name)

// Interface
interface IUserInfo {
  amount: number
  rewardDept: number
}

// Get user staked amount
const getUserInfos = async (account: string, masterChefAddress: string, poolId: number, block = 'latest', chain: Chain = 'bsc') => {
  const calls = [{
    target: masterChefAddress,
    params: [poolId, account],
  }]

  const userInfoABI = getAbiByName('userInfo')

  const userInfos = await api.abi.multiCall({
    // @ts-ignore
    block,
    calls,
    abi: userInfoABI,
    chain,
  })

  const { amount, rewardDebt } = userInfos.output[0].output

  return {
    amount: new BigNumber(amount).toNumber() / Math.pow(10, 18),
    rewardDebt: new BigNumber(rewardDebt).toNumber() / Math.pow(10, 18),
  } as unknown as IUserInfo
}

function App() {
  // Input data
  const account = '0xfc618ffd9164ebe5e50bab0295e526a7136f74e5'
  const masterChefAddress = '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
  const poolId = 251

  // User state
  const [userInfo, setUserInfo] = useState<IUserInfo>()

  // Get user info on mount
  useEffect(() => {
    async function loadUserInfo() {
      const userInfo = await getUserInfos(account, masterChefAddress, poolId)
      setUserInfo(userInfo)
    }

    loadUserInfo()
  }, [])

  // Render
  return (
    <div>
      <p>User Address: {account}</p>
      <p>User CAKE-LP Balance: {userInfo?.amount || 0}</p>
    </div>
  )
}

export default App
