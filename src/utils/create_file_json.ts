import type { FileSystemTree, DirectoryNode, FileNode } from "@webcontainer/api";
import { CodexaArtifact } from "./codexa_xml_parser";

// Define the types for the CodexaArtifact input

// Helper function to create a FileNode
const createFileNode = (content: string): FileNode => ({
    file: {
        contents: content,
    },
});

// Helper function to create a DirectoryNode
const createDirectoryNode = (): DirectoryNode => ({
    directory: {},
});

type TransformFilesReturnType = {
    fileSystemTree: FileSystemTree,
    shellCommands: string[]
}

// Main transformFiles function
function transformFiles(input: CodexaArtifact[]): TransformFilesReturnType {
    const fileSystemTree: FileSystemTree = {};
    const shellCommands: string[] = [];

    input.forEach((artifact) => {
        artifact.codexaActions.forEach((action) => {
            const { type, filePath, content } = action;

            // If the action is of type "shell", store the command in the shellCommands array
            if (type === "shell") {
                shellCommands.push(content);
                return;
            }

            // Otherwise, process it as a file and directory structure
            const pathParts = filePath.split('/');
            let currentLevel = fileSystemTree;

            pathParts.forEach((part, index) => {
                if (index === pathParts.length - 1) {
                    // Add the file node at the end of the path
                    currentLevel[part] = createFileNode(content);
                } else {
                    // Add a directory node if it doesn't exist
                    if (!currentLevel[part]) {
                        currentLevel[part] = createDirectoryNode();
                    }
                    // Move to the next level in the file system tree
                    currentLevel = (currentLevel[part] as DirectoryNode).directory;
                }
            });
        });
    });

    // Return both the FileSystemTree and the shell commands as a JSON
    return {
        fileSystemTree,
        shellCommands: shellCommands
    };
}

export type { TransformFilesReturnType }

export { transformFiles };
