import MyLayout from '../Layout/layout';
import React, { useState, useEffect, useRef } from 'react';
import '../css/sharefeatures.css';
import '../css/notes.css';
import LoadingPage from './../components/LoadingPage.js';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axiosInstance from '../../src/app/config/axios';

export default function Notes() {
    const router = useRouter();
    const [error, setError] = useState(null);
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const fetchNotes = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get('/api/notes');

            const formattedNotes = await Promise.all(response.data.notes.map(async note => {
                let societeData = null;
                let factureNum = "Sans numéro";

                if (note.facture) {
                    try {
                        const factureResponse = await axiosInstance.get(`/api/factures/${note.facture.id}`);
                        societeData = factureResponse.data.facture.societe;
                        factureNum = factureResponse.data.facture.num || "Sans numéro";
                    } catch (error) {
                        console.error(`Erreur lors de la récupération de la facture ID ${note.facture.id}:`, error);
                    }
                }

                const dateObj = new Date(note.date);
                const formattedDate = dateObj.toLocaleDateString('fr-FR');
                const formattedTime = dateObj.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return {
                    id: note.id,
                    contenu: note.contenu,
                    date: formattedDate,
                    heure: formattedTime,
                    facture: note.facture,
                    factureNum: factureNum, // Ajouter le numéro de facture
                    debiteur: societeData ? societeData.raisonsociale : 'Débiteur inconnu'
                };
            }));

            setNotes(formattedNotes.reverse());
            setFilteredNotes(formattedNotes.reverse());
        } catch (err) {
            setError('Impossible de charger les notes. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [selectedDebiteur, setSelectedDebiteur] = useState(null);

    const [loading, setLoading] = useState(false);

    const NoteCase = ({ name, dateEmission, heure, text, id, factureNum }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const maxTextLength = 150;
        const truncatedText = text.length > maxTextLength ? text.substring(0, maxTextLength) + '...' : text;

        const toggleText = () => {
            setIsExpanded(!isExpanded);
        };

        return (
            <div className={`notecase_container ${isExpanded ? 'expanded' : ''} ${text.length > maxTextLength ? 'has-button' : ''}`}>
                <div className='notecase_title_container'>
                    <div className='notecase_title_container_first_line'>
                        <Link href={`/objet/${id}`} className='title_var' style={{ textDecoration: 'none', justifyContent: 'start', marginLeft: '12px' }}><div className='text'>{name}</div></Link>
                        <div className='title_var'>{dateEmission}</div>
                        <div className='title_var'>{heure}</div>
                    </div>
                    <div className='notecase_title_container_second_line'>
                        <div className='notecase_title_fac' style={{ justifyContent: 'start', marginLeft: '12px' }}>facture :</div>
                        <div className='notecase_title_fac' style={{ justifyContent: 'start' }}>{factureNum}</div>
                    </div>
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

    useEffect(() => {
        fetchNotes();
    }, []);

    // Filtrer les notes quand selectedDebiteur change
    useEffect(() => {
        if (selectedDebiteur) {
            const filtered = notes.filter(note => note.debiteur === selectedDebiteur);
            setFilteredNotes(filtered);
        } else {
            setFilteredNotes(notes);
        }
    }, [selectedDebiteur, notes]);

    const [debiteurs, setDebiteurs] = useState([]);
    useEffect(() => {
        // Récupération des débiteurs quand le composant est monté
        const loadDebiteurs = async () => {
            setLoading(true);
            try {
                const result = await fetchDebiteurs();
                console.log('Débiteurs chargés:', result);
                setDebiteurs(result);
            } catch (error) {
                console.error('Erreur lors du chargement des débiteurs:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDebiteurs();
    }, []);

    const fetchDebiteurs = async () => {
        try {
            const response = await axiosInstance.get('/api/societes', {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            console.log('Données reçues:', response.data);

            if (response.data && response.data.societes) {
                return response.data.societes;
            } else {
                console.error('Format de réponse inattendu:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Erreur:', error);
            return [];
        }
    };

    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const dropdownRef = useRef(null);

    const handleInputClick = () => {
        setIsOpen(true);
    };

    const handleUserSelect = (user) => {
        setInputValue(user.raisonsociale);
        setSelectedDebiteur(user.raisonsociale);
        setIsOpen(false);
        document.activeElement.blur();
    };

    const resetFilter = () => {
        setInputValue('');
        setSelectedDebiteur(null);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setIsOpen(true);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        setUsers(debiteurs)
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [debiteurs]);

    const filteredUsers = users.filter(user =>
        user.raisonsociale.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <MyLayout>
            {loading && <LoadingPage />}
            <div className='page_container_navbar'>
                <div className='title_params_container' style={{ flexDirection: 'column', alignItems: 'start', width: '95%' }}>
                    <div className='title_params_text'>Historiques des notes</div>
                    <div className='title_params_container_input_test' style={{position: 'relative'}}ref={dropdownRef}>
                        <div className='title_params_input_and_clear'>
                            <input
                                className='title_params_input'
                                value={inputValue}
                                onClick={handleInputClick}
                                onBlur={handleBlur}
                                onChange={handleInputChange}
                                placeholder="Sélectionner un débiteur"
                            />
                            <div 
                                className='clear_input' 
                                onClick={resetFilter}
                                style={{cursor: 'pointer'}}
                            >
                                toutes les notes
                            </div>
                        </div>

                        {isOpen && (
                            <div className='title_params_dropdown'>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, index) => (
                                        <div
                                            key={index}
                                            className='title_params_item'
                                            onMouseOver={(e) => { e.target.style.backgroundColor = '#f0f0f0' }}
                                            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent' }}
                                            onClick={() => handleUserSelect(user)}
                                        >
                                            {user.raisonsociale}
                                        </div>
                                    ))
                                ) : (
                                    <div className='title_params_item'>Aucun utilisateur trouvé</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className='facture_obj_container'>
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                            <NoteCase
                                key={note.id}
                                name={note.debiteur}
                                dateEmission={note.date}
                                heure={note.heure}
                                text={note.contenu}
                                id={note.facture ? note.facture.id : 'sans-facture'}
                                factureNum={note.factureNum}
                            />
                        ))
                    ) : (
                        <div className="no-notes-message">
                            {loading ? "Chargement des notes..." : "Aucune note disponible."}
                        </div>
                    )}
                </div>
            </div>
        </MyLayout>
    );
}