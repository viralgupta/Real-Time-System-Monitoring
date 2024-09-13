import React from 'react'
import LiveServer from '../components/servers/live_server'
import OfflineServer from '../components/servers/offiline_server'

const Page = () => {
  return (
    <div className='h-full'>
      <LiveServer/>
      <OfflineServer/>
    </div>
  )
}

export default Page