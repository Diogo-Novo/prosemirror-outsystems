import { Node as PMNode } from 'prosemirror-model';

/**
 * Validation utilities for editor content
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate that document is not empty
 */
export function validateNotEmpty(doc: PMNode): ValidationResult {
  const errors: string[] = [];
  
  if (doc.childCount === 0 || (doc.childCount === 1 && doc.firstChild?.content.size === 0)) {
    errors.push('Document cannot be empty');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate minimum word count
 */
export function validateMinWords(doc: PMNode, minWords: number): ValidationResult {
  const errors: string[] = [];
  const text = doc.textContent;
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  if (wordCount < minWords) {
    errors.push(`Document must contain at least ${minWords} words (current: ${wordCount})`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate maximum word count
 */
export function validateMaxWords(doc: PMNode, maxWords: number): ValidationResult {
  const errors: string[] = [];
  const text = doc.textContent;
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  if (wordCount > maxWords) {
    errors.push(`Document must not exceed ${maxWords} words (current: ${wordCount})`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}