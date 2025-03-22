import React, { useState, useRef, useEffect } from 'react';

import MyLayout from '../Layout/layout'
import '../css/sharefeatures.css'
import '../css/debiteurs.css'
import ModalSelectedDebiteur from './ModalSelectedDebiteur';
import ModalMenuDeroulant2 from './ModalMenuDeroulant2';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoadingPage from './../components/LoadingPage.js'
import Router from 'next/router';
import axiosInstance from '../../src/app/config/axios';
import blue_dragon from '../../public/images/logo_mini_dreki_blue.png';
import white_dragon from '../../public/images/logo_mini_dreki_white.png';
import red_dragon from '../../public/images/logo_mini_dreki_red.png';

export default function debiteurs() {

    const dragons = {
        blue_dragon: blue_dragon,
        red_dragon: red_dragon,
        white_dragon: white_dragon,
    };
    const [formData, setFormData] = useState({
        type: 'Entreprise', // Valeur par défaut
        raisonSociale: '',
        siren: '',
        nomContact: '',
        adresse: '',
        codePostal: '',
        ville: '',
        telephone: '',
        email: ''
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (createFacture = false) => {
        try {
            setIsSubmitting(true);
            setError(null);

            const response = await axiosInstance.post('/api/societes', {
                type: 1, // Si c'est une entreprise
                raisonsociale: formData.raisonSociale,
                siren: formData.siren,
                contact: formData.nomContact,
                adresse1: formData.adresse,
                cp: formData.codePostal,
                ville: formData.ville,
                telephone: formData.telephone,
                mail: formData.email
            });

            // Recharger la liste des débiteurs
            const societesData = await fetchDebiteurs();
            const formattedDebiteurs = societesData.map(societe => ({
                id: societe.id,
                name: societe.raisonsociale || 'Sans nom',
                backColor: '#FFF5E6',
                textColor: '#FF8A00',
                textPaie: societe.type === 1 ? 'Client' : 'Fournisseur',
                due: societe.mail
            }));
            setDebiteurs(formattedDebiteurs);

            if (createFacture) {
                router.push(`/add_factures?societeId=${response.data.societe.id}`);
            } else {
                setActiveSection('');
            }

        } catch (err) {
            setError(err.response?.data?.error || 'Une erreur est survenue lors de la création');
        } finally {
            setIsSubmitting(false);
        }
    };
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
    const [debiteurs, setDebiteurs] = useState([]);

    {/* Fonction pour gérer l'apparition du menu déroulant */ }
    const handleSelectChoiceDeroulantMenu = (choice) => {
        setTextDeroulantMenu(choice);
        setEditingDeroulantMenu(false);
        if (choice === 'Entreprise') {
            setPro_part(true)
        } else {
            setPro_part(false)
        }
    };

    const [docButtonClicked, setDebButtonClicked] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const [pro_part, setPro_part] = useState(true);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    {/* Fonction pour gérer la perte de focus sur le menu déroulant et fermer le menu après un délai */ }
    const handleBlur = () => {
        setTimeout(() => {
            setEditingDeroulantMenu(false);
        }, 100);
    };

    {/* États pour gérer le texte du menu déroulant, l'édition et l'ouverture de la modal */ }
    const [textDeroulantMenu, setTextDeroulantMenu] = useState('Entreprise');
    const [isEditingDeroulantMenu, setEditingDeroulantMenu] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [text, setText] = useState("");
    const [editing, setEditing] = useState(false);

    {/* États pour suivre la section active, le débiteur sélectionné, et les états de tri */ }
    const [activeSection, setActiveSection] = useState('');
    const [selectedDebiteur, setSelectedDebiteur] = useState(null);
    const [sortAscName, setSortAscName] = useState(true);
    const [sortAscStat, setSortAscStat] = useState(true);
    const [sortAscDue, setSortAscDue] = useState(true);
    const [selectedDebiteurFromUrl, setSelectedDebiteurFromUrl] = useState(null);

    const fetchDebiteurs = async () => {
        try {
            const response = await axiosInstance.get('/api/societes', {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            return response.data.societes;
        } catch (error) {
            return [];
        }
    };
    
    const fetchFacturesParDebiteur = async (debiteurId) => {
        try {
            // Récupérez toutes les factures
            const response = await axiosInstance.get('/api/factures');

            // Filtrez uniquement les factures du débiteur spécifié
            const facturesDebiteur = response.data.factures.filter(facture =>
                facture.societe && facture.societe === debiteurId
            );

            return facturesDebiteur;
        } catch (error) {
            return [];
        }
    };
    const getStatusColor = (etat) => {
        switch (etat) {
            case 1: return '#ffeecc';
            case 2: return '#ccffcc';
            case 3: return '#ffcccc';
            default: return '#f5f5f5'
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };
    const getDragonByStatus = (etat) => {
        switch (etat) {
            case 1: return dragons.blue_dragon;
            case 2: return dragons.white_dragon;
            case 3: return dragons.red_dragon;
            default: return dragons.blue_dragon;
        }
    };
    // Modifiez votre fonction loadDebiteurs pour déboguer les données
    useEffect(() => {
    const loadDebiteurs = async () => {
        try {
            // 1. Récupérer tous les débiteurs
            const societesData = await fetchDebiteurs();
            
            // 2. Récupérer toutes les factures
            const facturesResponse = await axiosInstance.get('/api/factures');
            const allFactures = facturesResponse.data.factures;
            
            const formattedDebiteurs = societesData.map(societe => {
                // Filtrer les factures pour ce débiteur - ATTENTION: societe est un objet!
                const facturesDebiteur = allFactures.filter(facture => 
                    facture.societe && 
                    typeof facture.societe === 'object' && 
                    facture.societe.id === societe.id
                );
                
                // Calculer le montant total à récupérer
                let montantDu = 0;
                facturesDebiteur.forEach(facture => {
                    montantDu += (facture.creance - facture.recupere);
                });
                
                
                return {
                    id: societe.id,
                    name: societe.raisonsociale || societe.contact || 'Sans nom',
                    backColor: '#FFF5E6',
                    textColor: '#FF8A00',
                    textPaie: societe.type === 1 ? 'Client' : 'Fournisseur',
                    due: `${montantDu.toFixed(2)} €`,
                    email: societe.mail,
                   
                };
            });
            
            setDebiteurs(formattedDebiteurs);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    };

    loadDebiteurs();
}, []);

    {/* Fonction pour gérer les clics sur un débiteur et ouvrir la modal */ }
    const handleClick = (debiteurs) => {
        setSelectedDebiteur(debiteurs);
        setIsModalOpen(true);
    };

    {/* Fonction pour gérer l'ouverture du menu déroulant en calculant sa position */ }
    const handleClickDeroulant = (e) => {
        const rect = e.target.getBoundingClientRect();
        setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
        });
        setEditingDeroulantMenu(true);
    };

    {/* Fonctions de tri pour les débiteurs par nom, statut de paiement et date d'échéance */ }
    const handleSortDue = () => {
        const sortedDebiteurs = [...debiteurs].sort((a, b) => {
            // Extraire le nombre de la chaîne (en supprimant "€" et les espaces)
            const dueA = parseFloat(a.due.replace(/[^0-9.-]+/g, "")) || 0;
            const dueB = parseFloat(b.due.replace(/[^0-9.-]+/g, "")) || 0;
            
            return sortAscDue ? dueA - dueB : dueB - dueA;
        });
        
        setDebiteurs(sortedDebiteurs);
        setSortAscDue(!sortAscDue);
    };

    const handleSortName = () => {
        const sortedDebiteurs = [...debiteurs].sort((a, b) => sortAscName ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        setDebiteurs(sortedDebiteurs);
        setSortAscName(!sortAscName);
    };

    const handleSortStatus = () => {
        const sortedDebiteurs = [...debiteurs].sort((a, b) => sortAscStat ? a.textPaie.localeCompare(b.textPaie) : b.textPaie.localeCompare(a.textPaie));
        setDebiteurs(sortedDebiteurs);
        setSortAscStat(!sortAscStat);
    };

    {/* Composant pour afficher les informations d'un débiteur */ }
    const DebiteurCase = ({ id, name, backColor, textColor, textPaie, handleClick, due }) => {
        const handleButtonClick = () => {
            handleClick(id);
        };
        function truncateText(text, maxLength = 15) {
            if (text.length > maxLength) {
                return text.substring(0, maxLength) + '...';
            }
            return text;
        }
        return (
            <div className='input_case_container_deb' onClick={handleButtonClick} >
                <div className='case_name_menu' >{truncateText(name)}</div>
                <div className='case_status_menu'>
                    <div className='button_status' style={{ backgroundColor: backColor, color: textColor }}>
                        {textPaie}
                    </div>
                </div>
                <div className='case_action_menu_button_container'>
                    {due}
                </div>
            </div>
        );
    };

    const [searchTerm, setSearchTerm] = useState('');

    {/* Mise à jour du débiteur sélectionné à partir de l'URL */ }
    useEffect(() => {
        const { debiteurs: debiteurFromUrl } = router.query;
        setSelectedDebiteurFromUrl(debiteurFromUrl || null);
    }, [router.query]);

    {/* Filtre les débiteurs en fonction du terme de recherche et du débiteur sélectionné */ }
    const filteredDebiteur = debiteurs.filter(fact => {
        const searchTermLower = searchTerm.toLowerCase();
        const nameMatches = fact.name.toLowerCase().includes(searchTermLower);
        const dueMatches = fact.due.includes(searchTerm);
        const stateMatches = fact.textPaie.includes(searchTerm);
        const debiteurMatches = selectedDebiteurFromUrl ? fact.name === selectedDebiteurFromUrl : true;

        return (nameMatches || dueMatches || stateMatches) && debiteurMatches;
    });

    useEffect(() => {
        if (router.query.section) {
            setActiveSection(router.query.section);
        }
    }, [router.query]);
    return (
        <MyLayout>
            {loading && <LoadingPage />}
            <div className='page_container_navbar'>
                <div className='title_params_container' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className='title_params_text'>Débiteurs</div>
                    <div
                        className='reset_filter_button'
                        onClick={() => {
                            setSearchTerm('');
                        }}
                    >
                        voir tous les débiteurs
                    </div>
                </div>
                <div className='button_container_deb'>
                    {!docButtonClicked ? (
                        <div className='button_add_deb' onClick={() => {
                            setActiveSection('ajouterDeb');
                            setDebButtonClicked(true);
                        }}>
                            Ajouter un débiteur
                        </div>
                    ) : (
                        <div className='button_add_deb' onClick={() => {
                            setActiveSection('');
                            setDebButtonClicked(false);
                        }}>
                            Afficher votre liste<br />de débiteurs
                        </div>
                    )}
                    <input className='search_input' style={{ backgroundColor: 'white' }} placeholder='Recherche...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                </div>

                {activeSection === '' && (
                    <div className='debiteur_tab_container'>
                        <div className='fixed_input_case_container_deb'>
                            <div className='case_name_menu' style={{alignItems: 'center', display: 'flex'}} onClick={handleSortName} >
                                Nom {sortAscName ? '▲' : '▼'}
                            </div>
                            <div className='case_status_menu' onClick={handleSortStatus}>
                                Statut {sortAscStat ? '▲' : '▼'}
                            </div>
                            <div className='case_action_menu' onClick={handleSortDue} style={{ whiteSpace: 'nowrap' }}>
                                Montant dû {sortAscDue ? '▲' : '▼'}
                            </div>
                        </div>
                        <div className='container_scroll_deb'>
                            {loading ? (
                                <div>Chargement des débiteurs...</div>
                            ) : error ? (
                                <div>{error}</div>
                            ) : (
                                debiteurs.map((debiteur, index) => (
                                    <DebiteurCase
                                        id={debiteur.id}
                                        key={index}
                                        name={debiteur.name}
                                        backColor={debiteur.backColor}
                                        textColor={debiteur.textColor}
                                        textPaie={debiteur.textPaie}
                                        handleClick={() => handleClick(debiteur)}
                                        due={debiteur.due}
                                    />
                                ))
                            )}
                        </div>

                    </div>
                )}
                {activeSection === 'ajouterDeb' && (
                    <div className='debiteur_tab_container'>
                        {error && (
                            <div className='error_message' style={{ color: 'red', marginBottom: '10px' }}>
                                {error}
                            </div>
                        )}

                        <div className='preventif_text_container' style={{ marginTop: '24px' }}>
                            Attention ! Les champs marqués d'un '*' ne seront pas modifiables dans l'avenir.
                        </div>

                        <div className='input_case_container' style={{ marginTop: '24px' }}>
                            <div className='input_title_container'>
                                *Type :
                            </div>
                            <input
                                readOnly
                                className='input_field'
                                value={formData.type}
                                onClick={handleClickDeroulant}
                                style={{ backgroundColor: '#d2d5d7' }}
                                onBlur={handleBlur}
                            />
                        </div>

                        {pro_part && (
                            <>
                                <div className='input_case_container'>
                                    <div className='input_title_container'>
                                        Raison Sociale
                                    </div>
                                    <input
                                        name="raisonSociale"
                                        className='input_field'
                                        value={formData.raisonSociale}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='input_case_container'>
                                    <div className='input_title_container'>
                                        *SIREN
                                    </div>
                                    <input
                                        name="siren"
                                        className='input_field'
                                        value={formData.siren}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </>
                        )}

                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                *Nom du contact
                            </div>
                            <input
                                name="nomContact"
                                className='input_field'
                                value={formData.nomContact}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Adresse
                            </div>
                            <input
                                name="adresse"
                                className='input_field'
                                value={formData.adresse}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Code Postal
                            </div>
                            <input
                                name="codePostal"
                                className='input_field'
                                value={formData.codePostal}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Ville
                            </div>
                            <input
                                name="ville"
                                className='input_field'
                                value={formData.ville}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Téléphone
                            </div>
                            <input
                                name="telephone"
                                className='input_field'
                                value={formData.telephone}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Email
                            </div>
                            <input
                                name="email"
                                className='input_field'
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='bouton_save_container' style={{ width: '90%' }}>
                            {/* <button
                                disabled={isSubmitting}
                                className='button_save'
                                style={{ paddingLeft: '6px', paddingRight: '6px' }}
                                onClick={() => handleSave(true)}
                            >
                                {isSubmitting ? 'SAUVEGARDE...' : 'SAUVEGARDER + CREATION FACTURE'}
                            </button> */}
                            <button
                                disabled={isSubmitting}
                                className='button_save'
                                style={{ paddingLeft: '6px', paddingRight: '6px' }}
                                onClick={() => handleSave(false)}
                            >
                                {isSubmitting ? 'SAUVEGARDE...' : 'SAUVEGARDER'}
                            </button>
                        </div>
                    </div>
                )}
                {isEditingDeroulantMenu && (
                    <ModalMenuDeroulant2
                        top={dropdownPosition.top}
                        left={dropdownPosition.left}
                        handleSelectChoiceDeroulantMenu={handleSelectChoiceDeroulantMenu}
                    />
                )}
                {isModalOpen && selectedDebiteur && (
                    <ModalSelectedDebiteur
                        closeModal={closeModal}
                        selectedDebiteur={selectedDebiteur}
                        name={selectedDebiteur.name}
                        email={selectedDebiteur.email}
                        due={selectedDebiteur.due}
                        id={selectedDebiteur.id}

                    />
                )}
            </div>
        </MyLayout >

    );
}


