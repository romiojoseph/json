"use client";

import React from 'react';
import styles from './EmptyState.module.css';

export default function EmptyState({ isDragging, onPasteClick }) {
    return (
        <div className={`${styles.emptyState} ${isDragging ? styles.dragging : ''}`}>
            <img src="/emptyStateIcon.svg" alt="JSON Icon" />
            <h2>{isDragging ? 'Drop JSON or CSV file here' : 'Drop a JSON/CSV file or click "Open File"'}</h2>
            <p>
                {isDragging ? 'Release to load' : 'Keyboard shortcuts: Ctrl+O to open, Ctrl+F to search'}
            </p>
            {!isDragging && (
                <button className={styles.pasteBtn} onClick={onPasteClick}>
                    or Paste JSON
                </button>
            )}
        </div>
    );
}