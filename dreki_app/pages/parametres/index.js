import { useState } from 'react';
import ParametreLayout from './layout';
import '../css/navbar.css';
import '../css/params.css';

export default function Parametre() {
    const [activeSection, setActiveSection] = useState('');
    const [docButtonClicked, setDocButtonClicked] = useState(false);
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState("")
    const sections = ['RIB', 'Complément', 'Kbis', 'Carte Recto', 'Carte Verso', 'CGV'];
    const [fileNames, setFileNames] = useState(Array(sections.length).fill(''));
    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const newFileNames = [...fileNames];
            newFileNames[index] = file.name;
            setFileNames(newFileNames);
        }
    };

    return (
        <ParametreLayout>
            <div className='page_container_navbar'>
                <div className='title_params_container'>
                    <div className='title_params_text'>Paramètres</div>
                </div>

                <div className='button_container_params'>
                    <div className='button_mdp' onClick={() => setActiveSection('modifierMDP')}>
                        Modifier MDP
                    </div>

                    {!docButtonClicked ? (
                        <div className='button_doc' onClick={() => {
                            setActiveSection('ajouterDoc');
                            setDocButtonClicked(true);
                        }}>
                            Ajouter ou modifier<br />un document
                        </div>
                    ) : (
                        <div className='button_default' onClick={() => {
                            setActiveSection('');
                            setDocButtonClicked(false);
                        }}>
                            Ajouter ou modifier<br />vos informations
                        </div>
                    )}
                </div>

                <div className='part_change_params'>
                    {activeSection === 'modifierMDP' && (
                        <>
                            <div className='input_case_container' style={{ marginTop: '24px' }}>
                                <div className='input_title_container' >
                                    Mot de passe
                                </div>
                                <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                            </div>
                            <div className='bouton_save_container'>
                                <div className='button_save'>Modifier</div>
                            </div>
                        </>
                    )}

                    {activeSection === 'ajouterDoc' && (
                        <div className='container_scroll_doc'>
                            {sections.map((section, index) => (
                                <div className='input_case_container_file' key={index} style={{ marginTop: '24px', width: '100%' }}>
                                    <div>
                                        <div className='input_title_container'>
                                            {section} - (<span style={{ textDecoration: 'underline' }}>Format : PDF</span>) :
                                        </div>
                                        <div className='placeholder_file_container'>
                                            {fileNames[index] ? fileNames[index] : 'Aucun fichier sélectionné'}
                                        </div>

                                        <label htmlFor={`fileUpload${index}`} className='button_add_file'>
                                            choisir un fichier
                                        </label>

                                        <input
                                            id={`fileUpload${index}`}
                                            type="file"
                                            style={{ display: 'none' }}
                                            accept="image/*, application/pdf"
                                            onChange={(e) => handleFileChange(e, index)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === '' && (
                        <>
                            <div className='input_case_container' style={{ marginTop: '24px' }}>
                                <div className='input_title_container' >
                                    Nom Entreprise
                                </div>
                                <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                            </div>
                            <div className='input_case_container'>
                                <div className='input_title_container'>
                                    Nom du contact
                                </div>
                                <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                            </div>
                            <div className='input_case_container'>
                                <div className='input_title_container'>
                                    Votre adresse
                                </div>
                                <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                            </div>
                            <div className='input_case_container'>
                                <div className='input_title_container'>
                                    Votre code postal
                                </div>
                                <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                            </div>
                            <div className='input_case_container'>
                                <div className='input_title_container'>
                                    Votre Ville
                                </div>
                                <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                            </div>
                            <div className='input_case_container'>
                                <div className='input_title_container'>
                                    Votre siren
                                </div>
                                <input className='input_field' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                            </div>
                            <div className='bouton_save_container'>
                                <div className='button_save'>SAVE</div>
                            </div>
                        </>

                    )}
                    
                </div>
            </div>
        </ParametreLayout>
    );
}
