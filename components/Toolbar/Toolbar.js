"use client";

import React from 'react';
import styles from './Toolbar.module.css';
import { ArrowsOutSimple, ArrowsInSimple, TreeStructure, DownloadSimple, MagnifyingGlassPlus, TreeView, Graph } from '@phosphor-icons/react';

export default function Toolbar({
    onExpand, onCollapse, onGetStructure, onDownloadJson,
    onDownloadSkeleton, onQuery, onExportCsv, activeView, onSetView
}) {
    return (
        <div className={styles.toolbar}>
            <div className={styles.viewToggle}>
                <button
                    className={`${styles.btn} ${activeView === 'tree' ? styles.active : ''}`}
                    onClick={() => onSetView('tree')}
                >
                    <TreeView size={16} weight="bold" />
                </button>
                <button
                    className={`${styles.btn} ${activeView === 'graph' ? styles.active : ''}`}
                    onClick={() => onSetView('graph')}
                >
                    <Graph size={16} weight="bold" />
                </button>
            </div>

            <button className={styles.btn} onClick={onExpand} disabled={activeView !== 'tree'}><ArrowsOutSimple size={16} weight="bold" /> Expand</button>
            <button className={styles.btn} onClick={onCollapse} disabled={activeView !== 'tree'}><ArrowsInSimple size={16} weight="bold" /> Collapse</button>
            <button className={styles.btn} onClick={onQuery}><MagnifyingGlassPlus size={16} weight="bold" /> Query</button>
            <button className={styles.btn} onClick={onExportCsv}><DownloadSimple size={16} weight="bold" /> CSV</button>
            <button className={styles.btn} onClick={onDownloadJson}><DownloadSimple size={16} weight="bold" /> JSON</button>
            <button className={styles.btn} onClick={onGetStructure}><TreeStructure size={16} weight="bold" /> Diagram</button>
            <button className={styles.btn} onClick={onDownloadSkeleton}><DownloadSimple size={16} weight="bold" />Skeleton</button>
        </div>
    );
}