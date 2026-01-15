import { Schema } from 'prosemirror-model';
import { schema as basicSchemaSpec } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';

/**
 * Create a schema with list support
 * This is a helper for building custom schemas
 */
export function createSchemaWithLists(nodes: any, marks: any): Schema {
  const nodesWithLists = addListNodes(nodes, 'paragraph block*', 'block');
  return new Schema({
    nodes: nodesWithLists,
    marks,
  });
}

/**
 * Default node specifications
 * These can be used as building blocks for custom schemas
 */
export const defaultNodes = basicSchemaSpec.nodes;

/**
 * Default mark specifications
 */
export const defaultMarks = basicSchemaSpec.marks;