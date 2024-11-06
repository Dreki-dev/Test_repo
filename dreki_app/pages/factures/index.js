import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Router from 'next/router';

import '../css/facture.css'
import '../css/sharefeatures.css'

import blue_dragon from '../../public/images/logo_mini_dreki_blue.png';
import white_dragon from '../../public/images/logo_mini_dreki_white.png';
import red_dragon from '../../public/images/logo_mini_dreki_red.png';

import ModalDragon from './ModalDragon'
import ModalViewFacture from './ModalViewFacture'
import ModalMenuDeroulant from './ModalMenuDeroulant'
import ModalViewDebiteur from './ModalViewDebiteur'
import MyLayout from '../Layout/layout';
import LoadingPage from './../components/LoadingPage.js'

export default function Facture() {
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
    {/* Données de factures avec une association à des dragons */ }

    const choices = ['Entreprise', 'Particulier', 'Association', 'test', 'theo', 'lucas', 'end'];

    const dragons = {
        blue_dragon: blue_dragon,
        red_dragon: red_dragon,
        white_dragon: white_dragon,
    };
    const [facturesAvecDragon, setFacturesAvecDragon] = useState([
        {
            name: 'Theo Dupont',
            dragon: dragons.blue_dragon,
            backColor: '#01208729',
            euro: '158445',
            id: '1',
            numero: '10001',
            total: 312,
            aRecuperer: 5,
            dateEmission: '12/05/2000',
            dateEcheance: '23/08/2025'
        },
        {
            name: 'Jean Martin',
            dragon: dragons.blue_dragon,
            backColor: '#01208729',
            euro: '158445',
            id: '2',
            numero: '10002',
            total: 600,
            aRecuperer: 500,
            dateEmission: '15/07/2022',
            dateEcheance: '01/10/2025'
        },
        {
            name: 'Marie Lefevre',
            dragon: dragons.blue_dragon,
            backColor: '#01208729',
            euro: '158445',
            id: '3',
            numero: '10003',
            total: 450,
            aRecuperer: 300,
            dateEmission: '10/02/2021',
            dateEcheance: '30/12/2025'
        },
        {
            name: 'Emma Moreau',
            dragon: dragons.red_dragon,
            backColor: 'rgba(255, 0, 0, 0.085)',
            euro: '544',
            id: '4',
            numero: '10004',
            total: 700,
            aRecuperer: 544,
            dateEmission: '01/01/2020',
            dateEcheance: '15/05/2025'
        },
        {
            name: 'Lucas Girard',
            dragon: dragons.white_dragon,
            backColor: 'rgba(16, 137, 16, 0.085)',
            euro: '125',
            id: '5',
            numero: '10005',
            total: 125,
            aRecuperer: 125,
            dateEmission: '05/09/2021',
            dateEcheance: '22/11/2025'
        },
    ]);

    {/* Affichage des cases des factures avec gestion du modal */ }

    const FactureCase = ({ name, backColor, dragon, euro, id, total, aRecuperer, dateEcheance, dateEmission }) => {
        return (
            <div className='input_case_container_fac' onClick={() => openModalWithFacture(id)} >
                <div className='name_container_tab_fac'>
                    {name}
                </div>
                <div className='euro_container_tab_fac' style={{ justifyContent: 'center' }}>
                    {euro}
                </div>
                <div className='montant_container_tab_fac' style={{ justifyContent: 'center', }}>
                    <div className='montant_part'>
                        <div style={{ fontSize: '10px' }}>Montant créance :</div>
                        <div className='montant_price'>{aRecuperer}</div>
                    </div>
                    <div className='montant_part'>
                        <div style={{ fontSize: '10px' }}>Montant total :</div>
                        <div className='montant_price'>{total}</div>
                    </div>
                </div>
                <div className='status_container_tab_fac' style={{ backgroundColor: backColor, transform: 'scale(0.8)', justifyContent: 'center' }} onClick={openDragonModal}>
                    <img src={dragon.src} alt="dragon image" className='dragon_logo' />
                </div>
            </div>
        );
    };

    {/* Gère l'ouverture/fermeture d'un dropdown */ }
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    {/* Gère le tri et la navigation avec le routeur */ }
    const router = useRouter();
    const { id } = router.query;
    const [selectedFacture, setSelectedFacture] = useState(null);

    {/* Effet pour sélectionner et afficher la facture selon l'id */ }
    useEffect(() => {
        if (id) {
            const factureToDisplay = facturesAvecDragon.find(f => f.id === id);
            if (factureToDisplay) {
                setSelectedFacture(factureToDisplay);
                setIsModalOpen(true);
            }
            router.push('/factures', undefined, { shallow: true });
        }
    }, [id, facturesAvecDragon]);

    {/* Fonction pour gérer la perte de focus sur le menu déroulant et fermer le menu après un délai */ }
    const handleBlur = () => {
        setTimeout(() => {
            setEditingDeroulantMenu(false);
        }, 100);
    };

    {/* Gère le tri des factures par nom et statut */ }
    const [sortAscName, setSortAscName] = useState(true);
    const [sortAscEuro, setSortAscEuro] = useState(true);
    const [sortAscTotal, setSortAscTotal] = useState(true);
    const [sortAscDragon, setSortAscDragon] = useState(true);

    const handleSortName = () => {
        const sortedFactures = [...filteredFactures].sort((a, b) =>
            sortAscName ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        );
        setFacturesAvecDragon(sortedFactures);
        setSortAscName(!sortAscName);
    };

    const handleSortEuro = () => {
        const sortedFactures = [...filteredFactures].sort((a, b) => {
            const euroA = parseFloat(a.euro);
            const euroB = parseFloat(b.euro);
            return sortAscEuro ? euroA - euroB : euroB - euroA;
        });
        setFacturesAvecDragon(sortedFactures);
        setSortAscEuro(!sortAscEuro);
    };

    const handleSortTotal = () => {
        const sortedFactures = [...filteredFactures].sort((a, b) =>
            sortAscTotal ? a.total - b.total : b.total - a.total
        );
        setFacturesAvecDragon(sortedFactures);
        setSortAscTotal(!sortAscTotal);
    };

    const handleSortDragon = () => {
        const sortedFactures = [...filteredFactures].sort((a, b) => {
            const dragonKeyA = Object.keys(dragons).find(key => dragons[key] === a.dragon);
            const dragonKeyB = Object.keys(dragons).find(key => dragons[key] === b.dragon);

            return sortAscDragon
                ? dragonKeyA.localeCompare(dragonKeyB)
                : dragonKeyB.localeCompare(dragonKeyA);
        });
        setFacturesAvecDragon(sortedFactures);
        setSortAscDragon(!sortAscDragon);
    };


    {/* Modal pour afficher les détails d'une facture */ }
    const openModalWithFacture = (factureId) => {
        const selected = facturesAvecDragon.find(f => f.id === factureId);
        if (selected) {
            setSelectedFacture(selected);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setSelectedFacture(null);
        setIsModalOpen(false);
    };

    {/* Modal pour gérer d'autres affichages (dragons, débiteurs) */ }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDragonModalOpen, setIsDragonModalOpen] = useState(false);
    const [isDebiteurModalOpen, setisDebiteurModalOpen] = useState(false);

    const openDragonModal = () => setIsDragonModalOpen(true);
    const closeDragonModal = () => setIsDragonModalOpen(false);
    const openDebiteurModal = () => setisDebiteurModalOpen(true);
    const closeDebiteurModal = () => setisDebiteurModalOpen(false);

    {/* Gestion du menu déroulant */ }
    const [textDeroulantMenu, setTextDeroulantMenu] = useState('default');
    const [isEditingDeroulantMenu, setEditingDeroulantMenu] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [filteredChoices, setFilteredChoices] = useState(choices);

    const handleSelectChoiceDeroulantMenu = (choice) => {
        setTextDeroulantMenu(choice);
        setEditingDeroulantMenu(false);
    };

    {/* Positionne le dropdown en fonction de la sélection */ }
    const handleClickDeroulant = (e) => {
        const rect = e.target.getBoundingClientRect();
        setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
        });
        setEditingDeroulantMenu(true);
    };

    {/* Filtre les choix du menu déroulant */ }
    const handleInputChange = (e) => {
        const value = e.target.value;
        setTextDeroulantMenu(value);
        const newFilteredChoices = choices.filter(choice => choice.toLowerCase().includes(value.toLowerCase()));
        setFilteredChoices(newFilteredChoices);
    };



    {/* Gère la recherche de factures */ }
    const [searchTerm, setSearchTerm] = useState('');
    const [debiteur, setDebiteur] = useState(null);

    useEffect(() => {
        const { debiteur: debiteurFromUrl } = router.query;
        setDebiteur(debiteurFromUrl || null);
    }, [router.query]);

    const filteredFactures = facturesAvecDragon.filter(fact => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            (fact.name.toLowerCase().includes(searchTermLower) || fact.euro.includes(searchTerm) || fact.id.includes(searchTerm)) &&
            (!debiteur || fact.name === debiteur)
        );
    });

    {/* Recalcule la position du menu déroulant lors d'un redimensionnement */ }
    useEffect(() => {
        const handleResize = () => {
            if (isEditingDeroulantMenu) {
                const inputElement = document.querySelector('.input_field');
                const rect = inputElement.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isEditingDeroulantMenu]);

    return (
        <MyLayout>
            {loading && <LoadingPage />}
                <div className='page_container_navbar'>

                    <div className='title_params_container' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className='title_params_text'>Factures</div>
                        <div
                            className='reset_filter_button'
                            onClick={() => {
                                setSearchTerm('');
                                setDebiteur(null);
                            }}
                        >
                            voir toute les factures
                        </div>
                    </div>
                    <div className='button_container_fac'>
                        <div className='button_add_fac' href={'./add_factures'} onClick={openDebiteurModal}>
                            Ajouter une facture
                        </div>
                        <input className='search_input' placeholder='Recherche...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className='facture_tab_container'>
                        <div className='fixed_case_container_tab_fac'>
                            <div className='name_container_tab_fac' onClick={handleSortName}>
                                name {sortAscName ? '▲' : '▼'}
                            </div>
                            <div className='euro_container_tab_fac' onClick={handleSortEuro} style={{ justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                € à venir {sortAscEuro ? '▲' : '▼'}
                            </div>
                            <div className='montant_container_tab_fac' onClick={handleSortTotal}>
                                montant {sortAscTotal ? '▲' : '▼'}
                            </div>
                            <div className='status_container_tab_fac' onClick={handleSortDragon}>
                                status {sortAscDragon ? '▲' : '▼'}
                            </div>

                        </div>
                        <div className='container_scroll_fac'>
                            {filteredFactures.map((factures, index) => (
                                <FactureCase
                                    key={index}
                                    name={factures.name}
                                    backColor={factures.backColor}
                                    dragon={factures.dragon}
                                    euro={factures.euro}
                                    id={factures.id}
                                    total={factures.total}
                                    aRecuperer={factures.aRecuperer}
                                    dateEmission={factures.dateEmission}
                                    dateEcheance={factures.dateEcheance}
                                />
                            ))}
                        </div>
                    </div>
                    {isModalOpen && selectedFacture && (
                        <ModalViewFacture
                            closeModal={closeModal}
                            selectedFacture={selectedFacture}
                            openDragonModal={openDragonModal}
                            blue_dragon={blue_dragon.src}
                            id={selectedFacture.id}
                            dateEmission={selectedFacture.dateEmission}
                            dateEcheance={selectedFacture.dateEcheance}
                            aRecuperer={selectedFacture.aRecuperer}
                            total={selectedFacture.total}
                        />
                    )}

                    {isDragonModalOpen && (
                        <ModalDragon
                            closeDragonModal={closeDragonModal}
                            toggleDropdown={toggleDropdown}
                            isOpen={isOpen}
                            blue_dragon={blue_dragon.src}
                            red_dragon={red_dragon.src}
                            white_dragon={white_dragon.src}
                        />
                    )}
                    {isEditingDeroulantMenu && (
                        <ModalMenuDeroulant
                            left={dropdownPosition.left}
                            top={dropdownPosition.top}
                            filteredChoices={filteredChoices}
                            handleSelectChoiceDeroulantMenu={handleSelectChoiceDeroulantMenu}
                        />
                    )}
                    {isDebiteurModalOpen && (
                        <ModalViewDebiteur
                            closeDebiteurModal={closeDebiteurModal}
                            handleBlur={handleBlur}
                            handleInputChange={handleInputChange}
                            handleClickDeroulant={handleClickDeroulant}
                            textDeroulantMenu={textDeroulantMenu}
                        />
                    )}
                </div>
        </MyLayout >

    );
}