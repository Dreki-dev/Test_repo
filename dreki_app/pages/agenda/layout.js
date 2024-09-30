"use client"; // Marque ce fichier comme un composant client

import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function AgendaLayout({ children }) {
  const pathname = usePathname();
 
  console.log("DashboardLayout agenda")
  if (!pathname.includes("/agenda")) {
    return null;
  }

  return (
    <div>
      <Navbar/>
      <main>{children}</main>
    </div>
  );
}
