import axiosInstance from '../../src/app/config/axios';
import React, { useState, useEffect } from 'react';

export default function ModalMenuDeroulant({
    handleSelectChoiceDeroulantMenu,
    left,
    top,
}) {
    const [debiteurs, setDebiteurs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Récupération des débiteurs quand le composant est monté
        const loadDebiteurs = async () => {
            setLoading(true);
            try {
                const result = await fetchDebiteurs();
                console.log('Débiteurs chargés:', result);
                setDebiteurs(result);
            } catch (error) {
                console.error('Erreur lors du chargement des débiteurs:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDebiteurs();
    }, []);

    const fetchDebiteurs = async () => {
        try {
            const response = await axiosInstance.get('/api/societes', {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            
            // Vérifiez dans la console ce que vous recevez
            console.log('Données reçues:', response.data);
            
            // S'assurer que les sociétés sont bien extraites
            if (response.data && response.data.societes) {
                return response.data.societes;
            } else {
                console.error('Format de réponse inattendu:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Erreur:', error);
            return [];
        }
    };

    // Fonction pour gérer la sélection d'un débiteur
    const handleDebiteurSelect = (debiteur) => {
        // Appelle la fonction du parent avec l'id comme valeur
        handleSelectChoiceDeroulantMenu({
            id: debiteur.id,
            nom: debiteur.raisonsociale
        });
    };

    return (
        <div style={{ width: '55%' }}>
            <div className='dropdown_menu' style={{
                border: '1px solid #ccc',
                padding: '10px',
                backgroundColor: 'white',
                position: 'absolute',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                width: '45%',
                top: top,
                left: left,
                height: '15%',
                overflowY: 'scroll',
            }}>
                {loading ? (
                    <div>Chargement...</div>
                ) : (
                    debiteurs.length > 0 ? (
                        debiteurs.map((debiteur, index) => (
                            <div
                                key={debiteur.id || index}
                                onClick={() => handleDebiteurSelect(debiteur)}
                                style={{ padding: '5px', cursor: 'pointer' }}
                            >
                                {debiteur.raisonsociale} {/* D'après votre réponse API */}
                            </div>
                        ))
                    ) : (
                        <div>Aucun débiteur disponible</div>
                    )
                )}
            </div>
        </div>
    );
}