"use client"
import React from 'react'
import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Loadingmoonsvg } from '@/lib/icon'
// import { buttonVariants } from './ui/button'
// import { useUser } from "@clerk/clerk-react";
// import { UserButton } from '@clerk/nextjs';

const Navbar = () => {
  //   const { user } = useUser();

  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          <Link
            href='/'
            className='flex items-center z-40 font-semibold'>
            <span className='flex items-center mr-6'>Celestial Chat</span> <Loadingmoonsvg />
          </Link>
          {/* <MobileNav isAuth={!!user} /> */}

          <div className='hidden items-center space-x-4 sm:flex'>
            {/* {user ? (
              <UserButton />
            ) : (
              <Link
                href='/files'
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                })}>
                Get Started
              </Link>
            )} */}

          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
