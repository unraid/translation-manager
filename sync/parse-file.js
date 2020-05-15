const fs = require('fs');

const log = console;

const splitIntoTranslations = (line) => {
    return line.split('=');
};

const translateSingleLine = translations => (line) => {
    // Skip as this is a comment line
    if (line.startsWith(';')) {
        return line;
    }

    // Get input
    const [inputPhrase, inputExample] = line.split('=');

    // Weird line? Not a translation or comment
    if (!inputPhrase || !line.includes('=')) {
        return '';
    }

    // Get translation
    const translation = translations.find(translation => inputPhrase === translation[0]);

    // Can't find translation
    if (!translation) {
        return line;
    }

    // Found translation
    return `${inputPhrase}=${translation[1] === undefined ? (inputExample || '') : translation[1]}`;
};

const translateMultiLine = () => {

}

const parseFile = (baseFilePath, translationFilePath, outputFilePath) => {
    const baseFile = fs.readFileSync(baseFilePath, 'utf-8');
    const baseLines = baseFile.split('\n');
    const basePhrases = baseLines;

    const translationFile = fs.readFileSync(translationFilePath, 'utf-8');
    const translationLines = translationFile.split('\n');
    const translations = translationLines.map(splitIntoTranslations);

    const untranslatedMultiLines = [];
    const untranslatedSingleLines = [];

    const isMultiLineComment = line => {
        return line.startsWith(':') && (line.endsWith(':') || line.endsWith('end'))
    };

    let blockName;
    baseLines.forEach(line => {
        // Starting/ending comment for multi-line translation
        if (isMultiLineComment(line)) {
            blockName = line.split(':')[1];
            // Start
            if (blockName !== 'end') {
                untranslatedMultiLines[blockName] = [];
            }
            // End
            if (blockName === 'end') {
                blockName = undefined;
            }
            return;
        }

        // We're in a multi-line comment block
        if (blockName) {
            untranslatedMultiLines[blockName].push(line);
            return;
        }

        // Single-line translation
        if (line.includes('=')) {
            untranslatedSingleLines.push(line);
        }
    });

    const translatedLines = [
        // ...untranslatedMultiLines.map(translateMultiLine(translations)),
        ...untranslatedSingleLines.map(translateSingleLine(translations))
    ];

    if (process.env.DEBUG) {
        log.info({
            untranslatedMultiLines,
            untranslatedSingleLines,
            translatedLines
        });
        return;
    }

    // fs.writeFileSync(outputFilePath, newLanguage, 'utf-8');
};

module.exports = parseFile;