import React from 'react';

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
  return (
    <div className={`modalCo_overlay ${animationClass}`} onClick={toggleModalInscription}>
      <div className={`modalCo_content ${animationClass}`} onClick={(e) => e.stopPropagation()}>
        <div className='modalCo_content_center' onClick={() => handleOutsideClickIns()}>
          <div className='modalCo_field_content'>
            <div className='modalCo_field_title'>
              Nom Complet
            </div>
            <div className='modalCo_field_case' onClick={(e) => e.stopPropagation()}>
              {editingName ? (
                <div className='modalCo_field_input_container_button'>
                  <input className='modalCo_field_input_is_ed' value={textName} onChange={(e) => setTextName(e.target.value)} onClick={() => setEditingName(true)} />
                </div>
              ) : (
                <div className='modalCo_field_input_not_ed' onClick={() => handleClickName(!editingName)}>{textName}</div>
              )}
            </div>
          </div>
          <div className='modalCo_field_content'>
            <div className='modalCo_field_title'>
              Adresse mail
            </div>
            <div className='modalCo_field_case' onClick={(e) => e.stopPropagation()}>
              {editingMail ? (
                <div className='modalCo_field_input_container_button'>
                  <input className='modalCo_field_input_is_ed' value={textMail} onChange={(e) => setTextMail(e.target.value)} onClick={() => setEditingMail(true)} />
                </div>
              ) : (
                <div className='modalCo_field_input_not_ed' onClick={() => handleClickMail(!editingMail)}>{textMail}</div>
              )}
            </div>
          </div>
          <div className='modalCo_field_content'>
            <div className='modalCo_field_title'>
              Mot de passe
            </div>
            <div className='modalCo_field_case' onClick={(e) => e.stopPropagation()}>
              {editingMdpC ? (
                <div className='modalCo_field_input_container_button'>
                  <input className='modalCo_field_input_is_ed' value={textMdpC} onChange={(e) => setTextMdpC(e.target.value)} onClick={() => setEditingMdpC(true)} />
                </div>
              ) : (
                <div className='modalCo_field_input_not_ed' onClick={() => handleClickMdpC(!editingMdpC)}>{textMdpC}</div>
              )}
            </div>
          </div>
          <div className='modalCo_field_content'>
            <div className='modalCo_field_title'>
              Confirmation du mot de passe
            </div>
            <div className='modalCo_field_case' onClick={(e) => e.stopPropagation()}>
              {editingMdpV ? (
                <div className='modalCo_field_input_container_button'>
                  <input className='modalCo_field_input_is_ed' value={textMdpV} onChange={(e) => setTextMdpV(e.target.value)} onClick={() => setEditingMdpV(true)} />
                </div>
              ) : (
                <div className='modalCo_field_input_not_ed' onClick={() => handleClickMdpV(!editingMdpV)}>{textMdpV}</div>
              )}
            </div>
          </div>
          <div className='connexion_button_snd'>
            CONNEXION
          </div>
          <div className='no_account_content'>
            <div className='no_account_content_text'>Pas encore inscrit ?</div>
            <div className='no_account_content_button_to_sign'>Inscrivez-vous !</div>
          </div>
        </div>
      </div>
    </div>
  );
}
