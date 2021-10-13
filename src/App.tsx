// React
import React, { useEffect, useState } from 'react'

import { getFarmInfos, IFarmInfo } from './pancakeswap/farm'
import { getUserInfos, IUserInfo } from './pancakeswap/user'

function App() {
  // Input data
  const account = '0xfc618ffd9164ebe5e50bab0295e526a7136f74e5'
  const masterChefAddress = '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
  const farmAddress = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'
  const poulId = 251

  // User state
  const [userInfo, setUserInfo] = useState<IUserInfo>()
  const [farmInfo, setFarmInfo] = useState<IFarmInfo>()

  // Get user info on mount
  useEffect(() => {
    async function loadUserInfo() {
      const userInfo = await getUserInfos(account, masterChefAddress, poulId)
      const farmInfo = await getFarmInfos(farmAddress)
      setUserInfo(userInfo)
      setFarmInfo(farmInfo)
    }

    loadUserInfo()
  }, [])

  // Render
  return (
    <div>
      <h4>User</h4>
      <ul>
        <li>Address: {account}</li>
        <li>CAKE-LP Balance: {userInfo?.amount || 0}</li>
        <li>Pending CAKE reward: {userInfo?.pendingCake || 0}</li>
      </ul>
      <hr />
      <h4>Farm</h4>
      <ul>
        <li>reserve0: {farmInfo?.reserve0 || 0}</li>
        <li>reserve1: {farmInfo?.reserve1 || 0}</li>
      </ul>
    </div>
  )
}

export default App
