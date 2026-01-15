import { Schema, Node as PMNode, DOMSerializer, DOMParser as PMDOMParser } from 'prosemirror-model';

/**
 * Serialize ProseMirror document to JSON
 */
export function serializeToJSON(doc: PMNode): object {
  return doc.toJSON();
}

/**
 * Deserialize JSON to ProseMirror document
 */
export function deserializeFromJSON(schema: Schema, json: any): PMNode {
  return schema.nodeFromJSON(json);
}

/**
 * Serialize ProseMirror document to HTML
 */
export function serializeToHTML(schema: Schema, doc: PMNode): string {
  const div = document.createElement('div');
  const fragment = DOMSerializer.fromSchema(schema).serializeFragment(doc.content);
  div.appendChild(fragment);
  return div.innerHTML;
}

/**
 * Parse HTML string to ProseMirror document
 */
export function parseHTMLToDoc(schema: Schema, html: string): PMNode {
  const div = document.createElement('div');
  div.innerHTML = html;
  return PMDOMParser.fromSchema(schema).parse(div);
}