"use client";

import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function MyLayout({ children }) {
  const pathname = usePathname();
 
  const paths = ["/objet", "/parametres", "/mod_debiteurs", "/factures", "/add_factures", "/debiteurs", "/dashboard", "/mod_factures"];

  if (!paths.some(path => pathname.includes(path))) {
    return null;
  }
  
  return (
    <div>
      <Navbar/>
      <main>{children}</main>
    </div>
  );
}
