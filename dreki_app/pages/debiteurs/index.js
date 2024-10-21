import React, { useState, useRef, useEffect } from 'react';

import DebiteurLayout from './layout';
import '../css/navbar.css'
import '../css/debiteurs.css'

import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Debiteur() {
    const handleBlur = () => {
        setTimeout(() => {
            setEditingDeroulantMenu(false);
        }, 100);
    };
    const [textDeroulantMenu, setTextDeroulantMenu] = useState('Entreprise');
    const [isEditingDeroulantMenu, setEditingDeroulantMenu] = useState(false);
    const router = useRouter();

    const handleSelectChoiceDeroulantMenu = (choice) => {
        setTextDeroulantMenu(choice);
        setEditingDeroulantMenu(false);
        if (choice === 'Entreprise') {
            setPro_part(true)
        } else {
            setPro_part(false)
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [text, setText] = useState("")
    const [editing, setEditing] = useState(false);

    const [activeSection, setActiveSection] = useState('');
    const [docButtonClicked, setDebButtonClicked] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const [pro_part, setPro_part] = useState(true);
    const [selectedDebiteur, setSelectedDebiteur] = useState(null);

    const handleClick = (debiteur) => {
        setSelectedDebiteur(debiteur);
        setIsModalOpen(true);
    };

    const handleClickDeroulant = (e) => {
        const rect = e.target.getBoundingClientRect();

        setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
        });

        setEditingDeroulantMenu(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [sortAscName, setSortAscName] = useState(true);
    const [sortAscStat, setSortAscStat] = useState(true);
    const [sortAscDue, setSortAscDue] = useState(true);
    const [debiteurs, setDebiteurs] = useState([
        { name: 'Theo Dupont', id: '1', backColor: 'rgba(255, 166, 0, 0.085)', textColor: 'rgb(255, 166, 0)', textPaie: 'Paiement partiel', due: '544788' },
        { name: 'Jean Martin', id: '2', backColor: 'rgba(255, 166, 0, 0.085)', textColor: 'rgb(255, 166, 0)', textPaie: 'Paiement partiel', due: '1444' },
        { name: 'Marie Lefevre', id: '3', backColor: 'rgba(255, 166, 0, 0.085)', textColor: 'rgb(255, 166, 0)', textPaie: 'Paiement partiel', due: '188775' },
        { name: 'Emma Moreau', id: '4', backColor: 'rgba(255, 0, 0, 0.085)', textColor: 'rgba(255, 0, 0, 1)', textPaie: 'Paiement inexistant', due: '1475' },
        { name: 'Lucas Girard', id: '5', backColor: 'rgba(16, 137, 16, 0.085)', textColor: 'rgba(16, 137, 16, 1)', textPaie: 'Paiement complet', due: '753' },
    ]);

    const handleSortDue = () => {
        const sortedDebiteurs = [...debiteurs].sort((a, b) => {
            if (sortAscDue) {
                return a.due - b.due;
            } else {
                return b.due - a.due;
            }
        });

        setDebiteurs(sortedDebiteurs);
        setSortAscDue(!sortAscDue);
    };

    const handleSortName = () => {
        const sortedDebiteurs = [...debiteurs].sort((a, b) => {
            if (sortAscName) {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

        setDebiteurs(sortedDebiteurs);
        setSortAscName(!sortAscName);
    };

    const handleSortStatus = () => {
        const sortedDebiteurs = [...debiteurs].sort((a, b) => {
            if (sortAscStat) {
                return a.textPaie.localeCompare(b.textPaie);
            } else {
                return b.textPaie.localeCompare(a.textPaie);
            }
        });

        setDebiteurs(sortedDebiteurs);
        setSortAscStat(!sortAscStat);
    };

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

    const [searchTerm, setSearchTerm] = useState('');


    const [debiteur, setDebiteur] = useState(null);
    useEffect(() => {
        const { debiteur: debiteurFromUrl } = router.query;
        setDebiteur(debiteurFromUrl || null);
    }, [router.query]);

    const filteredDebiteur = debiteurs.filter(fact => {
        const searchTermLower = searchTerm.toLowerCase();

        const nameMatches = fact.name.toLowerCase().includes(searchTermLower);

        const dueMatches = fact.due.includes(searchTerm);
        const stateMatches = fact.textPaie.includes(searchTerm);

        const debiteurMatches = debiteur ? fact.name === debiteur : true;

        return (nameMatches || dueMatches || stateMatches) && debiteurMatches;
    });
    return (
        <DebiteurLayout>
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
                        Réinitialisez le filtre
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
                    <input className='search_input_deb' placeholder='Recherche...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

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
                    <div>
                        <div className='dropdown_menu' style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            backgroundColor: 'white',
                            position: 'absolute',
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column',
                            width: '50%',
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                        }}>
                            <div onClick={() => handleSelectChoiceDeroulantMenu('Entreprise')} style={{ padding: '5px', cursor: 'pointer' }}>Entreprise</div>
                            <div onClick={() => handleSelectChoiceDeroulantMenu('Particulier')} style={{ padding: '5px', cursor: 'pointer' }}>Particulier</div>
                        </div>
                    </div>
                )}
                {isModalOpen && selectedDebiteur && (
                    <div className='modal_back' onClick={closeModal}>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className='modal_content'
                            style={{
                                border: '2px solid #01208752'
                            }}>
                            <div className='Title_modal_debiteur'>
                                Information du débiteur
                            </div>
                            <div className='Subtitle_modal_debiteur'>
                                <div style={{ width: '120px' }}>
                                    Nom :
                                </div>
                                <div className='Subtitle_modal_debiteur_information'>{selectedDebiteur.name}</div>
                            </div>
                            <div className='Subtitle_modal_debiteur'>
                                <div style={{ width: '120px' }}>
                                    Téléphone :
                                </div>
                                <div className='Subtitle_modal_debiteur_information'>0781582512</div>
                            </div>
                            <div className='Subtitle_modal_debiteur'>
                                <div style={{ width: '120px' }}>
                                    Montant due :
                                </div>
                                <div className='Subtitle_modal_debiteur_information'>{selectedDebiteur.due} $</div>
                            </div>
                            <div className='Title_modal_debiteur'>
                                Action
                            </div>
                            <Link
                                href={{ pathname: '/factures', query: { debiteur: selectedDebiteur.name } }}
                                className='Link_modif_modal_debiteur'>
                                Voir les Factures
                            </Link>
                            <Link
                                href={{ pathname: '/mod_debiteurs', query: { debiteur: selectedDebiteur.name } }}
                                className='Link_modif_modal_debiteur'>
                                modifier le débiteur
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </DebiteurLayout >

    );
}


