import { Editor } from '@monaco-editor/react';
import React, { useState } from 'react';

const EditorComponent: React.FC = () => {
    const [code, setCode] = useState('// Write your code here');

    const handleEditorChange = (newValue: string) => {
        setCode(newValue);
    };

    return (
        <div className="editor-container" style={{ height: "100%", width: '100%' }}>
            <Editor
                width="100%" // Makes the editor responsive
                height="100%" // Full height of the container
                language="javascript" // Language of the code
                theme="vs-dark" // Monaco theme (vs-dark is commonly used)
                value={code} // The current code in the editor
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
            />
        </div>
    );
};

export default EditorComponent;
