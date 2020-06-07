// @ts-check
const fs = require('fs');
const translateSingleLine = require('./translate-single-line');
const translateMultiLine = require('./translate-multi-line');
const parseFile = require('./parse-file');

const sortByIndexKey = (array) => array.sort((a, b) => ((a.index < b.index) ? -1 : ((a.index > b.index) ? 1 : 0)));
const translateFile = async (baseFilePath, translationFilePath, outputFilePath) => {
    const baseFile = parseFile(baseFilePath);
    const translationFile = parseFile(translationFilePath);
    const translatedMultiLines = baseFile.multiLines.map(translateMultiLine(translationFile.multiLines));
    const translatedSingleLines = baseFile.singleLines.map(translateSingleLine(translationFile.singleLines));
    const translatedLines = sortByIndexKey([
        ...baseFile.blankLines,
        ...baseFile.comments,
        ...translatedMultiLines,
        ...translatedSingleLines
    ]);

    // Convert back to string
    const translation = translatedLines.map(({line}) => line).join('\n');

    if (!process.env.DEBUG) {
        // Write file
        await fs.promises.writeFile(outputFilePath, translation, 'utf-8');
    }

    return translation;
};

module.exports = translateFile;