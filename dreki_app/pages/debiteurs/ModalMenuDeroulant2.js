import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ModalMenuDeroulant2({
    dropdownPosition,
    handleSelectChoiceDeroulantMenu,
}) {
    return (
        <div>
            <div className='dropdown_menu' style={{
                border: '1px solid #ccc',
                padding: '10px',
                backgroundColor: 'white',
                position: 'absolute',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
            }}>
                <div onClick={() => handleSelectChoiceDeroulantMenu('Entreprise')} style={{ padding: '5px', cursor: 'pointer' }}>Entreprise</div>
                <div onClick={() => handleSelectChoiceDeroulantMenu('Particulier')} style={{ padding: '5px', cursor: 'pointer' }}>Particulier</div>
            </div>
        </div>
    );
}
