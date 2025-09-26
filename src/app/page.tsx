'use client';

import MainNav from './components/nav';
import TempGroupWidget from './components/tempGroup';
import { navData } from './data';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
   return (
    <>
      <MainNav data={navData} name="Hardwick Cider Company"></MainNav>
      <TempGroupWidget />
      <Analytics />
    </>
  );
}
