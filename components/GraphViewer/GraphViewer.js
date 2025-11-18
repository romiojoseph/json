"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styles from './GraphViewer.module.css';

const isHexColor = (str) => /^#([0-9A-F]{3}){1,2}$/i.test(str);
const MAX_PROPS_DISPLAY = 5;
const MAX_VALUE_LENGTH = 18;

function createNodeCard(node, d) {
    const props = d.data.properties || [];
    const displayProps = props.slice(0, MAX_PROPS_DISPLAY);
    const hasMore = props.length > MAX_PROPS_DISPLAY;
    const cardHeight = Math.max(90, 55 + displayProps.length * 28 + (hasMore ? 24 : 0));
    const cardWidth = 280;

    // Store dimensions for reference
    node.attr('data-width', cardWidth).attr('data-height', cardHeight);

    // Outer glow/shadow
    node.append('rect')
        .attr('class', 'graph-card-shadow')
        .attr('width', cardWidth + 8)
        .attr('height', cardHeight + 8)
        .attr('x', -14)
        .attr('y', -cardHeight / 2 - 4)
        .attr('rx', 12);

    // Card background
    node.append('rect')
        .attr('class', 'graph-card-bg')
        .attr('width', cardWidth)
        .attr('height', cardHeight)
        .attr('x', -10)
        .attr('y', -cardHeight / 2)
        .attr('rx', 10);

    // Header bar
    node.append('rect')
        .attr('class', 'graph-card-header')
        .attr('width', cardWidth)
        .attr('height', 40)
        .attr('x', -10)
        .attr('y', -cardHeight / 2)
        .attr('rx', 10);

    // Decorative line
    node.append('line')
        .attr('class', 'graph-card-line')
        .attr('x1', -10)
        .attr('y1', -cardHeight / 2 + 40)
        .attr('x2', cardWidth - 10)
        .attr('y2', -cardHeight / 2 + 40);

    // Title icon
    node.append('circle')
        .attr('class', 'graph-card-icon')
        .attr('cx', 5)
        .attr('cy', -cardHeight / 2 + 20)
        .attr('r', 4);

    // Title text
    const titleText = d.data.name.length > 20 ? d.data.name.substring(0, 20) + '...' : d.data.name;
    const titleEl = node.append('text')
        .attr('class', 'graph-card-title')
        .attr('x', 15)
        .attr('y', -cardHeight / 2 + 24)
        .text(titleText);
    
    if (d.data.name.length > 20) {
        titleEl.append('title').text(d.data.name);
    }

    // Properties
    displayProps.forEach((prop, i) => {
        const propY = -cardHeight / 2 + 58 + i * 28;
        const propGroup = node.append('g')
            .attr('class', 'graph-property')
            .attr('transform', `translate(5, ${propY})`);

        // Property background
        propGroup.append('rect')
            .attr('class', 'graph-property-bg')
            .attr('width', cardWidth - 30)
            .attr('height', 24)
            .attr('x', 0)
            .attr('y', -16)
            .attr('rx', 4);

        let xPos = 6;

        // Color swatch
        if (isHexColor(prop.value)) {
            propGroup.append('rect')
                .attr('class', 'graph-color-swatch')
                .attr('width', 18)
                .attr('height', 18)
                .attr('x', xPos)
                .attr('y', -13)
                .attr('rx', 4)
                .attr('fill', prop.value);
            xPos += 24;
        }

        // Key
        const maxKeyLength = 10;
        const keyText = prop.key.length > maxKeyLength ? prop.key.substring(0, maxKeyLength) + '...' : prop.key;
        const keyEl = propGroup.append('text')
            .attr('class', 'graph-property-key')
            .attr('x', xPos)
            .attr('y', -2)
            .text(keyText + ':');
        
        if (prop.key.length > maxKeyLength) {
            keyEl.append('title').text(prop.key);
        }

        // Value
        const maxValueLength = 18;
        const valueText = prop.value.length > maxValueLength ? prop.value.substring(0, maxValueLength) + '...' : prop.value;
        const valueEl = propGroup.append('text')
            .attr('class', 'graph-property-value')
            .attr('x', xPos + (keyText.length * 7.2) + 8)
            .attr('y', -2)
            .text(valueText);
        
        if (prop.fullValue || prop.value.length > maxValueLength) {
            valueEl.append('title').text(prop.fullValue || prop.value);
        }
    });

    // "... X more" indicator
    if (hasMore) {
        const moreGroup = node.append('g')
            .attr('class', 'graph-more-indicator')
            .attr('transform', `translate(5, ${-cardHeight / 2 + 58 + displayProps.length * 28})`)
            .style('cursor', 'pointer');

        moreGroup.append('rect')
            .attr('class', 'graph-more-bg')
            .attr('width', cardWidth - 30)
            .attr('height', 20)
            .attr('x', 0)
            .attr('y', -14)
            .attr('rx', 4);

        moreGroup.append('text')
            .attr('class', 'graph-more-text')
            .attr('x', 6)
            .attr('y', -2)
            .text(`⋯ ${props.length - MAX_PROPS_DISPLAY} more properties`);
    }

    // Collapse/expand button
    if (d.children || d._children) {
        const btnGroup = node.append('g')
            .attr('class', 'collapse-btn')
            .style('cursor', 'pointer');

        // Button shadow
        btnGroup.append('circle')
            .attr('class', 'graph-btn-shadow')
            .attr('r', 14)
            .attr('cx', cardWidth - 24)
            .attr('cy', -cardHeight / 2 + 20);

        btnGroup.append('circle')
            .attr('class', d.children ? 'graph-btn-expanded' : 'graph-btn-collapsed')
            .attr('r', 13)
            .attr('cx', cardWidth - 24)
            .attr('cy', -cardHeight / 2 + 20);

        btnGroup.append('text')
            .attr('class', 'graph-btn-text')
            .attr('x', cardWidth - 24)
            .attr('y', -cardHeight / 2 + 26)
            .attr('text-anchor', 'middle')
            .style('pointer-events', 'none')
            .text(d.children ? '−' : '+');
    }

    // Child count badge
    if (d._children) {
        const childCount = d._children.length;
        const badgeWidth = childCount > 9 ? 28 : 24;
        
        node.append('rect')
            .attr('class', 'graph-badge-bg')
            .attr('x', cardWidth - 56 - (badgeWidth - 24))
            .attr('y', -cardHeight / 2 + 12)
            .attr('width', badgeWidth)
            .attr('height', 20)
            .attr('rx', 10);

        node.append('text')
            .attr('class', 'graph-badge-text')
            .attr('x', cardWidth - 44 - (badgeWidth - 24) / 2)
            .attr('y', -cardHeight / 2 + 24)
            .attr('text-anchor', 'middle')
            .text(childCount);
    }
}

