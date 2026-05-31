import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
    Hover,
    MarkupKind,
    Location,
    Range,
    WorkspaceEdit,
    RenameParams
} from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			completionProvider: {
				resolveProvider: true,
                triggerCharacters: ['.']
			},
            hoverProvider: true,
            definitionProvider: true,
            renameProvider: true,
			documentFormattingProvider: true
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

interface ErikSettings {
	maxNumberOfProblems: number;
}

const defaultSettings: ErikSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ErikSettings = defaultSettings;

const documentSettings: Map<string, Thenable<ErikSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		documentSettings.clear();
	} else {
		globalSettings = <ErikSettings>(
			(change.settings.erikLanguageServer || defaultSettings)
		);
	}

	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ErikSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'erikLanguageServer'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	const settings = await getDocumentSettings(textDocument.uri);
	const text = textDocument.getText();
	const diagnostics: Diagnostic[] = [];

    // Simple validation: check for unclosed brackets
    const stack: number[] = [];
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '{') {
            stack.push(i);
        } else if (text[i] === '}') {
            if (stack.length === 0) {
                const diagnostic: Diagnostic = {
                    severity: DiagnosticSeverity.Error,
                    range: {
                        start: textDocument.positionAt(i),
                        end: textDocument.positionAt(i + 1)
                    },
                    message: `Unexpected closing bracket '}'`,
                    source: 'erik'
                };
                diagnostics.push(diagnostic);
            } else {
                stack.pop();
            }
        }
    }

    while (stack.length > 0) {
        const pos = stack.pop()!;
        const diagnostic: Diagnostic = {
            severity: DiagnosticSeverity.Error,
            range: {
                start: textDocument.positionAt(pos),
                end: textDocument.positionAt(pos + 1)
            },
            message: `Unclosed bracket '{'`,
            source: 'erik'
        };
        diagnostics.push(diagnostic);
    }

	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
        const textDocument = documents.get(_textDocumentPosition.textDocument.uri);
        if (!textDocument) return [];

        const text = textDocument.getText();
        const offset = textDocument.offsetAt(_textDocumentPosition.position);
        const before = text.substring(0, offset);

        if (before.endsWith('ai.')) {
            return [
                { label: 'chat', kind: CompletionItemKind.Method, detail: 'ai.chat(prompt: string) -> string' },
                { label: 'image', kind: CompletionItemKind.Method, detail: 'ai.image(prompt: string) -> Image' },
                { label: 'agent', kind: CompletionItemKind.Method, detail: 'ai.agent(instructions: string) -> Agent' },
                { label: 'ask', kind: CompletionItemKind.Method, detail: 'ai.ask(question: string) -> string' }
            ];
        }

        if (before.endsWith('web.')) {
            return [
                { label: 'component', kind: CompletionItemKind.Method },
                { label: 'render', kind: CompletionItemKind.Method },
                { label: 'http', kind: CompletionItemKind.Module }
            ];
        }

        if (before.endsWith('browser.')) {
            return [
                { label: 'window', kind: CompletionItemKind.Variable },
                { label: 'document', kind: CompletionItemKind.Variable },
                { label: 'localStorage', kind: CompletionItemKind.Variable }
            ];
        }

        if (before.endsWith('filesystem.')) {
            return [
                { label: 'readFile', kind: CompletionItemKind.Method },
                { label: 'writeFile', kind: CompletionItemKind.Method },
                { label: 'exists', kind: CompletionItemKind.Method }
            ];
        }

		return [
			{ label: 'let', kind: CompletionItemKind.Keyword },
			{ label: 'const', kind: CompletionItemKind.Keyword },
			{ label: 'fn', kind: CompletionItemKind.Keyword },
			{ label: 'pub', kind: CompletionItemKind.Keyword },
			{ label: 'if', kind: CompletionItemKind.Keyword },
			{ label: 'else', kind: CompletionItemKind.Keyword },
			{ label: 'match', kind: CompletionItemKind.Keyword },
			{ label: 'return', kind: CompletionItemKind.Keyword },
			{ label: 'class', kind: CompletionItemKind.Keyword },
			{ label: 'struct', kind: CompletionItemKind.Keyword },
			{ label: 'interface', kind: CompletionItemKind.Keyword },
			{ label: 'trait', kind: CompletionItemKind.Keyword },
			{ label: 'component', kind: CompletionItemKind.Keyword },
			{ label: 'render', kind: CompletionItemKind.Keyword },
            { label: 'ai', kind: CompletionItemKind.Module },
            { label: 'web', kind: CompletionItemKind.Module },
            { label: 'browser', kind: CompletionItemKind.Module },
            { label: 'filesystem', kind: CompletionItemKind.Module }
		];
	}
);

connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		return item;
	}
);

connection.onDocumentFormatting((params) => {
	const document = documents.get(params.textDocument.uri);
	if (!document) return [];

	const text = document.getText();
	const options = params.options;

	let formatted = '';
	let indentLevel = 0;
	const indentChar = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';

	const lines = text.split(/\r?\n/);
	for (let line of lines) {
		line = line.trim();
		if (line.startsWith('}')) {
			indentLevel = Math.max(0, indentLevel - 1);
		}

		if (line.length > 0) {
			formatted += indentChar.repeat(indentLevel) + line + '\n';
		} else {
			formatted += '\n';
		}

		if (line.endsWith('{')) {
			indentLevel++;
		}
	}

	return [{
		range: {
			start: { line: 0, character: 0 },
			end: { line: lines.length, character: 0 }
		},
		newText: formatted
	}];
});

connection.onHover((params: TextDocumentPositionParams): Hover | null => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);

    const wordRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)?\b/g;
    let match;
    while ((match = wordRegex.exec(text)) !== null) {
        if (offset >= match.index && offset <= match.index + match[0].length) {
            const word = match[0];
            if (word === 'ai.chat') {
                return {
                    contents: {
                        kind: MarkupKind.Markdown,
                        value: '**ai.chat(prompt: string) -> string**\n\nSend a prompt to an AI model and return the generated response.'
                    }
                };
            }
            if (word === 'ai.ask') {
                return {
                    contents: {
                        kind: MarkupKind.Markdown,
                        value: '**ai.ask(question: string) -> string**\n\nAsk a question to the AI.'
                    }
                };
            }
        }
    }

    return null;
});

// Basic Go To Definition (placeholder that points to the same position)
connection.onDefinition((params): Location | null => {
    return {
        uri: params.textDocument.uri,
        range: Range.create(params.position, params.position)
    };
});

// Basic Rename (placeholder)
connection.onRenameRequest((params: RenameParams): WorkspaceEdit | null => {
    const edits: WorkspaceEdit = {
        changes: {
            [params.textDocument.uri]: [
                {
                    range: Range.create(params.position, params.position),
                    newText: params.newName
                }
            ]
        }
    };
    return edits;
});

documents.listen(connection);
connection.listen();
