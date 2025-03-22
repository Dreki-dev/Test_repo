import MyLayout from '../Layout/layout';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import '../css/dashboard.css'
import '../css/facture.css'
import '../css/sharefeatures.css'

import blue_dragon from '../../public/images/logo_mini_dreki_blue.png'
import white_dragon from '../../public/images/logo_mini_dreki_white.png'
import red_dragon from '../../public/images/logo_mini_dreki_red.png'
import axiosInstance from '../../src/app/config/axios'
import bell_no_notif from '../../public/images/bell_no_notif.png'
import bell_notif from '../../public/images/bell_notif.png'
import LoadingPage from './../components/LoadingPage.js'
import Router from 'next/router'
import { useRouter } from 'next/router';
import Image from 'next/image';


export default function Dashboard() {
    //////////////////////////////////////////////////test api /////////////////////////////////////////////////

    const [factures, setFactures] = useState([]);
    const [notes, setNotes] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [isClient, setIsClient] = useState(false);

    const [statsFactures, setStatsFactures] = useState({
        nbFacturesTotal: 0,
        montantTotal: 0,
        montantRecupere: 0
    });

    useEffect(() => {
        if (isClient && user) {
            fetchFactures();
            fetchNotes();
        }
        setIsClient(true);
    }, [isClient, user]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!localStorage.getItem('token')) {
                    window.location.href = '/login';
                    return;
                }

                const response = await axiosInstance.get('/api/me');
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError({
                    message: err.response?.data?.error || 'Failed to fetch user information',
                    status: err.response?.status
                });
                setLoading(false);

                // Si l'erreur est 401, rediriger vers la page de connexion
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }
            }
        };

        if (isClient) {
            fetchUserData();
        }
    }, [isClient]);


    const fetchFactures = async () => {
        try {
            const response = await axiosInstance.get('/api/factures');
            const allFactures = response.data.factures;

            // Calcul des statistiques
            const nbFacturesTotal = allFactures.length;

            // Calcul du montant total de toutes les factures
            const montantTotal = allFactures.reduce((sum, facture) => {
                return sum + (facture.creance || 0);
            }, 0);

            // Calcul du montant total récupéré
            // Supposons que les factures avec l'état "payé" ou "encaissé" sont considérées comme récupérées
            // const montantRecupere = allFactures.reduce((sum, facture) => {
            //     if (facture.etat === 'payé' || facture.etat === 'encaissé') {
            //         return sum + (facture.montantRecupere || 0);
            //     }
            //     return sum;
            // }, 0);

            const montantRecupere = allFactures.reduce((sum, facture) => {
                return sum + (facture.recupere || 0);
            }, 0);

            // Mise à jour des statistiques
            setStatsFactures({
                nbFacturesTotal,
                montantTotal,
                montantRecupere
            });

            // Formater les données des factures pour l'affichage
            const formattedFactures = allFactures.map(facture => ({
                id: facture.id,
                name: facture.societe?.raisonsociale || 'Sans nom',
                backColor: getStatusColor(facture.etat),
                dragon: getDragonByStatus(facture.etat),
                euro: facture.creance,
                numero: facture.num
            }));

            // Trier par date (si disponible) ou par ID et prendre les 3 plus récentes
            const sortedFactures = formattedFactures.sort((a, b) => b.id - a.id);
            setFactures(sortedFactures.slice(0, 3));
        } catch (error) {
            console.error('Erreur lors du chargement des factures:', error);
        }
    };


    const fetchNotes = async () => {
        setLoadingNotes(true);
        try {
            // 1. Récupérer toutes les notes de l'utilisateur
            const notesResponse = await axiosInstance.get('/api/notes');

            if (!notesResponse.data.notes || !Array.isArray(notesResponse.data.notes)) {
                console.error('Format de réponse inattendu pour les notes:', notesResponse.data);
                setNotes([]);
                setLoadingNotes(false);
                return;
            }

            // 2. Filtrer pour n'avoir que des notes uniques par ID
            const uniqueNotes = Array.from(
                new Map(notesResponse.data.notes.map(note => [note.id, note])).values()
            );

            // 3. Trier les notes par date décroissante
            const sortedNotes = uniqueNotes.sort((a, b) => {
                const dateA = a.date ? new Date(a.date) : new Date(0);
                const dateB = b.date ? new Date(b.date) : new Date(0);
                return dateB - dateA;
            });

            // 4. Prendre les 3 notes les plus récentes
            const latestNotes = sortedNotes.slice(0, 3);

            // 5. Pour chaque note, récupérer les infos de facture et débiteur
            const processedNotes = await Promise.all(
                latestNotes.map(async (note) => {
                    let debiteurName = 'Débiteur inconnu';
                    let factureNum = 'N/A';
                    let factureId = null;

                    // Si la note a une facture associée
                    if (note.facture && note.facture.id) {
                        factureId = note.facture.id;
                        factureNum = note.facture.num || 'N/A';

                        try {
                            // Récupérer les détails de la facture pour obtenir le débiteur
                            const factureResponse = await axiosInstance.get(`/api/factures/${factureId}`);

                            if (factureResponse.data.facture && factureResponse.data.facture.societe) {
                                debiteurName = factureResponse.data.facture.societe.raisonsociale || 'Débiteur inconnu';
                            }
                        } catch (error) {
                            console.error(`Erreur lors de la récupération de la facture ${factureId}:`, error);
                        }
                    }

                    // Formater l'heure pour l'affichage
                    const formattedDate = note.date ? new Date(note.date).toLocaleDateString('fr-FR') : 'Date inconnue';

                    return {
                        id: note.id,
                        name: debiteurName,
                        contenu: note.contenu,
                        date: formattedDate,
                        numero: factureNum,
                        factureId: factureId
                    };
                })
            );

            setNotes(processedNotes);
        } catch (error) {
            setNotes([]);
        } finally {
            setLoadingNotes(false);
        }
    };

    const getStatusColor = (etat) => {
        switch (etat) {
            case 1: return '#ffeecc'; // bleu
            case 2: return '#ccffcc'; // vert
            case 3: return '#ffcccc'; // rouge
            default: return '#f5f5f5'; // gris
        }
    };
    const getDragonByStatus = (etat) => {
        switch (etat) {
            case 1: return dragons.blue_dragon;
            case 2: return dragons.white_dragon;
            case 3: return dragons.red_dragon;
            default: return dragons.blue_dragon;
        }
    };


    //////////////////////////////////////////////////test api /////////////////////////////////////////////////
    const handleRouteChangeStart = () => {
        setLoading(true);
        setTimeout(() => {
        }, 0);
    };

    const handleRouteChangeComplete = () => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    useEffect(() => {
        Router.events.on('routeChangeStart', handleRouteChangeStart);
        Router.events.on('routeChangeComplete', handleRouteChangeComplete);
        Router.events.on('routeChangeError', handleRouteChangeComplete);

        return () => {
            Router.events.off('routeChangeStart', handleRouteChangeStart);
            Router.events.off('routeChangeComplete', handleRouteChangeComplete);
            Router.events.off('routeChangeError', handleRouteChangeComplete);
        };
    }, []);
    const router = useRouter();

    const dragons = {
        blue_dragon: blue_dragon,
        red_dragon: red_dragon,
        white_dragon: white_dragon,
    };
    const FactureCase = ({ name, backColor, euro, id, dragon }) => {
        return (
            <Link className='input_case_container_fac' href={{ pathname: '/factures', query: { debiteur: name } }}
            >
                <div className='name_container_tab_fac'>
                    <div className='text'>{name}</div>
                </div>
                <div className='euro_container_tab_fac' style={{ justifyContent: 'center' }}>
                    {euro}
                </div>
                <div className='status_container_tab_fac' style={{ backgroundColor: backColor, transform: 'scale(0.8)', justifyContent: 'center' }}>
                    <Image src={dragon} alt="dragon image" className='dragon_logo' />
                </div>
                <div className='action_container_tab_fac'>
                    <div className='button_acton_voirplus no-select' href={`/factures?id=${id}`}>voir plus</div>
                </div>
            </Link>
        );
    };

    const NoteCase = ({ name, numero, id }) => {
        const handleAddClick = (e) => {
            e.preventDefault();
            sessionStorage.setItem('selectedFactureId', id);
            router.push('/test_note');
        };
        return (
            <Link href={{ pathname: `/test_note`, query: { showModal: true } }}
                onClick={handleAddClick}
                className='input_case_container_fac no-select' style={{ justifyContent: 'space-around' }}>
                <div className='name_container_tab_fac'>
                    <div className='text'>{name}</div>
                </div>
                <div className='euro_container_tab_fac' style={{ justifyContent: 'center' }}>
                    {numero}
                </div>
                <div className='action_container_tab_fac'>
                    <div className='button_acton_voirplus no-select'>voir note</div>
                </div>
            </Link>
        );
    };



    const [isFirstImage, setIsFirstImage] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleClick = () => {
        setIsFirstImage(!isFirstImage);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <MyLayout>
            {loading && <LoadingPage />}

            <div className='page_container_navbar' style={{ overflowY: 'hidden' }}>



                <div className='title_params_container' style={{ justifyContent: 'space-between' }}>
                    <div className='title_params_text'>Bonjour, {user?.nom || 'Utilisateur'}</div>

                    <Link href={'/historic'}>
                        <img
                            src={isFirstImage ? "/images/bell_notif.png" : "/images/bell_no_notif.png"}
                            alt="Toggle"
                            className="bell_notif"
                            onClick={() => {
                                handleClick();
                                // toggleNotifications();
                            }}
                        />
                    </Link>

                </div>
                <div className='scroll_dashboard_container'>
                    <div className='box_container_dashboard'>

                        <div className='box_information_dashboard'>
                            <div className='title_information_dashboard'>
                                <div style={{ marginLeft: '4px' }}> Nb de facture en cours :</div>
                            </div>
                            <div className='data_information'>{statsFactures.nbFacturesTotal}</div>
                        </div>
                        <div className='box_information_dashboard'>
                            <div className='title_information_dashboard'>
                                <div style={{ marginLeft: '4px' }}> Montant des retards/impayés en cours :</div>
                            </div>
                            <div className='data_information'>{statsFactures.montantTotal.toLocaleString()} €</div>
                        </div>
                        <div className='box_information_dashboard'>
                            <div className='title_information_dashboard'>
                                <div style={{ marginLeft: '4px' }}>Montant des sommes recouvrés :</div>
                            </div>
                            <div className='data_information'>{statsFactures.montantRecupere.toLocaleString()} €</div>
                        </div>
                        <div className='facture_tab_container' style={{ minHeight: '35%', overflow: 'hidden', maxHeight: '220px' }}>
                            <div className='title_information_dashboard' style={{ height: '15%' }}>
                                <div style={{ marginLeft: '4px' }}>Vos factures récentes :</div>
                            </div>
                            <div className='fixed_case_container_tab_fac'>
                                <div className='name_container_tab_fac'>
                                    débiteur
                                </div>
                                <div className='euro_container_tab_fac' style={{ justifyContent: 'center' }}>
                                    € à venir
                                </div>
                                <div className='status_container_tab_fac'>
                                    status
                                </div>
                                <div className='action_container_tab_fac'>
                                    action
                                </div>
                            </div>
                            <div className='container_scroll_fac'>
                                {factures.length > 0 ? (
                                    factures.map((facture, index) => (
                                        <FactureCase
                                            key={index}
                                            name={facture.name}
                                            backColor={facture.backColor}
                                            dragon={facture.dragon}
                                            euro={facture.euro}
                                            id={facture.id}
                                        />
                                    ))
                                ) : (
                                    <div className="no-data-message">Aucune facture disponible</div>
                                )}
                            </div>
                        </div>
                        <div className='facture_tab_container' style={{ minHeight: '35%', overflow: 'hidden', maxHeight: '220px' }}>
                            <div className='title_information_dashboard' style={{ height: '15%' }}>
                                <div style={{ marginLeft: '4px' }}>Vos notes récentes :</div>
                            </div>
                            <div className='fixed_case_container_tab_fac' style={{ justifyContent: 'space-around' }}>
                                <div className='name_container_tab_fac'>
                                    name
                                </div>
                                <div className='euro_container_tab_fac' style={{ justifyContent: 'center' }}>
                                    facture n°
                                </div>
                                <div className='status_container_tab_fac'>
                                    action
                                </div>

                            </div>
                            <div className='container_scroll_fac'>
                                {notes.length > 0 ? (
                                    notes.map((note, index) => (
                                        <NoteCase
                                            key={index}
                                            name={note.name}
                                            numero={note.numero}
                                            id={note.factureId || note.id}
                                        />
                                    ))
                                ) : (
                                    <div className="no-data-message">Aucune note disponible</div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </MyLayout>

    );
}