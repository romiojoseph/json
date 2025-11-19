"use client";

import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.section}>
                    <h2 className={styles.title}>Open JSON - Explore your JSON Data Online</h2>
                    <p className={styles.description}>
                        Free online JSON viewer with tree and graph visualization, search, JSONPath queries, structure analysis and CSV export. Paste or upload JSON files instantly.
                    </p>
                </div>

                <div className={styles.features}>
                    <div className={styles.featureColumn}>
                        <h3 className={styles.featureTitle}>Features</h3>
                        <ul className={styles.featureList}>
                            <li>Tree and interactive graph views</li>
                            <li>Expandable/collapsible nodes</li>
                            <li>Alt+Click recursive expand/collapse</li>
                            <li>Syntax highlighting</li>
                            <li>JSON structure skeleton generation</li>
                            <li>CSV export</li>
                            <li>Paste or Drag & drop file</li>
                            <li>Deep nested value search</li>
                            <li>JSONPath query support</li>
                            <li>Path and value copying, just click on it.</li>
                            <li>Keyboard shortcuts (Ctrl+F, Ctrl+O)</li>
                            <li>Completely works on your browser</li>
                            <li>No trackers, no ads and no account</li>
                            <li>Built with LLMs, thus open source</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.disclaimer}>
                        Created with AI Studio, Deep Seek and Claude • {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </footer>
    );
}
