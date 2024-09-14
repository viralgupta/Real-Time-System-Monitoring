import React from 'react'
import LiveTraining from '../components/training/LiveTraining'
import OfflineTraining from '../components/training/OfflineTraining'

const Page = () => {
  return (
    <div className='h-full'>
      <LiveTraining/>
      <OfflineTraining/>
    </div>
  )
}

export default Page