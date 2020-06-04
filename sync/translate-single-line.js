const translateSingleLine = translations => (line) => {
    // Skip as this is a blank line
    if (line.trim().length === 0) {
        return line.trim();
    }

    // Skip as this is a comment line
    if (line.startsWith(';')) {
        return line;
    }

    // Get input
    const [phrase, inputExample] = line.split('=');

    // Weird line? Not a translation or comment
    if (!phrase || !line.includes('=')) {
        return '';
    }

    // Get translation
    const translation = translations.find(translation => phrase === translation.split('=')[0]);

    // Can't find translation
    if (!translation) {
        return line;
    }

    const [_, translatedLine] = translation.split('=');

    // Found translation
    return `${phrase}=${translatedLine === '' ? (inputExample || '') : translatedLine}`;
};

module.exports = translateSingleLine;