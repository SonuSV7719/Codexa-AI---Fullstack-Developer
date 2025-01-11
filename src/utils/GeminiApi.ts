import axios from 'axios';
import { Readable } from 'stream';
import { SYSTEM_PROMPT } from '../constants/system_prompt';

interface GeminiApiResponse {
    candidates: GeminiCandidate[];
    usageMetadata: GeminiUsageMetadata;
    modelVersion: string;
}

interface GeminiCandidate {
    content: GeminiContent;
    finishReason: string
    avgLogprobs: number;
}

interface GeminiContent {
    parts: GeminiContentPart[];
    role: string
}

interface GeminiContentPart {
    text: string;
}

interface GeminiUsageMetadata {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
}


interface GeminiApiError {
    message: string;
    status: number;
    details: string;
}

class GeminiAPI {
    private apiKey: string;
    private systemPrompt: string;
    private previousContent: GeminiContent[];

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.systemPrompt = SYSTEM_PROMPT;
        this.previousContent = []
    }

    private async callGeminiApi(messages: Array<{ role: string, parts: Array<{ text: string }> }>, stream: boolean): Promise<GeminiApiResponse | Readable> {

        try {
            const endpoint = stream
                ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?alt=sse'
                : 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

            const response = await axios.post(
                endpoint,
                {
                    system_instruction:
                    {
                        parts: {
                            text: this.systemPrompt
                        }
                    },
                    contents: [
                        ...this.previousContent,
                        ...messages
                    ],
                    generationConfig: {
                        temperature: 1,
                        maxOutputTokens: 8192,
                        topP: 0.95,
                        topK: 40
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: {
                        key: this.apiKey
                    },
                    responseType: stream ? 'stream' : 'json', // Choose 'stream' for streaming output
                }
            );

            // If streaming is enabled, return the stream to handle it outside
            if (stream) {
                console.log("response.data", response.data)
                return response.data;
            }

            this.previousContent.push(...messages)
            console.log("previousContent",this.previousContent)
            return response.data as GeminiApiResponse;
        } catch (error: unknown) {
            this.handleError(error);
            throw new Error('Failed to call Gemini API');
        }
    }

    private handleError(error: unknown): void {
        if (axios.isAxiosError(error)) {
            const geminiApiError: GeminiApiError = {
                message: error.message,
                status: error.response?.status || 500,
                details: error.response?.data || 'No further details available.'
            };

            console.error(`Error: ${geminiApiError.message}`);
            console.error(`Status: ${geminiApiError.status}`);
            console.error(`Details: ${geminiApiError.details}`);
        } else {
            console.error('An unexpected error occurred:', error);
        }
    }

    public async chat(messages: Array<{ role: string, parts: Array<{ text: string }> }>, stream = false): Promise<string | void> {
        try {
            const result = await this.callGeminiApi(messages, stream);

            // If stream is requested, handle it as a stream
            if (stream) {
                this.handleStream(result as Readable);
                return;
            }         

            return (result as GeminiApiResponse).candidates[(result as GeminiApiResponse).candidates.length - 1].content.parts[(result as GeminiApiResponse).candidates[(result as GeminiApiResponse).candidates.length - 1].content.parts.length - 1].text;
        } catch (error) {
            throw new Error(`Error during chat call: ${(error as Error).message}`);
        }
    }

    public async update(messages: Array<{ role: string, parts: Array<{ text: string }> }>, stream = false): Promise<string | void> {
        try {
            const result = await this.callGeminiApi(messages, stream);

            // If stream is requested, handle it as a stream
            if (stream) {
                this.handleStream(result as Readable);
                return;
            }

                
            return (result as GeminiApiResponse).candidates[(result as GeminiApiResponse).candidates.length - 1].content.parts[(result as GeminiApiResponse).candidates[(result as GeminiApiResponse).candidates.length - 1].content.parts.length - 1].text;
        } catch (error) {
            throw new Error(`Error during update call: ${(error as Error).message}`);
        }
    }

    // Handle streaming response
    private handleStream(stream: Readable): void {
        stream.on('data', (chunk: Buffer) => {
            console.log('Received chunk:', chunk.toString());
        });

        stream.on('end', () => {
            console.log('Stream ended');
        });

        stream.on('error', (err) => {
            console.error('Stream error:', err);
        });
    }
}

export default GeminiAPI;
