import './css/page.css'
import { useState, useRef } from 'react';
import ModalConnexion from './components/ModalConnexion';
import ModalInscription from './components/ModalInscription';


export default function Connexion() {

  const [showModalConnexion, setShowModalConnexion] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const [showModalInscription, setShowModalInscription] = useState(false);

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("Theo.abitbol@gmail.com")
  const [editingMdp, setEditingMdp] = useState(false);
  const [textMdp, setTextMdp] = useState("***********")

  const [editingName, setEditingName] = useState(false);
  const [textName, setTextName] = useState("Nom")
  const [editingMail, setEditingMail] = useState(false);
  const [textMail, setTextMail] = useState("exemple@gmail.com")
  const [editingMdpC, setEditingMdpC] = useState(false);
  const [textMdpC, setTextMdpC] = useState("***********")
  const [editingMdpV, setEditingMdpV] = useState(false);
  const [textMdpV, setTextMdpV] = useState("***********")

  const toggleModalConnexion = () => {
    if (showModalConnexion) {
      setAnimationClass('hide');
      setTimeout(() => {
        setShowModalConnexion(false);
        setAnimationClass('');
      }, 500);
    } else {
      setShowModalConnexion(true);
      setAnimationClass('show');
    }
  };

  const toggleModalInscription = () => {
    if (showModalInscription) {
      setAnimationClass('hide');
      setTimeout(() => {
        setShowModalInscription(false);
        setAnimationClass('');
      }, 500);
    } else {
      setShowModalInscription(true);
      setAnimationClass('show');
    }
  };

  const handleOutsideClick2Mdp = (e) => {
    setEditingMdp(true);
  };
  const handleOutsideClick = (e) => {
    setEditing(false);
    setEditingMdp(false);

  };

  const handleClickName = (e) => {
    setEditingName(true);
  };
  const handleClickMail = (e) => {
    setEditingMail(true);
  };
  const handleClickMdpC = (e) => {
    setEditingMdpC(true);
  };
  const handleClickMdpV = (e) => {
    setEditingMdpV(true);
  };
  const handleOutsideClickIns = (e) => {
    setEditingName(false);
    setEditingMail(false);
    setEditingMdpC(false);
    setEditingMdpV(false);

  };
  const handleOutsideClick2 = (e) => {
    setEditing(true);
  };
  return (
    <div className="main_content">

      <div className='login_Content'>
        <div className='logo_content'>
          <div className={`swap_logo_first ${showModalConnexion ? 'fade-in' : 'fade-out'}`}>
            Bonjour <br /> Connectez-vous!
          </div>
          <div className={`swap_logo_second ${showModalConnexion ? 'fade-out' : 'fade-in'}`}>
            <img src='/images/dreki_logo.png' alt="Logo" />
          </div>
        </div>
        <div className="slogan_content">
          Bienvenue, connectez-vous !
        </div>
        <div className='connexion_button' onClick={toggleModalConnexion}>
          CONNEXION
        </div>
        <div className='inscription_button' onClick={toggleModalInscription}>
          INSCRIPTION
        </div>
        <div className='help_button'>
          <a href="https://www.linkedin.com/in/theo-abitbol/" target="_blank" rel="noopener noreferrer">
            Un problème ? Contactez-nous !
          </a>
        </div>
      </div>
      {showModalConnexion && (
        <ModalConnexion
          showModalConnexion={showModalConnexion}
          animationClass={animationClass}
          toggleModalConnexion={toggleModalConnexion}
          editing={editing}
          setEditing={setEditing}
          text={text}
          setText={setText}
          editingMdp={editingMdp}
          setEditingMdp={setEditingMdp}
          textMdp={textMdp}
          setTextMdp={setTextMdp}
          handleOutsideClick={handleOutsideClick}
          handleOutsideClick2={handleOutsideClick2}
          handleOutsideClick2Mdp={handleOutsideClick2Mdp} />
      )}

      {showModalInscription && (
        <ModalInscription
          showModalInscription={showModalInscription}
          animationClass={animationClass}
          toggleModalInscription={toggleModalInscription}
          editingName={editingName}
          setEditingName={setEditingName}
          textName={textName}
          setTextName={setTextName}
          editingMail={editingMail}
          setEditingMail={setEditingMail}
          textMail={textMail}
          setTextMail={setTextMail}
          editingMdpC={editingMdpC}
          setEditingMdpC={setEditingMdpC}
          textMdpC={textMdpC}
          setTextMdpC={setTextMdpC}
          editingMdpV={editingMdpV}
          setEditingMdpV={setEditingMdpV}
          textMdpV={textMdpV}
          setTextMdpV={setTextMdpV}

          handleClickName={handleClickName}
          handleClickMail={handleClickMail}
          handleClickMdpC={handleClickMdpC}
          handleClickMdpV={handleClickMdpV}
          handleOutsideClickIns={handleOutsideClickIns}

          handleOutsideClick2={handleOutsideClick2}
          handleOutsideClick2Mdp={handleOutsideClick2Mdp} />
      )}
    </div>
  );
}
