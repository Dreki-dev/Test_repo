import React, { useState, useRef, useEffect } from 'react';
import FacturesLayout from './layout';
import '../css/navbar.css'
import '../css/facture.css'
import '../css/sharefeatures.css'
import blue_dragon from '../../public/images/logo_mini_dreki_blue.png';
import white_dragon from '../../public/images/logo_mini_dreki_white.png';
import red_dragon from '../../public/images/logo_mini_dreki_red.png';

import Link from 'next/link';

import { useRouter } from 'next/router';

export default function Facture() {
    const [isOpen, setIsOpen] = useState(false);
    const choices = ['Entreprise', 'Particulier', 'Association', 'test', 'theo', 'lucas', 'end'];
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const [sortAscName, setSortAscName] = useState(true);
    const [sortAscStat, setSortAscStat] = useState(true);
    const router = useRouter();
    const { id } = router.query;
    const [selectedFacture, setSelectedFacture] = useState(null);


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
            aRecuperer: 245,
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
            total: 300,
            aRecuperer: 125,
            dateEmission: '05/09/2021',
            dateEcheance: '22/11/2025'
        },
    ]);

    useEffect(() => {
        if (id) {
            const factureToDisplay = facturesAvecDragon.find(f => f.id === id);
            if (factureToDisplay) {
                setSelectedFacture(factureToDisplay);
                setIsModalOpen(true);
            }
        }
    }, [id, facturesAvecDragon]);


    const handleSortName = () => {
        const sortedFactures = [...facturesAvecDragon].sort((a, b) => {
            if (sortAscName) {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

        setFacture(sortedFactures);
        setSortAscName(!sortAscName);
    };

    const handleSortStatus = () => {
        const sortedFactures = [...facturesAvecDragon].sort((a, b) => {
            if (sortAscStat) {
                return a.euro.localeCompare(b.euro);
            } else {
                return b.euro.localeCompare(a.euro);
            }
        });

        setFacture(sortedFactures);
        setSortAscStat(!sortAscStat);
    };

    const buttonRef = useRef(null);

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDragonModalOpen, setIsDragonModalOpen] = useState(false);
    const [isDebiteurModalOpen, setisDebiteurModalOpen] = useState(false);

    const openDragonModal = () => {
        setIsDragonModalOpen(true);
    };
    const closeDragonModal = () => {
        setIsDragonModalOpen(false);
    };

    const openDebiteurModal = () => {
        setisDebiteurModalOpen(true);
    };
    const closeDebiteurModal = () => {
        setisDebiteurModalOpen(false);
    };
    const handleBlur = () => {
        setTimeout(() => {
            setEditingDeroulantMenu(false);
        }, 100);
    };

    const [textDeroulantMenu, setTextDeroulantMenu] = useState('default');
    const [isEditingDeroulantMenu, setEditingDeroulantMenu] = useState(false); 
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [filteredChoices, setFilteredChoices] = useState(choices); 
    const handleSelectChoiceDeroulantMenu = (choice) => {
        setTextDeroulantMenu(choice);
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
    const handleInputChange = (e) => {
        const value = e.target.value;
        setTextDeroulantMenu(value);

        const newFilteredChoices = choices.filter(choice =>
            choice.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredChoices(newFilteredChoices);
    };
    const FactureCase = ({ name, backColor, dragon, euro, id, total, aRecuperer, dateEcheance, dateEmission }) => {
        return (
            <div className='input_case_container_fac' onClick={() => openModalWithFacture(id)} ref={buttonRef}>
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

    const [searchTerm, setSearchTerm] = useState('');
    const [debiteur, setDebiteur] = useState(null);
    useEffect(() => {
        const { debiteur: debiteurFromUrl } = router.query;
        setDebiteur(debiteurFromUrl || null);
    }, [router.query]);

    const filteredFactures = facturesAvecDragon.filter(fact => {
        const searchTermLower = searchTerm.toLowerCase();

        const nameMatches = fact.name.toLowerCase().includes(searchTermLower);
        const euroMatches = fact.euro.includes(searchTerm);
        const idMatches = fact.id.includes(searchTerm);

        const debiteurMatches = debiteur ? fact.name === debiteur : true;

        return (nameMatches || euroMatches || idMatches) && debiteurMatches;
    });

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
        <FacturesLayout>
            <div className='page_container_navbar'>

                <div className='title_params_container' style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div className='title_params_text'>Factures</div>
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
                <div className='button_container_fac'>
                    <div className='button_add_fac' href={'./add_factures'} onClick={openDebiteurModal}>
                        Ajouter une facture
                    </div>
                    <input className='search_input' placeholder='Recherche...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />


                </div>
                <div className='facture_tab_container'>
                    <div className='fixed_case_container_tab_fac'>
                        <div className='name_container_tab_fac'>
                            name
                        </div>
                        <div className='euro_container_tab_fac' style={{ justifyContent: 'center' }}>
                            $ à venir
                        </div>
                        <div className='montant_container_tab_fac'>
                            montant
                        </div>
                        <div className='status_container_tab_fac'>
                            status
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
                    <div className='modal_back_fac' onClick={closeModal}>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className='modal_content_fac'
                            style={{
                                border: '2px solid #01208752'
                            }}>
                            <div className='cross_container_modal_facture' onClick={closeModal} >
                                <div className='cross_icon' style={{ transform: 'rotate(45deg)' }} />
                                <div className='cross_icon' style={{ transform: 'rotate(135deg)' }} />
                            </div>

                            <div className='num_line_modal_facture'>
                                Numero :
                                <div className='num_container_line_modal_facture'>
                                    {selectedFacture.id}
                                </div>
                            </div>
                            <div className='euro_line_modal_facture'>
                                $ a recuper :
                                <div className='euro_container_line_modal_facture'>
                                    <div className='percent_bar_euro_container_line_modal_facture' style={{ width: '75%' }}>
                                    </div>
                                </div>
                                <div className='percent_container_line_modal_facture'>
                                    <div className='part_percent_container_line_modal_facture' style={{ width: '60%' }}>
                                        {selectedFacture.aRecuperer}
                                    </div>
                                    <div className='part_percent_container_line_modal_facture' style={{ width: '40%', justifyContent: 'flex-end' }}>
                                        total : {selectedFacture.total}
                                    </div>
                                </div>
                            </div>
                            <div className='time_line_modal_facture'>
                                <div className='part_time_line_modal_facture'>
                                    Date emission :
                                    <div className='date_part_time_line_modal_facture'>{selectedFacture.dateEmission}</div>

                                </div>
                                <div className='part_time_line_modal_facture'>
                                    Date echeance :
                                    <div className='date_part_time_line_modal_facture'>{selectedFacture.dateEcheance}</div>
                                </div>
                            </div>
                            <div className='note_line_modal_facture'>
                                Derniere note :
                                <div className='note_container_line_modal_facture'>
                                    <div className='part_note_container_line_modal_facture' style={{ width: '80%' }}>
                                        blablablabla bla blabla blablabla...
                                    </div>
                                    <div className='separator_note_container_line_modal_facture'> </div>

                                    <div className='button_note_container_line_modal_facture' style={{ width: '20%' }}>
                                        <Link href={`/objet/${selectedFacture.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            Voir
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className='dragon_line_modal_facture'>
                                <div className='dragon_container_line_modal_facture'>
                                    <div className='icon_dragon_container_line_modal_facture'>
                                        <img src={blue_dragon.src} alt="dragon image" className='dragon_logo' />
                                    </div>
                                    <div className='relance_dragon_container_line_modal_facture' onClick={openDragonModal}>
                                        pas encore relancé <div className='fleche' />
                                    </div>

                                </div>
                            </div>
                            <div className='button_line_modal_facture'>
                                <div className='button_modal_facture_note'>
                                    Ajouter note
                                </div>
                                <div className='button_modal_facture_edit'>
                                    Modifier
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isDragonModalOpen && (
                    <div className='modal_back_fac' onClick={closeDragonModal} style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className='modal_content_fac'
                            style={{
                                border: '2px solid #01208752',
                            }}>
                            <div className='warning_message_container'>
                                <div className='warning_image_up'></div>
                                <div className='warning_image_down'></div>
                            </div>
                            <div className='warning_message_text_container'>
                                <div className='warning_message_text'>blablab bla bla blablabla blablab bla bla blablabla blablab bla bla blablabla blablab bla bla blablabla blablab bla bla blablabla </div>
                            </div>
                            <div className='choice_dragon_menu_container' onClick={toggleDropdown}>
                                <div className='dropdown_menu_choice_container'>

                                    <img src={white_dragon.src} alt="dragon image" className='dragon_logo' />
                                    <div>Relance amiable {isOpen ? '▲' : '▼'}</div>

                                </div>
                                <div className={`dropdown_menu ${isOpen ? 'show' : 'hide'}`}>
                                    <div className='dropdown_menu_choice' style={{ marginTop: '12px' }}>
                                        <div className='dropdown_menu_choice_container'>
                                            <img src={white_dragon.src} alt="dragon image" className='dragon_logo' />
                                            <div>Relance amiable</div>
                                        </div>
                                    </div>
                                    <div className='dropdown_menu_choice'>
                                        <div className='dropdown_menu_choice_container'>
                                            <img src={blue_dragon.src} alt="dragon image" className='dragon_logo' />
                                            <div>Relance contencieux</div>
                                        </div>
                                    </div>
                                    <div className='dropdown_menu_choice'>
                                        <div className='dropdown_menu_choice_container'>
                                            <img src={red_dragon.src} alt="dragon image" className='dragon_logo' />
                                            <div>Relance judiciare</div>
                                        </div>
                                    </div>
                                    <div className='dropdown_menu_choice'>

                                        <div className='dropdown_menu_choice_container'>
                                            <img src={white_dragon.src} alt="dragon image" className='dragon_logo' />
                                            <div>Réussi</div>
                                        </div>
                                    </div>
                                    <div className='dropdown_menu_choice'>
                                        <div className='dropdown_menu_choice_container'>
                                            <div className='cross_container_modal_facture_no_fix' >
                                                <div className='cross_icon' style={{ transform: 'rotate(45deg)' }} />
                                                <div className='cross_icon' style={{ transform: 'rotate(135deg)' }} />
                                            </div>
                                            <div>Annuler</div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className='button_container_mod_fac'>
                                <div className='button_fac' onClick={closeDragonModal}>SAUVEGARDER</div>
                            </div>
                        </div>
                    </div>
                )}
                {isEditingDeroulantMenu && (
                    <div style={{ width: '55%' }}>
                        <div className='dropdown_menu' style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            backgroundColor: 'white',
                            position: 'absolute',
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column',
                            width: '45%',
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            height: '15%',
                            overflowY: 'scroll',
                        }}>
                            {filteredChoices.map((choice, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSelectChoiceDeroulantMenu(choice)}
                                    style={{ padding: '5px', cursor: 'pointer' }}
                                >
                                    {choice}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {isDebiteurModalOpen && (
                    <div className='modal_back_fac' onClick={closeDebiteurModal} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className='modal_content_fac'
                            style={{
                                border: '2px solid #01208752',
                                height: '25%',
                                justifyContent: 'normal'
                            }}>
                            <div className='title_modal_choice_debiteur_container'>
                                <div className='title_modal_choice_debiteur'>
                                    Choix du débiteur
                                </div>
                            </div>
                            <div className='input_case_container_modal_deb' style={{ marginTop: '24px' }}>
                                <div className='input_title_container' >
                                    Débiteur
                                </div>
                                <input className='input_field' value={textDeroulantMenu} onClick={handleClickDeroulant} style={{ backgroundColor: '#d2d5d7' }} onBlur={handleBlur} onChange={handleInputChange} />

                            </div>
                            <div className='bouton_save_container_fac'>
                                <div className='button_save' style={{ paddingLeft: '4px', paddingRight: '4px' }}>AJOUTER DEBITEUR</div>
                                <Link className='button_save' href={'./add_factures'} style={{ paddingLeft: '4px', paddingRight: '4px' }}>SAUVEGARDER</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </FacturesLayout >

    );
}