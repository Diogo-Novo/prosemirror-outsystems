import { Editor, EditorConfig } from './core/Editor';
import { basicSchema } from './schemas/basic';
import { letterSchema } from './schemas/letter';
import './styles/editor.css';

/**
 * Global API for ProseMirror OutSystems integration
 * 
 * This is the main entry point that OutSystems developers will use.
 * All editor instances are tracked and can be accessed by their container ID.
 */
class ProseMirrorOS {
  private static instances: Map<string, Editor> = new Map();
  private static idCounter = 0;

  /**
   * Create a new editor instance
   * @param container - DOM element or selector string
   * @param config - Editor configuration
   * @returns Editor instance
   */
  static create(container: string | HTMLElement, config: Partial<EditorConfig> = {}): Editor {
    const element = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;

    if (!element) {
      throw new Error(`Container not found: ${container}`);
    }

    // Generate unique ID for this instance
    const instanceId = config.id || `pm-editor-${++this.idCounter}`;
    
    // Check if instance already exists
    if (this.instances.has(instanceId)) {
      console.warn(`Editor instance "${instanceId}" already exists. Destroying old instance.`);
      this.destroy(instanceId);
    }

    const editor = new Editor(element as HTMLElement, {
      ...config,
      id: instanceId,
    });

    this.instances.set(instanceId, editor);
    return editor;
  }

  /**
   * Get an existing editor instance by ID
   */
  static getInstance(id: string): Editor | undefined {
    return this.instances.get(id);
  }

  /**
   * Destroy an editor instance
   */
  static destroy(id: string): boolean {
    const editor = this.instances.get(id);
    if (editor) {
      editor.destroy();
      this.instances.delete(id);
      return true;
    }
    return false;
  }

  /**
   * Destroy all editor instances
   */
  static destroyAll(): void {
    this.instances.forEach(editor => editor.destroy());
    this.instances.clear();
  }

  /**
   * Get all active editor instances
   */
  static getAllInstances(): Editor[] {
    return Array.from(this.instances.values());
  }

  /**
   * Available schemas
   */
  static schemas = {
    basic: basicSchema,
    letter: letterSchema,
  };

  /**
   * Library version
   */
  static version = '0.1.0';
}

// Expose to window for OutSystems
if (typeof window !== 'undefined') {
  (window as any).ProseMirrorOS = ProseMirrorOS;
}

export default ProseMirrorOS;
export { Editor, EditorConfig } from './core/Editor';
export { basicSchema } from './schemas/basic';
export { letterSchema } from './schemas/letter';