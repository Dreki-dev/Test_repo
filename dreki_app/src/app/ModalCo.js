import React from 'react';

export default function ModalCo({
  showModalCo,
  animationClass,
  toggleModalCo,
  editing, setEditing,
  text, setText,
  editingMdp, setEditingMdp,
  textMdp, setTextMdp,
  handleOutsideClick, handleOutsideClick2, handleOutsideClick2Mdp
}) {
  return (
    <div className={`modalCo_overlay ${animationClass}`} onClick={toggleModalCo}>
      <div className={`modalCo_content ${animationClass}`} onClick={(e) => e.stopPropagation()}>
        <div className='modalCo_content_center' onClick={() => handleOutsideClick()}>
          <div className='modalCo_field_content'>
            <div className='modalCo_field_title'>
              Email
            </div>
            <div className='modalCo_field_case' onClick={(e) => e.stopPropagation()}>
              {editing ? (
                <div className='modalCo_field_input_container_button'>
                  <input className='modalCo_field_input_is_ed' value={text} onChange={(e) => setText(e.target.value)} onClick={() => setEditing(true)} />
                </div>
              ) : (
                <div className='modalCo_field_input_not_ed' onClick={() => handleOutsideClick2(!editing)}>{text}</div>
              )}
            </div>
          </div>
          <div className='modalCo_field_content'>
            <div className='modalCo_field_title'>
              Mot de passe
            </div>
            <div className='modalCo_field_case' onClick={(e) => e.stopPropagation()}>
              {editingMdp ? (
                <div className='modalCo_field_input_container_button'>
                  <input className='modalCo_field_input_is_ed' value={textMdp} onChange={(e) => setTextMdp(e.target.value)} onClick={() => setEditingMdp(true)} />
                </div>
              ) : (
                <div className='modalCo_field_input_not_ed' onClick={() => handleOutsideClick2Mdp(!editingMdp)}>{textMdp}</div>
              )}
            </div>
          </div>
          <div className='mdp_forgot_content'>
            <div className='mdp_forgot_text'>
              Mot de passe oublié ?
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
