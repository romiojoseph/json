"use client";

import React from 'react';
import styles from './Header.module.css';
import { MagnifyingGlass, FileArrowUp } from '@phosphor-icons/react';

export default function Header({
    searchTerm,
    onSearchChange,
    onFileOpen,
    searchInputRef,
    hasData
}) {
    return (
        <header className={styles.header}>
            <h1>Explore JSON</h1>
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
                    <FileArrowUp size={16} weight="fill" />
                    <span>Open File</span>
                </button>
            </div>
        </header>
    );
}