import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axiosInstance from '../../src/app/config/axios';

import MyLayout from '../Layout/layout';

import '../css/sharefeatures.css';
import '../css/addfacture.css';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ModiFacture() {
    const [fileName, setFileName] = useState('');
    const [facture, setFacture] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [documentUrl, setDocumentUrl] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    // Nouveaux états pour les champs modifiables
    const [numFacture, setNumFacture] = useState('');
    const [montantTotal, setMontantTotal] = useState(0);
    const [montantRecupere, setMontantRecupere] = useState(0);
    const router = useRouter();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Vérifier le type de fichier
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert('Type de fichier non autorisé. Veuillez télécharger un PDF ou une image.');
                e.target.value = ''; // Réinitialiser l'input file
                return;
            }

            setFileName(file.name);
            setSelectedFile(file);
            console.log(`Fichier sélectionné: ${file.name} (${file.type})`);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const getStatusColor = (etat) => {
        switch (etat) {
            case 'paid':
                return 'rgba(16, 137, 16, 0.085)';
            case 'late':
                return 'rgba(255, 0, 0, 0.085)';
            default:
                return '#01208729';
        }
    };

    const fetchFactureDetails = async (id) => {
        console.log(`Début de fetchFactureDetails avec l'ID: ${id}`);
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(`/api/factures/${id}`);

            const facture = response.data.facture;

            const formattedFacture = {
                id: facture.id,
                name: facture.societe?.raisonsociale || facture.num,
                numero: facture.num,
                backColor: getStatusColor(facture.etat),
                dragon: facture.recupere,
                euro: facture.creance,
                total: facture.creance,
                aRecuperer: facture.creance - facture.recupere,
                dateEmission: formatDate(facture.dateemission),
                dateEcheance: formatDate(facture.dateecheance),
                pdfFile: facture.pdfFile,
                etat: facture.etat,
                societeId: facture.societe?.id
            };

            // Initialiser les états avec les valeurs de la facture
            setNumFacture(facture.num);
            setMontantTotal(facture.creance);
            setMontantRecupere(facture.recupere);
            setFacture(formattedFacture);

            if (facture.pdfFile) {
                setFileName(facture.pdfFile);
            } else {
                try {
                    const documentsResponse = await axiosInstance.get(`/api/factures/${id}/document`);

                    if (documentsResponse.data && documentsResponse.data.length > 0) {
                        const document = documentsResponse.data[0];
                        setFileName(document.filename);
                    } else {
                        setFileName(null);
                    }
                } catch (docError) {
                    console.error('Erreur lors de la récupération des documents:', docError);
                }
            }

            try {
                if (facture.dateemission) {
                    setStartDate(new Date(facture.dateemission));
                }
                if (facture.dateecheance) {
                    setDueDate(new Date(facture.dateecheance));
                }
            } catch (dateError) {
                console.error("Erreur lors de la conversion des dates:", dateError);
            }

        } catch (err) {
            console.error('Erreur lors de la récupération des détails de la facture:', err);
            console.error('Détails de l\'erreur:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data
            });
            setError('Impossible de charger les détails de la facture. Veuillez réessayer plus tard.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour sauvegarder les modifications sans envoyer l'état
    const handleSave = async () => {
        setIsSaving(true);
        setSuccessMessage(null);
        setError(null);

        try {
            if (!facture?.id) {
                throw new Error('ID de facture manquant');
            }

            // Préparer les données de la facture
            const updatedData = {
                num: numFacture,
                creance: parseFloat(montantTotal),
                recupere: parseFloat(montantRecupere),
                dateemission: startDate.toISOString().split('T')[0],
                dateecheance: dueDate.toISOString().split('T')[0]
            };

            console.log("Données à envoyer:", updatedData);

            // Si une société est associée, inclure son ID
            if (facture.societeId) {
                updatedData.societe_id = facture.societeId;
            }

            // Mettre à jour la facture
            const response = await axiosInstance.put(`/api/factures/${facture.id}`, updatedData);
            console.log("Réponse de la mise à jour:", response.data);

            // Si un fichier est sélectionné, l'uploader
            let uploadSuccess = true;
            if (selectedFile) {
                uploadSuccess = await uploadDocument();
            }

            // Mise à jour locale
            let currentEtat = facture.etat;
            setFacture({
                ...facture,
                numero: numFacture,
                total: parseFloat(montantTotal),
                dragon: parseFloat(montantRecupere),
                aRecuperer: parseFloat(montantTotal) - parseFloat(montantRecupere),
                dateEmission: formatDate(startDate),
                dateEcheance: formatDate(dueDate),
                backColor: getStatusColor(currentEtat),
                etat: currentEtat
            });

            if (uploadSuccess) {
                setSuccessMessage('Facture et document mis à jour avec succès');
            } else {
                setSuccessMessage('Facture mise à jour, mais problème avec le document');
            }

            // Rafraîchir les données
            setTimeout(() => {
                fetchFactureDetails(facture.id);
            }, 2000);

        } catch (err) {
            console.error('Erreur lors de la mise à jour de la facture:', err);
            setError('Impossible de mettre à jour la facture. Veuillez réessayer plus tard.');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        // Fonction pour gérer la récupération de l'ID et le chargement des données
        const loadFactureData = () => {
            let factureId = null;

            // Méthode 1: Vérifier le sessionStorage (méthode sécurisée)
            if (typeof window !== 'undefined') {
                const storedId = sessionStorage.getItem('selectedFactureId');
                if (storedId) {
                    console.log("ID récupéré depuis sessionStorage:", storedId);
                    factureId = storedId;
                }
            }

            // Méthode 2: Fallback - Vérifier l'URL (méthode classique)
            if (!factureId && router.isReady) {
                const { id } = router.query;
                if (id) {
                    console.log("ID récupéré depuis l'URL:", id);
                    factureId = id;
                }
            }

            // Si un ID a été trouvé, charger les données
            if (factureId) {
                fetchFactureDetails(factureId);
            } else {
                setIsLoading(false);
                setError("Aucun ID de facture trouvé");
            }
        };

        if (router.isReady) {
            loadFactureData();
        }
    }, [router.isReady, router.query]);

    if (isLoading) {
        return (
            <MyLayout>
                <div className='page_container_navbar'>
                    <div className='title_params_container'>
                        <div className='title_params_text'>Chargement...</div>
                    </div>
                </div>
            </MyLayout>
        );
    }

    if (error || !facture) {
        return (
            <MyLayout>
                <div className='page_container_navbar'>
                    <div className='return_arrow' style={{ height: '5%' }}>
                        <Link className='arrow_container' href='/factures'>
                            <div className='arrow_end'></div>
                            <div className='arrow_beg'></div>
                        </Link>
                    </div>
                    <div className='title_params_container'>
                        <div className='title_params_text'>Erreur</div>
                    </div>
                    <div className='addfacture_tab_container'>
                        <div>{error || "La facture demandée n'existe pas ou n'est plus disponible."}</div>
                        <Link href="/factures">
                            <div className='button_save' style={{ marginTop: '20px' }}>
                                Retour à la liste
                            </div>
                        </Link>
                    </div>
                </div>
            </MyLayout>
        );
    }
    const viewDocument = () => {
        console.log('Fonction viewDocument appelée');
    
        if (!facture?.id) {
            console.error('Impossible d\'afficher le document - ID de facture manquant');
            return;
        }
    
        // Si pdfFile est null, il n'y a probablement pas de document
        if (!facture.pdfFile && !fileName) {
            alert('Aucun document trouvé pour cette facture');
            return;
        }
    
        // Utiliser axiosInstance qui inclut déjà les jetons d'authentification
        const listUrl = `/api/factures/${facture.id}/document`;
        console.log(`Récupération des documents depuis: ${listUrl}`);
    
        axiosInstance.get(listUrl)
            .then(response => {
                console.log('Documents récupérés:', response.data);
    
                if (!response.data || response.data.length === 0) {
                    alert('Aucun document trouvé pour cette facture');
                    return;
                }
                
                // Le reste de votre code...
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des documents:', error);
                
                // Si erreur 404, c'est probablement que la facture n'a pas de document
                if (error.response && error.response.status === 404) {
                    alert('Aucun document disponible pour cette facture');
                } else {
                    alert(`Erreur: ${error.message}`);
                }
            });
    };

    const closeDocumentModal = () => {
        setShowDocumentModal(false);
    };


    const uploadDocument = async () => {
        if (!selectedFile || !facture?.id) {
            console.error('Impossible d\'uploader - Fichier ou ID de facture manquant');
            return false;
        }

        console.log(`Début de l'upload du document pour la facture ${facture.id}`);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            console.log(`Envoi du fichier à l'URL: /api/factures/${facture.id}/document/new`);
            const uploadResponse = await axiosInstance.post(
                `/api/factures/${facture.id}/document/new`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log("Document uploadé avec succès:", uploadResponse.data);
            setSelectedFile(null);
            return true;
        } catch (error) {
            console.error("Erreur lors de l'upload du document:", error);
            console.error("Détails:", error.response?.data);
            alert(`Erreur lors de l'upload: ${error.response?.data?.error || error.message}`);
            return false;
        }
    };


    const DocumentModal = () => {
        const [documentObjectUrl, setDocumentObjectUrl] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [loadError, setLoadError] = useState(null);

        // Charger le document quand la modal s'ouvre
        useEffect(() => {
            // Nettoyer l'URL de l'objet lors du nettoyage
            return () => {
                if (documentObjectUrl) {
                    URL.revokeObjectURL(documentObjectUrl);
                }
            };
        }, [documentObjectUrl]);

        useEffect(() => {
            if (showDocumentModal && documentUrl) {
                setIsLoading(true);
                setLoadError(null);

                // Utiliser axiosInstance pour récupérer le contenu binaire du document avec authentification
                axiosInstance.get(documentUrl, {
                    responseType: 'blob'
                })
                    .then(response => {
                        console.log('Document chargé avec succès, type:', response.data.type);

                        // Créer une URL d'objet à partir du blob
                        const objectUrl = URL.createObjectURL(response.data);
                        setDocumentObjectUrl(objectUrl);
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.error('Erreur lors du chargement du document:', error);
                        setLoadError(`Impossible de charger le document: ${error.message}`);
                        setIsLoading(false);
                    });
            }
            if (documentUrl) {
                // Extraire le nom du fichier à partir de l'URL ou utiliser une autre source
                // Cette méthode dépend de la structure de votre URL
                const extractedFileName = extractFileNameFromUrl(documentUrl);
                setFileName(extractedFileName);
            }
        }, [showDocumentModal, documentUrl]);

        if (!showDocumentModal) {
            return null;
        }

        return (
            <div className='modal_back' onClick={closeDocumentModal}>
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
                            <iframe
                                src={documentObjectUrl}
                                width="100%"
                                height="500px"
                                title="Document PDF"
                                style={{ border: 'none' }}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Fonction pour extraire le nom du fichier à partir de l'URL
    const extractFileNameFromUrl = (url) => {
        if (!url) return '';

        // Méthode 1: Si l'URL contient directement le nom du fichier
        // Exemple: "https://example.com/documents/facture-123.pdf"
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const fileName = pathParts[pathParts.length - 1];

            // Décodez les caractères URL-encodés (comme %20 pour espace)
            return decodeURIComponent(fileName);
        } catch (e) {
            // Si l'URL n'est pas valide ou si nous ne pouvons pas extraire le nom

            // Méthode 2: Alternative - extraire la dernière partie de l'URL après le dernier slash
            const parts = url.split('/');
            let fileName = parts[parts.length - 1];

            // Si l'URL contient des paramètres, les supprimer
            if (fileName.includes('?')) {
                fileName = fileName.split('?')[0];
            }

            return decodeURIComponent(fileName);
        }
    };
    return (
        <MyLayout>
            <div className='page_container_navbar'>
                <div className='return_arrow' style={{ height: '5%' }}>
                    <Link className='arrow_container' href='/factures'>
                        <div className='arrow_end'></div>
                        <div className='arrow_beg'></div>
                    </Link>
                </div>
                <div className='title_params_container'>
                    <div className='title_params_text'>
                        Modifier une facture
                        <span style={{ fontSize: '0.8em', marginLeft: '10px' }}>
                            (N° {facture.numero})
                        </span>
                    </div>
                </div>

                {successMessage && (
                    <div style={{
                        padding: '10px',
                        backgroundColor: 'rgba(16, 137, 16, 0.085)',
                        color: '#108910',
                        borderRadius: '5px',
                        margin: '10px 0',
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}>
                        {successMessage}
                    </div>
                )}

                <div className='addfacture_tab_container'>
                    <div className='container_scroll_doc'>
                        <div className='input_case_container' style={{ marginTop: '24px', width: '100%' }}>
                            <div>
                                <div className='input_title_container'>
                                    Factures - (<span style={{ textDecoration: 'underline' }}>Format : PDF</span>) :
                                </div>
                                <div
                                    className='placeholder_file_container'
                                    onClick={fileName ? viewDocument : null}
                                    style={{
                                        cursor: fileName ? 'pointer' : 'default',
                                        color: fileName ? 'black' : '#888' // Texte plus foncé quand un fichier est sélectionné
                                    }}
                                >
                                    {fileName ? fileName : 'Aucun fichier sélectionné'}
                                </div>
                                <label htmlFor="fileUpload" className='button_add_file'>
                                    {fileName ? 'Changer de fichier' : 'Choisir un fichier'}
                                </label>
                                <input id="fileUpload" type="file" style={{ display: 'none' }} accept="image/*, application/pdf" onChange={handleFileChange} />
                            </div>
                        </div>

                        <div className='input_case_container'>
                            <div className='input_title_container'>Client</div>
                            <input className='input_field' defaultValue={facture.name} readOnly />
                        </div>

                        <div className='input_case_container'>
                            <div className='input_title_container'>Numéro Facture</div>
                            <input
                                className='input_field'
                                value={numFacture}
                                onChange={(e) => setNumFacture(e.target.value)}
                            />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>Montant total (€)</div>
                            <input
                                className='input_field'
                                type="number"
                                step="0.01"
                                value={montantTotal}
                                onChange={(e) => setMontantTotal(e.target.value)}
                            />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>Montant récupéré (€)</div>
                            <input
                                className='input_field'
                                type="number"
                                step="0.01"
                                value={montantRecupere}
                                onChange={(e) => setMontantRecupere(e.target.value)}
                            />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>Montant à récupérer (€)</div>
                            <input
                                className='input_field'
                                value={`${parseFloat(montantTotal) - parseFloat(montantRecupere)}`}
                                readOnly
                            />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>Date d'émission Facture</div>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>

                        <div className='input_case_container' style={{ marginTop: '12px' }}>
                            <div className='input_title_container'>Date d'échéance Facture</div>
                            <DatePicker
                                selected={dueDate}
                                onChange={(date) => setDueDate(date)}
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>

                        <div className='bouton_save_container'>
                            <div
                                className='button_save'
                                onClick={handleSave}
                                style={{
                                    opacity: isSaving ? 0.7 : 1,
                                    cursor: isSaving ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isSaving ? 'SAUVEGARDE EN COURS...' : 'SAUVEGARDER'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DocumentModal />
        </MyLayout>
    );
}