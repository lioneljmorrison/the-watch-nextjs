import Image from 'next/image'
import MainNav from './components/nav'
import { navData } from './data'

export default function Home() {
  return (
    <MainNav data={navData} name='Hardwick Cider Company'></MainNav>


    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //     Code here
    // </main>
  )
}
