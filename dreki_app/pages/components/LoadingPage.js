import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import './../css/sharefeatures.css'

export default function LoadingPage({ }) {
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
    }, []);
    return (
        <div className="loading_container">
            <div className='image_mov_container' >
                <img src='/images/dreki_logo.png'/>
            </div>
            <div className='spin_mov_container'>
                <div className='spin'></div>
            </div>
            <div className='text_loading'>
                <p id='animated-text'>Chargement ...</p>
            </div>
        </div>
    );
}
