/**
 * Core Editor Class
 * Manages ProseMirror EditorState and EditorView
 * 
 * Design Philosophy:
 * - Encapsulates ProseMirror complexity
 * - Provides simple API for OutSystems integration
 * - Handles all state transitions internally
 */

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { DOMParser, DOMSerializer } from 'prosemirror-model'; 


import { editorSchema } from './schema.js';
import { buildMenuItems } from '../ui/menu-items.js';
import { trackChangesPlugin } from '../extensions/track-changes.js';

export class Editor {
  constructor(container, options = {}) {
    this.container = container;
    this.options = this._parseOptions(options);
    this.view = null;
    this.changeListeners = [];
    
    this._initializeEditor();
  }
  
  /**
   * Parse and validate configuration options
   * Accepts JSON string or object
   */
  _parseOptions(options) {
    // Handle JSON string from OutSystems
    if (typeof options === 'string') {
      try {
        options = JSON.parse(options);
      } catch (e) {
        console.error('Invalid editor configuration JSON:', e);
        options = {};
      }
    }
    
    return {
      editable: options.editable !== false,
      trackChanges: options.trackChanges || false,
      trackChangesUser: options.trackChangesUser || 'Anonymous',
      placeholder: options.placeholder || 'Start typing...',
      toolbar: options.toolbar !== false,
      toolbarItems: options.toolbarItems || 'default',
      initialContent: options.initialContent || null,
      onChange: options.onChange || null,
      ...options
    };
  }
  
  /**
   * Initialize ProseMirror editor
   */
  _initializeEditor() {
    const plugins = [
      history(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo
      }),
      keymap(baseKeymap)
    ];
    
    // Add track changes plugin if enabled
    if (this.options.trackChanges) {
      plugins.push(trackChangesPlugin(this.options.trackChangesUser));
    }
    
    // Create initial state
    const state = EditorState.create({
      schema: editorSchema,
      plugins,
      doc: this._getInitialDoc()
    });
    
    // Create view
    this.view = new EditorView(this.container, {
      state,
      editable: () => this.options.editable,
      dispatchTransaction: this._handleTransaction.bind(this)
    });
    
    // Create toolbar if enabled
    if (this.options.toolbar) {
      this._createToolbar();
    }
  }
  
  /**
   * Get initial document from options
   */
  _getInitialDoc() {
    if (!this.options.initialContent) {
      return editorSchema.node('doc', null, [
        editorSchema.node('paragraph')
      ]);
    }
    
    // Handle different content formats
    if (typeof this.options.initialContent === 'string') {
      // Assume HTML
      return this._parseHTML(this.options.initialContent);
    }
    
    // Assume ProseMirror JSON
    return editorSchema.nodeFromJSON(this.options.initialContent);
  }
  
  /**
   * Handle state transactions
   */
  _handleTransaction(transaction) {
    const newState = this.view.state.apply(transaction);
    this.view.updateState(newState);
    
    // Notify listeners if document changed
    if (transaction.docChanged) {
      this._notifyChange();
    }
  }
  
  /**
   * Create toolbar UI
   */
  _createToolbar() {
    const toolbarDiv = document.createElement('div');
    toolbarDiv.className = 'prosemirror-toolbar';
    
    const menuItems = buildMenuItems(
      editorSchema,
      this.options.toolbarItems
    );
    
    menuItems.forEach(item => {
      const button = this._createToolbarButton(item);
      toolbarDiv.appendChild(button);
    });
    
    this.container.insertBefore(toolbarDiv, this.view.dom);
    this.toolbar = toolbarDiv;
  }
  
  /**
   * Create individual toolbar button
   */
  _createToolbarButton(item) {
    const button = document.createElement('button');
    button.className = 'toolbar-button';
    button.innerHTML = item.icon || item.label;
    button.title = item.title;
    button.type = 'button';
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      item.command(this.view.state, this.view.dispatch, this.view);
      this.view.focus();
    });
    
    return button;
  }
  
  /**
   * Parse HTML string into ProseMirror document
   */
  _parseHTML(html) {
    // Create a temporary container div
    const container = document.createElement('div');
    container.innerHTML = html;
    
    // Create a DOM parser using our schema
    const parser = DOMParser.fromSchema(editorSchema);
    
    // Parse the HTML content
    return parser.parse(container);
  }
  
  /**
   * Notify change listeners
   */
  _notifyChange() {
    const content = this.getContent();
    
    // Call onChange callback if provided
    if (this.options.onChange) {
      this.options.onChange(content);
    }
    
    // Notify all registered listeners
    this.changeListeners.forEach(listener => {
      listener(content);
    });
  }
  
  // ===== PUBLIC API =====
  
  /**
   * Register a change listener
   */
  onChange(callback) {
    this.changeListeners.push(callback);
    return () => {
      this.changeListeners = this.changeListeners.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Get editor content in specified format
   */
  getContent(format = 'html') {
    const doc = this.view.state.doc;
    
    switch (format) {
      case 'json':
        return doc.toJSON();
      
      case 'html':
        const serializer = DOMSerializer.fromSchema(editorSchema);
        const fragment = serializer.serializeFragment(doc.content);
        const div = document.createElement('div');
        div.appendChild(fragment);
        return div.innerHTML;
      
      case 'text':
        return doc.textContent;
      
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }
  
  /**
   * Set editor content
   */
  setContent(content, format = 'html') {
    let doc;
    
    if (format === 'html') {
      doc = this._parseHTML(content);
    } else if (format === 'json') {
      doc = editorSchema.nodeFromJSON(content);
    } else {
      throw new Error(`Unknown format: ${format}`);
    }
    
    const state = EditorState.create({
      schema: editorSchema,
      plugins: this.view.state.plugins,
      doc
    });
    
    this.view.updateState(state);
  }
  
  /**
   * Clear editor content
   */
  clear() {
    this.setContent('<p></p>');
  }
  
  /**
   * Focus the editor
   */
  focus() {
    this.view.focus();
  }
  
  /**
   * Destroy the editor
   */
  destroy() {
    if (this.view) {
      this.view.destroy();
    }
    if (this.toolbar) {
      this.toolbar.remove();
    }
    this.changeListeners = [];
  }
}