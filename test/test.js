const { default: test } = require('ava');
const translateSingleLine = require('../sync/translate-single-line');
const translateMultiLine = require('../sync/translate-multi-line');

test('single-line', t => {
    const translations = [
        'Phrase with translation but no example=Translation',
        'Phrase with example=',
        'Phrase with example and a translation=Translation'
    ];

    const translate = translateSingleLine(translations);

    // Phrase with translation but no example
    const phraseWithTranslationButNoExample = translate('Phrase with translation but no example=')
    t.is(phraseWithTranslationButNoExample, 'Phrase with translation but no example=Translation');
    t.snapshot(phraseWithTranslationButNoExample, 'Phrase with translation but no example');

    // Phrase with example but no translation
    const phraseWithExampleButNoTranslation = translate('Phrase with example but no translation=Example');
    t.is(phraseWithExampleButNoTranslation, 'Phrase with example but no translation=Example');
    t.snapshot(phraseWithExampleButNoTranslation, 'Phrase with example but no translation');

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
        phrase_with_translation_but_no_example: [
            'Translation'
        ],
        phrase_with_example: [],
        phrase_with_example_and_a_translation: [
            'Translation'
        ]
    };

    const translate = translateMultiLine(translations);

    // Phrase with translation but no example
    const phraseWithTranslationButNoExample = translate(['phrase_with_translation_but_no_example', []]);
    t.is(phraseWithTranslationButNoExample, ':phrase_with_translation_but_no_example:\nTranslation\n:end');
    t.snapshot(phraseWithTranslationButNoExample, 'Phrase with translation but no example');

    // Phrase with example but no translation
    const phraseWithExampleButNoTranslation = translate(['phrase_with_example_but_no_translation', [
        'Example text',
        'even on multiple lines.'
    ]]);
    t.is(phraseWithExampleButNoTranslation, ':phrase_with_example_but_no_translation:\nExample text\neven on multiple lines.\n:end');
    t.snapshot(phraseWithExampleButNoTranslation, 'Phrase with example but no translation');

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