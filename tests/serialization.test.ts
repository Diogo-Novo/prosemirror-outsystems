import { serializeToJSON, deserializeFromJSON, serializeToHTML, parseHTMLToDoc } from '../src/utils/serialization';
import { basicSchema } from '../src/schemas/basic';

describe('Serialization', () => {
  test('serializes document to JSON', () => {
    const html = '<p>Hello <strong>world</strong></p>';
    const doc = parseHTMLToDoc(basicSchema, html);
    const json = serializeToJSON(doc);

    expect(json).toHaveProperty('type', 'doc');
    expect(json).toHaveProperty('content');
  });

  test('deserializes JSON to document', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello' }],
        },
      ],
    };

    const doc = deserializeFromJSON(basicSchema, json);
    expect(doc.type.name).toBe('doc');
    expect(doc.textContent).toBe('Hello');
  });

  test('converts document to HTML', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Hello ' },
            { 
              type: 'text', 
              text: 'world',
              marks: [{ type: 'strong' }],
            },
          ],
        },
      ],
    };

    const doc = deserializeFromJSON(basicSchema, json);
    const html = serializeToHTML(basicSchema, doc);

    expect(html).toContain('Hello');
    expect(html).toContain('<strong>world</strong>');
  });

  test('round-trip HTML -> Doc -> HTML', () => {
    const originalHTML = '<p>Test <em>italic</em> and <strong>bold</strong></p>';
    const doc = parseHTMLToDoc(basicSchema, originalHTML);
    const resultHTML = serializeToHTML(basicSchema, doc);

    expect(resultHTML).toContain('Test');
    expect(resultHTML).toContain('<em>italic</em>');
    expect(resultHTML).toContain('<strong>bold</strong>');
  });
});