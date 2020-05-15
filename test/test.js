const { default: test } = require('ava');
const translateSingleLine = require('../sync/translate-single-line');
const translateMultiLine = require('../sync/translate-multi-line');

test('single-line', t => {
    const french = [
        'English phrase=French phrase',
        'English phrase with example=',
        'English phrase with example and a translation=French translation'
    ];

    const translate = translateSingleLine(french);

    t.is(translate('English phrase='), 'English phrase=French phrase');
    t.is(translate('English phrase with example=English example'), 'English phrase with example=English example');
    t.is(translate('English phrase with example and a translation=English phrase with example and a translation'), 'English phrase with example and a translation=French translation');
    t.is(translate('English phrase with no translation and no example='), 'English phrase with no translation and no example=');
});


test('multi-line', t => {
    const french = {
        english_phrase: [
            'French phrase'
        ],
        english_phrase_with_example: [],
        english_phrase_with_example_and_a_translation: [
            'French translation'
        ]
    };

    const translate = translateMultiLine(french);

    t.is(translate(['english_phrase', []]), ':english_phrase:\nFrench phrase\n:end');
    t.is(translate(['english_phrase_with_example', [
        'English example',
        'even on multiple lines.'
    ]]), ':english_phrase_with_example:\nEnglish example\neven on multiple lines.\n:end');
    t.is(translate(['english_phrase_with_example_and_a_translation', [
        'This is the english example.'
    ]]), ':english_phrase_with_example_and_a_translation:\nFrench translation\n:end');
    t.is(translate(['english_phrase_with_no_translation_and_no_example', []]), ':english_phrase_with_no_translation_and_no_example:\n\n:end');
});