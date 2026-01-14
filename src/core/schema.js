import { Schema } from 'prosemirror-model'

export const letterSchema = new Schema({
    nodes: {
        doc: {
            content: 'letter'
        },

        text: {
            group: 'inline'
        },

        // =========================
        // Letter Root
        // =========================
        letter: {
            content: `
        header
        confidentiality?
        recipient
        accessibility_notice?
        date
        case_reference?
        salutation
        subject
        body
        signoff
      `.replace(/\s+/g, ' ').trim(),
            defining: true,
            toDOM() {
                return ['article', { 'data-letter': 'true' }, 0]
            }
        },

        // =========================
        // Header (logo + org info)
        // =========================
        header: {
            content: 'logo org_details',
            isolating: true,
            toDOM() {
                return ['header', { 'data-header': 'true' }, 0]
            }
        },

        logo: {
            atom: true,
            selectable: false,
            toDOM() {
                return ['div', { 'data-logo': 'true' }]
            }
        },

        org_details: {
            content: 'paragraph+',
            toDOM() {
                return ['div', { 'data-org-details': 'true' }, 0]
            }
        },

        // =========================
        // Notices
        // =========================
        confidentiality: {
            content: 'text*',
            toDOM() {
                return ['p', { 'data-confidential': 'true' }, 0]
            }
        },

        accessibility_notice: {
            content: 'paragraph+',
            isolating: true,
            toDOM() {
                return ['aside', { 'data-accessibility': 'true' }, 0]
            }
        },

        // =========================
        // Recipient block
        // =========================
        recipient: {
            content: 'paragraph+',
            isolating: true,
            toDOM() {
                return ['address', { 'data-recipient': 'true' }, 0]
            }
        },

        date: {
            content: 'text*',
            toDOM() {
                return ['p', { 'data-date': 'true' }, 0]
            }
        },

        case_reference: {
            content: 'paragraph+',
            isolating: true,
            toDOM() {
                return ['section', { 'data-case-ref': 'true' }, 0]
            }
        },

        // =========================
        // Letter content
        // =========================
        salutation: {
            content: 'text*',
            toDOM() {
                return ['p', { 'data-salutation': 'true' }, 0]
            }
        },

        subject: {
            content: 'text*',
            defining: true,
            toDOM() {
                return ['p', { 'data-subject': 'true' }, 0]
            }
        },

        body: {
            content: 'block+',
            toDOM() {
                return ['section', { 'data-body': 'true' }, 0]
            }
        },

        signoff: {
            content: 'paragraph+',
            toDOM() {
                return ['section', { 'data-signoff': 'true' }, 0]
            }
        },

        paragraph: {
            content: 'inline*',
            group: 'block',
            toDOM() {
                return ['p', 0]
            }
        }
    },

    marks: {
        strong: {
            toDOM() {
                return ['strong', 0]
            }
        },

        em: {
            toDOM() {
                return ['em', 0]
            }
        },

        link: {
            attrs: { href: {} },
            inclusive: false,
            toDOM(node) {
                return ['a', { href: node.attrs.href }, 0]
            }
        },

        // =========================
        // Track changes marks
        // =========================
        insertion: {
            attrs: {
                user: {},
                timestamp: {}
            },
            inclusive: true,
            toDOM(mark) {
                return [
                    'span',
                    {
                        'data-inserted': 'true',
                        'data-user': mark.attrs.user,
                        'data-ts': mark.attrs.timestamp
                    },
                    0
                ]
            }
        },

        deletion: {
            attrs: {
                user: {},
                timestamp: {}
            },
            inclusive: false,
            toDOM(mark) {
                return [
                    'span',
                    {
                        'data-deleted': 'true',
                        'data-user': mark.attrs.user,
                        'data-ts': mark.attrs.timestamp
                    },
                    0
                ]
            }
        }
    }
})
