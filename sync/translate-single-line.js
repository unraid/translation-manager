const translateSingleLine = translations => (line) => {
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

    // Found translation
    return `${phrase}=${translation[1] === undefined ? (inputExample || '') : translation[1]}`;
};

module.exports = translateSingleLine;