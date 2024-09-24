'use client'
import "./Navbar.css";
import { useState, useRef } from 'react';
import Link from 'next/link';

const Navbar = ({ currentPath }) => {

    const [isExpanded, setIsExpanded] = useState(false);

    const handleButtonClick = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`navbar_container ${isExpanded ? 'expanded' : ''}`}>
            <div className={`button_size_navbar ${isExpanded ? 'expanded' : ''}`} onClick={handleButtonClick}>
                &#x276F;
            </div>
            <img style={{ marginTop: '4px', marginBottom: '4px' }} src='/images/logo_mini_dreki.png' alt="Logo" />
            <div className="navbar_menu_container">
                <div className="text_inside_navbar">Menu</div>
                <Link className="button_icon_container" href="/Dashboard">
                    <img style={{ margin: '4px' }} src='/images/app.png' alt="Logo" />
                    {isExpanded && (
                        <div className="button_title_hide">Console</div>
                    )}
                </Link>
                <div className="button_icon_container">
                    <img style={{ marginTop: '4px', marginBottom: '4px' }} src='/images/facture.png' alt="Logo" />
                    {isExpanded && (
                        <div className="button_title_hide">Factures</div>
                    )}
                </div>
                <div className="button_icon_container">
                    <img style={{ marginTop: '4px', marginBottom: '4px' }} src='/images/user.png' alt="Logo" />
                    {isExpanded && (
                        <div className="button_title_hide">Débiteurs</div>
                    )}
                </div>
            </div>
            <div className="navbar_systeme_container">
                <div className="text_inside_navbar">Système</div>
                <div className="button_icon_container">
                    <img style={{ marginTop: '4px', marginBottom: '4px' }} src='/images/param.png' alt="Logo" />
                    {isExpanded && (
                        <div className="button_title_hide">Paramètres</div>
                    )}
                </div>
                <div className="button_icon_container">
                    <img style={{ marginTop: '4px', marginBottom: '4px' }} src='/images/logout.png' alt="Logo" />
                    {isExpanded && (
                        <div className="button_title_hide">Déconnexion</div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Navbar;
// vps chez ovh pour monter un serveur de dev / pas besoins de gros server car juste front / Montéee petit vps / environnement de dev /
// demmander un serveur nodejs demarage au lancement du serveur + mode dev / bien gere le code / reutilisation ou pas 
// sous domaine njinx