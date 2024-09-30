import ParametreLayout from './layout';
import '../css/navbar.css'
import '../css/params.css'

export default function Parametre() {
    return (
        <ParametreLayout>
            <div className='page_container_navbar'>
                <div className='title_params_container'>

                    <div className='title_params_text'>Paramètres</div>

                </div>
                <div className='button_container_params'>
                    <div className='button_mdp'>Modifier MDP</div>
                    <div className='button_doc'>Ajouter ou modifier<br/>un document</div>
                </div>

            </div>

        </ParametreLayout>

    );
}