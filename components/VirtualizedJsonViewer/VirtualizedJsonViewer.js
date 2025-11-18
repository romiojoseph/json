"use client";

import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import styles from './VirtualizedJsonViewer.module.css';
import { buildPathString } from '../../app/utils'; // Updated import path
import { CaretRight, CaretDown } from '@phosphor-icons/react';

export default function VirtualizedJsonViewer({ visibleRows, parentRef, onToggle, onPathCopy }) {
    const rowVirtualizer = useVirtualizer({
        count: visibleRows.length,
        getScrollElement: () => parentRef.current,
        // --- FIX: Remove estimateSize and add dynamic measurement ---
        estimateSize: () => 24, // Keep an estimate for initial render
        measureElement: (element) => element.getBoundingClientRect().height, // Measure the actual height
        overscan: 20,
    });

    return (
        <div className={styles.viewerContainer} ref={parentRef}>
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
                {rowVirtualizer.getVirtualItems().map(virtualItem => {
                    const row = visibleRows[virtualItem.index];
                    if (!row) return null;
                    const pathString = buildPathString(row.path);

                    return (
                        <div
                            // --- FIX: Add ref and data-index for measurement ---
                            key={virtualItem.key}
                            data-index={virtualItem.index}
                            ref={rowVirtualizer.measureElement}
                            className={styles.row}
                            style={{
                                position: 'absolute', top: 0, left: 0, width: '100%',
                                transform: `translateY(${virtualItem.start}px)`, // height is now dynamic
                            }}
                            onClick={() => onPathCopy(pathString)}
                        >
                            <span style={{ minWidth: `${row.depth * 20}px` }} /> {/* Indentation */}
                            {row.isObject && (
                                <span
                                    className={styles.toggle}
                                    onClick={(e) => { e.stopPropagation(); onToggle(row.path); }}
                                >
                                    {row.isExpanded ? (
                                        <CaretDown size={12} weight="fill" />
                                    ) : (
                                        <CaretRight size={12} weight="fill" />
                                    )}
                                </span>
                            )}
                            <span className={styles.key}>&quot;{row.key}&quot;:</span>
                            {row.isObject ? (
                                <span className={styles.bracket}>{Array.isArray(row.value) ? '[' : '{'}</span>
                            ) : (
                                <span className={`${styles.value} ${styles[typeof row.value]}`}>
                                    {JSON.stringify(row.value)}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}