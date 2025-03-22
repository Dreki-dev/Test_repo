import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MyLayout from '../Layout/layout';

import '../css/sharefeatures.css'
import '../css/addfacture.css'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from '../../src/app/config/axios';

export default function AddFacture() {
    const router = useRouter();

    // État pour les champs du formulaire
    const [formData, setFormData] = useState({
        num: '',
        creance: '',
        recupere: '0',
        dateemission: new Date(),
        dateecheance: new Date(new Date().setDate(new Date().getDate() + 30)), // Par défaut +30 jours
    });

    // État pour le fichier PDF
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [filePreviewUrl, setFilePreviewUrl] = useState(null);

    // État pour stocker l'ID du débiteur
    const [debiteurId, setDebiteurId] = useState(null);

    // État pour les messages d'erreur/succès
    const [message, setMessage] = useState({ type: '', text: '' });

    // État pour indiquer si le formulaire est en cours d'envoi
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Nouvel état pour stocker l'ID de la facture créée
    const [createdFactureId, setCreatedFactureId] = useState(null);

    // Récupérer l'ID du débiteur depuis sessionStorage lors du montage du composant
    useEffect(() => {
        // Exécution uniquement côté client
        if (typeof window !== 'undefined') {
            const storedId = sessionStorage.getItem('selectedDebiteurId');
            if (storedId) {
                setDebiteurId(storedId);
            }
        }

        // Nettoyage de l'URL d'aperçu lors du démontage du composant
        return () => {
            if (filePreviewUrl) {
                URL.revokeObjectURL(filePreviewUrl);
            }
        };
    }, []);

    // Mise à jour du fichier sélectionné
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Vérifier le type de fichier
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setMessage({ type: 'error', text: 'Type de fichier non autorisé. Veuillez télécharger un PDF ou une image.' });
                e.target.value = ''; // Réinitialiser l'input file
                return;
            }

            // Nettoyer l'URL précédente si elle existe
            if (filePreviewUrl) {
                URL.revokeObjectURL(filePreviewUrl);
            }

            setSelectedFile(file);
            setFileName(file.name);
            
            // Créer une URL pour prévisualiser le fichier
            const objectUrl = URL.createObjectURL(file);
            setFilePreviewUrl(objectUrl);
            
            console.log(`Fichier sélectionné: ${file.name} (${file.type})`);
        }
    };

    // Mise à jour des champs texte
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Mise à jour des dates
    const handleDateChange = (date, fieldName) => {
        setFormData({
            ...formData,
            [fieldName]: date
        });
    };
    
    // Fonction pour uploader le document (identique à ModiFacture)
    const uploadDocument = async (factureId) => {
        if (!selectedFile) {
            console.warn("Aucun fichier sélectionné pour l'upload");
            return false;
        }

        console.log(`Début de l'upload du document pour la facture ${factureId}`);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            console.log(`Envoi du fichier à l'URL: /api/factures/${factureId}/document/new`);
            const uploadResponse = await axiosInstance.post(
                `/api/factures/${factureId}/document/new`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log("Document uploadé avec succès:", uploadResponse.data);
            return true;
        } catch (error) {
            console.error("Erreur lors de l'upload du document:", error);
            console.error("Détails:", error.response?.data);
            setMessage({ 
                type: 'warning', 
                text: `Facture créée, mais problème avec le document: ${error.response?.data?.error || error.message}`
            });
            return false;
        }
    };

    // Ouvrir le document dans un nouvel onglet pour prévisualisation
    const previewDocument = () => {
        if (filePreviewUrl) {
            // Ouvrir dans un nouvel onglet
            window.open(filePreviewUrl, '_blank');
        }
    };

    // Soumission du formulaire
    const handleSubmit = async () => {
        // Vérification que le débiteur est sélectionné
        if (!debiteurId) {
            setMessage({ type: 'error', text: 'Veuillez sélectionner un débiteur avant de créer une facture' });
            return;
        }
    
        // Vérification des champs obligatoires
        if (!formData.num || !formData.creance) {
            setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' });
            return;
        }
        
        // Conversion des valeurs en nombres pour la comparaison
        const creanceValue = parseFloat(formData.creance);
        const recupereValue = parseFloat(formData.recupere || 0);
        
        // Vérification que le montant récupéré n'est pas supérieur à la créance
        if (recupereValue > creanceValue) {
            setMessage({ type: 'error', text: 'Le montant récupéré ne peut pas être supérieur au montant de la créance' });
            return;
        }
    
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });
    
        try {
            const factureData = {
                ...formData,
                societe_id: debiteurId,
                dateemission: formData.dateemission.toISOString().split('T')[0],
                dateecheance: formData.dateecheance.toISOString().split('T')[0],
                creance: creanceValue,
                recupere: recupereValue
            };
            
            console.log("Données de la facture à envoyer:", factureData);
    
            // Créer la facture
            const response = await axiosInstance.post('/api/factures', factureData);
            console.log("Réponse de la création de facture:", response.data);
    
            // Récupérer l'ID de la facture créée
            const factureId = response.data.facture.id;
            setCreatedFactureId(factureId);
    
            // Si un fichier est présent et que la création a réussi
            let uploadSuccess = true;
            if (selectedFile && factureId) {
                uploadSuccess = await uploadDocument(factureId);
            }
    
            if (uploadSuccess) {
                setMessage({ type: 'success', text: 'Facture et document créés avec succès!' });
            } else {
                setMessage({ type: 'warning', text: 'Facture créée, mais problème avec le document.' });
            }
    
            setTimeout(() => {
                router.push('/factures');
            }, 2000);
    
        } catch (error) {
            console.error('Erreur lors de la création de la facture:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la création de la facture';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsSubmitting(false);
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
                        Ajouter une facture
                        {/* {debiteurId && (
                            <span style={{ fontSize: '0.9em', marginLeft: '10px' }}>
                                (Débiteur ID: {debiteurId})
                            </span>
                        )} */}
                    </div>
                </div>

                {/* Messages d'erreur ou de succès */}
                {message.text && (
                    <div style={{
                        padding: '10px',
                        margin: '10px 0',
                        backgroundColor: message.type === 'error' ? '#ffdddd' : 
                                        message.type === 'warning' ? '#ffffdd' : '#ddffdd',
                        color: message.type === 'error' ? '#990000' : 
                               message.type === 'warning' ? '#999900' : '#009900',
                        borderRadius: '4px'
                    }}>
                        {message.text}
                    </div>
                )}

                <div className='addfacture_tab_container'>
                    <div className='container_scroll_doc'>

                        {/* Container pour l'importation de fichier */}
                        <div className='input_case_container' style={{ marginTop: '24px', width: '100%', height: '100px', marginBottom: '24px' }}>
                            <div>
                                <div className='input_title_container'>
                                    Factures - (<span style={{ textDecoration: 'underline' }}>Format : PDF</span>) :
                                </div>
                                <div 
                                    className='placeholder_file_container'
                                    onClick={fileName ? previewDocument : null}
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
                                <input
                                    id="fileUpload"
                                    type="file"
                                    style={{ display: 'none' }}
                                    accept="application/pdf, image/jpeg, image/png"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        {/* Container pour les champs de texte */}
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Numéro Facture *
                            </div>
                            <input
                                className='input_field'
                                name="num"
                                value={formData.num}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Montant créance *
                            </div>
                            <input
                                className='input_field'
                                name="creance"
                                value={formData.creance}
                                onChange={handleInputChange}
                                type="number"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Montant déjà récupéré
                            </div>
                            <input
                                className='input_field'
                                name="recupere"
                                value={formData.recupere}
                                onChange={handleInputChange}
                                type="number"
                                step="0.01"
                            />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Date d'émission Facture
                            </div>
                            <DatePicker
                                selected={formData.dateemission}
                                onChange={(date) => handleDateChange(date, 'dateemission')}
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>

                        <div className='input_case_container' style={{ marginTop: '12px' }}>
                            <div className='input_title_container'>
                                Date d'échéance Facture
                            </div>
                            <DatePicker
                                selected={formData.dateecheance}
                                onChange={(date) => handleDateChange(date, 'dateecheance')}
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>

                        <div className='bouton_save_container'>
                            <button
                                className='button_save'
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'ENVOI EN COURS...' : 'SAUVEGARDER'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MyLayout>
    );
}