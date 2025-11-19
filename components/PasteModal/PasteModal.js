"use client";

import React, { useState } from 'react';
import styles from './PasteModal.module.css';
import Modal from '../Modal/Modal';

export default function PasteModal({ isOpen, onClose, onPaste }) {
    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState('');

    const handlePaste = () => {
        if (!jsonText.trim()) return;

        try {
            const parsed = JSON.parse(jsonText);
            onPaste(parsed);
            setJsonText('');
            setError('');
            onClose();
        } catch (e) {
            setError('Invalid JSON: ' + e.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Paste JSON">
            <div className={styles.container}>
                <textarea
                    className={styles.textarea}
                    placeholder="Paste your JSON here..."
                    value={jsonText}
                    onChange={(e) => {
                        setJsonText(e.target.value);
                        if (error) setError('');
                    }}
                    autoFocus
                />
                {error && <div className={styles.error}>{error}</div>}
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button
                        className={styles.loadBtn}
                        onClick={handlePaste}
                        disabled={!jsonText.trim()}
                    >
                        Load JSON
                    </button>
                </div>
            </div>
        </Modal>
    );
}
