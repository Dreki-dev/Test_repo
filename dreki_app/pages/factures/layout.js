"use client";

import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function FacturesLayout({ children }) {
  const pathname = usePathname();
 
  if (!pathname.includes("/factures")) {
    return null;
  }

  return (
    <div>
      <Navbar/>
      <main>{children}</main>
    </div>
  );
}
