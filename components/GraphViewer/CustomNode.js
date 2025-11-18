"use client";

import React from 'react';
import styles from './GraphViewer.module.css';
import { Handle, Position } from 'reactflow';

// A simple regex to check for hex color codes
const isHexColor = (str) => /^#([0-9A-F]{3}){1,2}$/i.test(str);

const CustomNode = ({ data }) => {
    return (
        <>
            <Handle type="target" position={Position.Left} className={styles.handle} />
            <div className={styles.customNode}>
                {data.properties.map(({ key, value, isObject }) => (
                    <div key={key} className={styles.property}>
                        <span className={styles.key}>{key}:</span>
                        <div className={styles.valueContainer}>
                            {isHexColor(value) && <div className={styles.colorSwatch} style={{ backgroundColor: value }} />}
                            <span className={styles.value}>{String(value)}</span>
                        </div>
                    </div>
                ))}
            </div>
            <Handle type="source" position={Position.Right} className={styles.handle} />
        </>
    );
};

export default React.memo(CustomNode);