// schema.js (updated)

import { Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { tableNodes } from 'prosemirror-tables';

// Create DOM parser specifications for basic nodes
const basicNodes = {
  doc: {
    content: 'block+'
  },
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM: () => ['p', 0]
  },
  text: {
    group: 'inline'
  },
  // Add other basic nodes as needed
};

// Extend nodes with tables
const nodes = {
  ...basicNodes,
  ...tableNodes({
    tableGroup: 'block',
    cellContent: 'block+',
    cellAttributes: {
      background: { default: null },
      colspan: { default: 1 },
      rowspan: { default: 1 }
    }
  }),
  change: {
    attrs: {
      user: { default: null },
      timestamp: { default: null },
      type: { default: 'insert' }
    },
    inline: true,
    group: 'inline',
    content: 'inline*',
    parseDOM: [{
      tag: 'span[data-change-type]',
      getAttrs: dom => ({
        user: dom.getAttribute('data-user'),
        timestamp: dom.getAttribute('data-timestamp'),
        type: dom.getAttribute('data-change-type')
      })
    }],
    toDOM: node => [
      'span',
      {
        class: `change change-${node.attrs.type}`,
        'data-user': node.attrs.user,
        'data-timestamp': node.attrs.timestamp,
        'data-change-type': node.attrs.type
      },
      0
    ]
  }
};

// Marks configuration
const marks = {
  underline: {
    parseDOM: [
      { tag: 'u' },
      { tag: 'span[style*="underline"]' },
      { style: 'text-decoration=underline' }
    ],
    toDOM: () => ['u', 0]
  },
  highlight: {
    attrs: { color: { default: 'yellow' } },
    parseDOM: [{
      tag: 'mark',
      getAttrs: dom => ({
        color: dom.getAttribute('data-color') || 
               dom.style.backgroundColor || 
               'yellow'
      })
    }],
    toDOM: mark => [
      'mark',
      {
        'data-color': mark.attrs.color,
        style: `background-color: ${mark.attrs.color}`
      },
      0
    ]
  },
  // Include other marks from basic schema as needed
  strong: basicSchema.marks.strong,
  em: basicSchema.marks.em,
  // ... etc
};

export const editorSchema = new Schema({ nodes, marks });