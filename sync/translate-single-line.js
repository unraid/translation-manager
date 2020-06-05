// @ts-check

const translateSingleLine = translations => ({ line, index }) => {
    // Get input
    const [phrase, inputExample] = line.split('=');

    // Weird line? Not a translation or comment
    if (!phrase || !line.includes('=')) {
        return {
            index,
            line: ''
        };
    }

    // Get translation
    const translation = translations.find(line => index === line.index);

    // Can't find translation
    if (!translation) {
        return {
            index,
            line
        };
    }

    const [_, translatedLine] = translation.line.split('=');

    // Found translation
    return {
        index,
        line: `${phrase}=${translatedLine === '' ? (inputExample || '') : translatedLine}`
    };
};

module.exports = translateSingleLine;