import MyLayout from '../Layout/layout';
import '../css/sharefeatures.css';
import '../css/params.css';
import LoadingPage from './../components/LoadingPage.js'
import React, { useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import axiosInstance from '../../src/app/config/axios';

export default function Parametre() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [activeSection, setActiveSection] = useState('');
    const [editing, setEditing] = useState(false);
    const [textFields, setTextFields] = useState({
        entreprise: '',
        email: '',
        nom: '',
        adresse1: '',
        cp: '',
        ville: '',
        SIRET: '',
        siren: '',
    });

    // États pour la gestion des documents
    const sections = ['RIB', 'Complément', 'Kbis', 'Carte Recto', 'Carte Verso', 'CGV'];
    const [userDocuments, setUserDocuments] = useState({});
    const [fileNames, setFileNames] = useState({});
    const [selectedFiles, setSelectedFiles] = useState({});
    const [uploadStatus, setUploadStatus] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);

    // États pour la visionneuse de document
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [documentUrl, setDocumentUrl] = useState(null);
    const [documentObjectUrl, setDocumentObjectUrl] = useState(null);
    const [documentType, setDocumentType] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [isLoadingDocument, setIsLoadingDocument] = useState(false);
    const [loadError, setLoadError] = useState(null);

    const handleRouteChangeStart = () => {
        setLoading(true);
        setTimeout(() => {
        }, 0);
    };

    const handleRouteChangeComplete = () => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    useEffect(() => {
        Router.events.on('routeChangeStart', handleRouteChangeStart);
        Router.events.on('routeChangeComplete', handleRouteChangeComplete);
        Router.events.on('routeChangeError', handleRouteChangeComplete);

        return () => {
            Router.events.off('routeChangeStart', handleRouteChangeStart);
            Router.events.off('routeChangeComplete', handleRouteChangeComplete);
            Router.events.off('routeChangeError', handleRouteChangeComplete);
        };
    }, []);

    // Nettoyer l'URL de l'objet lors du nettoyage
    useEffect(() => {
        return () => {
            if (documentObjectUrl) {
                URL.revokeObjectURL(documentObjectUrl);
            }
        };
    }, [documentObjectUrl]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/api/me');
                setUserData(response.data);
                setTextFields({
                    entreprise: response.data.entreprise || '',
                    email: response.data.email || '',
                    nom: response.data.nom || '',
                    adresse1: response.data.adresse1 || '',
                    cp: response.data.cp || '',
                    ville: response.data.ville || '',
                    SIRET: response.data.SIRET || '',
                    siren: response.data.siren || '',
                });
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Erreur lors du chargement des données');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Charger les documents utilisateur lorsque la section est activée
    useEffect(() => {
        if (activeSection === 'ajouterDoc') {
            fetchUserDocuments();
        }
    }, [activeSection]);

    // Charger le document quand la modal s'ouvre
    useEffect(() => {
        if (showDocumentModal && documentUrl) {
            setIsLoadingDocument(true);
            setLoadError(null);

            axiosInstance.get(documentUrl, {
                responseType: 'blob'
            })
                .then(response => {
                    console.log('Document chargé avec succès, type:', response.data.type);
                    const objectUrl = URL.createObjectURL(response.data);
                    setDocumentObjectUrl(objectUrl);
                    setIsLoadingDocument(false);
                })
                .catch(error => {
                    console.error('Erreur lors du chargement du document:', error);
                    setLoadError(`Impossible de charger le document: ${error.message}`);
                    setIsLoadingDocument(false);
                });
        }
    }, [showDocumentModal, documentUrl]);

    const fetchUserDocuments = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/user/documents');

            // Organiser les documents par type
            const docs = {};
            const names = {};

            response.data.forEach(doc => {
                docs[doc.documentType] = doc;
                names[doc.documentType] = doc.filename;
            });

            setUserDocuments(docs);
            setFileNames(names);
            setLoading(false);
        } catch (err) {
            console.error('Erreur lors de la récupération des documents:', err);
            setLoading(false);
        }
    };

    const handleTextChange = (e, fieldName) => {
        setTextFields({ ...textFields, [fieldName]: e.target.value });
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const dataToSend = {
                entreprise: textFields.entreprise?.trim() || "",
                email: textFields.email?.trim() || "",
                nom: textFields.nom?.trim() || "",
                adresse1: textFields.adresse1?.trim() || "",
                cp: textFields.cp?.trim() || "",
                ville: textFields.ville?.trim() || "",
                SIRET: textFields.SIRET?.trim() || "",
                siren: textFields.siren?.trim() || ""
            };

            const response = await axiosInstance.put('/api/me/update', dataToSend);

            setUserData(response.data.user);
            setLoading(false);
            alert('Informations mises à jour avec succès');

        } catch (err) {
            setLoading(false);
            alert('Erreur lors de la mise à jour');
        }
    };

    const handleFileChange = (e, docType) => {
        const file = e.target.files[0];
        if (file) {
            // Vérifier le type de fichier
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert('Type de fichier non autorisé. Veuillez télécharger un PDF ou une image.');
                e.target.value = ''; // Réinitialiser l'input file
                return;
            }

            setFileNames({
                ...fileNames,
                [docType]: file.name
            });

            setSelectedFiles({
                ...selectedFiles,
                [docType]: file
            });

            console.log(`Fichier sélectionné pour ${docType}: ${file.name} (${file.type})`);
        }
    };

    const uploadAllDocuments = async () => {
        setLoading(true);
        setSuccessMessage(null);

        // Vérifier s'il y a des fichiers à uploader
        if (Object.keys(selectedFiles).length === 0) {
            setLoading(false);
            alert('Aucun fichier sélectionné');
            return;
        }

        let hasError = false;

        // Uploader chaque fichier sélectionné
        for (const [docType, file] of Object.entries(selectedFiles)) {
            setUploadStatus({ ...uploadStatus, [docType]: 'uploading' });

            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('documentType', docType);

                const response = await axiosInstance.post('/api/user/documents/new', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                setUploadStatus({ ...uploadStatus, [docType]: 'success' });

            } catch (error) {
                console.error(`Erreur lors du téléchargement du ${docType}:`, error);
                setUploadStatus({ ...uploadStatus, [docType]: 'error' });
                hasError = true;
            }
        }

        // Rafraîchir la liste des documents
        await fetchUserDocuments();

        setLoading(false);
        setSelectedFiles({});

        if (hasError) {
            alert('Certains documents n\'ont pas pu être téléchargés');
        } else {
            setSuccessMessage('Documents sauvegardés avec succès');
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        }
    };

    const viewDocument = (docType) => {
        if (!userDocuments[docType]) {
            alert('Aucun document disponible');
            return;
        }

        const document = userDocuments[docType];
        setFileName(document.filename);

        // Construire l'URL pour l'API
        const documentApiUrl = `/api/user/documents/${document.id}`;
        setDocumentUrl(documentApiUrl);

        // Déterminer le type de document en fonction de l'extension
        const fileExtension = document.filename.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            setDocumentType('image');
        } else {
            setDocumentType('pdf');
        }

        // Afficher la modal
        setShowDocumentModal(true);
    };

    const closeDocumentModal = () => {
        setShowDocumentModal(false);
        setDocumentObjectUrl(null);
    };

    if (loading && !activeSection) {
        return (
            <MyLayout>
                <LoadingPage />
            </MyLayout>
        );
    }

    return (
        <MyLayout>
            {loading && <LoadingPage />}

            <div className='page_container_navbar'>
                <div className='title_params_container'>
                    <div className='title_params_text'>Mes informations</div>
                </div>

                <div className='button_container_params'>
                    <div
                        className={`button_doc ${activeSection === 'ajouterDoc' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveSection('ajouterDoc');
                            setEditing(false);
                        }}
                    >
                        Ajouter ou modifier<br />un document
                    </div>
                    <div
                        className={`button_default ${activeSection === '' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveSection('');
                            setEditing(false);
                        }}
                    >
                        Ajouter ou modifier<br />vos informations
                    </div>
                </div>

                <div className='part_change_params'>
                    {activeSection === '' && (
                        <>

                            {Object.entries(textFields).map(([fieldName, value]) => {
                                // Créer une correspondance pour des noms plus lisibles
                                const displayNames = {
                                    'entreprise': 'Nom de l\'entreprise',
                                    'email': 'Adresse email',
                                    'nom': 'Nom complet',
                                    'adresse1': 'Adresse',
                                    'cp': 'Code postal',
                                    'ville': 'Ville',
                                    'SIRET': 'Numéro SIRET',
                                    'siren': 'Numéro SIREN'
                                };

                                // Définir les champs qui doivent être de type number
                                const numberFields = ['cp', 'SIRET', 'siren'];
                                const inputType = numberFields.includes(fieldName) ? 'number' : 'text';

                                return (
                                    <div className='input_case_container' key={fieldName} style={{ marginTop: '24px' }}>
                                        <div className='input_title_container'>
                                            {displayNames[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                                        </div>
                                        <input
                                            className='input_field'
                                            type={inputType}
                                            value={value}
                                            onChange={(e) => handleTextChange(e, fieldName)}
                                            onClick={() => setEditing(true)}
                                        />
                                    </div>
                                );
                            })}
                            <div className='bouton_save_container'>
                                <div className='button_mdp' onClick={() => {
                                    setActiveSection('modifierMDP');
                                    setEditing(false);
                                }}>
                                    Modifier MDP
                                </div>
                                <div className='button_save' onClick={handleSave}>
                                    SAUVEGARDER
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'ajouterDoc' && (
                        <div className='container_scroll_doc'>
                            {sections.map((section) => (
                                <div className='input_case_container' key={section} style={{ marginTop: '24px', width: '100%' }}>
                                    <div>
                                        <div className='input_title_container'>
                                            {section} - (<span style={{ textDecoration: 'underline' }}>Format : PDF</span>) :
                                        </div>
                                        <div
                                            className='placeholder_file_container'
                                            onClick={fileNames[section] ? () => viewDocument(section) : null}
                                            style={{ cursor: fileNames[section] ? 'pointer' : 'default' }}
                                        >
                                            {fileNames[section] ? fileNames[section] : 'Aucun fichier sélectionné'}
                                        </div>

                                        <label htmlFor={`fileUpload_${section}`} className='button_add_file'>
                                            choisir un fichier
                                        </label>

                                        <input
                                            id={`fileUpload_${section}`}
                                            type="file"
                                            style={{ display: 'none' }}
                                            accept="image/*, application/pdf"
                                            onChange={(e) => handleFileChange(e, section)}
                                        />

                                        {uploadStatus[section] === 'uploading' && (
                                            <div style={{ marginTop: '10px', color: '#888' }}>Envoi en cours...</div>
                                        )}

                                        {uploadStatus[section] === 'success' && (
                                            <div style={{ marginTop: '10px', color: 'green' }}>Document téléchargé avec succès</div>
                                        )}

                                        {uploadStatus[section] === 'error' && (
                                            <div style={{ marginTop: '10px', color: 'red' }}>Erreur lors du téléchargement</div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className='bouton_save_container' style={{ marginLeft: '0px', width: 'none' }}>
                                <div className='button_save' onClick={uploadAllDocuments}>
                                    SAUVEGARDER
                                </div>
                            </div>

                            {successMessage && (
                                <div style={{ marginTop: '15px', textAlign: 'center', color: 'green' }}>
                                    {successMessage}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Document Modal */}
            {showDocumentModal && (
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

                            {isLoadingDocument ? (
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
            )}
        </MyLayout>
    );
}