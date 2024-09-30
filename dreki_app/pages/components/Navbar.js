"use client";
import "../css/navbar.css"
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {

    const [isExpanded, setIsExpanded] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const handleButtonClick = () => {
        setIsExpanded(!isExpanded);
    };
    useEffect(() => {
        if (isExpanded) {
            const timer = setTimeout(() => {
                setShowContent(true);
            }, 300); 

            return () => clearTimeout(timer);
        } else {
            setShowContent(false);
        }
    }, [isExpanded]);
    return (
        <div className={`navbar_container ${isExpanded ? 'expanded' : ''}`}>
            <div className="navbar_menu_title">

                <img className="img_logo_white" src='/images/white_dreki_logo.png' alt="Logo" />
                <div className="button_size_navbar" onClick={handleButtonClick}>
                    <div className="inside_menu_button"></div>
                    <div className="inside_menu_button"></div>
                    <div className="inside_menu_button"></div>
                </div>
            </div>

            {showContent && (
                <div className="navbar_expanded_content">
                    <div className="expanded_item">
                        <img className="navbar_icon" src='/images/app.png' alt="Logo" />
                        <Link className="link_navbar" href="/dashboard">Tableau de bord</Link>
                    </div>
                    <div className="expanded_item">
                        <img className="navbar_icon" src='/images/facture.png' alt="Logo" />
                        <Link className="link_navbar" href="/factures">Factures</Link>
                    </div>
                    <div className="expanded_item">
                        <img className="navbar_icon" src='/images/user.png' alt="Logo" />
                        <Link className="link_navbar" href="/debiteurs">Débiteurs</Link>
                    </div>
                    <div className="line_separator" />
                    <div className="expanded_item">
                        <img className="navbar_icon" src='/images/param.png' alt="Logo" />

                        <Link className="link_navbar" href="/parametres">Paramètres</Link>
                    </div>
                    <div className="expanded_item">
                        <img className="navbar_icon" src='/images/logout.png' alt="Logo" />

                        <Link className="link_navbar" href="/">Déconnexion</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Navbar;
// vps chez ovh pour monter un serveur de dev / pas besoins de gros server car juste front / Montéee petit vps / environnement de dev /
// demmander un serveur nodejs demarage au lancement du serveur + mode dev / bien gere le code / reutilisation ou pas 
// sous domaine njinx

{/* <div className={`button_size_navbar ${isExpanded ? 'expanded' : ''}`} onClick={handleButtonClick}>
                &#x276F;
            </div>
            <img style={{ marginTop: '4px', marginBottom: '4px' }} src='/images/logo_mini_dreki.png' alt="Logo" />
            <div className="navbar_menu_container">
                <div className="text_inside_navbar">Menu</div>
                <Link className="button_icon_container" href="/dashboard">
                    <img style={{ margin: '4px' }} src='/images/app.png' alt="Logo" />
                    {isExpanded && (
                        <div className="button_title_hide">Console</div>
                    )}
                </Link>
                <Link className="button_icon_container" href="/agenda">
                    <img style={{ marginTop: '4px', marginBottom: '4px' }} src='/images/facture.png' alt="Logo" />
                    {isExpanded && (
                        <div className="button_title_hide">Factures</div>
                    )}
                </Link>
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
                <Link className="button_icon_container" href="/">
                    <img style={{ marginTop: '4px', marginBottom: '4px' }} src='/images/logout.png' alt="Logo" />
                    {isExpanded && (
                        <div className="button_title_hide">Déconnexion</div>
                    )}
                </Link>
            </div> */}