const translateMultiLine = (translations) => ([blockName, block]) => {
    const translation = (block || translations[blockName]).join('\n');
    return `:${blockName}:\n${translation}\n:end`;
};

module.exports = translateMultiLine;