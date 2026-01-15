# ProseMirror for OutSystems

A powerful, schema-driven rich text editor for OutSystems built on [ProseMirror](https://prosemirror.net/). Provides a clean, global API perfect for OutSystems Reactive apps with support for custom document structures, track changes, and extensible schemas.

## Features

- ✅ **OutSystems-friendly API** - Simple global interface for managing editor instances
- ✅ **Basic rich text editing** - Bold, italic, links, headings, lists
- ✅ **Custom schemas** - Build structured documents (letters, forms, reports)
- ✅ **Track changes** - Built-in insertion/deletion marks for document review
- ✅ **History support** - Undo/redo out of the box
- ✅ **TypeScript** - Full type safety and IntelliSense support
- ✅ **Single bundle** - One JS + one CSS file for easy integration
- ✅ **No markdown** - Pure WYSIWYG editing experience

## Installation

### From npm
```bash
npm install prosemirror-outsystems
```

### Direct Download (for OutSystems)

1. Download `prosemirror-outsystems.js` and `prosemirror-outsystems.css` from the [releases page](https://github.com/yourusername/prosemirror-outsystems/releases)
2. Upload both files to your OutSystems module as resources
3. Reference them in your screen or block

## Quick Start

### Basic Usage
```html
<!-- Include the files -->
<link rel="stylesheet" href="prosemirror-outsystems.css">
<script src="prosemirror-outsystems.js"></script>

<!-- Create a container -->
<div id="editor"></div>

<script>
  // Create an editor
  const editor = ProseMirrorOS.create('#editor', {
    placeholder: 'Start typing...',
    onChange: (content) => {
      console.log('Content changed:', content);
    }
  });

  // Get content as JSON
  const json = editor.getContent();

  // Get content as HTML
  const html = editor.getHTML();

  // Set content
  editor.setContent('<p>Hello <strong>world</strong>!</p>');

  // Clear content
  editor.clear();
</script>
```

### OutSystems Integration

In your OutSystems screen/block:

1. **Add the script resources** in the screen properties
2. **Create a container** with a unique ID
3. **Initialize in OnReady**:
```javascript
// In OnReady event
var editor = $public.ProseMirrorOS.create('#MyEditorContainer', {
    id: 'my-editor',
    placeholder: 'Start typing...',
    content: $parameters.InitialContent,
    onChange: function(content) {
        // Update OutSystems variable
        $actions.UpdateContent(JSON.stringify(content));
    }
});

// Store reference for later use
$parameters.EditorInstance = editor;
```

4. **Get content when needed**:
```javascript
// In Save button action
var content = $public.ProseMirrorOS.getInstance('my-editor').getContent();
$parameters.DocumentContent = JSON.stringify(content);
```

## API Reference

### Global API: `ProseMirrorOS`

#### `create(container, config)`
Create a new editor instance.
```javascript
const editor = ProseMirrorOS.create('#editor', {
  id: 'unique-id',           // Optional: unique identifier
  schema: basicSchema,        // Optional: custom schema
  content: '<p>Initial</p>',  // Optional: initial content
  editable: true,             // Optional: editable state
  placeholder: 'Type here...', // Optional: placeholder text
  onChange: (content) => {},  // Optional: change callback
  onBlur: () => {},           // Optional: blur callback
  onFocus: () => {},          // Optional: focus callback
  theme: 'default'            // Optional: 'default' | 'letter'
});
```

#### `getInstance(id)`
Get an existing editor by ID.
```javascript
const editor = ProseMirrorOS.getInstance('my-editor');
```

#### `destroy(id)`
Destroy an editor instance.
```javascript
ProseMirrorOS.destroy('my-editor');
```

#### `destroyAll()`
Destroy all editor instances.
```javascript
ProseMirrorOS.destroyAll();
```

### Editor Instance Methods

#### Content Management
- `getContent()` - Get content as JSON object
- `getHTML()` - Get content as HTML string
- `getText()` - Get plain text content
- `setContent(content)` - Set content (HTML string or JSON)
- `clear()` - Clear all content
- `isEmpty()` - Check if editor is empty

#### Editor Control
- `focus()` - Focus the editor
- `isFocused()` - Check if editor has focus
- `setEditable(boolean)` - Set editable state
- `isEditable()` - Check if editor is editable
- `destroy()` - Destroy this instance

#### Advanced
- `getView()` - Get ProseMirror EditorView (for advanced use)
- `getSchema()` - Get the editor's schema

## Custom Schemas

Create structured documents with custom schemas:
```javascript
import { Schema } from 'prosemirror-model';

const invoiceSchema = new Schema({
  nodes: {
    doc: { content: 'invoice' },
    invoice: { content: 'header items total', /* ... */ },
    header: { /* ... */ },
    items: { /* ... */ },
    total: { /* ... */ },
    // ... more nodes
  },
  marks: {
    // ... marks
  }
});

const editor = ProseMirrorOS.create('#editor', {
  schema: invoiceSchema,
  theme: 'letter'
});
```

See `src/schemas/letter.ts` for a complete example.

## Track Changes

The library includes built-in track changes support:
```javascript
// Track changes are automatically styled via CSS
// Insertions: green underline
// Deletions: red strikethrough

// Access track change marks in the schema
const { insertion, deletion } = editor.getSchema().marks;
```

## Keyboard Shortcuts

- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` or `Shift + Ctrl/Cmd + Z` - Redo

## Styling & Themes

### Default Theme
Clean, modern styling suitable for most use cases.

### Letter Theme
Optimized for formal document drafting with proper spacing and typography.
```javascript
const editor = ProseMirrorOS.create('#editor', {
  theme: 'letter'
});
```

### Custom Styling
Override CSS variables or add custom classes:
```css
.pm-editor-container {
  --editor-bg: #ffffff;
  --editor-border: #ddd;
  --editor-focus: #0066cc;
}
```

## Development

### Setup
```bash
npm install
```

### Build
```bash
npm run build          # Development build
npm run build:prod     # Production build with minification
```

### Development Mode
```bash
npm run dev            # Watch mode
```

### Testing
```bash
npm test              # Run tests
npm run test:watch    # Watch mode
```

### Type Checking
```bash
npm run typecheck
```

## Design Philosophy

### Principles
1. **OutSystems-first** - API designed for OutSystems integration patterns
2. **Schema-driven** - Structured documents over freeform markdown
3. **Minimal but complete** - Essential features without bloat
4. **Extensible** - Easy to add custom schemas and plugins
5. **Type-safe** - Full TypeScript support

### What's NOT Included (Intentionally)
- ❌ Markdown parsing/serialization
- ❌ Collaborative editing (coming in future)
- ❌ Image uploads (delegate to OutSystems)
- ❌ File attachments (delegate to OutSystems)
- ❌ Mentions/autocomplete (add as plugins)

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Credits

Built on [ProseMirror](https://prosemirror.net/) by Marijn Haverbeke.

## Support

- 📖 [Documentation](https://github.com/yourusername/prosemirror-outsystems/wiki)
- 🐛 [Issue Tracker](https://github.com/yourusername/prosemirror-outsystems/issues)
- 💬 [Discussions](https://github.com/yourusername/prosemirror-outsystems/discussions)