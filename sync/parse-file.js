const fs = require('fs');

const parseFile = (filePath) => {
    const file = fs.readFileSync(filePath, 'utf-8');
    const lines = file.split('\n');

    const multiLines = {};
    const singleLines = [];

    const isMultiLineComment = line => {
        return line.startsWith(':') && (line.endsWith(':') || line.endsWith('end'))
    };

    let blockName;
    lines.forEach(line => {
        // Empty line
        if (line.trim().length === 0) {
            singleLines.push(line.trim());
            return;
        }

        // Single-line comment
        if (line.startsWith(';')) {
            singleLines.push(line);
            return;
        }
        
        // Starting/ending comment for multi-line translation
        if (isMultiLineComment(line)) {
            blockName = line.split(':')[1];
            // Start
            if (blockName !== 'end') {
                multiLines[blockName] = [];
            }
            // End
            if (blockName === 'end') {
                blockName = undefined;
            }
            return;
        }

        // We're in a multi-line comment block
        if (blockName) {
            multiLines[blockName].push(line);
            return;
        }

        // Single-line translation
        if (line.includes('=')) {
            singleLines.push(line);
        }
    });

    return {
        singleLines,
        multiLines: Object.entries(multiLines)
    };
};

module.exports = parseFile;