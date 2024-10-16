import { useRouter } from 'next/router';
import ObjetLayout from './layout'
import '../css/objet.css'
import '../css/navbar.css'
import '../css/sharefeatures.css'
import React, { useState } from 'react';
import Link from 'next/link';

export default function ObjetDetail() {
    const router = useRouter();
    const { id } = router.query;

    const objet = {
        id: id,
        numero: '999999',
        aRecuperer: 245,
        total: 312,
        name: 'theo',
        dateEmission: '12/05/2000',
        dateEcheance: '23/08/2025',
        heure: '18h35',
        derniereNote: 'blablablabla bla blabla blablabla...'
    };



    const NoteCase = ({ name, dateEmission, heure, text }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const maxTextLength = 150;
        const truncatedText = text.length > maxTextLength
            ? text.substring(0, maxTextLength) + '...'
            : text;


        const toggleText = () => {
            setIsExpanded(!isExpanded);
        };

        return (
            <div className={`notecase_container ${isExpanded ? 'expanded' : ''} ${text.length > maxTextLength ? 'has-button' : ''}`}>
                <div className='notecase_title_container'>
                    <div className='title_var'>
                        {name}
                    </div>
                    <div className='title_var'>
                        {dateEmission}
                    </div>
                    <div className='title_var'>
                        {heure}
                    </div>
                </div>
                <div className={`text_container ${isExpanded ? 'expanded' : ''}`}>
                    {isExpanded ? text : truncatedText}
                </div>
                {text.length > maxTextLength && (
                    <div className='button_voirplus_container'>
                        <button className='button_voirplus' onClick={toggleText}>
                            {isExpanded ? 'Voir moins' : 'Voir plus'}
                        </button>
                    </div>
                )}
            </div>
        );
    };


    return (
        <ObjetLayout>
            <div className='page_container_navbar'>
                <div className='return_arrow'>
                    <Link className='arrow_container' href='/factures'>
                        <div className='arrow_end'></div>
                        <div className='arrow_beg'></div>
                    </Link>
                </div>
                <div className='title_params_container' style={{ marginBottom: '0', height: 'auto' }}>
                    <div className='title_params_text'>Notes</div>
                </div>
                <div className='title_params_container' style={{ marginTop: '0', height: 'auto' }}>
                    <div className='title_params_text' style={{ fontSize: '22px', marginTop: '0' }}>Débiteur : <div style={{ fontStyle: 'italic', color: '#012087b9' }}> Theo</div></div>
                </div>
                <div className='title_params_container' style={{ marginTop: '0', height: 'auto' }}>
                    <div className='title_params_text' style={{ fontSize: '22px', marginTop: '0' }}>Facture n°<div style={{ fontStyle: 'italic', color: '#012087b9' }}> 1999</div></div>
                </div>
                <div className='facture_obj_container'>
                    <NoteCase name='theo' dateEmission='17/05/2023' heure='18h36' text='Blablabla bla bla blabla bla blavlabla..' />
                    <NoteCase name='theo' dateEmission='17/05/2023' heure='18h36' text='Blablabla bla bla blabla bla blavlabla..' />
                    <NoteCase name='theo' dateEmission='17/05/2023' heure='18h36' text='Blablabla bla bla blabla bla blavlabla..' />
                    <NoteCase name='theo' dateEmission='17/05/2023' heure='18h36' text='Blablabla bla bla blabla bla blavlabla..' />
                    <NoteCase name='theo' dateEmission='17/05/2023' heure='18h36' text='Blablabla bla bla blabla bla blavlabla..' />
                    <NoteCase name='theo' dateEmission='17/05/2023' heure='18h36' text='Blablabla bla bla blabla bla blavlabla..' />
                    <NoteCase name='theo' dateEmission='17/05/2023' heure='18h36' text='BlablabBlablaBlablabla Blablabla Blablabla Blablabla Blablabla Blablabla Blablabla Blablabla Blablabla Blablabla Blablabla bla bla bla blabla bla blavlablala bla bla blabla bla blavlablaBlablabla bla bla blabla bla blavlablaBlablabla bla bla blabla bla blavlablaBlablabla bla bla blabla bla blavlablaBlablabla bla bla blabla bla blavlabla..theo' />
                    <NoteCase name='theo' dateEmission='17/05/2023' heure='18h36' text='Blablabla bla bla blabla bla blavlabla..' />
                </div>

            </div>
        </ObjetLayout>
    );
}
