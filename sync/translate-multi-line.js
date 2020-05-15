const translateMultiLine = (translations) => blockName => {
    return `:${blockName}:\n${translations[blockName].join('\n')}\n:end`;
};

module.exports = translateMultiLine;