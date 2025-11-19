"use client";

import React from 'react';
import styles from './Header.module.css';
import { MagnifyingGlass, FileArrowUp } from '@phosphor-icons/react';
import Toolbar from '../Toolbar/Toolbar';

export default function Header({
    searchTerm,
    onSearchChange,
    onFileOpen,
    searchInputRef,
    hasData,
    // Toolbar props
    onExpand,
    onCollapse,
    onGetStructure,
    onDownloadJson,
    onDownloadSkeleton,
    onQuery,
    onExportCsv,
    activeView,
    onSetView
}) {
    return (
        <header className={styles.header}>
            <div className={styles.topRow}>
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
            </div>
            {hasData && (
                <Toolbar
                    onExpand={onExpand}
                    onCollapse={onCollapse}
                    onGetStructure={onGetStructure}
                    onDownloadJson={onDownloadJson}
                    onDownloadSkeleton={onDownloadSkeleton}
                    onQuery={onQuery}
                    onExportCsv={onExportCsv}
                    activeView={activeView}
                    onSetView={onSetView}
                />
            )}
        </header>
    );
}