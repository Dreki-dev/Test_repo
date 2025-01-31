import React, { useState, useEffect } from 'react';
import './../css/sharefeatures.css';

export default function LoadingPage() {
    const [isLoading, setIsLoading] = useState(true); // Contrôle de la page de chargement

    useEffect(() => {
        const textElement = document.getElementById('animated-text');
        if (textElement) {
            const textContent = textElement.textContent;
            textElement.innerHTML = '';

            textContent.split('').forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter;
                span.style.animationDelay = `${index * 0.15}s`; // Delay each letter
                span.classList.add('letter');
                textElement.appendChild(span);
            });
        }

        // Temporisation pour afficher la page de chargement
        const timer = setTimeout(() => {
            setIsLoading(false); // Cache la page de chargement après 15 secondes
        }, 15000);

        // Nettoyage du timer en cas de démontage du composant
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        // Page de chargement
        return (
            <div className="loading_container">
                <div className="image_mov_container">
                    <img src="/images/dreki_logo.png" alt="Logo" />
                </div>
                <div className="spin_mov_container">
                    <div className="spin"></div>
                </div>
                <div className="text_loading">
                    <p id="animated-text">Chargement ...</p>
                </div>
            </div>
        );
    }

    // Contenu principal (ou autre)
    return (
        <div className="main_content">
            <h1>Le contenu principal est prêt !</h1>
        </div>
    );
}
