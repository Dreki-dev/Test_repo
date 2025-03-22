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
import axiosInstance from '../../src/app/config/axios';

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

    const choices = ['Entreprise', 'Particulier', 'Association', 'test', 'theo', 'lucas', 'end'];
    const [factures, setFactures] = useState([]);
    const [error, setError] = useState(null);

    const dragons = {
        blue_dragon: blue_dragon,
        red_dragon: red_dragon,
        white_dragon: white_dragon,
    };

    {/* Affichage des cases des factures avec gestion du modal */ }

    const FactureCase = ({ name, backColor, dragon, euro, id, total, aRecuperer, dateEcheance, dateEmission, societe }) => {
        function truncateText(text, maxLength = 15) {
            if (text && text.length > maxLength) {
                return text.substring(0, maxLength) + '...';
            }
            return text;
        }
        
        // Définir une couleur d'arrière-plan différente pour les factures avec aRecuperer = 0
        const containerStyle = {
            backgroundColor: aRecuperer === 0 ? 'rgba(82, 232, 98,0.20)' : 'fini', // Beige pour aRecuperer = 0, blanc par défaut
        };
        
        return (
            <div 
                className='input_case_container_fac' 
                onClick={() => openModalWithFacture(id)} 
                style={containerStyle}
            >
                <div className='name_container_tab_fac'>
                    <div className='text'>
                        {truncateText(societe?.raisonsociale) || 'Sans débiteur'}
                    </div>
                </div>
                <div className='euro_container_tab_fac' style={{ justifyContent: 'center' }}>
                    {euro}
                </div>
                <div className='montant_container_tab_fac' style={{ justifyContent: 'center', }}>
                    <div className='montant_part'>
                        <div style={{ fontSize: '10px' }}>Montant créance :</div>
                        <div className='montant_price'>{aRecuperer}</div>
                    </div>
                </div>
                <div 
                    className='status_container_tab_fac' 
                    style={{ 
                        backgroundColor: backColor, 
                        transform: 'scale(0.8)', 
                        justifyContent: 'center' 
                    }} 
                    onClick={openDragonModal}
                >
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
    const [selectedFacture, setSelectedFacture] = useState(null);

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
        setFactures(sortedFactures);
        setSortAscName(!sortAscName);
    };

    const handleSortEuro = () => {
        const sortedFactures = [...filteredFactures].sort((a, b) => {
            const euroA = parseFloat(a.euro);
            const euroB = parseFloat(b.euro);
            return sortAscEuro ? euroA - euroB : euroB - euroA;
        });
        setFactures(sortedFactures);
        setSortAscEuro(!sortAscEuro);
    };

    const handleSortTotal = () => {
        const sortedFactures = [...filteredFactures].sort((a, b) =>
            sortAscTotal ? a.total - b.total : b.total - a.total
        );
        setFactures(sortedFactures);
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
        setFactures(sortedFactures);
        setSortAscDragon(!sortAscDragon);
    };


    {/* Modal pour afficher les détails d'une facture */ }
    const openModalWithFacture = (factureId) => {
        const stringId = String(factureId);
        const selected = factures.find(f => String(f.id) === stringId);
    
        if (selected) {
            // Log the selected facture to debug
            console.log('Selected facture:', selected);
            
            // Make sure societe exists before setting the selected facture
            const factureWithDefaultSociete = {
                ...selected,
                societe: selected.societe || { raisonsociale: 'Sans débiteur' }
            };
            
            setSelectedFacture(factureWithDefaultSociete);
            setIsModalOpen(true);
        } else {
            console.error(`Facture avec ID ${factureId} non trouvée`);
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
    const [selectedDebiteurId, setSelectedDebiteurId] = useState(null);


    const handleSelectChoiceDeroulantMenu = (debiteurData) => {
        setSelectedDebiteurId(debiteurData.id);
        console.log(debiteurData.id)
        setTextDeroulantMenu(debiteurData.nom);
        setEditingDeroulantMenu(false);
    };

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


    const fetchFactures = async () => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await axiosInstance.get('/api/factures');
            
            // Log to verify the structure of the data
            console.log('API Response:', response.data);
    
            const formattedFactures = response.data.factures.map(facture => {
                // Log each facture to check if societe exists
                console.log('Facture data:', facture);
                
                return {
                    id: facture.id,
                    name: facture.num,
                    backColor: getStatusColor(facture.etat),
                    dragon: getDragonByStatus(facture.etat),
                    euro: facture.creance,
                    total: facture.creance,
                    aRecuperer: facture.creance - facture.recupere,
                    dateEmission: formatDate(facture.dateemission),
                    dateEcheance: formatDate(facture.dateecheance),
                    societe: facture.societe || { raisonsociale: 'Sans débiteur' }
                };
            });
    
            setFactures(formattedFactures);
        } catch (err) {
            console.error('Error fetching factures:', err);
            setError('Impossible de charger les factures. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };


    // en attente du state pour le back
    const getStatusColor = (etat) => {
        switch (etat) {
            case 1: return 'rgba(127, 129, 243, 0.30)';
            case 2: return '#ccffcc';
            case 3: return '#ffcccc';
            default: return '#f5f5f5'
        }
    };
    // en attente du state pour le back
    const getDragonByStatus = (etat) => {
        switch (etat) {
            case 1: return dragons.blue_dragon;
            case 2: return dragons.white_dragon;
            case 3: return dragons.red_dragon;
            default: return dragons.blue_dragon;
        }
    };


    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [debiteur, setDebiteur] = useState(null);

    const filteredFactures = factures.filter(facture => {
        const factureNum = facture.name || '';
        const raisonSociale = facture.societe?.raisonsociale || '';
        const montantEuro = String(facture.euro || '');
        
        const matchesSearch = !searchTerm ||
            factureNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
            raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
            montantEuro.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDebiteur = !debiteur ||
            raisonSociale.toLowerCase() === debiteur.toLowerCase();
        
        return matchesSearch && matchesDebiteur;
    });

    {/* Recalcule la position du menu déroulant lors d'un redimensionnement */ }
    useEffect(() => {
        fetchFactures();
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
        if (router.query.debiteur) {
            setDebiteur(router.query.debiteur);
            setSearchTerm(router.query.debiteur);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);


    }, [router.query.debiteur, isEditingDeroulantMenu]);

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
                            nom {sortAscName ? '▲' : '▼'}
                        </div>
                        <div className='euro_container_tab_fac' onClick={handleSortEuro} style={{ justifyContent: 'center', whiteSpace: 'nowrap' }}>
                            € à venir {sortAscEuro ? '▲' : '▼'}
                        </div>
                        <div className='montant_container_tab_fac' onClick={handleSortTotal}>
                            montant {sortAscTotal ? '▲' : '▼'}
                        </div>
                        <div className='status_container_tab_fac' onClick={handleSortDragon}>
                            statut {sortAscDragon ? '▲' : '▼'}
                        </div>

                    </div>
                    <div className='container_scroll_fac'>
                        {filteredFactures.map((facture, index) => (
                            <FactureCase
                                key={index}
                                name={facture.name}
                                backColor={facture.backColor}
                                dragon={facture.dragon}
                                euro={facture.euro}
                                id={facture.id}
                                total={facture.total}
                                aRecuperer={facture.aRecuperer}
                                dateEmission={facture.dateEmission}
                                dateEcheance={facture.dateEcheance}
                                societe={facture.societe}
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
                        // debiteur={selectedFacture.societe}
                        debiteur={selectedFacture.societe || { raisonsociale: 'Sans débiteur' }}
                        
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
                        selectedDebiteurId={selectedDebiteurId}
                    />
                )}
            </div>
        </MyLayout >

    );
}