"use client";

import React from 'react';
import styles from './Toolbar.module.css';
// --- THIS IS THE FIX ---
// Changed FileJson to FileJs
import { ArrowsOutSimple, ArrowsInSimple, TreeStructure, FileJs, File } from '@phosphor-icons/react';

export default function Toolbar({ onExpand, onCollapse, onGetStructure, onDownloadJson, onDownloadSkeleton }) {
    return (
        <div className={styles.toolbar}>
            <button className={styles.btn} onClick={onExpand}><ArrowsOutSimple size={16} /> Expand All</button>
            <button className={styles.btn} onClick={onCollapse}><ArrowsInSimple size={16} /> Collapse All</button>
            <button className={styles.btn} onClick={onGetStructure}><TreeStructure size={16} /> View Structure</button>
            {/* --- THIS IS THE FIX --- */}
            {/* Changed FileJson to FileJs */}
            <button className={styles.btn} onClick={onDownloadJson}><FileJs size={16} /> Download JSON</button>
            <button className={styles.btn} onClick={onDownloadSkeleton}><File size={16} /> Download Skeleton</button>
        </div>
    );
}