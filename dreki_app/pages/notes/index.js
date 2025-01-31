import MyLayout from '../Layout/layout';
import React, { useState, useEffect } from 'react';
import '../css/sharefeatures.css';
import '../css/notes.css';
import LoadingPage from './../components/LoadingPage.js';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Notes() {
    const router = useRouter();

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

    const [loading, setLoading] = useState(false);

    const NoteCase = ({ name, dateEmission, heure, text, id }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const maxTextLength = 150;
        const truncatedText = text.length > maxTextLength ? text.substring(0, maxTextLength) + '...' : text;

        const toggleText = () => {
            setIsExpanded(!isExpanded);
        };

        return (
            <div className={`notecase_container ${isExpanded ? 'expanded' : ''} ${text.length > maxTextLength ? 'has-button' : ''}`}>
                <div className='notecase_title_container'>
                    <Link href={`/objet/${id}`} className='title_var' style={{ textDecoration: 'none' }}>{name}</Link>
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
            {loading && <LoadingPage />}
            <div className='page_container_navbar'>
                <div className='title_params_container'>
                    <div className='title_params_text'>Historiques des notes</div>
                </div>

                <div className='facture_obj_container'>
                    {factures.map((facture) => (
                        <NoteCase
                            key={facture.id}
                            name={facture.name}
                            dateEmission={facture.dateEmission}
                            heure={facture.heure}
                            text={facture.derniereNote}
                            id={facture.id}
                        />
                    ))}
                </div>
            </div>
        </MyLayout>
    );
}
