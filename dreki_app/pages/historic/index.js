import MyLayout from '../Layout/layout';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import LoadingPage from '../components/LoadingPage';

import '../css/sharefeatures.css';
import '../css/historic.css';

export default function Historic() {

    const NotifCase = ({ name, id, text, backcolor }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const toggleExpand = () => {
            setIsExpanded(!isExpanded);
        };

        return (
            <div
                className={`notif_case ${isExpanded ? 'extended' : ''}`}
                style={{ background: backcolor }}
                onClick={toggleExpand} // Change la classe au clic
            >
                <div className={`notif_case_container ${isExpanded ? 'extended' : ''}`}>
                    <div className={`notif_name ${isExpanded ? 'extended' : ''}`} >
                        {name}
                    </div>
                    <div className={`notif_text ${isExpanded ? 'extended' : ''}`}>
                        {isExpanded ? text : text.length > 22 ? text.slice(0, 22) + '...' : text}
                    </div>

                    <div className={`notif_date ${isExpanded ? 'extended' : ''}`}>
                        12/05/2025 :<br />
                        12:30
                    </div>
                    {isExpanded && (
                        <div className="notif_button">
                            Voir
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [isFirstImage, setIsFirstImage] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleClick = () => {
        setIsFirstImage(!isFirstImage);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

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
                <div className='title_params_container' style={{ justifyContent: 'space-between' }}>
                    <div className='title_params_text'>Mon historique</div>
                </div>
                <div className={`notifications_box`}>
                    <div className='title_information_dashboard' style={{ minHeight: '45px' }}>
                        <div style={{ marginLeft: '4px' }}> Notifications :</div>
                    </div>
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'#0120871f'}
                        text={'à payé 255 €'}
                    />
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'rgba(0, 255, 34, 0.05)'}
                        text={'à payé 255 €'}
                    />
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'rgba(255, 0, 119, 0.05)'}
                        text={'à payé 255 €'}
                    />
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'#0120871f'}
                        text={'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb c aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb c aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}
                    />
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'#0120871f'}
                        text={'à payé 255 €'}
                    />
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'#0120871f'}
                        text={'à payé 255 €'}
                    />
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'#0120871f'}
                        text={'à payé 255 €'}
                    />
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'#0120871f'}
                        text={'à payé 255 €'}
                    />
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'#0120871f'}
                        text={'à payé 255 €'}
                    />
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'#0120871f'}
                        text={'à payé 255 €'}
                    />
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'#0120871f'}
                        text={'à payé 255 €'}
                    />
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'#0120871f'}
                        text={'à payé 255 €'}
                    />
                    <NotifCase
                        name={'theo'}
                        id={'1'}
                        backcolor={'#0120871f'}
                        text={'à payé 255 €'}
                    />
                </div>
            </div>
        </MyLayout>
    );
}
