"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { getJsonSkeleton, flattenJson, getVisibleRows } from './utils';
import Header from '../components/Header/Header';
import Toolbar from '../components/Toolbar/Toolbar';
import VirtualizedJsonViewer from '../components/VirtualizedJsonViewer/VirtualizedJsonViewer';
import EmptyState from '../components/EmptyState/EmptyState';
import Modal from '../components/Modal/Modal';
import CopyToast from '../components/CopyToast/CopyToast';
import styles from './page.module.css';
import { Copy, DownloadSimple, X } from '@phosphor-icons/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Home() {
  const [jsonData, setJsonData] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedPath, setCopiedPath] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef();
  const parentRef = useRef();
  const searchInputRef = useRef();

  useEffect(() => {
    if (jsonData) {
      const newNodes = flattenJson(jsonData, [], 0, searchTerm);
      setNodes(newNodes);
    }
  }, [jsonData, searchTerm]);

  const visibleRows = useMemo(() => getVisibleRows(nodes), [nodes]);

  const skeletonJsonString = useMemo(() => {
    if (!jsonData) return '';
    return JSON.stringify(getJsonSkeleton(jsonData), null, 2);
  }, [jsonData]);

  const handleFileRead = useCallback((file) => {
    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setJsonData(json);
        setSearchTerm('');
      } catch (err) { setError('Invalid JSON file. Please check the file format.'); }
    };
    reader.onerror = () => { setError('Failed to read file. Please try again.'); };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleFileRead(file);
    } else { setError('Please drop a valid JSON file.'); }
  }, [handleFileRead]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleFileRead(file);
  }, [handleFileRead]);

  const handleToggle = useCallback((path) => {
    setNodes(prevNodes => {
      const newNodes = JSON.parse(JSON.stringify(prevNodes));
      let currentLevel = newNodes;
      let nodeToUpdate = null;
      for (const key of path) {
        nodeToUpdate = currentLevel.find(n => n.key === key);
        if (nodeToUpdate) { currentLevel = nodeToUpdate.children; }
        else break;
      }
      if (nodeToUpdate) { nodeToUpdate.isExpanded = !nodeToUpdate.isExpanded; }
      return newNodes;
    });
  }, []);

  const handlePathCopy = useCallback((pathString) => {
    if (!pathString) return;
    navigator.clipboard.writeText(pathString);
    setCopiedPath(pathString);
    setTimeout(() => setCopiedPath(''), 2500);
  }, []);

  const handleCopyToClipboard = useCallback((text) => navigator.clipboard.writeText(text), []);

  const expandAll = useCallback(() => {
    setNodes(prevNodes => {
      const expand = (nodeList) => nodeList.map(node => ({ ...node, isExpanded: true, children: expand(node.children) }));
      return expand(prevNodes);
    });
  }, []);

  const collapseAll = useCallback(() => {
    setNodes(prevNodes => {
      const collapse = (nodeList) => nodeList.map(node => ({ ...node, isExpanded: false, children: collapse(node.children) }));
      return collapse(prevNodes);
    });
  }, []);

  const downloadFile = useCallback((content, filename) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    const handleKeyboard = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); searchInputRef.current?.focus(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') { e.preventDefault(); fileInputRef.current?.click(); }
    };
    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  return (
    <div className={styles.appContainer}>
      <Header
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onFileOpen={() => fileInputRef.current?.click()}
        searchInputRef={searchInputRef}
        hasData={!!jsonData}
      />

      <input
        ref={fileInputRef} type="file"
        accept="application/json,.json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && <div className={styles.errorMessage}><X size={16} /> {error}</div>}

      {jsonData && (
        <Toolbar
          onExpand={expandAll}
          onCollapse={collapseAll}
          onGetStructure={() => setIsModalOpen(true)}
          onDownloadJson={() => downloadFile(JSON.stringify(jsonData, null, 2), 'data.json')}
          onDownloadSkeleton={() => downloadFile(skeletonJsonString, 'skeleton.json')}
        />
      )}

      <main
        className={styles.mainContent}
        onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
      >
        {jsonData ? (
          <VirtualizedJsonViewer
            parentRef={parentRef}
            visibleRows={visibleRows}
            onToggle={handleToggle}
            onPathCopy={handlePathCopy}
          />
        ) : (
          <EmptyState isDragging={isDragging} />
        )}
      </main>

      <CopyToast text={copiedPath} />

      <Modal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title="JSON Structure Skeleton"
      >
        <div className={styles.modalActions}>
          <button className={styles.btnPrimary} onClick={() => handleCopyToClipboard(skeletonJsonString)}>
            <Copy size={16} /> Copy
          </button>
          <button className={styles.btn} onClick={() => downloadFile(skeletonJsonString, 'skeleton.json')}>
            <DownloadSimple size={16} /> Download
          </button>
        </div>
        <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ margin: 0, borderRadius: '6px' }}>
          {skeletonJsonString}
        </SyntaxHighlighter>
      </Modal>
    </div>
  );
}