"use client";

import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import styles from './VirtualizedJsonViewer.module.css';
import { buildPathString } from '../../app/utils';
import { CaretRight, CaretDown } from '@phosphor-icons/react';

export default function VirtualizedJsonViewer({ visibleRows, parentRef, onToggle, onPathCopy }) {
    const rowVirtualizer = useVirtualizer({
        count: visibleRows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 24,
        measureElement: (element) => element.getBoundingClientRect().height,
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
                            key={virtualItem.key}
                            data-index={virtualItem.index}
                            ref={rowVirtualizer.measureElement}
                            className={styles.row}
                            style={{
                                position: 'absolute', top: 0, left: 0, width: '100%',
                                transform: `translateY(${virtualItem.start}px)`,
                            }}
                        >
                            <span style={{ minWidth: `${row.depth * 20}px` }} /> {/* Indentation */}
                            {row.isObject && (
                                <span
                                    className={styles.toggle}
                                    onClick={(e) => { e.stopPropagation(); onToggle(row.path, e.altKey); }}
                                >
                                    {row.isExpanded ? (
                                        <CaretDown size={12} weight="fill" />
                                    ) : (
                                        <CaretRight size={12} weight="fill" />
                                    )}
                                </span>
                            )}
                            <span
                                className={styles.key}
                                onClick={(e) => { e.stopPropagation(); onPathCopy(pathString); }}
                                title="Copy path"
                            >
                                &quot;{row.key}&quot;:
                            </span>
                            {row.isObject ? (
                                <span className={styles.bracket}>{Array.isArray(row.value) ? '[' : '{'}</span>
                            ) : (
                                <span
                                    className={`${styles.value} ${styles[typeof row.value]}`}
                                    onClick={(e) => { e.stopPropagation(); onPathCopy(String(row.value)); }}
                                    title="Copy value"
                                >
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