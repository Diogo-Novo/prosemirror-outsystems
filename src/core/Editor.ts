import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser, DOMSerializer, Node as PMNode } from 'prosemirror-model';
import { basicSchema } from '../schemas/basic';
import { createPlugins } from './plugins';
import { serializeToJSON, deserializeFromJSON, serializeToHTML } from '../utils/serialization';

export interface EditorConfig {
  id?: string;
  schema?: Schema;
  content?: string | object | PMNode;
  editable?: boolean;
  placeholder?: string;
  onChange?: (content: any) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  theme?: 'default' | 'letter';
}

export class Editor {
  private view: EditorView;
  private config: Required<EditorConfig>;
  public readonly id: string;

  constructor(container: HTMLElement, config: Partial<EditorConfig> = {}) {
    // Set defaults
    this.config = {
      id: config.id || 'editor',
      schema: config.schema || basicSchema,
      content: config.content || '',
      editable: config.editable !== false,
      placeholder: config.placeholder || 'Start typing...',
      onChange: config.onChange || (() => {}),
      onBlur: config.onBlur || (() => {}),
      onFocus: config.onFocus || (() => {}),
      theme: config.theme || 'default',
    };

    this.id = this.config.id;

    // Apply theme class
    container.classList.add('pm-editor-container');
    container.classList.add(`pm-theme-${this.config.theme}`);

    // Create initial state
    const state = this.createState(this.config.content);

    // Create view
    this.view = new EditorView(container, {
      state,
      editable: () => this.config.editable,
      dispatchTransaction: this.dispatchTransaction.bind(this),
      attributes: {
        'data-editor-id': this.id,
        'data-placeholder': this.config.placeholder,
      },
    });
  }

  /**
   * Create editor state from content
   */
  private createState(content: string | object | PMNode): EditorState {
    let doc: PMNode;

    if (typeof content === 'string') {
      // Parse HTML string
      const div = document.createElement('div');
      div.innerHTML = content;
      doc = DOMParser.fromSchema(this.config.schema).parse(div);
    } else if (content && typeof content === 'object' && 'type' in content) {
      // ProseMirror Node
      doc = content as PMNode;
    } else if (content && typeof content === 'object') {
      // JSON object
      doc = deserializeFromJSON(this.config.schema, content);
    } else {
      // Create empty document
      doc = this.config.schema.node(this.config.schema.topNodeType);
    }

    return EditorState.create({
      schema: this.config.schema,
      doc,
      plugins: createPlugins(this.config.schema),
    });
  }

  /**
   * Handle transactions
   */
  private dispatchTransaction(transaction: Transaction): void {
    const newState = this.view.state.apply(transaction);
    this.view.updateState(newState);

    // Trigger change callback if document changed
    if (transaction.docChanged) {
      this.config.onChange(this.getContent());
    }
  }

  /**
   * Get current content as JSON
   */
  public getContent(): object {
    return serializeToJSON(this.view.state.doc);
  }

  /**
   * Get current content as HTML
   */
  public getHTML(): string {
    return serializeToHTML(this.config.schema, this.view.state.doc);
  }

  /**
   * Set editor content
   */
  public setContent(content: string | object | PMNode): void {
    const state = this.createState(content);
    this.view.updateState(state);
  }

  /**
   * Get current text content (stripped of formatting)
   */
  public getText(): string {
    return this.view.state.doc.textContent;
  }

  /**
   * Check if editor is empty
   */
  public isEmpty(): boolean {
    const doc = this.view.state.doc;
    if(doc && doc.firstChild) {
        return doc.childCount === 1 && 
           doc.firstChild.isTextblock && 
           doc.firstChild.content.size === 0;
    }
    else {
        return true;
    }
  }

  /**
   * Clear editor content
   */
  public clear(): void {
    this.setContent('');
  }

  /**
   * Focus the editor
   */
  public focus(): void {
    this.view.focus();
  }

  /**
   * Check if editor is focused
   */
  public isFocused(): boolean {
    return this.view.hasFocus();
  }

  /**
   * Set editable state
   */
  public setEditable(editable: boolean): void {
    this.config.editable = editable;
    this.view.setProps({ editable: () => editable });
  }

  /**
   * Check if editor is editable
   */
  public isEditable(): boolean {
    return this.config.editable;
  }

  /**
   * Get the underlying ProseMirror view (for advanced use)
   */
  public getView(): EditorView {
    return this.view;
  }

  /**
   * Get the editor schema
   */
  public getSchema(): Schema {
    return this.config.schema;
  }

  /**
   * Destroy the editor instance
   */
  public destroy(): void {
    this.view.destroy();
  }
}