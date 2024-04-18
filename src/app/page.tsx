import Uploadsection from '@/components/Uploadsection'
import Image from 'next/image'
import Landing from '@/components/Landing'
import { DotBackgroundDemo } from '@/components/Dotlanding'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

export default function Home() {
  return (
    <main >
      {/* <DotBackgroundDemo /> */}
      <MaxWidthWrapper>
        <Landing />

      </MaxWidthWrapper>

     
    </main>
  )
}
