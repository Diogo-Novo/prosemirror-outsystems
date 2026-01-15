# Architecture & Design Decisions

## Overview

ProseMirror for OutSystems is designed as a thin, opinionated wrapper around ProseMirror that provides a clean global API suitable for OutSystems integration.

## Core Design Decisions

### 1. Global API Pattern

**Decision**: Expose `window.ProseMirrorOS` as a singleton manager.

**Rationale**:
- OutSystems works best with global objects
- Simplifies instance management across screens/blocks
- Avoids module system complexity in OutSystems
- Familiar pattern for OutSystems developers

**Trade-offs**:
- Not ideal for npm/modern JS apps (but we support both)
- Global namespace pollution (mitigated by single global)

### 2. Instance Management

**Decision**: Centralized instance registry with ID-based lookup.

**Rationale**:
- OutSystems developers need to access editors across lifecycle events
- Prevents memory leaks from orphaned editors
- Enables clean destroy patterns

**Implementation**:
```typescript
private static instances: Map<string, Editor> = new Map();
```

### 3. Schema-Driven Architecture

**Decision**: Build on ProseMirror's schema system, not markdown.

**Rationale**:
- Structured documents need validation (letters, forms, invoices)
- Markdown is too loose for formal documents
- ProseMirror schemas provide strong guarantees
- Better for legal/business use cases

**Extension Point**: Custom schemas are first-class citizens.

### 4. Single Bundle Output

**Decision**: Bundle all ProseMirror dependencies into one file.

**Rationale**:
- OutSystems expects simple file uploads
- Avoids dependency management complexity
- Reduces integration friction
- Trade-off: Larger bundle size (but gzipped it's acceptable)

### 5. TypeScript Implementation

**Decision**: Write in TypeScript, compile to JavaScript.

**Rationale**:
- Better developer experience
- Catch errors at compile time
- Self-documenting API
- Still outputs clean JS for OutSystems

## Module Structure
```
src/
├── index.ts              → Global API entry point
├── core/
│   ├── Editor.ts         → Main editor class
│   ├── schema.ts         → Schema helpers
│   └── plugins.ts        → Plugin configuration
├── schemas/
│   ├── basic.ts          → Default rich-text schema
│   └── letter.ts         → Example structured schema
└── utils/
    ├── serialization.ts  → Content conversion
    ├── validation.ts     → Content validation
    └── keymap.ts         → Keyboard shortcuts
```

### Separation of Concerns

1. **Global API** (`index.ts`)
   - Instance lifecycle management
   - Public API surface
   - OutSystems integration layer

2. **Editor Core** (`core/Editor.ts`)
   - ProseMirror view management
   - State management
   - Content operations

3. **Schemas** (`schemas/`)
   - Document structure definitions
   - Node and mark specifications
   - Validation rules

4. **Utilities** (`utils/`)
   - Serialization (JSON ↔ HTML)
   - Validation helpers
   - Reusable functions

## State Management

### Editor State
- Managed by ProseMirror's `EditorState`
- Immutable updates via transactions
- History plugin tracks changes

### Instance State
- Tracked in global Map
- Lifecycle tied to DOM elements
- Explicit cleanup via `destroy()`

## Extension Points

### Easy to Add Later

1. **Custom Plugins**
```typescript
   // Add to plugins.ts
   export function createPlugins(schema: Schema, custom?: Plugin[]) {
     return [...defaultPlugins, ...(custom || [])];
   }
```

2. **Custom Schemas**
```typescript
   // User creates their own schema
   const mySchema = new Schema({ /* ... */ });
   ProseMirrorOS.create('#editor', { schema: mySchema });
```

3. **Custom Commands**
```typescript
   // Extend keymap
   const customKeymap = {
     'Ctrl-Shift-X': myCustomCommand
   };
```

4. **Track Changes UI**
   - Marks are already in letter schema
   - Add UI for accept/reject in future version

### Intentionally Not Included Yet

1. **Collaborative Editing**
   - Requires websocket infrastructure
   - Complex conflict resolution
   - Better as separate plugin/module

2. **Image Uploads**
   - Delegate to OutSystems file upload
   - Keep editor focused on text

3. **Mentions/Autocomplete**
   - High variability in requirements
   - Easy to add as plugin later

4. **Advanced Formatting**
   - Tables, footnotes, etc.
   - Can add incrementally via schemas

## Performance Considerations

### Bundle Size
- ~300KB unminified (includes all ProseMirror)
- ~80KB minified + gzipped
- Acceptable for OutSystems use case

### Runtime Performance
- ProseMirror is highly optimized
- No virtual DOM overhead
- Efficient updates via transactions

### Memory Management
- Instances cleaned up via `destroy()`
- No memory leaks if properly destroyed
- OutSystems developers must call destroy in OnDestroy

## Testing Strategy

### Unit Tests
- Test core Editor class methods
- Test serialization utils
- Test validation functions

### Integration Tests
- Test global API
- Test instance management
- Test lifecycle

### Manual Testing
- Example HTML files
- OutSystems test module

## Build Process
```
TypeScript → Rollup → Bundle → Minify
           → Type Declarations
           → Source Maps
```

### Build Outputs
- `dist/prosemirror-outsystems.js` - Development bundle
- `dist/prosemirror-outsystems.min.js` - Production bundle
- `dist/prosemirror-outsystems.css` - Styles
- `dist/*.d.ts` - Type declarations

## OutSystems Integration Pattern

### Recommended Flow

1. **Screen OnReady**
```javascript
   ProseMirrorOS.create('#editor', {
     id: 'my-editor',
     onChange: (content) => {
       $parameters.Content = JSON.stringify(content);
     }
   });
```

2. **Data Binding**
```javascript
   // On content change
   editor.setContent($parameters.InitialContent);
```

3. **Save Action**
```javascript
   var content = ProseMirrorOS.getInstance('my-editor').getContent();
   SaveDocument(JSON.stringify(content));
```

4. **Cleanup (OnDestroy)**
```javascript
   ProseMirrorOS.destroy('my-editor');
```

## Future Roadmap

### v0.2.0
- [ ] Track changes UI
- [ ] Better validation helpers
- [ ] More example schemas

### v0.3.0
- [ ] Plugin API
- [ ] Custom node views
- [ ] Advanced formatting options

### v1.0.0
- [ ] Stable API
- [ ] Full documentation
- [ ] OutSystems Forge release

## Contributing Guidelines

### Code Style
- Use TypeScript
- Prefer composition over inheritance
- Keep functions small and focused
- Document public APIs

### Testing
- Write tests for new features
- Maintain >80% coverage
- Include integration tests

### Documentation
- Update README for API changes
- Add inline comments for complex logic
- Provide examples for new features