// @ts-check
const fs = require('fs');

const isComment = line => line.startsWith(';');
const isMultiLineTitle = line => line.startsWith(':') && (line.endsWith(':') || line.endsWith('end'));

const parseFile = (filePath) => {
    const file = fs.readFileSync(filePath, 'utf-8');
    const lines = file.split('\n');

    const blankLines = [];
    const comments = [];
    const multiLines = {};
    const singleLines = [];

    let blockName;
    let blockIndex;
    lines.forEach((line, index) => {
        // Comment
        if (isComment(line)) {
            comments.push({ index, line });
            return;
        }

        // Starting/ending block for multi-line
        if (isMultiLineTitle(line)) {
            const currentBlockName = line.split(':')[1];
            
            // Start
            if (currentBlockName !== 'end') {
                blockName = currentBlockName;
                blockIndex = index;
                multiLines[blockName] = [];
            }
            // End
            if (currentBlockName === 'end') {
                // Ensure all multi blocks have atleast a single entry so they know their index
                if ((multiLines[blockName]).length === 0) {
                    multiLines[blockName].push({ index: blockIndex, line: '' });
                }
                blockName = undefined;
            }
            return;
        }

        // We're in a multi-line block
        if (blockName) {
            multiLines[blockName].push({ index, line });
            return;
        }

        // Single-line
        if (line.includes('=')) {
            singleLines.push({ line, index });
            return;
        }

        // Empty line
        if (line.trim().length === 0) {
            blankLines.push({ index, line });
            return;
        }
    });

    return {
        blankLines,
        comments,
        singleLines,
        multiLines: Object.entries(multiLines)
    };
};

module.exports = parseFile;