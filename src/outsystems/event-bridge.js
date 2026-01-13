/**
 * Event Bridge for OutSystems Communication
 * Handles bidirectional events between editor and OutSystems
 */

export class EventBridge {
  constructor(element, editor) {
    this.element = element;
    this.editor = editor;
    this.listeners = [];
    
    this._setupListeners();
  }
  
  _setupListeners() {
    // Listen to editor changes
    const unsubscribe = this.editor.onChange((content) => {
      // Already handled in web-component.js onChange
    });
    
    this.listeners.push(unsubscribe);
  }
  
  /**
   * Emit custom event to OutSystems
   */
  emit(eventName, detail) {
    this.element.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    }));
  }
  
  /**
   * Cleanup
   */
  destroy() {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }
}