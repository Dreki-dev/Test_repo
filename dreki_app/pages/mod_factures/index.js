import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import MyLayout from '../Layout/layout';

import '../css/sharefeatures.css';
import '../css/addfacture.css';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ModiFacture() {
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const [facturesAvecDragon, setFacturesAvecDragon] = useState([
        {
            name: 'Theo Dupont',
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

    const [facture, setFacture] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());

    const router = useRouter();

    useEffect(() => {
        const { id } = router.query; 
        if (id) {
            const selectedFacture = facturesAvecDragon.find(f => f.id === id);
            if (selectedFacture) {
                setFacture(selectedFacture);
                
                const emissionDate = new Date(selectedFacture.dateEmission.split('/').reverse().join('-'));
                const echeanceDate = new Date(selectedFacture.dateEcheance.split('/').reverse().join('-'));

                if (!isNaN(emissionDate.getTime())) {
                    setStartDate(emissionDate);
                } else {
                    console.error("Date d'émission invalide :", selectedFacture.dateEmission);
                }

                if (!isNaN(echeanceDate.getTime())) {
                    setDueDate(echeanceDate);
                } else {
                    console.error("Date d'échéance invalide :", selectedFacture.dateEcheance);
                }
            }
        }
    }, [router.query]); 

    
    if (!facture) {
        return <div>Chargement...</div>;
    }
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
                    <div className='title_params_text'>Modifier une facture</div>
                </div>
                <div className='addfacture_tab_container'>
                    <div className='container_scroll_doc'>

                        {/*Container pour l'importation de file */}
                        <div className='input_case_container' style={{ marginTop: '24px', width: '100%' }}>
                            <div>
                                <div className='input_title_container'>
                                    Factures - (<span style={{ textDecoration: 'underline' }}>Format : PDF</span>) :
                                </div>
                                <div className='placeholder_file_container'>
                                    {fileName ? fileName : 'Aucun fichier sélectionné'}
                                </div>
                                <label htmlFor="fileUpload" className='button_add_file'>
                                    choisir un fichier
                                </label>
                                <input id="fileUpload" type="file" style={{ display: 'none' }} accept="image/*, application/pdf" onChange={handleFileChange} />
                            </div>
                        </div>

                        {/*Container pour les champs de texte */}
                        <div className='input_case_container'>
                            <div className='input_title_container'>Numéro Facture</div>
                            <input className='input_field' defaultValue={facture.numero} />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>Numéro créance</div>
                            <input className='input_field' defaultValue={facture.aRecuperer} />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>Numéro déjà récupéré</div>
                            <input className='input_field' defaultValue={facture.total} />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>Date d'émission Facture</div>
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>

                        <div className='input_case_container' style={{ marginTop: '12px' }}>
                            <div className='input_title_container'>Date d'échéance Facture</div>
                            <DatePicker selected={dueDate} onChange={(date) => setDueDate(date)} />
                        </div>

                        <div className='bouton_save_container'>
                            <div className='button_save'>SAUVEGARDER</div>
                        </div>
                    </div>
                </div>
            </div>
        </MyLayout>
    );
}
