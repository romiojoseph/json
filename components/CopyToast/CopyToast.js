"use client";

import React from 'react';
import styles from './CopyToast.module.css';
import { CheckCircle } from '@phosphor-icons/react';

export default function CopyToast({ text }) {
    if (!text) return null;

    return (
        <div className={styles.copyToast}>
            <CheckCircle size={20} weight="fill" />
            Copied: {text}
        </div>
    );
}