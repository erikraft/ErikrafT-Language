# ErikrafT Language

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ErikrafT** is a modern, high-performance programming language designed for AI, Web, and Native applications.

## Key Features
- **Modern Syntax**: Elegant and familiar syntax inspired by TypeScript and Rust.
- **Type Safety**: Null-safe by default with a powerful static type system.
- **AI-First**: Native primitives for AI chat, image generation, and agents.
- **Unified Web/Desktop**: Built-in frameworks for cross-platform UI.
- **High Performance**: Compiled to native code, JavaScript, or WebAssembly.

## Quick Start
```bash
# Install erik
curl -sSL https://erikraft.com/install.sh | sh

# Create a new app
erik new my-app
cd my-app
erik run main.erik
```

## Examples
### Hello World
```erik
pub fn main() {
    print("Hello ErikrafT!")
}
```

### AI Chat
```erik
let reply = await ai.chat("Explain quantum physics")
```

## Roadmap
- **v0.1**: Initial CLI, Lexer, and Design Specs (Current)
- **v0.5**: Full Parser, Semantic Analysis, JS Target
- **v1.0**: Native Runtime, Desktop Platform, Package Manager
- **v2.0**: Advanced AI Workflows, Hardware Integration

## License
ErikrafT is licensed under the MIT License.
