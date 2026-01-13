# ProseMirror for OutSystems

A powerful, free-to-use rich text editor for OutSystems built on [ProseMirror](https://prosemirror.net/). Designed specifically for document drafting with no markdown support—pure WYSIWYG editing.

## Features

✅ **Core Rich Text Editing**
- Bold, italic, underline, highlight
- Headings (H1-H3)
- Bullet and numbered lists
- Tables with customizable cells

✅ **Document Management**
- Track changes with user attribution
- Import/Export HTML and JSON
- Export to clean HTML for documents

✅ **OutSystems Native**
- Simple Web Block integration
- JSON-based configuration
- Event-driven reactive updates
- No external dependencies to manage

✅ **Production Ready**
- Lightweight single-file bundle
- Fully styled and themed
- Keyboard shortcuts
- Responsive design

## Installation

### For OutSystems Forge

1. Download `prosemirror-outsystems.js` and `prosemirror-outsystems.css` from the latest release
2. Upload both files to your OutSystems module resources
3. Add the script and CSS to your screen

### Using the Web Component

In your OutSystems screen, add an HTML element:
```html
<prosemirror-editor 
  id="myEditor"
  config='{"trackChanges": true, "trackChangesUser": "John Doe"}'
  initial-content="<p>Start typing...</p>">
</prosemirror-editor>
```

## Configuration Options

Pass configuration as a JSON string in the `config` attribute:
```json
{
  "editable": true,
  "placeholder": "Start typing...",
  "trackChanges": false,
  "trackChangesUser": "Anonymous",
  "toolbar": true,
  "toolbarItems": "default",
  "initialContent": "<p>Hello</p>"
}
```

### Configuration Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `editable` | boolean | `true` | Enable/disable editing |
| `placeholder` | string | `"Start typing..."` | Placeholder text |
| `trackChanges` | boolean | `false` | Enable change tracking |
| `trackChangesUser` | string | `"Anonymous"` | User name for changes |
| `toolbar` | boolean | `true` | Show/hide toolbar |
| `toolbarItems` | string/array | `"default"` | Toolbar configuration |
| `initialContent` | string/object | `null` | Initial HTML or JSON |

## API Usage

### From OutSystems JavaScript
```javascript
// Get editor instance
const editor = document.getElementById('myEditor');

// Or use global API
const editor = ProseMirrorOutSystems.getInstance('myEditor');

// Get content in different formats
const html = editor.getContent('html');
const json = editor.getContent('json');
const text = editor.getContent('text');

// Set content
editor.setContent('<p>New content</p>', 'html');

// Clear editor
editor.clear();

// Focus editor
editor.focus();
```

### Handling Events

Listen to content changes in OutSystems:
```javascript
document.getElementById('myEditor').addEventListener('content-changed', function(e) {
  const html = e.detail.html;
  const json = e.detail.json;
  const text = e.detail.text;
  
  // Update OutSystems variable
  $parameters.ContentHTML = html;
});

// Editor ready event
document.getElementById('myEditor').addEventListener('editor-ready', function(e) {
  console.log('Editor initialized');
});
```

### Export to HTML
```javascript
// Export clean HTML for documents
const editor = document.getElementById('myEditor');
const html = editor.exportContent('html');

// Send to server or download
downloadFile(html, 'document.html');
```

## Toolbar Customization

Available toolbar item IDs:

- `bold` - Bold text (Ctrl+B)
- `italic` - Italic text (Ctrl+I)
- `underline` - Underline text (Ctrl+U)
- `heading1` - Heading 1
- `heading2` - Heading 2
- `heading3` - Heading 3
- `bulletList` - Bullet list
- `orderedList` - Numbered list

### Custom Toolbar Example
```json
{
  "toolbar": true,
  "toolbarItems": ["bold", "italic", "heading1", "heading2", "bulletList"]
}
```

## Track Changes

Enable track changes to monitor document edits:
```json
{
  "trackChanges": true,
  "trackChangesUser": "Jane Smith"
}
```

Changes are visually marked:
- **Insertions**: Green underline
- **Deletions**: Red strikethrough

Access tracked changes programmatically:
```javascript
const changes = editor._editorInstance.view.state.plugins
  .find(p => p.spec.key === 'trackChanges')
  .getState(editor._editorInstance.view.state)
  .changes;
```

## Import/Export

### HTML Export
```javascript
const html = editor.getContent('html');
// Returns: "<h1>Title</h1><p>Content...</p>"
```

### JSON Export (ProseMirror format)
```javascript
const json = editor.getContent('json');
// Returns: { type: "doc", content: [...] }
```

### Import Content
```javascript
// Import HTML
editor.setContent('<h1>Title</h1>', 'html');

// Import JSON
editor.setContent(jsonData, 'json');
```

## Keyboard Shortcuts

- **Ctrl+B** / **Cmd+B**: Bold
- **Ctrl+I** / **Cmd+I**: Italic
- **Ctrl+U** / **Cmd+U**: Underline
- **Ctrl+Z** / **Cmd+Z**: Undo
- **Ctrl+Y** / **Cmd+Y**: Redo
- **Ctrl+Shift+Z** / **Cmd+Shift+Z**: Redo (alternative)

## Development

### Setup
```bash
npm install
```

### Build
```bash
npm run build
```

Outputs:
- `dist/prosemirror-outsystems.js`
- `dist/prosemirror-outsystems.css`

### Watch Mode (Development)
```bash
npm run watch
```

### Create Release
```bash
npm run release
```

Creates `release/` folder with distribution files.

### Run Tests
```bash
npm test
```

### Local Development

Open `examples/basic.html` in a browser to test the editor locally without OutSystems.

## Design Philosophy

### Simplicity First
- Single Web Block component
- JSON configuration over complex APIs
- Minimal learning curve for OutSystems developers

### No Framework Lock-in
- Pure Web Components standard
- Works in any modern browser
- No React, Vue, or Angular dependencies

### OutSystems Native
- Designed for OutSystems Reactive Apps
- Event-driven architecture matches OutSystems patterns
- Easy integration with OutSystems variables and actions

### Production Quality
- Battle-tested ProseMirror foundation
- Comprehensive keyboard shortcuts
- Accessibility built-in
- Mobile responsive

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires browsers with Custom Elements v1 support.

## Examples

### Basic Usage in OutSystems
```html
<!-- Simple editor -->
<prosemirror-editor id="editor1"></prosemirror-editor>

<!-- With configuration -->
<prosemirror-editor 
  id="editor2"
  config='{"placeholder": "Enter description..."}'>
</prosemirror-editor>

<!-- With initial content -->
<prosemirror-editor 
  id="editor3"
  initial-content="<p>Pre-filled content</p>">
</prosemirror-editor>
```

### JavaScript Integration
```javascript
// In OutSystems JavaScript action
function saveDocument() {
  const editor = document.getElementById('editor1');
  const html = editor.getContent('html');
  
  // Save to OutSystems entity
  $actions.SaveDocument(html);
}

function loadDocument(html) {
  const editor = document.getElementById('editor1');
  editor.setContent(html, 'html');
}
```

## Troubleshooting

### Editor not appearing
- Ensure both JS and CSS files are loaded
- Check browser console for errors
- Verify Custom Elements are supported

### Content not saving
- Listen to `content-changed` event
- Check event handler is registered before user types
- Verify OutSystems variable binding

### Styling conflicts
- Editor uses `.prosemirror-outsystems-container` namespace
- Check for CSS conflicts in your theme
- Use browser DevTools to inspect styles

## License

MIT License - Free for commercial and personal use

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Support

- **Documentation**: See examples folder
- **Issues**: Report bugs via GitHub
- **OutSystems Forum**: Search for "ProseMirror"

## Roadmap

### Version 0.1.0 (Current)
- ✅ Basic rich text editing
- ✅ Tables support
- ✅ Track changes
- ✅ Import/Export HTML/JSON

### Version 0.2.0 (Planned)
- Comments and annotations
- Advanced table features
- Custom color picker
- Image support with upload hooks

### Version 0.3.0 (Future)
- Real-time collaboration
- Version history integration
- PDF export
- Template system

## Credits

Built on [ProseMirror](https://prosemirror.net/) by Marijn Haverbeke.

---

**Made with ❤️ for the OutSystems Community**