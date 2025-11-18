"use client";

import React from 'react';
import styles from './Toolbar.module.css';
import { ArrowsOutSimple, ArrowsInSimple, TreeStructure, FileJs, File, MagnifyingGlassPlus, FileCsv, Tree, Graph } from '@phosphor-icons/react';

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
                    <Tree size={16} /> Tree View
                </button>
                <button
                    className={`${styles.btn} ${activeView === 'graph' ? styles.active : ''}`}
                    onClick={() => onSetView('graph')}
                >
                    <Graph size={16} /> Graph View
                </button>
            </div>

            <div className={styles.separator}></div>

            <button className={styles.btn} onClick={onExpand} disabled={activeView !== 'tree'}><ArrowsOutSimple size={16} /> Expand All</button>
            <button className={styles.btn} onClick={onCollapse} disabled={activeView !== 'tree'}><ArrowsInSimple size={16} /> Collapse All</button>
            <button className={styles.btn} onClick={onGetStructure}><TreeStructure size={16} /> View Structure</button>
            <button className={styles.btn} onClick={onQuery}><MagnifyingGlassPlus size={16} /> Query (JSONPath)</button>
            <button className={styles.btn} onClick={onExportCsv}><FileCsv size={16} /> Export to CSV</button>
            <button className={styles.btn} onClick={onDownloadJson}><FileJs size={16} /> Download JSON</button>
            <button className={styles.btn} onClick={onDownloadSkeleton}><File size={16} /> Download Skeleton</button>
        </div>
    );
}