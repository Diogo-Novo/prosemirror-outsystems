/**
 * OutSystems Web Component
 * Custom element that wraps the editor for easy OutSystems integration
 * 
 * Usage in OutSystems:
 * <prosemirror-editor 
 *   id="myEditor"
 *   config='{"trackChanges": true}'
 *   initial-content="<p>Hello</p>">
 * </prosemirror-editor>
 */

import { Editor } from '../core/editor.js';
import { EventBridge } from './event-bridge.js';

export class OutSystemsEditor extends HTMLElement {
  constructor() {
    super();
    this._editor = null;
    this._eventBridge = null;
  }
  
  /**
   * Observed attributes for reactivity
   */
  static get observedAttributes() {
    return ['config', 'initial-content', 'editable'];
  }
  
  /**
   * Called when element is added to DOM
   */
  connectedCallback() {
    // Create container for editor
    const container = document.createElement('div');
    container.className = 'prosemirror-outsystems-container';
    this.appendChild(container);
    
    // Parse configuration
    const config = this._getConfig();
    
    // Initialize editor
    this._editor = new Editor(container, config);
    
    // Store reference for external access
    this._editorInstance = this._editor;
    
    // Initialize event bridge for OutSystems
    this._eventBridge = new EventBridge(this, this._editor);
    
    // Dispatch ready event
    this.dispatchEvent(new CustomEvent('editor-ready', {
      detail: { editor: this._editor },
      bubbles: true
    }));
  }
  
  /**
   * Called when element is removed from DOM
   */
  disconnectedCallback() {
    if (this._editor) {
      this._editor.destroy();
      this._editor = null;
    }
    
    if (this._eventBridge) {
      this._eventBridge.destroy();
      this._eventBridge = null;
    }
  }
  
  /**
   * Called when attributes change
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._editor) return;
    
    switch (name) {
      case 'config':
        // Re-parse config and update editor
        // Note: Some options may require recreation
        console.warn('Config change after initialization not fully supported');
        break;
        
      case 'initial-content':
        if (newValue && newValue !== oldValue) {
          this._editor.setContent(newValue);
        }
        break;
        
      case 'editable':
        // Update editable state
        this._editor.options.editable = newValue !== 'false';
        break;
    }
  }
  
  /**
   * Parse configuration from attributes
   */
  _getConfig() {
    const config = {
      initialContent: this.getAttribute('initial-content') || null,
      editable: this.getAttribute('editable') !== 'false'
    };
    
    // Merge with JSON config if provided
    const configAttr = this.getAttribute('config');
    if (configAttr) {
      try {
        const jsonConfig = JSON.parse(configAttr);
        Object.assign(config, jsonConfig);
      } catch (e) {
        console.error('Invalid config JSON:', e);
      }
    }
    
    // Setup change handler to dispatch OutSystems events
    config.onChange = (content) => {
      this.dispatchEvent(new CustomEvent('content-changed', {
        detail: {
          html: content.html || this._editor.getContent('html'),
          json: content.json || this._editor.getContent('json'),
          text: content.text || this._editor.getContent('text')
        },
        bubbles: true
      }));
    };
    
    return config;
  }
  
  // ===== PUBLIC API (callable from OutSystems) =====
  
  /**
   * Get editor content
   */
  getContent(format = 'html') {
    return this._editor ? this._editor.getContent(format) : '';
  }
  
  /**
   * Set editor content
   */
  setContent(content, format = 'html') {
    if (this._editor) {
      this._editor.setContent(content, format);
    }
  }
  
  /**
   * Clear editor
   */
  clear() {
    if (this._editor) {
      this._editor.clear();
    }
  }
  
  /**
   * Focus editor
   */
  focus() {
    if (this._editor) {
      this._editor.focus();
    }
  }
  
  /**
   * Export content
   */
  exportContent(format = 'html') {
    return this.getContent(format);
  }
  
  /**
   * Import content
   */
  importContent(content, format = 'html') {
    this.setContent(content, format);
  }
}