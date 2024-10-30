import React, { useState } from 'react';

export default function ModalDragon({
    closeDragonModal,
    toggleDropdown,
    isOpen,
    blue_dragon,
    red_dragon,
    white_dragon,
}) {
    // État pour stocker l'option sélectionnée (texte et dragon)
    const [selectedChoice, setSelectedChoice] = useState({
        text: 'Relance amiable',  // Texte par défaut
        dragon: white_dragon,     // Dragon par défaut (white_dragon)
    });

    // Fonction pour gérer le clic sur une option et mettre à jour la sélection
    const handleSelectChoice = (choiceText, choiceDragon) => {
        setSelectedChoice({ text: choiceText, dragon: choiceDragon }); // Met à jour l'état avec le texte et le dragon choisis
    };

    return (
        <div className='modal_back' onClick={closeDragonModal} style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
            <div
                onClick={(e) => e.stopPropagation()}
                className='modal_content_fac'
                style={{ border: '2px solid #01208752' }}
            >
                <div className='warning_message_container'>
                    <div className='warning_image_up'></div>
                    <div className='warning_image_down'></div>
                </div>
                <div className='warning_message_text_container'>
                    <div className='warning_message_text'>
                        OOOPPS bla bla blablabla blablab...
                    </div>
                </div>

                <div className='choice_dragon_menu_container' onClick={toggleDropdown}>
                    {/* Section qui affiche le choix sélectionné */}
                    <div className='dropdown_menu_choice_container'>
                        {/* Image du dragon sélectionné */}
                        <img src={selectedChoice.dragon} alt="dragon image" className='dragon_logo' />
                        {/* Texte sélectionné */}
                        <div>{selectedChoice.text} {isOpen ? '▲' : '▼'}</div>
                    </div>

                    {/* Menu déroulant */}
                    <div className={`dropdown_menu ${isOpen ? 'show' : 'hide'}`}>
                        <div className='dropdown_menu_choice' style={{ marginTop: '12px' }} onClick={() => handleSelectChoice('Relance amiable', white_dragon)}>
                            <div className='dropdown_menu_choice_container'>
                                <img src={white_dragon} alt="dragon image" className='dragon_logo' />
                                <div>Relance amiable</div>
                            </div>
                        </div>

                        <div className='dropdown_menu_choice' onClick={() => handleSelectChoice('Relance contentieux', blue_dragon)}>
                            <div className='dropdown_menu_choice_container'>
                                <img src={blue_dragon} alt="dragon image" className='dragon_logo' />
                                <div>Relance contentieux</div>
                            </div>
                        </div>

                        <div className='dropdown_menu_choice' onClick={() => handleSelectChoice('Relance judiciaire', red_dragon)}>
                            <div className='dropdown_menu_choice_container'>
                                <img src={red_dragon} alt="dragon image" className='dragon_logo' />
                                <div>Relance judiciaire</div>
                            </div>
                        </div>

                        <div className='dropdown_menu_choice' onClick={() => handleSelectChoice('Réussi', white_dragon)}>
                            <div className='dropdown_menu_choice_container'>
                                <img src={white_dragon} alt="dragon image" className='dragon_logo' />
                                <div>Réussi</div>
                            </div>
                        </div>

                        <div className='dropdown_menu_choice' onClick={closeDragonModal}>
                            <div className='dropdown_menu_choice_container'>
                                <div className='cross_container_modal_facture_no_fix'>
                                    <div className='cross_icon' style={{ transform: 'rotate(45deg)' }} />
                                    <div className='cross_icon' style={{ transform: 'rotate(135deg)' }} />
                                </div>
                                <div>Annuler</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bouton sauvegarder */}
                <div className='button_container_mod_fac'>
                    <div className='button_fac' onClick={closeDragonModal}>SAUVEGARDER</div>
                </div>
            </div>
        </div>
    );
}
