// This file should be named app/utils.js

// Utility: Get JSON skeleton structure
export const getJsonSkeleton = (jsonObject, maxArrayItems = 1) => {
    if (jsonObject === null) return null;
    if (Array.isArray(jsonObject)) {
        if (jsonObject.length === 0) return [];
        const sampleSize = Math.min(maxArrayItems, jsonObject.length);
        const result = [];
        for (let i = 0; i < sampleSize; i++) {
            result.push(getJsonSkeleton(jsonObject[i], maxArrayItems));
        }
        if (jsonObject.length > sampleSize) {
            result.push(`[... ${jsonObject.length - sampleSize} more items]`);
        }
        return result;
    }
    if (typeof jsonObject === 'object' && jsonObject !== null) {
        const skeleton = {};
        for (const key in jsonObject) {
            if (Object.prototype.hasOwnProperty.call(jsonObject, key)) {
                const value = jsonObject[key];
                if (value === null) skeleton[key] = null;
                else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                    skeleton[key] = getJsonSkeleton(value, maxArrayItems);
                } else if (typeof value === 'boolean') skeleton[key] = "<boolean>";
                else if (typeof value === 'number') skeleton[key] = "<number>";
                else if (typeof value === 'string') skeleton[key] = "<string>";
                else skeleton[key] = `<${typeof value}>`;
            }
        }
        return skeleton;
    }
    return `<${typeof jsonObject}>`;
};

// Utility: Flatten JSON for virtualization
export const flattenJson = (json, path = [], depth = 0, searchTerm = '') => {
    let nodes = [];
    if (typeof json !== 'object' || json === null) return nodes;

    Object.keys(json).forEach(key => {
        const value = json[key];
        const newPath = [...path, key];
        const isObject = typeof value === 'object' && value !== null;
        const valueString = isObject ? '' : String(value);
        const matchesSearch = !searchTerm ||
            key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            valueString.toLowerCase().includes(searchTerm.toLowerCase());

        const node = {
            key,
            value,
            depth,
            path: newPath,
            isObject,
            isExpanded: searchTerm ? true : false,
            matchesSearch,
            children: isObject ? flattenJson(value, newPath, depth + 1, searchTerm) : [],
        };

        const hasMatchingChildren = isObject && node.children.some(c => c.matchesSearch);
        if (matchesSearch || hasMatchingChildren) {
            nodes.push(node);
        }
    });
    return nodes;
};

// Get visible rows based on expansion state
export const getVisibleRows = (nodes) => {
    const visibleRows = [];
    const traverse = (nodeList) => {
        nodeList.forEach(node => {
            visibleRows.push(node);
            if (node.isExpanded && node.children.length > 0) {
                traverse(node.children);
            }
        });
    };
    traverse(nodes);
    return visibleRows;
};

// Build JSONPath string
export const buildPathString = (path) => {
    return path.reduce((acc, key) => {
        if (!isNaN(parseInt(key, 10))) return acc + `[${key}]`;
        return acc + `["${String(key).replace(/"/g, '\\"')}"]`;
    }, '$');
};