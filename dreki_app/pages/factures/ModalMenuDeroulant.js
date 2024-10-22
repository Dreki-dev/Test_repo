import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ModalMenuDeroulant({
    dropdownPosition,
    filteredChoices,
    handleSelectChoiceDeroulantMenu,

}) {
    return (
        <div style={{ width: '55%' }}>
        <div className='dropdown_menu' style={{
            border: '1px solid #ccc',
            padding: '10px',
            backgroundColor: 'white',
            position: 'absolute',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            width: '45%',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            height: '15%',
            overflowY: 'scroll',
        }}>
            {filteredChoices.map((choice, index) => (
                <div
                    key={index}
                    onClick={() => handleSelectChoiceDeroulantMenu(choice)}
                    style={{ padding: '5px', cursor: 'pointer' }}
                >
                    {choice}
                </div>
            ))}
        </div>
    </div>
    );
}
