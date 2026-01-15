import { Editor } from '../src/core/Editor';
import { basicSchema } from '../src/schemas/basic';

describe('Editor', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('creates editor instance', () => {
    const editor = new Editor(container, {
      id: 'test-editor',
    });

    expect(editor.id).toBe('test-editor');
    expect(container.querySelector('.ProseMirror')).toBeTruthy();
  });

  test('sets and gets content', () => {
    const editor = new Editor(container);
    
    editor.setContent('<p>Hello world</p>');
    const text = editor.getText();
    
    expect(text).toBe('Hello world');
  });

  test('handles empty state', () => {
    const editor = new Editor(container);
    
    expect(editor.isEmpty()).toBe(true);
    
    editor.setContent('<p>Not empty</p>');
    expect(editor.isEmpty()).toBe(false);
  });

  test('clears content', () => {
    const editor = new Editor(container, {
      content: '<p>Initial content</p>',
    });

    expect(editor.isEmpty()).toBe(false);
    
    editor.clear();
    expect(editor.isEmpty()).toBe(true);
  });

  test('toggles editable state', () => {
    const editor = new Editor(container, { editable: true });

    expect(editor.isEditable()).toBe(true);
    
    editor.setEditable(false);
    expect(editor.isEditable()).toBe(false);
  });

  test('triggers onChange callback', (done) => {
    const onChange = jest.fn((content) => {
      expect(content).toBeTruthy();
      done();
    });

    const editor = new Editor(container, { onChange });
    editor.setContent('<p>New content</p>');
    
    // Wait for transaction
    setTimeout(() => {
      expect(onChange).toHaveBeenCalled();
    }, 0);
  });

  test('serializes to JSON and HTML', () => {
    const editor = new Editor(container, {
      content: '<p>Test <strong>content</strong></p>',
    });

    const json = editor.getContent();
    expect(json).toHaveProperty('type');
    
    const html = editor.getHTML();
    expect(html).toContain('Test');
    expect(html).toContain('strong');
  });
});