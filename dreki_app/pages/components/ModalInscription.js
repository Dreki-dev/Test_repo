import React, { useState } from 'react';
import axiosInstance from '../../src/app/config/axios';

export default function ModalInscription({
  showModalInscription,
  animationClass,
  toggleModalInscription,
  editingName, setEditingName,
  textName, setTextName,
  editingMail, setEditingMail,
  textMail, setTextMail,
  editingMdpC, setEditingMdpC,
  textMdpC, setTextMdpC,
  editingMdpV, setEditingMdpV,
  textMdpV, setTextMdpV,
  handleClickName, handleClickMail, handleClickMdpC, handleClickMdpV, handleOutsideClickIns
}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    console.log('🚀 Début inscription');

    // Empêcher les soumissions multiples
    if (loading) {
      console.log('⚠️ Soumission déjà en cours...');
      return;
    }

    // Validation des champs
    if (!textName || !textMail || !textMdpC || !textMdpV) {
      console.log('❌ Validation: champs manquants');
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (textMdpC !== textMdpV) {
      console.log('❌ Validation: mots de passe différents');
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(textMail)) {
      console.log('❌ Validation: email invalide');
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    console.log('✅ Validation réussie');
    setLoading(true);
    setError(null);

    try {
      const userData = {
        nom: textName.trim(),
        email: textMail.trim(),
        password: textMdpC
      };

      console.log('📦 Données préparées:', {
        nom: userData.nom,
        email: userData.email,
        passwordLength: userData.password.length
      });

      console.log('🌐 Envoi de la requête...');
      const response = await axiosInstance.post('/api/register', userData);

      console.log('✅ Réponse du serveur:', {
        status: response.status,
        data: {
          ...response.data,
          token: response.data.token ? '***' : null
        }
      });

      if (response.data.token) {
        console.log('🔑 Token reçu, sauvegarde...');
        localStorage.setItem('token', response.data.token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        console.log('🔄 Redirection...');
        toggleModalInscription();
        window.location.href = "/";
      } else {
        console.log('⚠️ Pas de token dans la réponse');
        throw new Error('Réponse invalide du serveur : token manquant');
      }

    } catch (error) {
      console.error('🔴 Erreur détaillée:', {
        message: error.message,
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        },
        request: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });

      setError(
        error.response?.data?.details?.errorMessage ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Une erreur est survenue lors de l'inscription"
      );
    } finally {
      setLoading(false);
      console.log('🏁 Fin de la tentative d\'inscription');
    }
  };

  return (
    <div className={`modalCo_overlay ${animationClass}`} onClick={toggleModalInscription}>
      <div className={`modalCo_content ${animationClass}`} onClick={(e) => e.stopPropagation()}>
        <div className='modalCo_content_center' onClick={() => handleOutsideClickIns()}>
          {error && (
            <div className='error-message' style={{ color: 'red', margin: '10px 0', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className='modalCo_field_content'>
            <div className='modalCo_field_title'>Nom complet</div>
            <div className='modalCo_field_case' onClick={(e) => e.stopPropagation()}>
              {editingName ? (
                <div className='modalCo_field_input_container_button'>
                  <input
                    className='modalCo_field_input_is_ed'
                    value={textName}
                    onChange={(e) => setTextName(e.target.value)}
                    onClick={() => setEditingName(true)}
                    disabled={loading}
                  />
                </div>
              ) : (
                <div className='modalCo_field_input_not_ed' onClick={() => handleClickName(!editingName)}>
                  {textName || "Cliquez pour saisir votre nom"}
                </div>
              )}
            </div>
          </div>

          <div className='modalCo_field_content'>
            <div className='modalCo_field_title'>Adresse mail</div>
            <div className='modalCo_field_case' onClick={(e) => e.stopPropagation()}>
              {editingMail ? (
                <div className='modalCo_field_input_container_button'>
                  <input
                    type="email"
                    className='modalCo_field_input_is_ed'
                    value={textMail}
                    onChange={(e) => setTextMail(e.target.value)}
                    onClick={() => setEditingMail(true)}
                    disabled={loading}
                  />
                </div>
              ) : (
                <div className='modalCo_field_input_not_ed' onClick={() => handleClickMail(!editingMail)}>
                  {textMail || "Cliquez pour saisir votre email"}
                </div>
              )}
            </div>
          </div>

          <div className='modalCo_field_content'>
            <div className='modalCo_field_title'>Mot de passe</div>
            <div className='modalCo_field_case' onClick={(e) => e.stopPropagation()}>
              {editingMdpC ? (
                <div className='modalCo_field_input_container_button'>
                  <input
                    type="password"
                    className='modalCo_field_input_is_ed'
                    value={textMdpC}
                    onChange={(e) => setTextMdpC(e.target.value)}
                    onClick={() => setEditingMdpC(true)}
                    disabled={loading}
                  />
                </div>
              ) : (
                <div className='modalCo_field_input_not_ed' onClick={() => handleClickMdpC(!editingMdpC)}>
                  {textMdpC ? "••••••••" : "Cliquez pour saisir votre mot de passe"}
                </div>
              )}
            </div>
          </div>

          <div className='modalCo_field_content'>
            <div className='modalCo_field_title'>Confirmation du mot de passe</div>
            <div className='modalCo_field_case' onClick={(e) => e.stopPropagation()}>
              {editingMdpV ? (
                <div className='modalCo_field_input_container_button'>
                  <input
                    type="password"
                    className='modalCo_field_input_is_ed'
                    value={textMdpV}
                    onChange={(e) => setTextMdpV(e.target.value)}
                    onClick={() => setEditingMdpV(true)}
                    disabled={loading}
                  />
                </div>
              ) : (
                <div className='modalCo_field_input_not_ed' onClick={() => handleClickMdpV(!editingMdpV)}>
                  {textMdpV ? "••••••••" : "Cliquez pour confirmer votre mot de passe"}
                </div>
              )}
            </div>
          </div>

          <button
            className='connexion_button_snd'
            onClick={handleRegister}
            disabled={loading}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? "INSCRIPTION EN COURS..." : "S'INSCRIRE"}
          </button>

          <div className='no_account_content'>
            <div className='no_account_content_text'>Déjà inscrit ?</div>
            <div
              className='no_account_content_button_to_sign'
              onClick={toggleModalInscription}
              style={{ cursor: 'pointer' }}
            >
              Connectez-vous !
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}