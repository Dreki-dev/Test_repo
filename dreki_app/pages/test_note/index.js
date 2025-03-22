import { useRouter } from 'next/router';
import MyLayout from '../Layout/layout';
import '../css/objet.css'
import '../css/facture.css'
import '../css/sharefeatures.css'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '../../src/app/config/axios';

export default function NoteAdd() {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [factureData, setFactureData] = useState(null);
    const [notes, setNotes] = useState([]);
    const [noteText, setNoteText] = useState('');

    // Récupération de l'ID depuis l'URL (pour compatibilité)
    const { id } = router.query;

    const handleAddNoteClick = () => {
        setIsModalVisible(true);
    };

    const closeNoteModal = () => {
        setIsModalVisible(false);
    };

    // Fonction pour charger les données de la facture
    const fetchFactureData = async (factureId) => {
        try {
            setLoading(true);
            // Utiliser votre instance axiosInstance ou la fonction fetch
            const response = await axiosInstance.get(`/api/factures/${factureId}`);
            setFactureData(response.data.facture);
            setLoading(false);
        } catch (err) {
            console.error('Erreur lors du chargement de la facture:', err);
            setError('Impossible de charger les données de la facture');
            setLoading(false);
        }
    };

    // Fonction pour charger les notes liées à la facture
    const fetchNotes = async (factureId) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/factures/${factureId}/notes`);
            setNotes(response.data.notes);
            setLoading(false);
        } catch (err) {
            console.error('Erreur lors du chargement des notes:', err);
            setError('Impossible de charger les notes');
            setLoading(false);
        }
    };

    // Fonction pour soumettre une nouvelle note
    const submitNote = async () => {
        if (!noteText.trim()) {
            return;
        }
        try {
            const factureId = sessionStorage.getItem('selectedFactureId');
            const response = await axiosInstance.post(`/api/factures/${factureId}/notes`, {
                contenu: noteText
            });
            
            fetchNotes(factureId);
            setNoteText('');
            closeNoteModal();
        } catch (err) {
            console.error('Erreur lors de la création de la note:', err);
            setError('Impossible d\'ajouter la note');
        }
    };

    // Utiliser useEffect pour charger les données au chargement de la page
    useEffect(() => {
        const storedId = sessionStorage.getItem('selectedFactureId');
        
        if (storedId) {
            fetchFactureData(storedId);
            fetchNotes(storedId);
        } else if (id) {
            // Fallback à l'ID de l'URL si rien dans sessionStorage
            fetchFactureData(id);
            fetchNotes(id);
            sessionStorage.setItem('selectedFactureId', id);
        }

        if (router.query.showModal === 'true') {
            setIsModalVisible(true);
        }
    }, [id, router.query.showModal]);

    if (loading) {
        return (
            <MyLayout>
                <div className="loading-container">
                    <p>Chargement des données...</p>
                </div>
            </MyLayout>
        );
    }

    if (error) {
        return (
            <MyLayout>
                <div className="error-container">
                    <p>Erreur: {error}</p>
                    <button onClick={() => router.push('/factures')}>
                        Retour à la liste des factures
                    </button>
                </div>
            </MyLayout>
        );
    }

    if (!factureData) {
        return (
            <MyLayout>
                <div className="error-container">
                    <p>Aucune facture sélectionnée</p>
                    <button onClick={() => router.push('/factures')}>
                        Retour à la liste des factures
                    </button>
                </div>
            </MyLayout>
        );
    }

    /* Composant pour afficher une note */
    const NoteCase = ({ name, date, contenu }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const maxTextLength = 150;
        const truncatedText = contenu.length > maxTextLength
            ? contenu.substring(0, maxTextLength) + '...'
            : contenu;

        const formattedDate = new Date(date);
        const dateString = formattedDate.toLocaleDateString();
        const timeString = formattedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const toggleText = () => {
            setIsExpanded(!isExpanded);
        };

        return (
            <div className={`notecase_container ${isExpanded ? 'expanded' : ''} ${contenu.length > maxTextLength ? 'has-button' : ''}`}>
                <div className='notecase_title_container'>
                    <div className='title_var'>{name}</div>
                    <div className='title_var'>{dateString}</div>
                    <div className='title_var'>{timeString}</div>
                </div>
                <div className={`text_container ${isExpanded ? 'expanded' : ''}`}>
                    {isExpanded ? contenu : truncatedText}
                </div>
                {contenu.length > maxTextLength && (
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
                        href={{ pathname: '/debiteurs', query: { debiteur: factureData.societe?.raisonsociale } }}
                        className='title_params_text'
                        style={{ fontSize: '22px', marginTop: '0', textDecoration: 'none' }}
                    >
                        Débiteur :
                        <span style={{ fontStyle: 'italic', color: '#012087b9' }}> {factureData.societe?.raisonsociale}</span>
                    </Link>
                </div>

                <div className='title_params_container' style={{ marginTop: '0', height: 'auto', justifyContent: 'space-between' }}>
                    <Link
                        href={{ pathname: '/factures', query: { debiteur: factureData.societe?.raisonsociale } }}
                        className='title_params_text'
                        style={{ fontSize: '22px', marginTop: '0', textDecoration: 'none' }}
                    >
                        Facture n°
                        <span style={{ fontStyle: 'italic', color: '#012087b9' }}> {factureData.num}</span>
                    </Link>
                    <div className='button_add_note' onClick={handleAddNoteClick}>
                        Ajouter une note
                    </div>
                </div>

                <div className='facture_obj_container'>
                    {notes.length > 0 ? (
                        notes.map((note) => (
                            <NoteCase
                                key={note.id}
                                name={factureData.societe?.raisonsociale || 'Nom inconnu'}
                                date={note.date}
                                contenu={note.contenu}
                            />
                        ))
                    ) : (
                        <div className="no-notes-message">
                            Aucune note pour cette facture.
                        </div>
                    )}
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
                                justifyContent: 'normal'
                            }}
                        >
                            <div className='title_modal_choice_debiteur_container'>
                                <div className='title_modal_choice_debiteur'>
                                    {factureData.societe?.raisonsociale || 'Nom inconnu'}
                                </div>
                            </div>
                            <div className='input_case_container_modal_deb' style={{ marginTop: '0px', marginBottom: '0px', height: 'auto' }}>
                                <div className='input_title_container'>
                                    Ajouter une note
                                </div>
                            </div>
                            <div className='input_container_note'>
                                <textarea 
                                    className='input_field' 
                                    style={{
                                        height: '89%', 
                                        width: '99%', 
                                        justifyContent: 'none', 
                                        resize: 'none', 
                                        textAlign: 'none', 
                                        boxSizing: 'border-box', 
                                        verticalAlign: 'top',
                                        lineHeight: '1.2',
                                        overflowY: 'auto'
                                    }}
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                />
                            </div>

                            <div className='bouton_save_container_fac' style={{ justifyContent: 'flex-end', marginTop: '45px' }}>
                                <div
                                    onClick={submitNote}
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