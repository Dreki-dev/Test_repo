import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
export default function ModalViewDebiteur({
    closeDebiteurModal,
    textDeroulantMenu,
    handleClickDeroulant,
    handleBlur,
    handleInputChange,
    selectedDebiteurId

}) {
    const router = useRouter();

    const naviguerVersFactures = () => {
        // Stocker l'ID dans sessionStorage avant la navigation
        if (selectedDebiteurId) {
            sessionStorage.setItem('selectedDebiteurId', selectedDebiteurId);
        }

        // Naviguer sans paramètres dans l'URL
        router.push('./add_factures');
    };
    
    // Vérifier si un débiteur est sélectionné
    const isDebiteurSelected = !!selectedDebiteurId;
    
    return (
        <div className='modal_back' onClick={closeDebiteurModal} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div
                onClick={(e) => e.stopPropagation()}
                className='modal_content_fac'
                style={{
                    border: '2px solid #01208752',
                    height: '25%',
                    justifyContent: 'normal'
                }}>
                <div className='title_modal_choice_debiteur_container'>
                    <div className='title_modal_choice_debiteur'>
                        Choix du débiteur
                    </div>
                </div>
                <div className='input_case_container_modal_deb' style={{ marginTop: '24px' }}>
                    <div className='input_title_container' >
                        Débiteur
                    </div>
                    <input
                        className='input_field'
                        value={textDeroulantMenu}
                        onClick={handleClickDeroulant}
                        style={{ backgroundColor: '#d2d5d7' }}
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                    />

                </div>
                <div className='bouton_save_container_fac'>
                    <Link className='button_save' href={'./debiteurs?section=ajouterDeb'} style={{ paddingLeft: '4px', paddingRight: '4px', height: '35px' }}>AJOUTER DEBITEUR</Link>
                    <button
                        className='button_save'
                        onClick={naviguerVersFactures}
                        style={{ 
                            paddingLeft: '4px', 
                            paddingRight: '4px', 
                            height: '35px',
                            opacity: isDebiteurSelected ? '1' : '0.5', 
                            cursor: isDebiteurSelected ? 'pointer' : 'not-allowed' 
                        }}
                        disabled={!isDebiteurSelected}
                    >
                        SAUVEGARDER
                    </button>
                </div>
            </div>
        </div>
    );
}