import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AddDebiteurLayout from './layout';

export default function ModiDebiteur() {
    const router = useRouter();
    const { debiteur: debiteurFromUrl } = router.query;

    const [debiteurs, setDebiteurs] = useState([
        {
            name: 'Theo Dupont',
            id: '1',
            backColor: 'rgba(255, 166, 0, 0.085)',
            textColor: 'rgb(255, 166, 0)',
            textPaie: 'Paiement partiel',
            due: '544788',
            raisonSociale: 'Bijoutier',
            siren: '362 521 879 00034',
            adresse: '56 rue de Lavaud',
            codePostal: '33000',
            ville: 'Bordeaux',
            telephone: '07 81 58 25 12',
            email: 'theo.dupont@gmail.com',
            type: 'Particulier'
        },
        {
            name: 'Jean Martin',
            id: '2',
            backColor: 'rgba(255, 166, 0, 0.085)',
            textColor: 'rgb(255, 166, 0)',
            textPaie: 'Paiement partiel',
            due: '1444',
            raisonSociale: 'Électricien',
            siren: '789 654 123 00029',
            adresse: '12 rue des Fleurs',
            codePostal: '75008',
            ville: 'Paris',
            telephone: '06 72 45 78 96',
            email: 'jean.martin@yahoo.fr',
            type: 'Entreprise'
        },
        {
            name: 'Marie Lefevre',
            id: '3',
            backColor: 'rgba(255, 166, 0, 0.085)',
            textColor: 'rgb(255, 166, 0)',
            textPaie: 'Paiement partiel',
            due: '188775',
            raisonSociale: 'Artisane',
            siren: '963 258 741 00022',
            adresse: '34 avenue des Champs',
            codePostal: '69007',
            ville: 'Lyon',
            telephone: '07 82 56 34 22',
            email: 'marie.lefevre@outlook.fr',
            type: 'Entreprise'
        },
        {
            name: 'Emma Moreau',
            id: '4',
            backColor: 'rgba(255, 0, 0, 0.085)',
            textColor: 'rgba(255, 0, 0, 1)',
            textPaie: 'Paiement inexistant',
            due: '1475',
            raisonSociale: 'Restauratrice',
            siren: '123 456 789 00011',
            adresse: '5 boulevard Saint-Germain',
            codePostal: '75005',
            ville: 'Paris',
            telephone: '07 91 34 45 67',
            email: 'emma.moreau@hotmail.fr',
            type: 'Entreprise'
        },
        {
            name: 'Lucas Girard',
            id: '5',
            backColor: 'rgba(16, 137, 16, 0.085)',
            textColor: 'rgba(16, 137, 16, 1)',
            textPaie: 'Paiement complet',
            due: '753',
            raisonSociale: 'Architecte',
            siren: '456 789 123 00058',
            adresse: '23 rue du Général',
            codePostal: '34000',
            ville: 'Montpellier',
            telephone: '06 89 12 34 56',
            email: 'lucas.girard@wanadoo.fr',
            type: 'Particulier'
        }
    ]);


    const [selectedDebiteur, setSelectedDebiteur] = useState(null);

    const [raisonSociale, setRaisonSociale] = useState("");
    const [siren, setSiren] = useState("");
    const [nomContact, setNomContact] = useState("");
    const [adresse, setAdresse] = useState("");
    const [codePostal, setCodePostal] = useState("");
    const [ville, setVille] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        if (debiteurFromUrl) {
            const foundDebiteur = debiteurs.find(
                (deb) => deb.name === debiteurFromUrl || deb.id === debiteurFromUrl
            );
            if (foundDebiteur) {
                setSelectedDebiteur(foundDebiteur);
                setRaisonSociale(foundDebiteur.raisonSociale);
                setSiren(foundDebiteur.id);
                setNomContact(foundDebiteur.name);
                setAdresse(foundDebiteur.adresse);
                setCodePostal(foundDebiteur.codePostal);
                setVille(foundDebiteur.ville);
                setTelephone(foundDebiteur.telephone);
                setEmail(foundDebiteur.email);
                setType(foundDebiteur.type);
            }
        }
    }, [debiteurFromUrl, debiteurs]);

    const handleSave = () => {
        if (selectedDebiteur) {
            const updatedDebiteurs = debiteurs.map((deb) => {
                if (deb.id === selectedDebiteur.id) {
                    return {
                        ...deb,
                        name: raisonSociale,
                        id: siren,
                    };
                }
                return deb;
            });
            setDebiteurs(updatedDebiteurs);
            console.log("Debiteur modifié :", updatedDebiteurs);
            router.push('/debiteurs');
        }
    };

    if (!selectedDebiteur) {
        return <div>Chargement...</div>;
    }

    return (
        <AddDebiteurLayout>
            <div className='page_container_navbar'>
                <div className='title_params_container'>
                    <div className='title_params_text'>Modification débiteur</div>
                </div>

                <div className='debiteur_tab_container'>
                    <div className='preventif_text_container'>
                        Attention ! Les champs marqué d'un '*' ne seront pas modifiables dans l'avenir.
                    </div>

                    <div className='input_case_container'>
                        <div className='input_title_container'>*Type :</div>
                        <input
                            readOnly
                            className='input_field'
                            value={type}
                            style={{ backgroundColor: '#d2d5d7' }}
                            disabled
                        />
                    </div>

                    {selectedDebiteur?.type === 'Entreprise' && (
                        <>
                            <div className='input_case_container'>
                                <div className='input_title_container'>Raison Sociale</div>
                                <input
                                    className='input_field'
                                    value={raisonSociale}
                                    onChange={(e) => setRaisonSociale(e.target.value)}
                                />
                            </div>

                            <div className='input_case_container'>
                                <div className='input_title_container'>*SIREN</div>
                                <input
                                    className='input_field'
                                    value={siren}
                                    style={{ backgroundColor: '#d2d5d7' }}
                                    disabled
                                />
                            </div>
                        </>
                    )}

                    <div className='input_case_container'>
                        <div className='input_title_container'>Nom du contact</div>
                        <input
                            className='input_field'
                            value={nomContact}
                            onChange={(e) => setNomContact(e.target.value)}
                        />
                    </div>

                    <div className='input_case_container'>
                        <div className='input_title_container'>Adresse</div>
                        <input
                            className='input_field'
                            value={adresse}
                            onChange={(e) => setAdresse(e.target.value)}
                        />
                    </div>

                    <div className='input_case_container'>
                        <div className='input_title_container'>Code Postal</div>
                        <input
                            className='input_field'
                            value={codePostal}
                            onChange={(e) => setCodePostal(e.target.value)}
                        />
                    </div>

                    <div className='input_case_container'>
                        <div className='input_title_container'>Ville</div>
                        <input
                            className='input_field'
                            value={ville}
                            onChange={(e) => setVille(e.target.value)}
                        />
                    </div>

                    <div className='input_case_container'>
                        <div className='input_title_container'>Téléphone</div>
                        <input
                            className='input_field'
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                        />
                    </div>

                    <div className='input_case_container'>
                        <div className='input_title_container'>Email</div>
                        <input
                            className='input_field'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='bouton_save_container'>
                        <div className='button_save' onClick={handleSave}>SAUVEGARDER</div>
                    </div>
                </div>
            </div>
        </AddDebiteurLayout>
    );
}
