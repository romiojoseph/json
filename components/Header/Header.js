"use client";

import React from 'react';
import styles from './Header.module.css';
import { MagnifyingGlass, File } from '@phosphor-icons/react';

export default function Header({
    searchTerm,
    onSearchChange,
    onFileOpen,
    searchInputRef,
    hasData
}) {
    return (
        <header className={styles.header}>
            <h1>JSON Tree Viewer</h1>
            <div className={styles.headerActions}>
                <div className={styles.searchBox}>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search... (Ctrl+F)"
                        value={searchTerm}
                        onChange={onSearchChange}
                        disabled={!hasData}
                    />
                    <MagnifyingGlass size={16} className={styles.searchIcon} />
                </div>
                <button className={styles.btn} onClick={onFileOpen}>
                    <File size={16} />
                    <span>Open File</span>
                </button>
            </div>
        </header>
    );
}