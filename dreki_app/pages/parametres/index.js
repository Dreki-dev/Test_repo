import { useState } from 'react';
import MyLayout from '../Layout/layout';
import '../css/sharefeatures.css';
import '../css/params.css';

export default function Parametre() {
    const [activeSection, setActiveSection] = useState('');
    const [editing, setEditing] = useState(false);
    const [textFields, setTextFields] = useState({
        entreprise: '',
        contact: '',
        adresse: '',
        codePostal: '',
        ville: '',
        siren: '',
        email: '',
        motDePasse: '',
    });
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

    const handleTextChange = (e, fieldName) => {
        setTextFields({ ...textFields, [fieldName]: e.target.value });
    };

    return (
        <MyLayout>
            <div className='page_container_navbar'>
                <div className='title_params_container'>
                    <div className='title_params_text'>Mes informations</div>
                </div>

                <div className='button_container_params'>
                    <div
                        className={`button_doc ${activeSection === 'ajouterDoc' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveSection('ajouterDoc');
                            setEditing(false);
                        }}
                    >
                        Ajouter ou modifier<br />un document
                    </div>
                    <div
                        className={`button_default ${activeSection === '' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveSection('');
                            setEditing(false);
                        }}
                    >
                        Ajouter ou modifier<br />vos informations
                    </div>
                </div>

                <div className='part_change_params'>
                    {activeSection === 'modifierMDP' && (
                        <>
                            <div className='input_case_container' style={{ marginTop: '24px' }}>
                                <div className='input_title_container'>Mot de passe</div>
                                <input className='input_field' value={textFields.motDePasse} onChange={(e) => handleTextChange(e, 'motDePasse')} onClick={() => setEditing(true)} />
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

                                        <input id={`fileUpload${index}`} type="file" style={{ display: 'none' }} accept="image/*, application/pdf" onChange={(e) => handleFileChange(e, index)}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === '' && (
                        <>
                            {Object.keys(textFields).map((fieldName) => (
                                fieldName !== 'motDePasse' && (
                                    <div className='input_case_container' key={fieldName} style={{ marginTop: '24px' }}>
                                        <div className='input_title_container'>
                                            {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                                        </div>
                                        <input className='input_field' value={textFields[fieldName]} onChange={(e) => handleTextChange(e, fieldName)} onClick={() => setEditing(true)}/>
                                    </div>
                                )
                            ))}
                            <div className='bouton_save_container'>
                                <div className='button_mdp' onClick={() => {
                                    setActiveSection('modifierMDP');
                                    setEditing(false);
                                }}>
                                    Modifier MDP
                                </div>
                                <div className='button_save'>SAVE</div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MyLayout>
    );
}
