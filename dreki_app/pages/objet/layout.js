"use client";

import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function objetLayout({ children }) {
  const pathname = usePathname();
 
  if (!pathname.includes("/objet")) {
    return null;
  }

  return (
    <div>
      <Navbar/>
      <main>{children}</main>
    </div>
  );
}
