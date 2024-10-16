import React, { useState, useRef } from 'react';
import FacturesLayout from './layout';
import '../css/sharefeatures.css'
import '../css/navbar.css'
import '../css/addfacture.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Link from 'next/link';


export default function AddFacture() {
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };
    const [startDate, setStartDate] = useState(new Date());


    return (
        <FacturesLayout>
            <div className='page_container_navbar'>
                <div className='return_arrow' style={{height: '5%'}}>
                    <Link className='arrow_container' href='/factures'>
                        <div className='arrow_end'></div>
                        <div className='arrow_beg'></div>
                    </Link>
                </div>
                <div className='title_params_container'>
                    <div className='title_params_text'>Ajouter une facture</div>
                </div>
                <div className='addfacture_tab_container'>
                    <div className='container_scroll_doc'>
                        <div className='input_case_container_file' style={{ marginTop: '24px', width: '100%' }}>
                            <div >
                                <div className='input_title_container'>
                                    Factures - (<span style={{ textDecoration: 'underline' }}>Format : PDF</span>) :
                                </div>

                                <div className='placeholder_file_container'>
                                    {fileName ? fileName : 'Aucun fichier sélectionné'}
                                </div>

                                <label htmlFor="fileUpload" className='button_add_file'>
                                    choisir un fichier
                                </label>

                                <input
                                    id="fileUpload"
                                    type="file"
                                    style={{ display: 'none' }}
                                    accept="image/*, application/pdf"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Numéro Facture
                            </div>
                            <input className='input_field' />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Numéro créance
                            </div>
                            <input className='input_field' />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Numéro déjà récupéré
                            </div>
                            <input className='input_field' />
                        </div>
                        <div className='input_case_container'>
                            <div className='input_title_container'>
                                Date d'émission Facture
                            </div>
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>

                        <div className='input_case_container' style={{ marginTop: '12px' }}>
                            <div className='input_title_container'>

                                Date d'échéance Facture
                            </div>
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />

                        </div>

                        <div className='bouton_save_container'>
                            <div className='button_save'>SAUVEGARDER</div>
                        </div>
                    </div>
                </div>

            </div>
        </FacturesLayout >

    );
}