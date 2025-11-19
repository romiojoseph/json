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
                else if (value instanceof Date) skeleton[key] = value.toISOString();
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

    // Helper function to recursively check if any descendant matches
    const hasMatchInDescendants = (children) => {
        return children.some(child => {
            if (child.matchesSearch) return true;
            if (child.children.length > 0) {
                return hasMatchInDescendants(child.children);
            }
            return false;
        });
    };

    Object.keys(json).forEach(key => {
        const value = json[key];
        const newPath = [...path, key];
        const isObject = typeof value === 'object' && value !== null && !(value instanceof Date);
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

        const hasMatchingChildren = isObject && hasMatchInDescendants(node.children);
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

// Robust copy to clipboard function
export const copyToClipboard = async (text) => {
    if (!text) return false;

    try {
        // Try modern API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        throw new Error('Clipboard API unavailable');
    } catch (err) {
        // Fallback for older browsers / mobile webviews
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;

            // Ensure it's not visible but part of DOM
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        } catch (fallbackErr) {
            console.error('Copy failed', fallbackErr);
            return false;
        }
    }
};
