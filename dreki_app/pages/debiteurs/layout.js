"use client";

import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function DebiteurLayout({ children }) {
  const pathname = usePathname();
 
  if (!pathname.includes("/debiteurs")) {
    return null;
  }

  return (
    <div>
      <Navbar/>
      <main>{children}</main>
    </div>
  );
}
