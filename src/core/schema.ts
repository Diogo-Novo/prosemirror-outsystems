import { Schema } from 'prosemirror-model';
import { schema as basicSchemaSpec } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';

/**
 * Create a schema with list support
 */
export function createSchemaWithLists(): Schema {
  // Use the basic schema as a starting point
  const nodesWithLists = addListNodes(
    basicSchemaSpec.spec.nodes,
    'paragraph block*',
    'block'
  );

  return new Schema({
    nodes: nodesWithLists,
    marks: basicSchemaSpec.spec.marks,
  });
}

