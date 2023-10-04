import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SmallBanner from '@/components/SmallBanner'
import { useAuth } from '@/services/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {user} = useAuth();
  console.log(user?.token)
  return (
    <main>

          <Navbar />
          <Hero />
          <SmallBanner />
    </main>
  )
}
