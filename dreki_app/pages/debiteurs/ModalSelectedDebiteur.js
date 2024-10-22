import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ModalSelectedDebiteur({
    closeModal,
    selectedDebiteur,
    name,
    due
}) {
    return (
        <div className='modal_back' onClick={closeModal}>
            <div
                onClick={(e) => e.stopPropagation()}
                className='modal_content'
                style={{
                    border: '2px solid #01208752'
                }}>
                <div className='Title_modal_debiteur'>
                    Information du débiteur
                </div>
                <div className='Subtitle_modal_debiteur'>
                    <div style={{ width: '120px' }}>
                        Nom :
                    </div>
                    <div className='Subtitle_modal_debiteur_information'>{name}</div>
                </div>
                <div className='Subtitle_modal_debiteur'>
                    <div style={{ width: '120px' }}>
                        Téléphone :
                    </div>
                    <div className='Subtitle_modal_debiteur_information'>0781582512</div>
                </div>
                <div className='Subtitle_modal_debiteur'>
                    <div style={{ width: '120px' }}>
                        Montant due :
                    </div>
                    <div className='Subtitle_modal_debiteur_information'>{due} $</div>
                </div>
                <div className='Title_modal_debiteur'>
                    Action
                </div>
                <Link
                    href={{ pathname: '/factures', query: { debiteur: name } }}
                    className='Link_modif_modal_debiteur'>
                    Voir les Factures
                </Link>
                <Link
                    href={{ pathname: '/mod_debiteurs', query: { debiteur: name } }}
                    className='Link_modif_modal_debiteur'>
                    modifier le débiteur
                </Link>
            </div>
        </div>
    );
}
