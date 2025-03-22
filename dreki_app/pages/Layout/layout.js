"use client";

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingPage from '../components/LoadingPage';

export default function MyLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const paths = ["/objet", "/parametres", "/mod_debiteurs", "/factures", "/add_factures", "/debiteurs", "/dashboard", "/mod_factures", "/notes", "/historic", "/test_note"];

  if (!paths.some(path => pathname.includes(path))) {
    return null;
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => {
      setTimeout(() => setLoading(false), 800);
    };

    if (router && router.events) {
      router.events.on('routeChangeStart', handleRouteChangeStart);
      router.events.on('routeChangeComplete', handleRouteChangeComplete);
      router.events.on('routeChangeError', handleRouteChangeComplete);

      return () => {
        router.events.off('routeChangeStart', handleRouteChangeStart);
        router.events.off('routeChangeComplete', handleRouteChangeComplete);
        router.events.off('routeChangeError', handleRouteChangeComplete);
      };
    }
  }, [router]);

  return (
    <div>
      {loading && <LoadingPage minDuration={800} isVisible={loading} />}
      
      <div className={loading ? 'content-hidden' : 'content-visible'}>
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}