import React from 'react'
import Link from 'next/link'

const Body = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='w-full flex h-dvh'>
      <div className='w-1/6 h-full border-r border-2 p-2 font-sofiapro text-xl flex flex-col text-foreground bg-background'>
        <Link className='text-center w-full hover:bg-primary-foreground duration-300 border-b p-3' href={"/servers"}>Servers</Link>
        <Link className='text-center w-full hover:bg-primary-foreground duration-300 border-b p-3' href={"/trainings"}>Training Logs</Link>
      </div>
      <div className='w-5/6 p-10 pt-5'>
        {children}
      </div>
    </div>
  )
}

export default Body