// @ts-check
const { promises: { readFile } } = require('fs');
const { default: test } = require('ava');
const tempy = require('tempy');
const translateSingleLine = require('../sync/translate-single-line');
const translateMultiLine = require('../sync/translate-multi-line');
const translateFile = require('../sync/translate-file');

test('single-line', t => {
    const translations = [{
        index: 0,
        line: 'Phrase with translation but no example=Translation'
    }, {
        index: 1,
        line: 'Phrase with example=',
    }, {
        index: 2,
        line: 'Phrase with example and a translation=Translation'
    }];

    const translate = translateSingleLine(translations);

    // Phrase with translation but no example
    const phraseWithTranslationButNoExample = translate({
        line: 'Phrase with translation but no example=',
        index: 0
    });
    t.is(phraseWithTranslationButNoExample.index, 0);
    t.is(phraseWithTranslationButNoExample.line, 'Phrase with translation but no example=Translation');
    t.snapshot(phraseWithTranslationButNoExample.line, 'Phrase with translation but no example');

    // Phrase with example but no translation
    const phraseWithExampleButNoTranslation = translate({
        line: 'Phrase with example but no translation=Example',
        index: 4
    });
    t.is(phraseWithExampleButNoTranslation.index, 4);
    t.is(phraseWithExampleButNoTranslation.line, 'Phrase with example but no translation=Example');
    t.snapshot(phraseWithExampleButNoTranslation.line, 'Phrase with example but no translation');

    // Phrase with example and translation
    const phraseWithExampleAndTranslation = translate({
        line: 'Phrase with example and a translation=phrase with example and a translation',
        index: 2
    });
    t.is(phraseWithExampleAndTranslation.index, 2);
    t.is(phraseWithExampleAndTranslation.line, 'Phrase with example and a translation=Translation');
    t.snapshot(phraseWithExampleAndTranslation.line, 'Phrase with example and translation');

    // Phrase with no example and no translation
    const phraseWithNoExampleAndNoTranslation = translate({
        line: 'Phrase with no translation and no example=',
        index: 5
    });
    t.is(phraseWithNoExampleAndNoTranslation.index, 5);
    t.is(phraseWithNoExampleAndNoTranslation.line, 'Phrase with no translation and no example=');
    t.snapshot(phraseWithNoExampleAndNoTranslation.line, 'Phrase with no example and no translation');
});

test('single-line file', async t => {
    // Get example files
    const enUsSingleLineFileContent = await readFile('./test/examples/en-us/single-line.txt', 'utf-8');
    const nlNlSingleLineFileContent = await readFile('./test/examples/nl-nl/single-line.txt', 'utf-8');

    // Get file paths ready, prefill base and translation.
    const singleLineBaseFilePath = tempy.writeSync(enUsSingleLineFileContent);
    const singleLineTranslationFilePath = tempy.writeSync(nlNlSingleLineFileContent);
    const singleLineOutputFilePath = tempy.file();

    // Translate file
    await translateFile(singleLineBaseFilePath, singleLineTranslationFilePath, singleLineOutputFilePath);
    
    // Check results
    t.snapshot(await readFile(singleLineBaseFilePath, 'utf-8'), 'Single-line file (base)');
    t.snapshot(await readFile(singleLineTranslationFilePath, 'utf-8'), 'Single-line file (translation)');
    t.snapshot(await readFile(singleLineOutputFilePath, 'utf-8'), 'Single-line file (output)');
});

