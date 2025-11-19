"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { getJsonSkeleton, flattenJson, getVisibleRows } from './utils';
import Header from '../components/Header/Header';
import VirtualizedJsonViewer from '../components/VirtualizedJsonViewer/VirtualizedJsonViewer';
import EmptyState from '../components/EmptyState/EmptyState';
import Modal from '../components/Modal/Modal';
import PasteModal from '../components/PasteModal/PasteModal';
import CopyToast from '../components/CopyToast/CopyToast';
import Footer from '../components/Footer/Footer';
import styles from './page.module.css';
import { Copy, DownloadSimple, X, MagnifyingGlassPlus } from '@phosphor-icons/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { JSONPath } from 'jsonpath-plus';
import { json2csv } from 'json-2-csv';
import Papa from 'papaparse';
import dynamic from 'next/dynamic';

// Dynamically import the GraphViewer to ensure it's a client-side component
const GraphViewer = dynamic(() => import('../components/GraphViewer/GraphViewer'), { ssr: false });

export default function Home() {
  const [jsonData, setJsonData] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedPath, setCopiedPath] = useState('');
  const [copyCount, setCopyCount] = useState(0);
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [jsonPathQuery, setJsonPathQuery] = useState('$..*');
  const [queryResult, setQueryResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('tree'); // 'tree' or 'graph'

  const fileInputRef = useRef();
  const parentRef = useRef();
  const searchInputRef = useRef();

  // Compute nodes when JSON is loaded or when the user searches.
  // We avoid calling setState synchronously inside an effect by
  // updating nodes at the time we load the JSON and when the
  // search input changes (see below). This keeps `nodes` as
  // mutable state for expand/collapse operations while avoiding
  // cascading renders from an effect.

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
        const content = event.target.result;
        let json;

        if (file.name.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
          const result = Papa.parse(content, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            transform: (value) => {
              try {
                if (typeof value === 'string' && (value.trim().startsWith('{') || value.trim().startsWith('['))) {
                  return JSON.parse(value);
                }
              } catch (e) { /* ignore */ }
              return value;
            }
          });

          if (result.errors.length > 0) {
            console.warn('CSV Parsing Errors:', result.errors);
            if (!result.data || result.data.length === 0) {
              throw new Error('Error parsing CSV: ' + result.errors[0].message);
            }
          }
          json = result.data;
        } else {
          json = JSON.parse(content);
        }

        setJsonData(json);
        // reset search and initialize nodes right away to avoid
        // updating nodes inside an effect
        setSearchTerm('');
        setNodes(flattenJson(json, [], 0, ''));
      } catch (err) {
        console.error(err);
        setError(err.message || 'Invalid file format. Please check the file.');
      }
    };
    reader.onerror = () => { setError('Failed to read file. Please try again.'); };
    reader.readAsText(file);
  }, []);

  const handlePasteJson = useCallback((json) => {
    setJsonData(json);
    setSearchTerm('');
    setNodes(flattenJson(json, [], 0, ''));
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/json' || file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      handleFileRead(file);
    } else { setError('Please drop a valid JSON or CSV file.'); }
  }, [handleFileRead]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleFileRead(file);
  }, [handleFileRead]);

  const handleToggle = useCallback((path, isRecursive = false) => {
    setNodes(prevNodes => {
      const newNodes = JSON.parse(JSON.stringify(prevNodes));
      let currentLevel = newNodes;
      let nodeToUpdate = null;
      for (const key of path) {
        nodeToUpdate = currentLevel.find(n => n.key === key);
        if (nodeToUpdate) { currentLevel = nodeToUpdate.children; }
        else break;
      }

      if (nodeToUpdate) {
        const newState = !nodeToUpdate.isExpanded;

        if (isRecursive) {
          const updateRecursive = (node, state) => {
            node.isExpanded = state;
            if (node.children) {
              node.children.forEach(child => updateRecursive(child, state));
            }
          };
          updateRecursive(nodeToUpdate, newState);
        } else {
          nodeToUpdate.isExpanded = newState;
        }
      }
      return newNodes;
    });
  }, []);

  const handlePathCopy = useCallback((pathString) => {
    if (!pathString) return;
    navigator.clipboard.writeText(pathString);
    setCopiedPath('Copied to clipboard');
    setCopyCount(c => c + 1);
    setTimeout(() => setCopiedPath(''), 2500);
  }, []);

  const handleCopyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    setCopiedPath('Copied to clipboard');
    setCopyCount(c => c + 1);
    setTimeout(() => setCopiedPath(''), 2500);
  }, []);

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

  const handleJsonPathQuery = useCallback(() => {
    if (!jsonData) return;
    try {
      const result = JSONPath({ path: jsonPathQuery, json: jsonData });
      setQueryResult(result);
    } catch (e) {
      setQueryResult(`Error executing JSONPath query: ${e.message}`);
    }
  }, [jsonData, jsonPathQuery]);

  const handleExportCsv = useCallback(async () => {
    if (!jsonData) return;
    try {
      const csv = await json2csv(jsonData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(`Could not convert to CSV. This typically happens if the JSON is not an array of objects.\n\nError: ${e.message}`);
    }
  }, [jsonData]);

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
        onSearchChange={(e) => {
          const value = e.target.value;
          setSearchTerm(value);
          if (jsonData) setNodes(flattenJson(jsonData, [], 0, value));
        }}
        onFileOpen={() => fileInputRef.current?.click()}
        onPasteClick={() => setIsPasteModalOpen(true)}
        searchInputRef={searchInputRef}
        hasData={!!jsonData}
        onExpand={expandAll}
        onCollapse={collapseAll}
        onGetStructure={() => setIsStructureModalOpen(true)}
        onQuery={() => setIsQueryModalOpen(true)}
        onExportCsv={handleExportCsv}
        onDownloadJson={() => downloadFile(JSON.stringify(jsonData, null, 2), 'data.json')}
        onDownloadSkeleton={() => downloadFile(skeletonJsonString, 'skeleton.json')}
        activeView={activeView}
        onSetView={setActiveView}
      />

      <input
        ref={fileInputRef} type="file"
        accept="application/json,.json,.csv,text/csv"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && <div className={styles.errorMessage}><X size={16} /> {error}</div>}

      <main
        className={styles.mainContent}
        style={jsonData ? { height: 'calc(100vh - 120px)' } : {}}
        onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
      >
        {jsonData ? (
          <>
            {activeView === 'tree' && (
              <VirtualizedJsonViewer
                parentRef={parentRef}
                visibleRows={visibleRows}
                onToggle={handleToggle}
                onPathCopy={handlePathCopy}
              />
            )}
            {activeView === 'graph' && <GraphViewer data={jsonData} />}
          </>
        ) : (
          <EmptyState
            isDragging={isDragging}
            onPasteClick={() => setIsPasteModalOpen(true)}
          />
        )}
      </main>

      <CopyToast key={copyCount} text={copiedPath} />

      <Modal
        isOpen={isStructureModalOpen} onClose={() => setIsStructureModalOpen(false)}
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
        <SyntaxHighlighter language="json" style={nightOwl} customStyle={{ margin: 0, borderRadius: '6px' }}>
          {skeletonJsonString}
        </SyntaxHighlighter>
      </Modal>

      <Modal
        isOpen={isQueryModalOpen} onClose={() => { setIsQueryModalOpen(false); setQueryResult(null); }}
        title="Query with JSONPath"
      >
        <div className={styles.queryContainer}>
          <input
            type="text"
            className={styles.queryInput}
            value={jsonPathQuery}
            onChange={(e) => setJsonPathQuery(e.target.value)}
            placeholder="Enter JSONPath query (e.g., $.store.book[*].author)"
          />
          <button className={styles.btnPrimary} onClick={handleJsonPathQuery}>
            <MagnifyingGlassPlus size={16} /> Run Query
          </button>
        </div>
        {queryResult && (
          <div className={styles.resultsContainer}>
            <h3>Results:</h3>
            <SyntaxHighlighter language="json" style={nightOwl} customStyle={{ margin: 0, borderRadius: '6px' }}>
              {JSON.stringify(queryResult, null, 2)}
            </SyntaxHighlighter>
          </div>
        )}
      </Modal>

      <PasteModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onPaste={handlePasteJson}
      />

      {!jsonData && <Footer />}
    </div>
  );
}