const fs = require('fs');
const translateSingleLine = require('./translate-single-line');
const translateMultiLine = require('./translate-multi-line');
const parseFile = require('./parse-file');
const log = require('./log');

const translateFile = (baseFilePath, translationFilePath, outputFilePath) => {
    const baseFile = parseFile(baseFilePath);
    const translationFile = parseFile(translationFilePath);
    const translatedSingleLines = baseFile.singleLines.map(translateSingleLine(translationFile.singleLines));
    const translatedMultiLines = Object.keys(baseFile.multiLines).map(translateMultiLine(translationFile.multiLines));
    const translatedLines = [
        ...translatedSingleLines,
        ...translatedMultiLines
    ];

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

    fs.writeFileSync(outputFilePath, translatedLines.join('\n'), 'utf-8');
};

module.exports = translateFile;