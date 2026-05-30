# Getting Started with ErikrafT

## Installation
Currently in alpha. Follow these steps to set up the development environment:
1. Clone the repository.
2. Run `python cli/erik.py` to use the prototype CLI.

## Basics
- Variables: `let x = 10`
- Functions: `fn add(a: int, b: int) -> int { return a + b }`
- Logic: `if`, `else`, `match`

## AI Functions
ErikrafT provides a built-in `ai` module.
- `ai.chat(prompt)`: Get text responses.
- `ai.image(description)`: Generate images.
- `ai.agent(name, config)`: Create autonomous agents.
