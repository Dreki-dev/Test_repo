"use client"; // Marque ce fichier comme un composant client

import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
 
  console.log("DashboardLayout rendu")
  if (!pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <div>
      <Navbar/>
      <main>{children}</main>
    </div>
  );
}