export default function GraphViewer({ data }) {
    const svgRef = useRef(null);
    const [detailsModal, setDetailsModal] = useState(null);

    useEffect(() => {
        if (!svgRef.current || !data) return;

        const container = svgRef.current.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;

        d3.select(svgRef.current).selectAll('*').remove();

        const root = d3.hierarchy(transformData(data));
        
        // Collapse all nodes by default except root
        root.descendants().forEach((d, i) => {
            if (i > 0 && d.children) {
                d._children = d.children;
                d.children = null;
            }
        });
        
        const treeLayout = d3.tree()
            .nodeSize([160, 340])
            .separation((a, b) => (a.parent === b.parent ? 1 : 1.4));
        
        treeLayout(root);

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', 'translate(150, 50)');

        const zoom = d3.zoom()
            .scaleExtent([0.1, 3])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });
        svg.call(zoom);

        function drawGraph() {
            // Clear and redraw
            g.selectAll('.link').remove();
            g.selectAll('.node').remove();

            // Draw links with curve
            g.selectAll('.link')
                .data(root.links())
                .enter()
                .append('path')
                .attr('class', 'link')
                .attr('d', d3.linkHorizontal()
                    .x(d => d.y)
                    .y(d => d.x))
                .attr('fill', 'none')
                .attr('stroke', '#d0d7de')
                .attr('stroke-width', 2)
                .attr('opacity', 0.6);

            // Draw nodes
            const nodes = g.selectAll('.node')
                .data(root.descendants())
                .enter()
                .append('g')
                .attr('class', 'node')
                .attr('transform', d => `translate(${d.y},${d.x})`);

            nodes.each(function(d) {
                createNodeCard(d3.select(this), d);
            });

            // Hover effects
            nodes.selectAll('.card-bg')
                .on('mouseenter', function() {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('stroke', '#0969da')
                        .attr('stroke-width', 2);
                })
                .on('mouseleave', function() {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('stroke', '#e1e4e8')
                        .attr('stroke-width', 1.5);
                });

            // Click on card to show details
            nodes.selectAll('.card-bg, .card-header, text:not(.collapse-btn text)')
                .on('click', function(event, d) {
                    event.stopPropagation();
                    setDetailsModal(d.data);
                });

            // Click on collapse button
            nodes.selectAll('.collapse-btn')
                .on('click', function(event, d) {
                    event.stopPropagation();
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    treeLayout(root);
                    updateGraph();
                });
        }

        function updateGraph() {
            const t = d3.transition().duration(500).ease(d3.easeCubicInOut);

            // Update links
            const links = g.selectAll('.link')
                .data(root.links(), d => d.target.data.id);

            links.exit()
                .transition(t)
                .attr('opacity', 0)
                .remove();

            links.transition(t)
                .attr('d', d3.linkHorizontal()
                    .x(d => d.y)
                    .y(d => d.x));

            links.enter()
                .append('path')
                .attr('class', 'link')
                .attr('d', d3.linkHorizontal()
                    .x(d => d.y)
                    .y(d => d.x))
                .attr('fill', 'none')
                .attr('stroke', '#d0d7de')
                .attr('stroke-width', 2)
                .attr('opacity', 0)
                .transition(t)
                .attr('opacity', 0.6);

            // Update nodes
            const nodeUpdate = g.selectAll('.node')
                .data(root.descendants(), d => d.data.id);

            nodeUpdate.exit()
                .transition(t)
                .attr('opacity', 0)
                .remove();

            nodeUpdate.transition(t)
                .attr('transform', d => `translate(${d.y},${d.x})`);

            const nodeEnter = nodeUpdate.enter()
                .append('g')
                .attr('class', 'node')
                .attr('transform', d => `translate(${d.y},${d.x})`)
                .attr('opacity', 0);

            nodeEnter.each(function(d) {
                createNodeCard(d3.select(this), d);
            });

            nodeEnter.transition(t).attr('opacity', 1);

            // Reattach event handlers
            nodeEnter.selectAll('.card-bg')
                .on('mouseenter', function() {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('stroke', '#0969da')
                        .attr('stroke-width', 2);
                })
                .on('mouseleave', function() {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('stroke', '#e1e4e8')
                        .attr('stroke-width', 1.5);
                });

            nodeEnter.selectAll('.card-bg, .card-header, text:not(.collapse-btn text)')
                .on('click', function(event, d) {
                    event.stopPropagation();
                    setDetailsModal(d.data);
                });

            nodeEnter.selectAll('.collapse-btn')
                .on('click', function(event, d) {
                    event.stopPropagation();
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    treeLayout(root);
                    updateGraph();
                });
        }

        drawGraph();

    }, [data]);

    return (
        <>
            <svg ref={svgRef} className={styles.container} />
            {detailsModal && (
                <div className={styles.modal} onClick={() => setDetailsModal(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div>
                                <h3>{detailsModal.name}</h3>
                                <span className={styles.propCount}>
                                    {detailsModal.properties.length} {detailsModal.properties.length === 1 ? 'property' : 'properties'}
                                </span>
                            </div>
                            <button onClick={() => setDetailsModal(null)} aria-label="Close">✕</button>
                        </div>
                        <div className={styles.modalBody}>
                            {detailsModal.properties.length > 0 ? (
                                <div className={styles.propertyList}>
                                    {detailsModal.properties.map((prop, i) => (
                                        <div key={i} className={styles.propertyItem}>
                                            <div className={styles.propertyKey}>
                                                {isHexColor(prop.fullValue || prop.value) && (
                                                    <span 
                                                        className={styles.colorSwatchModal} 
                                                        style={{ backgroundColor: prop.fullValue || prop.value }}
                                                    />
                                                )}
                                                {prop.key}
                                            </div>
                                            <div className={styles.propertyValue}>
                                                {prop.fullValue || prop.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.emptyMessage}>No properties to display</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function transformData(obj, name = 'root', id = 0) {
    const node = { name, id: id++, properties: [], children: [] };

    if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            if (typeof value === 'object' && value !== null) {
                const childNode = transformData(value, key, id);
                id = childNode.maxId;
                node.children.push(childNode);
            } else {
                const fullValue = String(value);
                const displayValue = fullValue.length > MAX_VALUE_LENGTH 
                    ? fullValue.substring(0, MAX_VALUE_LENGTH) + '...' 
                    : fullValue;
                node.properties.push({ 
                    key, 
                    value: displayValue,
                    fullValue: fullValue !== displayValue ? fullValue : undefined
                });
            }
        });
    }

    node.maxId = id;
    return node;
}
