import { Editor } from '@monaco-editor/react';
import React from 'react';
import * as monaco from "monaco-editor";
interface EditorComponentProps {
    setSelectedFileContent: React.Dispatch<React.SetStateAction<string>>
    updateFileContent: (newContent: string) => void
    selectedFileContent: string
    selectedFileExtension: string | null
}

const EditorComponent: React.FC<EditorComponentProps> = ({ setSelectedFileContent, updateFileContent, selectedFileContent, selectedFileExtension }) => {
    function getLanguageByExtension(extension: string): string | null {
        // Normalize the extension by ensuring it starts with a "."
        if (!extension.startsWith(".")) {
            extension = `.${extension}`;
        }

        // Get all registered languages from Monaco
        const languages = monaco.languages.getLanguages();

        // Search for the language matching the extension
        for (const language of languages) {
            if (language.extensions?.includes(extension)) {
                return language.id; // Return the language ID if found
            }
        }

        // Return null if no language matches the given extension
        return null;
    }

    return (
        <div className="editor-container" style={{ height: "100%", width: '100%' }}>
            <Editor
                width="100%" // Makes the editor responsive
                height="100%" // Full height of the container
                language={selectedFileExtension ? getLanguageByExtension(selectedFileExtension) || '' : ''} // Language of the code
                theme="vs-dark" // Monaco theme (vs-dark is commonly used)
                value={selectedFileContent} // The current code in the editor
                // onChange={handleEditorChange}
                options={{
                    selectOnLineNumbers: true,
                    minimap: { enabled: false },
                    automaticLayout: true, // Automatically adjust layout based on container size
                    quickSuggestions: true, // Enable quick suggestions (autocomplete)
                    suggestOnTriggerCharacters: true, // Show suggestions when trigger characters like "." or "(" are typed
                    acceptSuggestionOnEnter: "on", // Accept suggestion on Enter key
                    tabSize: 4, // Set the number of spaces per tab
                    insertSpaces: true, // Use spaces instead of tabs
                    smoothScrolling: true, // Enable smooth scrolling
                    lineNumbersMinChars: 2, // Reduce the width reserved for line numbers
                }}
                onChange={(e: string | undefined) => {
                    if (!e) return
                    setSelectedFileContent(e);
                    updateFileContent(e);
                }}
            />
        </div>
    );
};

export default EditorComponent;
