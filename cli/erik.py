import sys
import re

class Token:
    def __init__(self, type, value):
        self.type = type
        self.value = value
    def __repr__(self):
        return f"Token({self.type}, {self.value})"

class Lexer:
    TOKEN_SPEC = [
        ('NUMBER',   r'\d+(\.\d*)?'),
        ('STRING',   r'"[^"]*"'),
        ('KEYWORD',  r'\b(let|const|fn|pub|use|return|if|else|match|ai|component|render|async|await|spawn|type|struct|class|interface|trait|enum|try|catch|throw)\b'),
        ('COMMENT',  r'//.*'),
        ('ID',       r'[a-zA-Z_][a-zA-Z0-9_]*'),
        ('OP',       r'[+\-*/%!=<>|&?.]{1,2}'),
        ('LPAREN',   r'\('),
        ('RPAREN',   r'\)'),
        ('LBRACE',   r'\{'),
        ('RBRACE',   r'\}'),
        ('LBRACKET', r'\['),
        ('RBRACKET', r'\]'),
        ('SEMICOLON',r';'),
        ('COLON',    r':'),
        ('COMMA',    r','),
        ('ARROW',    r'->|=>'),
        ('NEWLINE',  r'\n'),
        ('SKIP',     r'[ \t]+'),
        ('MISMATCH', r'.'),
    ]

    def __init__(self, code):
        self.code = code

    def tokenize(self):
        tok_regex = '|'.join('(?P<%s>%s)' % pair for pair in self.TOKEN_SPEC)
        for mo in re.finditer(tok_regex, self.code):
            kind = mo.lastgroup
            value = mo.group()
            if kind == 'NUMBER':
                value = float(value) if '.' in value else int(value)
            elif kind == 'STRING':
                value = value[1:-1]
            elif kind == 'SKIP' or kind == 'COMMENT':
                continue
            elif kind == 'MISMATCH':
                raise RuntimeError(f'Unexpected character {value!r}')
            yield Token(kind, value)

class Parser:
    def __init__(self, tokens):
        self.tokens = list(tokens)
        self.pos = 0

    def parse(self):
        # Very basic parser that just collects top-level elements for now
        ast = []
        while self.pos < len(self.tokens):
            token = self.tokens[self.pos]
            if token.type == 'NEWLINE':
                self.pos += 1
                continue
            ast.append(token)
            self.pos += 1
        return ast

def main():
    if len(sys.argv) < 2:
        print("Usage: erik <command> [file]")
        return

    command = sys.argv[1]

    if command == "run" and len(sys.argv) > 2:
        filename = sys.argv[2]
        with open(filename, 'r') as f:
            code = f.read()

        lexer = Lexer(code)
        tokens = list(lexer.tokenize())
        # parser = Parser(tokens)
        # ast = parser.parse()

        print(f"Executing {filename}...")
        for t in tokens:
            if t.type != 'NEWLINE':
                print(t)
    else:
        print(f"ErikrafT CLI v0.1")
        print(f"Available commands: run, build, test, ai")

if __name__ == "__main__":
    main()
