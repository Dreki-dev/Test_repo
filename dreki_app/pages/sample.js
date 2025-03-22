import MyLayout from '../Layout/layout';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import LoadingPage from './components/LoadingPage';

import '../css/dashboard.css';
import '../css/facture.css';
import '../css/sharefeatures.css';

export default function PageTemplate() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Gestion du chargement lors du changement de route
    useEffect(() => {
        const handleRouteChangeStart = () => setLoading(true);
        const handleRouteChangeComplete = () => setTimeout(() => setLoading(false), 1500);

        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);
        router.events.on('routeChangeError', handleRouteChangeComplete);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            router.events.off('routeChangeError', handleRouteChangeComplete);
        };
    }, []);

    return (
        <MyLayout>
            {loading && <LoadingPage />}

            <div className="page_container_navbar">
                <div className="title_params_container">
                    <div className="title_params_text">Titre de la page</div>
                </div>

                <div className="content_container">
                    <p>
                        Ceci est un modèle de page réutilisable. Vous pouvez y ajouter du contenu spécifique.
                    </p>

                    <Link href="/another-page" className="custom_button">
                        Aller à une autre page
                    </Link>
                </div>
            </div>
        </MyLayout>
    );
}
