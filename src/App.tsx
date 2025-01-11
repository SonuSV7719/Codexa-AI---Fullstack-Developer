import React, { useRef, useState } from "react";
import EditorContainer from "./components/EditorContainer";
import Chats from "./components/Chats";
import LOGO from './assets/logo1.png';
import { useWebContainer } from "./hooks/useWebcontainer";
import Spinner from "./components/Spinner/Spinner";
import GeminiAPI from "./utils/GeminiApi";
import { CodexaArtifact, parseXML } from "./utils/codexa_xml_parser";
import { transformFiles, TransformFilesReturnType } from "./utils/create_file_json";
import { CiExport } from "react-icons/ci";
import { DirectoryNode, FileNode, FileSystemTree } from "@webcontainer/api";
import JSZip from "jszip";

interface AppProps {
  gemini: GeminiAPI;
}

interface ChatMessage {
  sender: "user" | "AI";
  text: string;
}

const App: React.FC<AppProps> = ({ gemini }) => {
  const [collapse, setCollapse] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]); // State for tracking chat messages
  const webContainerInstance = useWebContainer();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const geminiOuput = useRef<string | null>(null);
  const parseXmlGeminiOuput = useRef<CodexaArtifact[] | null>(null);
  const [transformedXmlData, setTransformedXmlData] = useState<TransformFilesReturnType | null>(null);

  const fetchGemini = async (chat: string | undefined) => {
    if (!chat) return;
    setLoading(true);
    try {
      const response = await gemini.chat([
        { role: 'user', parts: [{ text: chat }] }
      ]);

      if (response) {
        const xmlReplaceResponse = response.replace('xml', '');
        geminiOuput.current = xmlReplaceResponse;
        console.log('parseXmlGeminiOuput', geminiOuput.current)
        parseXmlGeminiOuput.current = parseXML(geminiOuput.current);
        console.log('parseXmlGeminiOuput', parseXmlGeminiOuput)
        setTransformedXmlData(transformFiles(parseXmlGeminiOuput.current));
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error('Error fetching Gemini data:', err);
    }
  };

  const handleSend = async () => {
    if (!textAreaRef.current) return;
    const textAreaValue = textAreaRef.current.value;
    textAreaRef.current.value = '';

    // Add user message to the messages state
    setMessages(prevMessages => [
      ...prevMessages,
      { sender: "user", text: textAreaValue }
    ]);

    fetchGemini(textAreaValue);
  };

  const exportToZip = async (fileSystemTree: FileSystemTree) => {
    const zip = new JSZip();

    const addFilesToZip = (tree: FileSystemTree, zipFolder: JSZip | null) => {
      Object.entries(tree).forEach(([key, value]) => {
        if ((value as DirectoryNode).directory && zipFolder) {
          // Add a directory
          const folder = zipFolder.folder(key);
          addFilesToZip((value as DirectoryNode).directory, folder);
        } else if ((value as FileNode).file && zipFolder) {
          // Add a file
          zipFolder.file(key, (value as FileNode).file.contents);
        }
      });
    };

    addFilesToZip(fileSystemTree, zip);

    // Generate the ZIP
    const blob = await zip.generateAsync({ type: "blob" });

    // Trigger file download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${parseXmlGeminiOuput && parseXmlGeminiOuput.current && parseXmlGeminiOuput.current.length > 0 ? parseXmlGeminiOuput.current[0].title : "project_files"}.zip`;
    link.click();
  };

  const handleExport = async () => {
    console.log("Handle Export clicked")
    if (!transformedXmlData) return

    await exportToZip(transformedXmlData.fileSystemTree)
  }

  return (
    <div>
      <header className="flex justify-between items-center text-white bg-bg-secondary h-fit px-3 py-1 fixed top-0 left-0 w-full z-20">
        <div className="flex items-center w-fit">
          <img src={LOGO} alt="" className="w-16" />
          <span className="font-bold text-xl">Codexa AI</span>
        </div>
        <div>
          <button className=" flex gap-2 items-center justify-center p-2 mr-4 bg-blue-500 rounded-md px-4 shadow-md hover:bg-blue-600" onClick={handleExport}>Export <CiExport /></button>
        </div>
      </header>

      {
        !webContainerInstance ? (
          <div className="text-white w-[100vw] h-[100vh] flex justify-center items-center flex-col">
            Web Container is Loading...<Spinner speed="1s" />
          </div>
        ) : (
          <div className="">
            <div className="flex tablet:w-[45vw] justify-center mt-24 flex-col tablet:px-11 px-2">
              <div className="text-white">
                <div className=" mb-44">
                  <Chats messages={messages} />
                </div>
                {collapse &&
                  <div className="flex fixed bottom-5 h-32 bg-bg-secondary tablet:w-[38vw] rounded-md z-50 p-2 items-center gap-4 border border-slate-400">
                    <textarea
                      className="w-full p-2 bg-transparent text-white border-none outline-none border-slate-500"
                      placeholder="Type here..."
                      style={{ zIndex: 100, resize: "none", scrollbarWidth: 'thin' }}
                      ref={textAreaRef}
                    />
                    <button className="flex gap-2 items-center justify-center p-2 mr-4 bg-blue-500 rounded-md px-4 shadow-md hover:bg-blue-600 font-semibold" onClick={handleSend}>Send</button>
                  </div>
                }
              </div>
            </div>

            <div className="flex items-center text-white tablet:mx-5 mt-2 justify-end tablet:fixed w-full tablet:right-1 tablet:top-[4.5rem]">
              <EditorContainer
                collapse={collapse}
                setCollapse={setCollapse}
                files={transformedXmlData ? transformedXmlData.fileSystemTree : {}}
                commands={transformedXmlData ? transformedXmlData.shellCommands : null}
                loading={loading}
              />

            </div>
          </div>
        )
      }
    </div>
  );
};

export default App;
