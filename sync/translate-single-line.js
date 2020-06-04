const translateSingleLine = translations => ({ line, index }) => {
    // Skip as this is a blank line
    if (line.trim().length === 0) {
        return;
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
    const translation = translations[index];

    // Can't find translation
    if (!translation) {
        return line;
    }

    const [_, translatedLine] = translation.line.split('=');

    // Found translation
    return `${phrase}=${translatedLine === '' ? (inputExample || '') : translatedLine}`;
};

module.exports = translateSingleLine;