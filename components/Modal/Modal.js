"use client";
import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import { X } from '@phosphor-icons/react';
export default function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);
    if (!isOpen) return null;
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>{title}</h2>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    );
};