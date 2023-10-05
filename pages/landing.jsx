import Navbar from '@/components/Navbar'
import { Button, buttonVariants } from '@/components/ui/button'
import React from 'react'
import Banner from '@/public/banner.jpg'
import Image from 'next/image'
import NavLanding from '@/components/NavLanding'
import Link from 'next/link'

function landing() {
  return (
    <div className="">
      {/* <Head>
        <title>QooSpayce</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="icon" href="/qoo_logo.png" />
      </Head> */}
      {/* <Header /> */}
      {/* <Navbar /> */}
      <NavLanding />

      <main className="flex flex-col items-center justify-center w-full mt-20 mb-16">
        <div className="w-[30rem] ">
          <h1 className="text-4xl font-bold text-center text-secondary leading-[2.75rem]">
            WELCOME TO THE CEMCS VOTING PLATFORM
          </h1>
        </div>

        <div className='flex space-x-5 mt-5' >
            <Link className={buttonVariants({
              })} href="/signinmember">
            Member Sign in
            </Link>
            <Link className={buttonVariants({
              })} href="/signin">
            Admin Sign in
            </Link>
        </div>


        <div className="relative w-full mt-16 h-[24rem]">
          <Image
            className="absolute w-full h-full"
            src={Banner}
            layout="fill"
            objectFit="cover"
          />
        </div>
       
      </main>
      
    </div>
  )
}

export default landing