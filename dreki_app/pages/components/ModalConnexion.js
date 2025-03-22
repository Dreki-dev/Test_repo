import React, { useState } from "react";
import axiosInstance from '../../src/app/config/axios'; // Assurez-vous que le chemin est correct

export default function ModalConnexion({
  showModalConnexion,
  animationClass,
  toggleModalConnexion,
  text, setText,
  textMdp, setTextMdp,
  handleOutsideClick
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!text || !textMdp) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const loginData = {
      username: text,
      password: textMdp
    };
    
    try {
      const response = await axiosInstance.post('/api/login', loginData);
      
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        window.location.href = "/dashboard";
      } else {
        setError("Réponse invalide du serveur");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Erreur de connexion au serveur"
      );
    } finally {
      setLoading(false);
    }
  };

  // Gestion du focus pour le champ username
  const handleUsernameFocus = () => {
    setUsernameFocused(true);
    if (!usernameFocused) {
      setText('');
    }
  };

  // Gestion du focus pour le champ mot de passe
  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    if (!passwordFocused) {
      setTextMdp('');
    }
  };

  return (
    <div className={`modalCo_overlay ${animationClass}`} onClick={toggleModalConnexion}>
      <div className={`modalCo_content ${animationClass}`} onClick={(e) => e.stopPropagation()}>
        <div className="modalCo_content_center">
          {error && (
            <div className="error-message" style={{color: 'red', margin: '10px 0'}}>
              {error}
            </div>
          )}
          <div className="modalCo_field_content">
            <div className="modalCo_field_title">username</div>
            <div className="modalCo_field_case" >
              <input
                type="username"
                className="modalCo_field_input_is_ed"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={handleUsernameFocus}
                placeholder="Entrez votre nom d'utilisateur"
                disabled={loading}
              />
            </div>
          </div>
          <div className="modalCo_field_content">
            <div className="modalCo_field_title">Mot de passe</div>
            <div className="modalCo_field_case">
              <input
                type="password"
                className="modalCo_field_input_is_ed"
                value={textMdp}
                onChange={(e) => setTextMdp(e.target.value)}
                onFocus={handlePasswordFocus}
                placeholder="Entrez votre mot de passe"
                disabled={loading}
              />
            </div>
          </div>
          <button 
            className="connexion_button_snd" 
            onClick={handleLogin} 
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "CONNEXION"}
          </button>
        </div>
      </div>
    </div>
  );
}