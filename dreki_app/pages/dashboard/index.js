import DashboardLayout from './layout';
import '../css/navbar.css'
import '../css/dashboard.css'
import '../css/facture.css'
import React, { useState, useRef } from 'react';
import blue_dragon from '../../public/images/logo_mini_dreki_blue.png'
import white_dragon from '../../public/images/logo_mini_dreki_white.png'
import red_dragon from '../../public/images/logo_mini_dreki_red.png'
import Link from 'next/link';

export default function Dashboard() {
    const objet = [
        { id: 1, numero: '999999', montant: 245, total: 312 },
        { id: 2, numero: '888888', montant: 150, total: 400 },
    ];
    const [facture, setFacture] = useState([
        { name: 'CTheo', dragon: blue_dragon, backColor: '#01208729', euro: '158445', id: '1', numero: '422' },
        { name: 'ZTheo', dragon: blue_dragon, backColor: '#01208729', euro: '158445', id: '2', numero: '12' },
        { name: 'ATheo', dragon: blue_dragon, backColor: '#01208729', euro: '158445', id: '3', numero: '2' },
        { name: 'BTheo', dragon: red_dragon, backColor: 'rgba(255, 0, 0, 0.085)', euro: '544', id: '4', numero: '3644' },
        { name: 'ATheo', dragon: white_dragon, backColor: 'rgba(16, 137, 16, 0.085)', euro: '125', id: '5', numero: '9754' },
        { name: 'ATheo', dragon: white_dragon, backColor: 'rgba(16, 137, 16, 0.085)', euro: '4475', id: '6', numero: '245' },
        { name: 'ATheo', dragon: white_dragon, backColor: 'rgba(16, 137, 16, 0.085)', euro: '22475', id: '7', numero: '198' },
        { name: 'ATheo', dragon: white_dragon, backColor: 'rgba(16, 137, 16, 0.085)', euro: '199', id: '8', numero: '37' },
        { name: 'ATheo', dragon: white_dragon, backColor: 'rgba(16, 137, 16, 0.085)', euro: '75', id: '9', numero: '49' },
        { name: 'ATheo', dragon: white_dragon, backColor: 'rgba(16, 137, 16, 0.085)', euro: '1254', id: '10', numero: '666' },
        { name: 'ATheo', dragon: white_dragon, backColor: 'rgba(16, 137, 16, 0.085)', euro: '25222', id: '11', numero: '7532' },
    ]);
    const handleClick = (buttonRef) => {
        if (buttonRef.current) {
            console.log("clickmodale")
            const rect = buttonRef.current.getBoundingClientRect();

            setModalPosition({
                top: rect.bottom + window.scrollY - 60,
                left: rect.left + window.scrollX - 140
            });

            setIsModalOpen(true);
        }
    };
    const FactureCase = ({ name, backColor, dragon, euro, id }) => {
        console.log(dragon)
        return (
            <div className='input_case_container_fac'>
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
                    <Link className='button_acton_voirplus no-select' href={`/factures?id=${id}`}>voir plus</Link>
                </div>
            </div>
        );
    };

    const NoteCase = ({ name, dragon, numero }) => {
        console.log(dragon)
        return (
            <div className='input_case_container_fac' style={{ justifyContent: 'space-around' }}>
                <div className='name_container_tab_fac'>
                    {name}
                </div>
                <div className='euro_container_tab_fac' style={{ justifyContent: 'center' }}>
                    {numero}
                </div>
                <div className='action_container_tab_fac'>
                    <Link className='button_acton_voirplus no-select' href={`/objet/${objet.id}`} >voir note</Link>
                </div>
            </div>
        );
    };
    return (
        <DashboardLayout>
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
                                    $ à venir
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
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </DashboardLayout>

    );
}