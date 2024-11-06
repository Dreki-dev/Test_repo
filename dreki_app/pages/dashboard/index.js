import MyLayout from '../Layout/layout';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import '../css/dashboard.css'
import '../css/facture.css'
import '../css/sharefeatures.css'

import blue_dragon from '../../public/images/logo_mini_dreki_blue.png'
import white_dragon from '../../public/images/logo_mini_dreki_white.png'
import red_dragon from '../../public/images/logo_mini_dreki_red.png'
import LoadingPage from './../components/LoadingPage.js'
import Router from 'next/router'
import { useRouter } from 'next/router';

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const handleRouteChangeStart = () => {
        setLoading(true);
        setTimeout(() => {
        }, 0);
    };

    const handleRouteChangeComplete = () => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    useEffect(() => {
        Router.events.on('routeChangeStart', handleRouteChangeStart);
        Router.events.on('routeChangeComplete', handleRouteChangeComplete);
        Router.events.on('routeChangeError', handleRouteChangeComplete);

        return () => {
            Router.events.off('routeChangeStart', handleRouteChangeStart);
            Router.events.off('routeChangeComplete', handleRouteChangeComplete);
            Router.events.off('routeChangeError', handleRouteChangeComplete);
        };
    }, []);
    const router = useRouter();
    const [facture, setFacture] = useState([
        { 
            name: 'Theo Dupont', 
            dragon: blue_dragon, 
            backColor: '#01208729', 
            euro: '158445', 
            id: '1', 
            numero: '422' 
        },
        { 
            name: 'Jean Martin', 
            dragon: blue_dragon, backColor: '#01208729', 
            euro: '158445', 
            id: '2', 
            numero: '12' 
        },
        { 
            name: 'Marie Lefevre', 
            dragon: blue_dragon, backColor: '#01208729', 
            euro: '158445', 
            id: '3', 
            numero: '2' 
        },
        { 
            name: 'Emma Moreau', 
            dragon: red_dragon, backColor: 'rgba(255, 0, 0, 0.085)', 
            euro: '544', 
            id: '4', 
            numero: '3644' 
        },
        { 
            name: 'Lucas Girard', 
            dragon: white_dragon, backColor: 'rgba(16, 137, 16, 0.085)', 
            euro: '125', 
            id: '5', 
            numero: '9754' 
        },
        
    ]);

    const FactureCase = ({ name, backColor, dragon, euro, id }) => {
        console.log(dragon)
        return (
            <Link className='input_case_container_fac' href={`/factures?id=${id}`}>
                <div className='name_container_tab_fac'>
                    {name}
                </div>
                <div className='euro_container_tab_fac' style={{ justifyContent: 'center' }}>
                    {euro}
                </div>
                <div className='status_container_tab_fac' style={{ backgroundColor: backColor, transform: 'scale(0.8)', justifyContent: 'center' }}>
                    <img src={dragon.src} alt="dragon image" className='dragon_logo' />
                </div>
                <div className='action_container_tab_fac'>
                    <div className='button_acton_voirplus no-select' href={`/factures?id=${id}`}>voir plus</div>
                </div>
            </Link>
        );
    };

    const NoteCase = ({ name, dragon, numero, id }) => {
        console.log(dragon)
        return (
            <Link href={`/objet/${id}`} className='input_case_container_fac no-select' style={{ justifyContent: 'space-around' }}>
                <div className='name_container_tab_fac'>
                    {name}
                </div>
                <div className='euro_container_tab_fac' style={{ justifyContent: 'center' }}>
                    {numero}
                </div>
                <div className='action_container_tab_fac'>
                    <div className='button_acton_voirplus no-select' >voir note</div>
                </div>
            </Link>
        );
    };
    
    return (
        <MyLayout>
            {loading && <LoadingPage />}

            <div className='page_container_navbar' style={{ overflowY: 'hidden' }}>



                <div className='title_params_container'>
                    <div className='title_params_text'>Dashboard</div>
                </div>
                <div className='scroll_dashboard_container'>

                    <div className='box_container_dashboard'>

                        <div className='box_information_dashboard'>
                            <div className='title_information_dashboard'>
                                <div style={{ marginLeft: '4px' }}> Nb de facture en cours :</div>
                            </div>
                            <div className='data_information'>22</div>
                        </div>
                        <div className='box_information_dashboard'>
                            <div className='title_information_dashboard'>
                                <div style={{ marginLeft: '4px' }}> Montant des retards/impayés en cours :</div>
                            </div>
                            <div className='data_information'>1865 €</div>
                        </div>
                        <div className='box_information_dashboard'>
                            <div className='title_information_dashboard'>
                                <div style={{ marginLeft: '4px' }}>Montant des sommes recouvrés :</div>
                            </div>
                            <div className='data_information'>9954 €</div>
                        </div>
                        <div className='facture_tab_container' style={{ minHeight: '35%', overflow: 'hidden', maxHeight: '220px' }}>
                            <div className='title_information_dashboard' style={{ height: '15%' }}>
                                <div style={{ marginLeft: '4px' }}>Vos factures récentes :</div>
                            </div>
                            <div className='fixed_case_container_tab_fac'>
                                <div className='name_container_tab_fac'>
                                    name
                                </div>
                                <div className='euro_container_tab_fac' style={{ justifyContent: 'center' }}>
                                    € à venir
                                </div>
                                <div className='status_container_tab_fac'>
                                    status
                                </div>
                                <div className='action_container_tab_fac'>
                                    action
                                </div>
                            </div>
                            <div className='container_scroll_fac'>
                                {facture.slice(0, 3).map((factures, index) => (
                                    <FactureCase
                                        key={index}
                                        name={factures.name}
                                        backColor={factures.backColor}
                                        dragon={factures.dragon}
                                        euro={factures.euro}
                                        id={factures.id}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='facture_tab_container' style={{ minHeight: '35%', overflow: 'hidden', maxHeight: '220px' }}>
                            <div className='title_information_dashboard' style={{ height: '15%' }}>
                                <div style={{ marginLeft: '4px' }}>Vos notes récentes :</div>
                            </div>
                            <div className='fixed_case_container_tab_fac' style={{ justifyContent: 'space-around' }}>
                                <div className='name_container_tab_fac'>
                                    name
                                </div>
                                <div className='euro_container_tab_fac' style={{ justifyContent: 'center' }}>
                                    facture n°
                                </div>
                                <div className='status_container_tab_fac'>
                                    action
                                </div>

                            </div>
                            <div className='container_scroll_fac'>
                                {facture.slice(0, 3).map((factures, index) => (
                                    <NoteCase
                                        key={index}
                                        name={factures.name}
                                        dragon={factures.dragon}
                                        numero={factures.numero}
                                        id={factures.id}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </MyLayout>

    );
}