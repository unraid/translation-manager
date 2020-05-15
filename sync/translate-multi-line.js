const translateMultiLine = (translations) => ([blockName, block]) => {
    const translation = ((translations[blockName] || []).length === 0 ? block : translations[blockName]).join('\n');
    return `:${blockName}:\n${translation}\n:end`;
};

module.exports = translateMultiLine;