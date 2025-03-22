import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ModalSelectedDebiteur({
    id,
    closeModal,
    selectedDebiteur,
    email,
    name,
    due
}) {
    const [showCopyNotification, setShowCopyNotification] = useState(false);
    const [notificationText, setNotificationText] = useState('');
    const [notificationPosition, setNotificationPosition] = useState({ top: 0, left: 0 });
    
    // Référence aux éléments pour obtenir leurs positions
    const telRef = useRef(null);
    const emailRef = useRef(null);
    
    // Référence de minuterie pour le clic long
    const timerRef = useRef(null);
    
    // Fonction pour gérer le clic long et copier le texte
    const handleLongPress = (text, type, elementRef) => {
        // Démarrer un minuteur lorsque le clic commence
        timerRef.current = setTimeout(() => {
            // Copier le texte dans le presse-papier
            navigator.clipboard.writeText(text)
                .then(() => {
                    // Vérifier que la référence à l'élément existe
                    if (elementRef && elementRef.current) {
                        // Obtenir la position de l'élément
                        const rect = elementRef.current.getBoundingClientRect();
                        
                        // Définir la position de la notification
                        setNotificationPosition({
                            top: rect.top - 30, // 30px au-dessus de l'élément
                            left: rect.left + (rect.width / 2) // Centré horizontalement
                        });
                        
                        // Définir le texte de la notification
                        setNotificationText(`${type} copié !`);
                        
                        // Afficher la notification
                        setShowCopyNotification(true);
                        
                        // Masquer la notification après 2 secondes
                        setTimeout(() => {
                            setShowCopyNotification(false);
                        }, 2000);
                    }
                })
                .catch(err => {
                    console.error('Impossible de copier le texte: ', err);
                });
        }, 800); // 800ms pour considérer comme un clic long
    };
    
    // Annuler le minuteur si le clic est relâché avant la durée du clic long
    const handleTouchEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };
    
    // Annuler tous les minuteurs lors du démontage du composant
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <div className='modal_back' onClick={closeModal}>
            <div
                onClick={(e) => e.stopPropagation()}
                className='modal_content_deb'
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
                    <div 
                        ref={telRef}
                        className='Subtitle_modal_debiteur_information'
                        onMouseDown={() => handleLongPress('0781582512', 'Téléphone', telRef)}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}
                        onTouchStart={() => handleLongPress('0781582512', 'Téléphone', telRef)}
                        onTouchEnd={handleTouchEnd}
                        style={{ cursor: 'copy' }}
                    >
                        0781582512
                    </div>
                </div>
                <div className='Subtitle_modal_debiteur'>
                    <div style={{ width: '120px' }}>
                        email :
                    </div>
                    <div 
                        ref={emailRef}
                        className='Subtitle_modal_debiteur_information'
                        onMouseDown={() => handleLongPress(email, 'Email', emailRef)}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}
                        onTouchStart={() => handleLongPress(email, 'Email', emailRef)}
                        onTouchEnd={handleTouchEnd}
                        style={{ cursor: 'copy' }}
                    >
                        {email}
                    </div>
                </div>
                <div className='Subtitle_modal_debiteur'>
                    <div style={{ width: '120px' }}>
                        Montant due :
                    </div>
                    <div className='Subtitle_modal_debiteur_information'>{due}</div>
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
                    href={{ pathname: '/mod_debiteurs', query: { debiteur: id } }}
                    className='Link_modif_modal_debiteur'>
                    modifier le débiteur
                </Link>
                
                {/* Notification de copie */}
                {showCopyNotification && (
                    <div 
                        style={{
                            position: 'fixed',
                            top: `${notificationPosition.top}px`,
                            left: `${notificationPosition.left}px`,
                            transform: 'translateX(-50%)',
                            backgroundColor: '#333',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            zIndex: 9999,
                            pointerEvents: 'none'
                        }}
                    >
                        {notificationText}
                    </div>
                )}
            </div>
        </div>
    );
}