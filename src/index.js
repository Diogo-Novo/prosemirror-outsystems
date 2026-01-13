/**
 * ProseMirror for OutSystems
 * Main entry point - registers the web component and exposes the API
 */

import { OutSystemsEditor } from './outsystems/web-component.js';

// Register the custom element
if (!customElements.get('prosemirror-editor')) {
  customElements.define('prosemirror-editor', OutSystemsEditor);
}

// Export for programmatic usage (if needed)
export { OutSystemsEditor };

// Global API for OutSystems JavaScript nodes
window.ProseMirrorOutSystems = {
  version: '0.1.0',
  
  // Helper to get editor instance from element
  getInstance: (elementId) => {
    const element = document.getElementById(elementId);
    return element?._editorInstance || null;
  },
  
  // Utility functions
  utils: {
    // Convert HTML string to ProseMirror JSON
    htmlToJSON: (html) => {
      // Implementation in utils/serialization.js
    },
    
    // Convert ProseMirror JSON to HTML
    jsonToHTML: (json) => {
      // Implementation in utils/serialization.js
    }
  }
};