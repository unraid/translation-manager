const { default: test } = require('ava');
const translateSingleLine = require('../sync/translate-single-line');
const translateMultiLine = require('../sync/translate-multi-line');

test('single-line', t => {
    const french = [
        'English phrase=French phrase',
        'English phrase with example='
    ];

    const translate = translateSingleLine(french);

    t.is(translate('English phrase='), 'English phrase=French phrase');
    t.is(translate('English phrase with example=English example'), 'English phrase with example=English example');
    t.is(translate('English phrase with no traslation and no example='), 'English phrase with no traslation and no example=');
});


test('multi-line', t => {
    const french = {
        english_phrase: [],
        english_phrase_with_example: [
            'English example',
            'even on multiple lines.'
        ]
    };

    const translate = translateMultiLine(french);

    t.is(translate('english_phrase'), ':english_phrase:\n\n:end');
    t.is(translate('english_phrase_with_example'), ':english_phrase_with_example:\nEnglish example\neven on multiple lines.\n:end');
});