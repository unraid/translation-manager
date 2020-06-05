// @ts-check

const getTranslatedBlock = (translations, blockName) => {
    const translation = translations.find(([translatedBlockName]) => translatedBlockName === blockName);
    if (translation) {
        return {
            // We return the first index as we ignore any missing indexes when rejoining the lines
            index: translation[1][0].index,
            line: translation[1].map(({line}) => line).join('\n')
        }
    }
}

const translateMultiLine = (translations) => ([blockName, block]) => {
    const translation = getTranslatedBlock(translations, blockName);

    // Return example
    if (!translation) {
        const result = {
            index: block[0].index,
            line: `:${blockName}:\n${block.map(({line}) => line).join('\n')}\n:end`
        };
        return result;
    }

    // Return translation
    const result = {
        index: translation.index,
        line: `:${blockName}:\n${translation.line}\n:end`
    };
    return result;
};

module.exports = translateMultiLine;