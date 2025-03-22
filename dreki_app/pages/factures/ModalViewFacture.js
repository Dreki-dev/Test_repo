import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axiosInstance from '../../src/app/config/axios';

export default function ModalViewFacture({
    closeModal,
    selectedFacture,
    openDragonModal,
    blue_dragon,
    id,
    dateEmission,
    dateEcheance,
    aRecuperer,
    total,
    debiteur
}) {
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [documentUrl, setDocumentUrl] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [latestNote, setLatestNote] = useState(null);
    const [isLoadingNote, setIsLoadingNote] = useState(true);
    const router = useRouter();
    const pourcentageRestant = ((total - aRecuperer) / total) * 100;
    const fetchLatestNote = async () => {
        try {
            setIsLoadingNote(true);
            const response = await axiosInstance.get(`/api/factures/${id}/notes`);

            // Ajoutez cette ligne pour voir la structure exacte de la réponse
            console.log("Réponse complète:", response);
            console.log("Données des notes:", response.data);

            if (response.data.notes && response.data.notes.length > 0) {
                const sortedNotes = response.data.notes.sort((a, b) => b.id - a.id);
                setLatestNote(sortedNotes[0]);
                // Ajoutez cette ligne pour vérifier la note sélectionnée
                console.log("Note la plus récente:", sortedNotes[0]);
            } else {
                console.log("Pas de notes trouvées ou tableau vide");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des notes:", error);
        } finally {
            setIsLoadingNote(false);
        }
    };
    const handleEditClick = (e) => {
        e.preventDefault();
        sessionStorage.setItem('selectedFactureId', id);
        router.push('/mod_factures');
    };

    const handleAddClick = (e) => {
        e.preventDefault();
        sessionStorage.setItem('selectedFactureId', id);
        router.push('/test_note');
    };
    useEffect(() => {
        fetchLatestNote();
    }, [id]);
    console.log(debiteur.raisonsociale)






    const [fileName, setFileName] = useState('');
    const [documentObjectUrl, setDocumentObjectUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const DocumentModal = () => {
        const [documentObjectUrl, setDocumentObjectUrl] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [loadError, setLoadError] = useState(null);
        const [pdfOpened, setPdfOpened] = useState(false); // Nouvel état pour suivre si le PDF a été ouvert
    
        // Nettoyer l'URL de l'objet lors du nettoyage
        useEffect(() => {
            return () => {
                if (documentObjectUrl) {
                    URL.revokeObjectURL(documentObjectUrl);
                }
            };
        }, [documentObjectUrl]);
    
        // Charger le document quand la modal s'ouvre et l'URL est disponible
        useEffect(() => {
            if (showDocumentModal && documentUrl) {
                setIsLoading(true);
                setLoadError(null);
                setPdfOpened(false); // Réinitialiser l'état à chaque ouverture de la modale
    
                // Utiliser axiosInstance pour récupérer le contenu binaire du document avec authentification
                axiosInstance.get(documentUrl, {
                    responseType: 'blob'
                })
                    .then(response => {
                        console.log('Document chargé avec succès, type:', response.data.type);
    
                        // Créer une URL d'objet à partir du blob
                        const objectUrl = URL.createObjectURL(response.data);
                        setDocumentObjectUrl(objectUrl);
                        
                        // Si c'est un PDF, l'ouvrir dans un nouvel onglet
                        if (response.data.type === 'application/pdf' && !pdfOpened) {
                            setPdfOpened(true); // Marquer le PDF comme ouvert
                            window.open(objectUrl, '_blank');
                            // Fermer la modale puisque le document est ouvert dans un nouvel onglet
                            closeDocumentModal();
                        }
                        
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.error('Erreur lors du chargement du document:', error);
                        setLoadError(`Impossible de charger le document: ${error.message}`);
                        setIsLoading(false);
                    });
            }
        }, [showDocumentModal, documentUrl, pdfOpened, closeDocumentModal]);
    
        // Fonction pour ouvrir manuellement le document si besoin
        const openDocument = () => {
            if (documentObjectUrl && !pdfOpened) {
                setPdfOpened(true);
                window.open(documentObjectUrl, '_blank');
                closeDocumentModal();
            }
        };
    
        if (!showDocumentModal) {
            return null;
        }
    
        return (
            <div className='modal_back' onClick={closeDocumentModal} style={{zIndex: '999'}}>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className='modal_content_doc'
                    style={{
                        maxWidth: '80%',
                        maxHeight: '80%',
                        overflow: 'auto',
                        padding: '20px',
                        backgroundColor: '#fff',
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                        borderRadius: '5px'
                    }}
                >
                    <div className='cross_container_modal_facture' onClick={closeDocumentModal}>
                        <div className='cross_icon' style={{ transform: 'rotate(45deg)' }} />
                        <div className='cross_icon' style={{ transform: 'rotate(135deg)' }} />
                    </div>
    
                    <div className='document_viewer_container'>
                        <h3>{fileName || 'Document'}</h3>
    
                        {isLoading ? (
                            <div>Chargement du document...</div>
                        ) : loadError ? (
                            <div style={{ color: 'red' }}>
                                {loadError}
                            </div>
                        ) : !documentObjectUrl ? (
                            <div>Document non disponible</div>
                        ) : documentType === 'image' ? (
                            <img
                                src={documentObjectUrl}
                                alt="Document"
                                style={{ maxWidth: '100%', maxHeight: '70vh' }}
                            />
                        ) : (
                            <div>
                                <p>Ouverture du document dans un nouvel onglet...</p>
                                {!pdfOpened && (
                                    <button 
                                        onClick={openDocument}
                                        style={{
                                            padding: '8px 15px',
                                            background: '#2c7be5',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginTop: '10px'
                                        }}
                                    >
                                        Ouvrir le document
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    const viewDocument = () => {
        console.log('Fonction viewDocument appelée');

        if (!id) { 
            console.error('Impossible d\'afficher le document - ID de facture manquant');
            return;
        }

        const listUrl = `/api/factures/${id}/document`;
        console.log(`Récupération des documents depuis: ${listUrl}`);

        axiosInstance.get(listUrl)
            .then(response => {
                console.log('Documents récupérés:', response.data);

                if (!response.data || response.data.length === 0) {
                    alert('Aucun document trouvé pour cette facture');
                    return;
                }

                const document = response.data[0];
                setFileName(document.filename);

                const documentApiUrl = `/api/factures/${id}/document/${document.id}`;

                setDocumentUrl(documentApiUrl);

                const fileExtension = document.filename.split('.').pop().toLowerCase();
                if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                    setDocumentType('image');
                } else {
                    setDocumentType('pdf');
                }

                setShowDocumentModal(true);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des documents:', error);
                console.error('Détails de l\'erreur:', error.response?.data);
                alert(`Erreur: ${error.message}`);
            });
    };

    const closeDocumentModal = () => {
        setShowDocumentModal(false);
    };

    return (
        <div className='modal_back' onClick={closeModal}>
            <DocumentModal />
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
                        {id}
                    </div>
                </div>
                <div className='num_line_modal_facture' style={{ gap: "12px" }}>
                    <div>Débiteur associé :</div>
                    {debiteur ? debiteur.raisonsociale : 'Sans débiteur'}
                </div>
                <div className='euro_line_modal_facture'>
                    € a recuper :
                    <div className='euro_container_line_modal_facture'>
                        <div className='percent_bar_euro_container_line_modal_facture' style={{ width: `${pourcentageRestant}%` }}>
                        </div>
                        <div className='indicator_progress_bar'>

                        </div>
                    </div>
                    <div className='percent_container_line_modal_facture'>
                        <div className='part_percent_container_line_modal_facture' style={{ width: '60%' }}>
                            {aRecuperer}
                        </div>
                        <div className='part_percent_container_line_modal_facture' style={{ width: '40%', justifyContent: 'flex-end' }}>
                            total : {total}
                        </div>
                    </div>
                </div>
                <div className='time_line_modal_facture'>
                    <div className='part_time_line_modal_facture'>
                        Date emission :
                        <div className='date_part_time_line_modal_facture'>{dateEmission}</div>

                    </div>
                    <div className='part_time_line_modal_facture'>
                        Date echeance :
                        <div className='date_part_time_line_modal_facture'>{dateEcheance}</div>
                    </div>
                </div>
                <div className='note_line_modal_facture'>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', width: '100%' }}>
                        Derniere note :
                        <div style={{ fontSize: '14px', color: '#666', marginTop: '3px', right: '25%' }}>
                            {latestNote && latestNote.date ? (
                                new Date(latestNote.date).toLocaleString('fr-FR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                            ) : (
                                "Aucune date"
                            )}
                        </div>
                    </div>
                    <div className='note_container_line_modal_facture'>
                        <div className='part_note_container_line_modal_facture' style={{ width: '80%' }}>
                            {isLoadingNote ? (
                                "Chargement..."
                            ) : latestNote && latestNote.contenu ? (
                                <div>
                                    <div>
                                        {`${latestNote.contenu.substring(0, 25)}${latestNote.contenu.length > 25 ? '...' : ''}`}
                                    </div>

                                </div>
                            ) : (
                                "Aucune note disponible"
                            )}
                        </div>
                        <div className='separator_note_container_line_modal_facture'> </div>

                        <div className='button_note_container_line_modal_facture' style={{ width: '20%' }}>
                            <Link
                                className='button_modal_facture_note'
                                href={{ pathname: `/test_note`, query: { showModal: true } }}
                                onClick={handleAddClick}
                                style={{ textDecoration: 'none', color: 'inherit', border: 'none' }}
                            >
                                Voir
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='dragon_line_modal_facture'>
                    <div className='dragon_container_line_modal_facture'>
                        <div className='icon_dragon_container_line_modal_facture'>
                            <img src={blue_dragon} alt="dragon image" className='dragon_logo' />
                        </div>
                        <div className='relance_dragon_container_line_modal_facture' onClick={openDragonModal}>
                            pas encore relancé <div className='fleche' />
                        </div>

                    </div>
                </div>
                <div
                    className='view_doc_modale_facture'
                    onClick={(e) => {
                        e.stopPropagation();
                        viewDocument();
                    }}
                >
                    voir le document
                </div>
                <div className='button_line_modal_facture'>
                    <Link
                        className='button_modal_facture_note'
                        href={{ pathname: `/test_note`, query: { showModal: true } }}
                        onClick={handleAddClick}

                    >
                        Ajouter note
                    </Link>
                    <a
                        className='button_modal_facture_edit'
                        href="/mod_factures"
                        onClick={handleEditClick}
                    >
                        Modifier
                    </a>
                </div>
            </div>

        </div>
    );
}