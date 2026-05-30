# ErikrafT Compiler & Runtime Architecture

## 1. Compiler Pipeline

The `erik` compiler follows a traditional multi-pass architecture optimized for multiple targets.

### Phase 1: Frontend
1. **Lexer (Scanner)**: Converts `.erik` source code into a stream of tokens. Handles comments, whitespace, and literals.
2. **Parser (Syntax Analysis)**: Consumes tokens and builds an Abstract Syntax Tree (AST). Uses a Recursive Descent or Pratt Parser for expressions.
3. **Semantic Analyzer**: Performs type checking, scope resolution, and trait verification.

### Phase 2: Middle-end
1. **Optimizer**: AST-level optimizations, constant folding, and dead code elimination.
2. **IR Generator**: (Optional for Native) Converts AST to an Intermediate Representation.

### Phase 3: Backend (Multi-target)
- **Target: JavaScript/Web**: Transforms AST to optimized JavaScript. Bundles components into HTML/CSS/JS.
- **Target: Native/Desktop**: Generates LLVM IR or C code for native compilation.
- **Target: Bytecode**: Generates `.ebc` (Erik Byte Code) for the Erik Runtime.

## 2. Architecture Diagram (Textual)

```
[ .erik Source ]
      |
      v
[ Lexer / Scanner ] --> [ Tokens ]
      |
      v
[ Parser ] ----------> [ AST ]
      |
      v
[ Semantic Analyzer ] --> [ Typed AST ]
      |
      v
[ Optimizer ]
      |
      +-----------------------+-----------------------+
      |                       |                       |
      v                       v                       v
[ JS Generator ]      [ Native Gen ]           [ Bytecode Gen ]
      |                       |                       |
      v                       v                       v
[ Web App / JS ]      [ Executable ]           [ .ebc File ]
```

## 3. Runtime System

### Memory Management
- **Hybrid GC**: Uses a generational mark-and-sweep garbage collector for reference types.
- **Stack Allocation**: Aggressive escape analysis ensures local objects stay on the stack.

### Concurrency Model
- **Spark Scheduler**: M:N scheduling (M sparks mapped to N OS threads).
- **Non-blocking I/O**: Integrated event loop for async/await operations.

### Standard Library (std)
- `std.io`: File and console I/O.
- `std.net`: HTTP and networking.
- `std.ai`: High-level AI abstractions.
- `std.ui`: Cross-platform UI primitives.

## 4. Execution Targets

| Target | Output | Platform |
|--------|--------|----------|
| `web` | HTML/CSS/JS | Browsers |
| `desktop` | Native App | Win, macOS, Linux |
| `native` | Binary | Server, CLI |
| `ebc` | Bytecode | Erik VM |

## 5. Package Manager: erikpkg

### Architecture
- **Registry**: Centralized repository for `.erik` modules.
- **Dependency Resolver**: SAT-based solver for versioning.
- **Build Cache**: Distributed caching for compiled artifacts.

### Security
- Content Addressable Storage (CAS) for all packages.
- Native signing and verification of publishers.

## 6. Language Server Protocol (LSP)

The Erik LSP provides:
- **IntelliSense**: Powered by the Semantic Analyzer.
- **Diagnostics**: Real-time syntax and type error reporting.
- **Refactoring**: AST-based renaming and symbol moves.
- **Documentation**: Hover information extracted from doc-comments.
