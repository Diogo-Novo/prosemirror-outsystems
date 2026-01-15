import { Schema } from 'prosemirror-model';
import { undo, redo } from 'prosemirror-history';
import { Command } from 'prosemirror-state';
import { toggleMark, setBlockType, wrapIn } from 'prosemirror-commands';

/**
 * Build keymap for common editor commands
 */
export function buildKeymap(schema: Schema): Record<string, Command> {
  const keys: Record<string, Command> = {};

  // History
  keys['Mod-z'] = undo;
  keys['Mod-y'] = redo;
  keys['Shift-Mod-z'] = redo;

  // Marks
  if (schema.marks.strong) {
    keys['Mod-b'] = toggleMark(schema.marks.strong);
  }
  if (schema.marks.em) {
    keys['Mod-i'] = toggleMark(schema.marks.em);
  }

  // Block types
  if (schema.nodes.heading) {
    for (let i = 1; i <= 6; i++) {
      keys[`Shift-Ctrl-${i}`] = setBlockType(schema.nodes.heading, { level: i });
    }
  }

  if (schema.nodes.paragraph) {
    keys['Shift-Ctrl-0'] = setBlockType(schema.nodes.paragraph);
  }

  return keys;
}