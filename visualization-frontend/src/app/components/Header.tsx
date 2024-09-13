import React from 'react'
import { ModeToggle } from './ui/theme'
import Link from 'next/link'

const Header = () => {
  return (
    <div className='h-20 border-b-2 w-full flex items-center align-middle justify-between border-border px-10 bg-background text-foreground'>
      <Link href={"/"} className='font-cubano text-3xl flex items-center'>
        <img src="/logo-removebg-preview.png" className='h-16 mr-2' />
        WatchDawg
      </Link>
      <ModeToggle/>
    </div>
  )
}

export default Header