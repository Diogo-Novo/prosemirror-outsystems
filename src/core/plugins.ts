import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { buildKeymap } from '../utils/keymap';

/**
 * Create the default plugin set for an editor
 */
export function createPlugins(schema: Schema): Plugin[] {
  return [
    // History support (undo/redo)
    history(),

    // Keybindings
    keymap(buildKeymap(schema)),
    keymap(baseKeymap),

    // Placeholder plugin
    placeholderPlugin(),
  ];
}

/**
 * Plugin to show placeholder text when editor is empty
 */
function placeholderPlugin(): Plugin {
  return new Plugin({
    props: {
      decorations(state) {
        const doc = state.doc;
        if (
          doc.childCount === 1 &&
          doc.firstChild?.isTextblock &&
          doc.firstChild.content.size === 0
        ) {
          // Empty editor - CSS will handle the placeholder via ::before
          return null;
        }
        return null;
      },
    },
  });
}