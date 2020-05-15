const { default: test } = require('ava');
const translateSingleLine = require('../sync/translate-single-line');
const translateMultiLine = require('../sync/translate-multi-line');

test('single-line', t => {
    const translations = [
        'Phrase=Translation',
        'Phrase with example=',
        'Phrase with example and a translation=Translation'
    ];

    const translate = translateSingleLine(translations);

    // Phrase
    const phrase = translate('Phrase=')
    t.is(phrase, 'Phrase=Translation');
    t.snapshot(phrase, 'Phrase');

    // Phrase with example
    const phraseWithExample = translate('Phrase with example=Example');
    t.is(phraseWithExample, 'Phrase with example=Example');
    t.snapshot(phraseWithExample, 'Phrase with example');

    // Phrase with example and translation
    const phraseWithExampleAndTranslation = translate('Phrase with example and a translation=phrase with example and a translation');
    t.is(phraseWithExampleAndTranslation, 'Phrase with example and a translation=Translation');
    t.snapshot(phraseWithExampleAndTranslation, 'Phrase with example and translation');


    // Phrase with no example and no translation
    const phraseWithNoExampleAndNoTranslation = translate('Phrase with no translation and no example=');
    t.is(phraseWithNoExampleAndNoTranslation, 'Phrase with no translation and no example=');
    t.snapshot(phraseWithNoExampleAndNoTranslation, 'Phrase with no example and no translation');
});

test('multi-line', t => {
    const translations = {
        phrase: [
            'Translation'
        ],
        phrase_with_example: [],
        phrase_with_example_and_a_translation: [
            'Translation'
        ]
    };

    const translate = translateMultiLine(translations);

    // Phrase
    const phrase = translate(['phrase', []]);
    t.is(phrase, ':phrase:\nTranslation\n:end');
    t.snapshot(phrase, 'Phrase');

    // Phrase with example
    const phraseWithExample = translate(['phrase_with_example', [
        'Example text',
        'even on multiple lines.'
    ]]);
    t.is(phraseWithExample, ':phrase_with_example:\nExample text\neven on multiple lines.\n:end');
    t.snapshot(phraseWithExample, 'Phrase with example');

    // Phrase with example and translation
    const phraseWithExampleAndTranslation = translate(['phrase_with_example_and_a_translation', [
        'Example text.'
    ]]);
    t.is(phraseWithExampleAndTranslation, ':phrase_with_example_and_a_translation:\nTranslation\n:end');
    t.snapshot(phraseWithExampleAndTranslation, 'Phrase with example and translation');

    // Phrase with no example and no translation
    const phraseWithNoExampleAndNoTranslation = translate(['phrase_with_no_translation_and_no_example', []]);
    t.is(phraseWithNoExampleAndNoTranslation, ':phrase_with_no_translation_and_no_example:\n\n:end');
    t.snapshot(phraseWithNoExampleAndNoTranslation, 'Phrase with no example and no translation');
});