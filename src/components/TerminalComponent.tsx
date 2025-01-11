import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { ChatMessage } from '../App';
import { useGeminiApi } from '../hooks/useGeminiApi';

interface TerminalComponentProps {
    webContainerInstance: any;
    commandToExecute?: string[]; // Command to be executed programmatically
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
    setAiCmdLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const TerminalComponent: React.FC<TerminalComponentProps> = ({ webContainerInstance, commandToExecute, setMessages, setAiCmdLoading }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const terminalInstance = useRef<Terminal | null>(null);
    const fitAddonInstance = useRef<FitAddon | null>(null);
    const processRef = useRef<any>(null); // Keep track of the currently running process
    let currentCommand = ''; // Buffer for the current command
    const gemini = useGeminiApi()

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize the terminal
        const terminal = new Terminal({
            theme: {
                background: '#1E1E1E', // Dark theme background
                foreground: '#FFFFFF', // White text
                cursor: '#00FF00', // Green cursor
                selectionBackground: '#2BA6FF1A', // Light blue selection
            },
            cursorBlink: true,
            scrollback: 1000,
            fontFamily: 'Fira Code, monospace',
            fontSize: 14,

        });

        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(terminalRef.current);
        fitAddon.fit();

        // Store references
        terminalInstance.current = terminal;
        fitAddonInstance.current = fitAddon;

        const resizeTerminal = () => {
            fitAddon.fit();
        };

        const scrollToBottom = () => {
            terminal.scrollToBottom();
        };

        const terminateCurrentProcess = () => {
            if (processRef.current) {
                processRef.current.kill(); // Kill the current process
                processRef.current = null;
                terminal.writeln('\x1b[31mProcess terminated.\x1b[0m'); // Red termination message
                terminal.write('$ Codexa $ '); // Re-display the prompt
            }
        };

        const runCommand = async (command: string) => {
            if (!webContainerInstance || command === '') return;

            try {
                const process = await webContainerInstance.spawn('sh', ['-c', command]);
                processRef.current = process; // Keep reference to the running process

                process.output.pipeTo(
                    new WritableStream({
                        write(chunk) {
                            const data = chunk
                            terminal.write(data);
                            scrollToBottom();
                        },
                    })
                );

                const exitCode = await process.exit;
                terminal.writeln(`\nProcess exited with code: ${exitCode}\n\n`);
                processRef.current = null; // Clear process reference
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                terminal.writeln(`\x1b[31mError: ${errorMessage}\x1b[0m`); // Red error message
            } finally {
                terminal.write('$ Codexa $ '); // Show prompt after execution
                scrollToBottom();
            }
        };

        // Display welcome message and prompt
        terminal.writeln('\x1b[32mWelcome to Codexa Terminal!\x1b[0m'); // Green welcome message
        terminal.write('$ Codexa $ ');

        // Handle user input
        terminal.onData((data) => {
            switch (data) {
                case '\r': // Enter key
                    terminal.write('\r\n'); // Move to the next line
                    runCommand(currentCommand.trim());
                    currentCommand = '';
                    terminal.write('$ Codexa $ '); // Show the prompt again
                    break;
                case '\u007F': // Backspace key
                    if (currentCommand.length > 0) {
                        currentCommand = currentCommand.slice(0, -1);
                        terminal.write('\b \b'); // Remove last character visually
                    }
                    break;
                case '\x03': // Ctrl+C
                    terminateCurrentProcess();
                    break;
                default:
                    if (data >= ' ') {
                        currentCommand += data;
                        terminal.write(data);
                    }
                    break;
            }
            scrollToBottom();
        });

        // Handle resizing
        window.addEventListener('resize', resizeTerminal);

        return () => {
            terminal.dispose();
            window.removeEventListener('resize', resizeTerminal);
        };
    }, [webContainerInstance]);

    // Watch for changes to the `commandToExecute` prop
    useEffect(() => {
        if (commandToExecute && terminalInstance.current) {
            const runCommandsProgrammatically = async () => {
                for (const command of commandToExecute) {
                    terminalInstance.current!.writeln(`${command}`);
                    try {
                        setAiCmdLoading(true)
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { sender: 'AI', text: `Executing: ${command}...`, type: 'shell' }
                        ])
                        const process = await webContainerInstance.spawn('sh', ['-c', command]);
                        processRef.current = process;
                        let output = ''
                        process.output.pipeTo(
                            new WritableStream({
                                write(chunk) {
                                    terminalInstance.current!.write(chunk);
                                    output += chunk
                                },
                            })
                        );

                        const exitCode = await process.exit;
                        if (exitCode) {
                            setAiCmdLoading(false)
                        }

                        if (exitCode != 0) {
                            // gemini.chat([{ role: 'user', parts: [{ text: `${output} solve this error and again run npm install and script start code`}]}])
                        }
                        terminalInstance.current!.writeln(`\nProcess exited with code: ${exitCode}`);
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        terminalInstance.current!.writeln(`\x1b[31mError: ${errorMessage}\x1b[0m`);
                        setAiCmdLoading(false)
                        // gemini.chat([{ role: 'user', parts: [{ text: `${errorMessage} solve this error and again run npm install and script start code` }] }])
                    } finally {
                        processRef.current = null;
                        setAiCmdLoading(false)
                        terminalInstance.current!.write('$ Codexa $ ');
                        terminalInstance.current!.scrollToBottom();

                    }
                }
            };

            runCommandsProgrammatically();
        }
    }, [commandToExecute, webContainerInstance]);


    return (
        <div
            ref={terminalRef}
            className="w-full h-full border-t border-gray-600 bg-bg-secondary text-white overflow-scroll"
            style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                overflow: 'hidden',
            }}
        />
    );
};

export default TerminalComponent;
