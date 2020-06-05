// @ts-check
const fs = require('fs');
const translateSingleLine = require('./translate-single-line');
const translateMultiLine = require('./translate-multi-line');
const parseFile = require('./parse-file');
const log = require('./log');

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

    if (process.env.DEBUG) {
        log.info({
            baseFile,
            translationFile,
            translatedSingleLines,
            translatedMultiLines,
            translatedLines
        });
        return;
    }

    const result = translatedLines.map(({line}) => line).join('\n');
    await fs.promises.writeFile(outputFilePath, result, 'utf-8');
};

module.exports = translateFile;