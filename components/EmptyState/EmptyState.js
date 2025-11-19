"use client";

import React from 'react';
import styles from './EmptyState.module.css';
import { FileDashed } from '@phosphor-icons/react';

export default function EmptyState({ isDragging, onPasteClick }) {
    return (
        <div className={`${styles.emptyState} ${isDragging ? styles.dragging : ''}`}>
            <FileDashed size={64} weight="thin" />
            <h2>{isDragging ? 'Drop JSON file here' : 'Drop a JSON file or click "Open File"'}</h2>
            <p>
                {isDragging ? 'Release to load' : 'Keyboard shortcuts: Ctrl+O to open, Ctrl+F to search'}
            </p>
            {!isDragging && (
                <button className={styles.pasteBtn} onClick={onPasteClick}>
                    or Paste JSON code
                </button>
            )}
        </div>
    );
}