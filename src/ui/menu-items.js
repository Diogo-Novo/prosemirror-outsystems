/**
 * Toolbar Menu Items Configuration
 * Defines available toolbar buttons and their commands
 */

import { toggleMark } from 'prosemirror-commands';
import { wrapInList, liftListItem } from 'prosemirror-schema-list';

/**
 * Build menu items based on schema and configuration
 */
export function buildMenuItems(schema, config = 'default') {
  const items = [];
  
  // Text formatting
  if (schema.marks.strong) {
    items.push({
      id: 'bold',
      label: 'B',
      title: 'Bold (Ctrl+B)',
      command: toggleMark(schema.marks.strong),
      icon: '<strong>B</strong>'
    });
  }
  
  if (schema.marks.em) {
    items.push({
      id: 'italic',
      label: 'I',
      title: 'Italic (Ctrl+I)',
      command: toggleMark(schema.marks.em),
      icon: '<em>I</em>'
    });
  }
  
  if (schema.marks.underline) {
    items.push({
      id: 'underline',
      label: 'U',
      title: 'Underline (Ctrl+U)',
      command: toggleMark(schema.marks.underline),
      icon: '<u>U</u>'
    });
  }
  
  // Separator
  items.push({ type: 'separator' });
  
  // Headings
  [1, 2, 3].forEach(level => {
    items.push({
      id: `heading${level}`,
      label: `H${level}`,
      title: `Heading ${level}`,
      command: setBlockType(schema.nodes.heading, { level })
    });
  });
  
  // Lists
  if (schema.nodes.bullet_list) {
    items.push({
      id: 'bulletList',
      label: '•',
      title: 'Bullet List',
      command: wrapInList(schema.nodes.bullet_list)
    });
  }
  
  if (schema.nodes.ordered_list) {
    items.push({
      id: 'orderedList',
      label: '1.',
      title: 'Numbered List',
      command: wrapInList(schema.nodes.ordered_list)
    });
  }
  
  // Filter based on config
  if (config !== 'default' && Array.isArray(config)) {
    return items.filter(item => config.includes(item.id));
  }
  
  return items;
}

/**
 * Helper to set block type
 */
function setBlockType(nodeType, attrs = {}) {
  return (state, dispatch) => {
    const { $from, $to } = state.selection;
    const range = $from.blockRange($to);
    
    if (!range) return false;
    
    if (dispatch) {
      dispatch(state.tr.setBlockType(
        range.start,
        range.end,
        nodeType,
        attrs
      ));
    }
    
    return true;
  };
}