type CodexaAction = {
    type: string;
    filePath: string;
    content: string;
};

type CodexaArtifact = {
    id: string;
    title: string;
    codexaActions: CodexaAction[];
};

const parseXML = (xml: string): CodexaArtifact[] => {
    const regexArtifact = /<codexaArtifact\s+(?:title|id)="([^"]+)"\s+(?:id|title)="([^"]+)">([\s\S]*?)<\/codexaArtifact>/g;
    const regexActions = /<codexaAction\s+type="([^"]+)"\s*(?:filePath="([^"]+)")?>(.*?)<\/codexaAction>/gs;

    const artifacts: CodexaArtifact[] = [];
    let artifactMatch;

    // Loop through each artifact in the XML
    while ((artifactMatch = regexArtifact.exec(xml)) !== null) {
        const artifact: CodexaArtifact = {
            id: artifactMatch[1],
            title: artifactMatch[2],
            codexaActions: [],
        };

        // Extract actions for this artifact
        const artifactContent = artifactMatch[3];
        let actionMatches;
        while ((actionMatches = regexActions.exec(artifactContent)) !== null) {
            const action: CodexaAction = {
                type: actionMatches[1],
                filePath: actionMatches[2] || '',
                content: actionMatches[3].trim()
            };

            artifact.codexaActions.push(action);
        }

        artifacts.push(artifact);
    }

    return artifacts;
};

export { parseXML };
export type { CodexaAction, CodexaArtifact };
