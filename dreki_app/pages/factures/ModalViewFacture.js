import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ModalViewFacture({
    closeModal,
    selectedFacture,
    openDragonModal,
    blue_dragon,
    id,
    dateEmission,
    dateEcheance,
    aRecuperer,
    total
}) {
    return (
        <div className='modal_back' onClick={closeModal}>
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
                <div className='euro_line_modal_facture'>
                    $ a recuper :
                    <div className='euro_container_line_modal_facture'>
                        <div className='percent_bar_euro_container_line_modal_facture' style={{ width: '75%' }}>
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
                    Derniere note :
                    <div className='note_container_line_modal_facture'>
                        <div className='part_note_container_line_modal_facture' style={{ width: '80%' }}>
                            blablablabla bla blabla blablabla...
                        </div>
                        <div className='separator_note_container_line_modal_facture'> </div>

                        <div className='button_note_container_line_modal_facture' style={{ width: '20%' }}>
                            <Link href={`/objet/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                <div className='button_line_modal_facture'>
                    <Link className='button_modal_facture_note' href={{ pathname: `/objet/${id}`, query: { showModal: true } }}
                    >
                        Ajouter note
                    </Link>
                    <Link className='button_modal_facture_edit' href={`/mod_factures?id=${id}`}>
                        Modifier
                    </Link>
                </div>
            </div>
        </div>
    );
}
