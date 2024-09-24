// // app/layout.js
// import Navbar from './Navbar';
// import './globals.css'; // Vos styles globaux ici
// import { usePathname } from 'next/navigation'; // Utilisez ce hook pour obtenir le pathname

// export const metadata = {
//   title: 'Votre Titre',
//   description: 'Votre description',
// };

// export default function RootLayout({ children }) {
//   const pathname = usePathname(); // Obtenez le pathname actuel

//   // Déterminez si la navbar doit être affichée
//   const showNavbar = !pathname.includes('/login') && !pathname.includes('/signup');

//   return (
//     <html lang="fr">
//       <body>
//         {showNavbar && <Navbar currentPath={pathname} />} {/* Passe le pathname à Navbar */}
//         <main>{children}</main>
//       </body>
//     </html>
//   );
// }
