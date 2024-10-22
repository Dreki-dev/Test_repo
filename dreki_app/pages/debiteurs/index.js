import React, { useState, useRef, useEffect } from 'react';

import MyLayout from '../Layout/layout'
import '../css/sharefeatures.css'
import '../css/debiteurs.css'
import ModalSelectedDebiteur from './ModalSelectedDebiteur';
import ModalMenuDeroulant2 from './ModalMenuDeroulant2';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Debiteur() {
    const router = useRouter();
    
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

    {/* État pour stocker les débiteurs et leurs données initiales */ }
    const [debiteurs, setDebiteurs] = useState([
        { name: 'Theo Dupont', id: '1', backColor: 'rgba(255, 166, 0, 0.085)', textColor: 'rgb(255, 166, 0)', textPaie: 'Paiement partiel', due: '544788' },
        { name: 'Jean Martin', id: '2', backColor: 'rgba(255, 166, 0, 0.085)', textColor: 'rgb(255, 166, 0)', textPaie: 'Paiement partiel', due: '1444' },
        { name: 'Marie Lefevre', id: '3', backColor: 'rgba(255, 166, 0, 0.085)', textColor: 'rgb(255, 166, 0)', textPaie: 'Paiement partiel', due: '188775' },
        { name: 'Emma Moreau', id: '4', backColor: 'rgba(255, 0, 0, 0.085)', textColor: 'rgba(255, 0, 0, 1)', textPaie: 'Paiement inexistant', due: '1475' },
        { name: 'Lucas Girard', id: '5', backColor: 'rgba(16, 137, 16, 0.085)', textColor: 'rgba(16, 137, 16, 1)', textPaie: 'Paiement complet', due: '753' },
    ]);

    {/* Fonction pour gérer les clics sur un débiteur et ouvrir la modal */ }
    const handleClick = (debiteur) => {
        setSelectedDebiteur(debiteur);
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
        const sortedDebiteurs = [...debiteurs].sort((a, b) => sortAscDue ? a.due - b.due : b.due - a.due);
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
    const DebiteurCase = ({ name, backColor, textColor, textPaie, handleClick, due }) => {
        const handleButtonClick = () => {
            handleClick();
        };

        return (
            <div className='input_case_container_deb' onClick={handleButtonClick} >
                <div className='case_name_menu'>{name}</div>
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

    {/* État pour stocker le terme de recherche pour filtrer les débiteurs */ }
    const [searchTerm, setSearchTerm] = useState('');
    const [debiteur, setDebiteur] = useState(null);

    {/* Mise à jour du débiteur sélectionné à partir de l'URL */ }
    useEffect(() => {
        const { debiteur: debiteurFromUrl } = router.query;
        setDebiteur(debiteurFromUrl || null);
    }, [router.query]);

    {/* Filtre les débiteurs en fonction du terme de recherche et du débiteur sélectionné */ }
    const filteredDebiteur = debiteurs.filter(fact => {
        const searchTermLower = searchTerm.toLowerCase();
        const nameMatches = fact.name.toLowerCase().includes(searchTermLower);
        const dueMatches = fact.due.includes(searchTerm);
        const stateMatches = fact.textPaie.includes(searchTerm);
        const debiteurMatches = debiteur ? fact.name === debiteur : true;

        return (nameMatches || dueMatches || stateMatches) && debiteurMatches;
    });

    return (
        <MyLayout>
            <div className='page_container_navbar'>
                <div className='title_params_container' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className='title_params_text'>Débiteurs</div>
                    <div
                        className='reset_filter_button'
                        onClick={() => {
                            setSearchTerm('');
                            setDebiteur(null);
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
                            Ajouter ou modifier<br />un débiteur
                        </div>
                    ) : (
                        <div className='button_add_deb' onClick={() => {
                            setActiveSection('');
                            setDebButtonClicked(false);
                        }}>
                            Afficher votre liste<br />de débiteurs
                        </div>
                    )}
                    <input className='search_input' style={{backgroundColor:'white'}} placeholder='Recherche...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                </div>

                {activeSection === '' && (
                    <div className='debiteur_tab_container'>
                        <div className='fixed_input_case_container_deb'>
                            <div className='case_name_menu' onClick={handleSortName} >
                                Nom {sortAscName ? '▲' : '▼'}
                            </div>
                            <div className='case_status_menu' onClick={handleSortStatus}>
                                Status {sortAscStat ? '▲' : '▼'}
                            </div>
                            <div className='case_action_menu' onClick={handleSortDue}>
                                Montant due {sortAscDue ? '▲' : '▼'}
                            </div>
                        </div>
                        <div className='container_scroll_deb'>
                            {filteredDebiteur.map((debiteur, index) => (
                                <DebiteurCase
                                    key={index}
                                    name={debiteur.name}
                                    backColor={debiteur.backColor}
                                    textColor={debiteur.textColor}
                                    textPaie={debiteur.textPaie}
                                    handleClick={() => handleClick(debiteur)}
                                    due={debiteur.due}
                                />
                            ))}
                        </div>

                    </div>
                )}
                {activeSection === 'ajouterDeb' && (
                    <div className='debiteur_tab_container'>
                        <div className='preventif_text_container' style={{ marginTop: '24px' }}>
                            Attention ! Les champs marqué d'un '*' ne seront pas modifiable dans l'avenir.
                        </div>
                        <div className='input_case_container' style={{ marginTop: '24px' }}>
                            <div className='input_title_container' >
                                *Type :
                            </div>
                            <input readOnly className='input_field' value={textDeroulantMenu} onClick={handleClickDeroulant} style={{ backgroundColor: '#d2d5d7' }} onBlur={handleBlur} />

                        </div>
                        {pro_part === true && (
                            <>
                                <div className='input_case_container' >
                                    <div className='input_title_container' >
                                        Raison Sociale
                                    </div>
                                    <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                                </div>
                                <div className='input_case_container' >
                                    <div className='input_title_container' >
                                        *SIREN
                                    </div>
                                    <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                                </div>
                            </>

                        )}

                        <div className='input_case_container' >
                            <div className='input_title_container' >
                                *Nom du contact
                            </div>
                            <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Adresse
                            </div>
                            <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Code Postal
                            </div>
                            <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Ville
                            </div>
                            <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Téléphone
                            </div>
                            <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Email
                            </div>
                            <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                        </div>
                        <div className='bouton_save_container'>
                            <div className='button_save' >SAUVEGARDER <br />+ CREATION FACTURE</div>
                            <div className='button_save'>SAUVEGARDER</div>
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
                        due={selectedDebiteur.due}
                        
                   />
                )}
            </div>
        </MyLayout >

    );
}


