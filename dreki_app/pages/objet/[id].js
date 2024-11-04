import { useRouter } from 'next/router';
import MyLayout from '../Layout/layout';

import '../css/objet.css'
import '../css/facture.css'
import '../css/sharefeatures.css'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ObjetDetail() {
    /* Imports */
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddNoteClick = () => {
        setIsModalVisible(true);
    };

    const closeNoteModal = () => {
        setIsModalVisible(false);
    };
    /* Constantes et données initiales */
    const { id } = router.query;
    const [factureData, setFactureData] = useState(null);
    const Test = {
        theo: 'tt', prout: 'zz', lolo: 'aa'
    }

    /* État initial */
    const [factures, setFactures] = useState([
        {
            id: '1',
            numero: '10001',
            aRecuperer: 245,
            total: 55,
            name: 'Theo Dupont',
            dateEmission: '12/05/2020',
            dateEcheance: '23/08/2025',
            heure: '8h35',
            derniereNote: 'Première facture: Rappel pour paiement partiel.',
        },
        {
            id: '2',
            numero: '10002',
            aRecuperer: 500,
            total: 600,
            name: 'Jean Martin',
            dateEmission: '15/07/2021',
            dateEcheance: '01/10/2025',
            heure: '8h35',
            derniereNote: 'Deuxième facture: Solde restant après premier versement.',
        },
        {
            id: '3',
            numero: '10003',
            aRecuperer: 300,
            total: 450,
            name: 'Marie Lefevre',
            dateEmission: '10/02/2022',
            dateEcheance: '30/12/2025',
            heure: '8h35',
            derniereNote: 'Troisième facture: Paiement à prévoir avant échéance.',
        },
        {
            id: '4',
            numero: '10004',
            aRecuperer: 1475,
            total: 1500,
            name: 'Emma Moreau',
            dateEmission: '01/04/2023',
            dateEcheance: '15/09/2025',
            heure: '8h35',
            derniereNote: 'Facture impayée : Aucune action prise à ce jour.',
        },
        {
            id: '5',
            numero: '10005',
            aRecuperer: 753,
            total: 753,
            name: 'Lucas Girard',
            dateEmission: '12/05/2023',
            dateEcheance: '23/06/2025',
            heure: '8h35',
            derniereNote: 'Paiement complet : Facture réglée.',
        },
    ]);

    /*Récupère une facture correspondant à l'ID donné et met à jour l'état, ou affiche un message de chargement si non disponible.*/
    useEffect(() => {
        if (id) {
            const fetchedFacture = factures.find(facture => facture.id === id);
            setFactureData(fetchedFacture);
        }
        // Vérifie si le paramètre showModal est dans l'URL
        if (router.query.showModal === 'true') {
            setIsModalVisible(true);
        }
    }, [id, router.query.showModal]);
    
    useEffect(() => {
        if (id) {
            const fetchedFacture = factures.find(facture => facture.id === id);
            setFactureData(fetchedFacture);
        }
    }, [id]);

    if (!factureData) {
        return <p>Chargement...</p>;
    }

    /*  Gere l'affichage des case avec les notes */

    const NoteCase = ({ name, dateEmission, heure, text }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const maxTextLength = 150;
        const truncatedText = text.length > maxTextLength
            ? text.substring(0, maxTextLength) + '...'
            : text;

        const toggleText = () => {
            setIsExpanded(!isExpanded);
        };

        return (
            <div className={`notecase_container ${isExpanded ? 'expanded' : ''} ${text.length > maxTextLength ? 'has-button' : ''}`}>
                <div className='notecase_title_container'>
                    <div className='title_var'>{name}</div>
                    <div className='title_var'>{dateEmission}</div>
                    <div className='title_var'>{heure}</div>
                </div>
                <div className={`text_container ${isExpanded ? 'expanded' : ''}`}>
                    {isExpanded ? text : truncatedText}
                </div>
                {text.length > maxTextLength && (
                    <div className='button_voirplus_container'>
                        <button className='button_voirplus' onClick={toggleText}>
                            {isExpanded ? 'Voir moins' : 'Voir plus'}
                        </button>
                    </div>
                )}
            </div>
        );
    };


    return (
        <MyLayout>
            <div className='page_container_navbar'>
                <div className='return_arrow'>
                    <Link className='arrow_container' href='/factures'>
                        <div className='arrow_end'></div>
                        <div className='arrow_beg'></div>
                    </Link>
                </div>

                <div className='title_params_container' style={{ marginBottom: '0', height: 'auto' }}>
                    <div className='title_params_text'>Notes</div>
                </div>

                <div className='title_params_container' style={{ marginTop: '0', height: 'auto' }}>
                    <Link
                        href={{ pathname: '/debiteurs', query: { debiteur: factureData.name } }}
                        className='title_params_text'
                        style={{ fontSize: '22px', marginTop: '0', textDecoration: 'none' }}
                    >
                        Débiteur :
                        <span style={{ fontStyle: 'italic', color: '#012087b9' }}> {factureData.name}</span>
                    </Link>
                </div>

                <div className='title_params_container' style={{ marginTop: '0', height: 'auto', justifyContent: 'space-between' }}>
                    <Link
                        href={{ pathname: '/factures', query: { debiteur: factureData.name } }}
                        className='title_params_text'
                        style={{ fontSize: '22px', marginTop: '0', textDecoration: 'none' }}
                    >
                        Facture n°
                        <span style={{ fontStyle: 'italic', color: '#012087b9' }}> {factureData.numero}</span>
                    </Link>
                    <div className='button_add_note' onClick={handleAddNoteClick}>
                        Ajouter une note
                    </div>
                </div>

                <div className='facture_obj_container'>


                    <NoteCase
                        name={factureData.name}
                        dateEmission={factureData.dateEmission}
                        heure={factureData.heure}
                        text={factureData.derniereNote}
                    />
                    <NoteCase
                        name={factureData.name}
                        dateEmission={factureData.dateEmission}
                        heure={factureData.heure}
                        text={factureData.derniereNote}
                    />
                    <NoteCase
                        name={factureData.name}
                        dateEmission={factureData.dateEmission}
                        heure={factureData.heure}
                        text={factureData.derniereNote}
                    />
                    <NoteCase
                        name={factureData.name}
                        dateEmission={factureData.dateEmission}
                        heure={factureData.heure}
                        text={factureData.derniereNote}
                    />
                    <NoteCase
                        name={factureData.name}
                        dateEmission={factureData.dateEmission}
                        heure={factureData.heure}
                        text={factureData.derniereNote}
                    />
                    <NoteCase
                        name={factureData.name}
                        dateEmission={factureData.dateEmission}
                        heure={factureData.heure}
                        text={factureData.derniereNote}
                    />
                    <NoteCase
                        name={factureData.name}
                        dateEmission={factureData.dateEmission}
                        heure={factureData.heure}
                        text={factureData.derniereNote}
                    />
                </div>

                {isModalVisible && (
                    <div
                        className='modal_back'
                        onClick={closeNoteModal}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant sur le contenu de la modale
                            className='modal_content_fac'
                            style={{
                                border: '2px solid #01208752',
                                height: '25%',
                                justifyContent: 'normal'
                            }}
                        >
                            <div className='title_modal_choice_debiteur_container'>
                                <div className='title_modal_choice_debiteur'>
                                    {factureData.name}
                                </div>
                            </div>
                            <div className='input_case_container_modal_deb' style={{ marginTop: '0px', marginBottom: '0px', height: 'auto' }}>
                                <div className='input_title_container'>
                                    Ajouter une note
                                </div>
                            </div>
                            <div className='input_container_note'>
                                <textarea className='input_field' style={{height: '99%', width: '99%', justifyContent: 'none', resize: 'none', textAlign: 'none', boxSizing: 'border-box', verticalAlign: 'top',lineHeight: '1.2',overflowY: 'auto'}}/>
                            </div>






                            <div className='bouton_save_container_fac' style={{ justifyContent: 'flex-end' }}>

                                <div
                                    onClick={closeNoteModal}
                                    className='button_save'
                                    style={{ paddingLeft: '4px', paddingRight: '4px', height: '35px' }}
                                >
                                    SAUVEGARDER
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MyLayout>
    );
}

