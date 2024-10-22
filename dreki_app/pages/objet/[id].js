import { useRouter } from 'next/router';
import MyLayout from '../Layout/layout';

import '../css/objet.css'
import '../css/navbar.css'
import '../css/sharefeatures.css'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ObjetDetail() {
    {/* Imports */} 
    const router = useRouter();

    {/* Constantes et données initiales */} 
    const { id } = router.query;
    const [factureData, setFactureData] = useState(null);
    
    {/* État initial */ }
    const [factures, setFactures] = useState([
        {
            id: '1',
            numero: '10001',
            aRecuperer: 245,
            total: 55,
            name: 'Theo Dupont',
            dateEmission: '12/05/2020',
            dateEcheance: '23/08/2025',
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
            derniereNote: 'Paiement complet : Facture réglée.',
        },
    ]);

    {/*Récupère une facture correspondant à l'ID donné et met à jour l'état, ou affiche un message de chargement si non disponible.*/ }

    useEffect(() => {
        if (id) {
            const fetchedFacture = factures.find(facture => facture.id === id);
            setFactureData(fetchedFacture);
        }
    }, [id]);

    if (!factureData) {
        return <p>Chargement...</p>;
    }
    {/*  Gere l'affichage des case avec les notes */ }

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

                <div className='title_params_container' style={{ marginTop: '0', height: 'auto' }}>
                    <Link
                        href={{ pathname: '/factures', query: { debiteur: factureData.name } }}
                        className='title_params_text'
                        style={{ fontSize: '22px', marginTop: '0', textDecoration: 'none' }}
                    >
                        Facture n°
                        <span style={{ fontStyle: 'italic', color: '#012087b9' }}> {factureData.numero}</span>
                    </Link>
                </div>

                <div className='facture_obj_container'>
                    {/* Affichage des notes, a modifier avec map quand back */}

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
            </div>
        </MyLayout>
    );
}

