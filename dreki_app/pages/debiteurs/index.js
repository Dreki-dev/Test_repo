import React, { useState, useRef } from 'react';
import DebiteurLayout from './layout';
import '../css/navbar.css'
import '../css/debiteurs.css'
import Link from 'next/link';

export default function Debiteur() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    const handleClick = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();

            // Mise à jour de la position de la modale en fonction des dimensions du bouton
            setModalPosition({
                top: rect.bottom + window.scrollY - 60, // Juste en dessous du bouton
                left: rect.left + window.scrollX - 140 // À gauche du bouton (ajustable selon la largeur de la modale)
            });

            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <DebiteurLayout>
            <div className='page_container_navbar'>
                <div className='title_params_container'>
                    <div className='title_params_text'>Débiteurs</div>
                </div>
                <div className='button_container_deb'>
                    <div className='button_add_deb'>
                        Ajouter un débiteur
                    </div>
                </div>
                <div className='debiteur_tab_container'>
                    <div className='fixed_input_case_container_deb'>
                        <div className='case_id_menu'> ID :</div>
                        <div className='case_name_menu'>Nom</div>
                        <div className='case_phone_menu'>Telephone</div>
                        <div className='case_action_menu'> Actions</div>
                    </div>
                    <div className='container_scroll_deb'>
                        <div className='input_case_container_deb'>
                            <div className='case_id_menu'>1</div>
                            <div className='case_name_menu'>Abitbol</div>
                            <div className='case_phone_menu'>0781582512</div>
                            <div className='case_action_menu_button_container'>
                                <div className='case_action_menu_button' onClick={handleClick} ref={buttonRef} >
                                    <div className='button_action_point'></div>
                                    <div className='button_action_point'></div>
                                    <div className='button_action_point'></div>
                                </div>
                            </div>
                        </div>
                        <div className='input_case_container_deb'>
                            <div className='case_id_menu'>2</div>
                            <div className='case_name_menu'>theo</div>
                            <div className='case_phone_menu'>077</div>
                            <div className='case_action_menu_button_container'>
                                <div className='case_action_menu_button'>
                                    <div className='button_action_point'></div>
                                    <div className='button_action_point'></div>
                                    <div className='button_action_point'></div>
                                </div>
                            </div>
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>
                        <div className='input_case_container_deb'>
                            hello
                        </div>

                    </div>
                </div>
                {isModalOpen && (
                    <div className='modal_back' onClick={closeModal}>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className='modal_content'
                            style={{ top: modalPosition.top, left: modalPosition.left, border: '1px solid #01208752' }}>
                            <Link href="/factures">
                                5 Factures
                            </Link>
                            <Link href="/factures">
                                modifier débiteur
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </DebiteurLayout >

    );
}


