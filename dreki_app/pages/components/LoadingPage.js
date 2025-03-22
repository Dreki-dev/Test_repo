import React, { useState, useEffect } from 'react';
import './../css/sharefeatures.css';

export default function LoadingPage({ minDuration = 1000, isVisible = true }) {
    const [showLoader, setShowLoader] = useState(true);
    
    useEffect(() => {
        // Animation des lettres du texte
        const textElement = document.getElementById('animated-text');
        if (textElement) {
            const textContent = textElement.textContent;
            textElement.innerHTML = '';

            textContent.split('').forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter;
                span.style.animationDelay = `${index * 0.15}s`; 
                span.classList.add('letter');
                textElement.appendChild(span);
            });
        }

        // Timer pour assurer une durée minimale d'affichage
        let timer;
        if (isVisible) {
            timer = setTimeout(() => {
                setShowLoader(false);
            }, minDuration);
        } else {
            setShowLoader(false);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isVisible, minDuration]);

    // Si le composant parent a indiqué que le loader n'est plus nécessaire
    // et que la durée minimale est passée
    if (!isVisible && !showLoader) {
        return null;
    }

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