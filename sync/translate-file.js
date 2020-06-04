const fs = require('fs');
const translateSingleLine = require('./translate-single-line');
const translateMultiLine = require('./translate-multi-line');
const parseFile = require('./parse-file');
const log = require('./log');

const translateFile = (baseFilePath, translationFilePath, outputFilePath) => {
    const baseFile = parseFile(baseFilePath);
    const translationFile = parseFile(translationFilePath);
    const translatedSingleLines = baseFile.singleLines.map(translateSingleLine(translationFile.singleLines));
    const translatedMultiLines = baseFile.multiLines.map(translateMultiLine(translationFile.multiLines));
    const translatedLines = [
        ...translatedSingleLines,
        ...translatedMultiLines.map(line => `${line}\n`)
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

    const singleLinesText = translatedSingleLines.join('\n').trim();
    const multiLinesText = translatedMultiLines.join('\n\n').trim();
    fs.writeFileSync(outputFilePath, [singleLinesText, multiLinesText].join('\n\n'), 'utf-8');
};

module.exports = translateFile;