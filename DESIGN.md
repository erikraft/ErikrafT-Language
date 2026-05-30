# ErikrafT Language Design Specification (v0.1)

## Core Philosophy
ErikrafT (erik) is designed for the modern era where AI, Web, and Native performance intersect. It aims to be as expressive as TypeScript, as safe as Rust, and as productive as Go.

## 1. Syntax & Keywords

### Keywords
`let`, `const`, `fn`, `struct`, `class`, `interface`, `trait`, `enum`, `if`, `else`, `match`, `for`, `while`, `break`, `continue`, `return`, `async`, `await`, `spawn`, `pub`, `use`, `type`, `ai`, `try`, `catch`, `throw`, `component`, `render`.

### Operators
- Arithmetic: `+`, `-`, `*`, `/`, `%`, `**` (power)
- Logical: `&&`, `||`, `!`
- Comparison: `==`, `!=`, `<`, `>`, `<=`, `>=`
- Assignment: `=`, `+=`, `-=`, etc.
- Range: `..`, `..=`
- Pipeline: `|>`
- Optional Chaining: `?.`
- Null Coalescing: `??`

### Naming Conventions
- Types/Classes/Structs: `PascalCase`
- Functions/Variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Files: `snake_case.erik`

### Variable Declaration
```erik
let x = 10              // Inferred as int
const PI: float = 3.14  // Explicit type
let name: string? = nil // Nullable type
```

### Functions
```erik
pub fn add(a: int, b: int) -> int {
    return a + b
}

// Arrow function shorthand
let multiply = (a: int, b: int) => a * b
```

## 2. Type System

### Primitive Types
- `int`, `float`, `string`, `bool`, `char`, `byte`

### Complex Types
- `List<T>`, `Map<K, V>`
- `Structs`: Value types, stack-allocated when possible.
- `Classes`: Reference types, heap-allocated.

### Null Safety
ErikrafT is null-safe by default.
```erik
let s: string = "hello" // Cannot be null
let s: string? = nil    // Can be null
```

### Enums and Traits
```erik
trait Drawable {
    fn draw(self)
}

enum Shape {
    Circle(float),
    Rect(float, float)
}

impl Drawable for Shape {
    fn draw(self) {
        match self {
            Shape.Circle(r) => print("Drawing circle {r}"),
            Shape.Rect(w, h) => print("Drawing rect {w}x{h}")
        }
    }
}
```

### Pattern Matching
```erik
match value {
    1 => print("one"),
    2..10 => print("between 2 and 10"),
    is string => print("it's a string"),
    _ => print("something else")
}
```

## 3. Concurrency & Async

### Async/Await
First-class support for asynchronous I/O.
```erik
async fn fetchData() -> string {
    let response = await http.get("...")
    return response.body
}
```

### Lightweight Concurrency (Sparks)
Similar to Go routines.
```erik
spawn someWork()
```

## 4. Module System
```erik
use std.io
use web.components.Button

pub fn main() {
    io.print("Hello ErikrafT!")
}
```

## 5. AI Integration
ErikrafT treats AI as a first-class citizen.

### AI Natives
```erik
let summary = ai.chat("Summarize this: " + text)
let icon = ai.image("A blue robot")
```

### AI Security & Architecture
- **Sandboxing**: AI agents run in a restricted Spark environment with granular permissions.
- **Privacy**: Local-first processing when available; automatic data masking for remote LLM calls.
- **Verifiability**: Built-in audit logs for all AI-generated actions and code.

## 6. Hardware Platform
Integration with physical hardware.

### Features
- **Direct Access**: `hw.serial`, `hw.gpio`, `hw.usb`.
- **Permission Model**: Manifest-based security. Apps must declare `hardware.gpio` access in `erik.toml`.
- **Safety**: Real-time constraints for critical hardware loops.

## 6. Web Platform
Built-in component model that compiles to HTML/JS.
```erik
component HelloWorld(name: string) {
    render {
        <div>Hello {name}!</div>
    }
}
```

## 7. Memory Model
- Automatic memory management with a high-performance garbage collector.
- Escape analysis to prefer stack allocation.
- Optional manual memory management for performance-critical sections (via `unsafe`).

## 8. Error Handling
Result-based error handling combined with structured `try/catch`.
```erik
fn divide(a: int, b: int) -> int ! Error {
    if b == 0 { throw Error("Division by zero") }
    return a / b
}
```
