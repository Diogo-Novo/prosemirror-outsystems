import { Schema } from 'prosemirror-model';
import { createSchemaWithLists, defaultNodes, defaultMarks } from '../core/schema';

/**
 * Basic rich-text schema
 * Supports: paragraphs, headings, bold, italic, links, lists
 */
export const basicSchema = createSchemaWithLists(
  defaultNodes,
  defaultMarks
);