"use client";

import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function AddDebiteurLayout({ children }) {
  const pathname = usePathname();
 
  if (!pathname.includes("/mod_debiteurs")) {
    return null;
  }

  return (
    <div>
      <Navbar/>
      <main>{children}</main>
    </div>
  );
}