test('multi-line', t => {
    const translations = [
        [
            'phrase_with_translation_but_no_example', [{
                index: 1,
                line: 'Translation'
            }]
        ],
        [
            'phrase_with_example', []
        ],
        [
            'phrase_with_example_and_a_translation', [{
                index: 6,
                line: 'Translation'
            }]
        ]
    ];

    const translate = translateMultiLine(translations);

    // Phrase with translation but no example
    const phraseWithTranslationButNoExample = translate(['phrase_with_translation_but_no_example', []]);
    t.is(phraseWithTranslationButNoExample.index, 1);
    t.is(phraseWithTranslationButNoExample.line, ':phrase_with_translation_but_no_example:\nTranslation\n:end');
    t.snapshot(phraseWithTranslationButNoExample.line, 'Phrase with translation but no example');

    // Phrase with example but no translation
    const phraseWithExampleButNoTranslation = translate(['phrase_with_example_but_no_translation', [{
        index: 8,
        line: 'Example text'
    }, {
        index: 9,
        line: 'even on multiple lines.'
    }]]);
    t.is(phraseWithExampleButNoTranslation.index, 8);
    t.is(phraseWithExampleButNoTranslation.line, ':phrase_with_example_but_no_translation:\nExample text\neven on multiple lines.\n:end');
    t.snapshot(phraseWithExampleButNoTranslation.line, 'Phrase with example but no translation');

    // Phrase with example and translation
    const phraseWithExampleAndTranslation = translate(['phrase_with_example_and_a_translation', [
        'Example text.'
    ]]);
    t.is(phraseWithExampleAndTranslation.index, 6);
    t.is(phraseWithExampleAndTranslation.line, ':phrase_with_example_and_a_translation:\nTranslation\n:end');
    t.snapshot(phraseWithExampleAndTranslation.line, 'Phrase with example and translation');

    // Phrase with no example and no translation
    const phraseWithNoExampleAndNoTranslation = translate(['phrase_with_no_translation_and_no_example', [{
        index: 7,
        line: ''
    }]]);
    t.is(phraseWithNoExampleAndNoTranslation.index, 7);
    t.is(phraseWithNoExampleAndNoTranslation.line, ':phrase_with_no_translation_and_no_example:\n\n:end');
    t.snapshot(phraseWithNoExampleAndNoTranslation.line, 'Phrase with no example and no translation');
});

test('multi-line file', async t => {
    // Get example files
    const enUsMultiLineFileContent = await readFile('./test/examples/en-us/multi-line.txt', 'utf-8');
    const nlNlMultiLineFileContent = await readFile('./test/examples/nl-nl/multi-line.txt', 'utf-8');

    // Get file paths ready, prefill base and translation.
    const multiLineBaseFilePath = tempy.writeSync(enUsMultiLineFileContent);
    const multiLineTranslationFilePath = tempy.writeSync(nlNlMultiLineFileContent);
    const multiLineOutputFilePath = tempy.file();

    // Translate file
    await translateFile(multiLineBaseFilePath, multiLineTranslationFilePath, multiLineOutputFilePath);
    
    // Check results
    t.snapshot(await readFile(multiLineBaseFilePath, 'utf-8'), 'Multi-line file (base)');
    t.snapshot(await readFile(multiLineTranslationFilePath, 'utf-8'), 'Multi-line file (translation)');
    t.snapshot(await readFile(multiLineOutputFilePath, 'utf-8'), 'Multi-line file (output)');
});

test('single-line + multi-line file', async t => {
    // Get example files
    const enUsBothLineFileContent = await readFile('./test/examples/en-us/both.txt', 'utf-8');
    const nlNlBothLineFileContent = await readFile('./test/examples/nl-nl/both.txt', 'utf-8');

    // Get file paths ready, prefill base and translation.
    const bothLineBaseFilePath = tempy.writeSync(enUsBothLineFileContent);
    const bothLineTranslationFilePath = tempy.writeSync(nlNlBothLineFileContent);
    const bothLineOutputFilePath = tempy.file();

    // Translate file
    await translateFile(bothLineBaseFilePath, bothLineTranslationFilePath, bothLineOutputFilePath);
    
    // Check results
    t.snapshot(await readFile(bothLineBaseFilePath, 'utf-8'), 'Single-line + multi-line file (base)');
    t.snapshot(await readFile(bothLineTranslationFilePath, 'utf-8'), 'Single-line + multi-line file (translation)');
    t.snapshot(await readFile(bothLineOutputFilePath, 'utf-8'), 'Single-line + multi-line file (output)');
});