const fs = require('fs');
const path = require('path');

const log = console;
const args = process.argv.slice(2);
const baseFilePath = path.resolve(args[0] || './base.txt');
const translationFilePath = path.resolve(args[1] || './translation.txt');
const ouputFilePath = path.resolve(args[2] || './ouput.txt');

const usage = (exitCode) => {
    log.info('Usage: node sync.js ./base.txt ./translation.txt ./output.txt');
    process.exit(exitCode || 0);
};

const checkExists = (paths) => {
    if (!Array.isArray(paths)) {
        throw new Error('Only arrays allowed!');
    }
    return paths.map(filePath => [filePath, fs.existsSync(filePath)]);
}

const filesExist = checkExists([baseFilePath, translationFilePath]).filter(([, exists]) => !exists);

// No args
if (args.length === 0) {
    usage(1);
}

// Missing files
if (filesExist.length !== 0) {
    log.info(`Missing files ${filesExist.map(([filePath]) => `"${filePath}"`).join(', ')}`);
    process.exit(1);
}

const baseFile = fs.readFileSync(baseFilePath, 'utf-8');
const translationFile = fs.readFileSync(translationFilePath, 'utf-8');

const basePhrases = baseFile.split('\n');
const translations = translationFile.split('\n').map(line => line.split('='));

const newLanguage = basePhrases.map(line => {
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
}).join('\n');

fs.writeFileSync(ouputFilePath, newLanguage, 'utf-8');
