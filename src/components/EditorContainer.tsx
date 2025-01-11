import React, { useEffect, useRef, useState } from 'react';
import EditorComponent from './EditorComponent';
import Split from 'react-split';
import { RiRobot3Fill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { PiTreeViewFill } from "react-icons/pi";
import { FaAngleLeft } from "react-icons/fa6";
import FileTreeContructor from './FileTree/FileTreeContructor';
import {
  DirectoryNode,
  FileNode,
  FileSystemTree
} from '@webcontainer/api';
import { useWebContainer } from '../hooks/useWebcontainer';
import TerminalComponent from './TerminalComponent';
import Spinner from './Spinner/Spinner';
import { ChatMessage } from '../App';

enum CodeTabs {
  CODE,
  PREVIEW
}

interface EditorContainerProps {
  className?: string;
  collapse: boolean;
  setCollapse: (data: boolean) => void;
  files: FileSystemTree | null | undefined;
  commands: string[] | null;
  loading: boolean
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  setAiCmdLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const EditorContainer: React.FC<EditorContainerProps> = ({ className, collapse, setCollapse, files, commands, loading,setMessages,setAiCmdLoading }) => {
  const [activeTab, setActiveTab] = useState<CodeTabs>(CodeTabs.CODE);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedFileContent, setSelectedFileContent] = useState<string>('');
  const [cwd, setCwd] = useState<string>('/'); // Root directory as default
  const parentDirRef = useRef<string | null>(null);
  const webContainerInstance = useWebContainer();
  const [command, setCommand] = useState<string[] | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFileExtension, setSelectedFileExtension] = useState<string | null>(null)

  function getFileExtension(filename: string): string | null {
    const match = filename.match(/\.\w+$/);
    return match ? match[0].toString() : null;
  }
  const executeCommand = () => {
    if (!commands) return;
    if (!(commands.length > 0)) return;
    setCommand(commands)
  };

  useEffect(() => {
    executeCommand();
  }, [files]);

  useEffect(() => {
    const updatePreview = async () => {
      if (webContainerInstance && files) {
        try {
          await webContainerInstance.mount(files); // Re-mount updated files

          // Optionally, restart server to ensure changes are reflected
          webContainerInstance.on('server-ready', (port, url) => {
            setPreviewUrl(url);
          });
        } catch (err) {
          console.error('Error updating WebContainer with new files:', err);
        }
      }
    };

    updatePreview();
  }, [files, webContainerInstance, selectedFileContent]);


  const handleFileClick = (content: string | Uint8Array, filePath: string, parentDir: string | null) => {
    console.log("Filepath: ", filePath, "parentDir: ", parentDir);
    parentDirRef.current = parentDir;

    const newCwd = parentDir ? `/${parentDir}` : '/'; // Update cwd based on parent directory
    setCwd(newCwd);

    setSelectedFilePath(filePath);
    setSelectedFileExtension(getFileExtension(filePath))
    setSelectedFileContent(getContentAsString(content));
  };

  const updateFileContent = (newContent: string) => {
    if (selectedFilePath && files) {
      let currentLevel = files

      if (parentDirRef.current) {
        ((currentLevel[parentDirRef.current] as DirectoryNode).directory[selectedFilePath] as FileNode).file.contents = newContent;
      } else {
        (currentLevel[selectedFilePath] as FileNode).file.contents = newContent;
      }
      setSelectedFileContent(newContent);
    }
  };

  const getContentAsString = (content: string | Uint8Array): string => {
    if (content instanceof Uint8Array) {
      const decoder = new TextDecoder();
      return decoder.decode(content);
    }
    return content;
  };

  console.log(previewUrl)

  return (
    <>
      <div className={`bg-bg-secondary text-white rounded-md my-4 border border-gray-600 ${collapse ? 'tablet:w-[50%]' : 'tablet:w-[95%]'} h-fit w-[95%] duration-75 ${className} relative`}>
        <FaAngleLeft className='hidden tablet:block text-white self-center w-fit absolute -left-10 top-[50%] -translate-y-[50%]' size={24} onClick={() => setCollapse(!collapse)} />
        {/* Header */}
        <div className="h-14 border-b border-gray-600 px-4 py-3 justify-between w-full items-center flex">
          {/* Tabs Section */}
          <div className={`h-fit bg-bg-primary w-fit rounded-full p-1 flex gap-1 ${collapse ? 'tablet:visible' : 'tablet:hidden'} `}>
            <button
              className={`px-4 inset-0 rounded-full ${activeTab === CodeTabs.CODE ? 'bg-[#2ba6ff1a] text-[#2BA6FF]' : 'text-gray-500 font-light'}`}
              onClick={() => setActiveTab(CodeTabs.CODE)}
            >
              Code
            </button>
            <button
              className={`px-4 rounded-full ${activeTab === CodeTabs.PREVIEW ? 'bg-[#2ba6ff1a] text-[#2BA6FF]' : 'text-gray-500 font-light'}`}
              onClick={() => setActiveTab(CodeTabs.PREVIEW)}
            >
              Preview
            </button>
          </div>
        </div>

        <div className=' flex w-full h-[70vh]'>
          <Split
            className={` 
              flex-col border-r border-gray-600 overflow-hidden w-full
              ${collapse ? '' : 'tablet:basis-1/2'}
              ${activeTab === CodeTabs.CODE ? 'flex' : 'hidden'}
              ${collapse && activeTab !== CodeTabs.CODE ? 'tablet:hidden' : 'tablet:block'}
            `}
            direction="vertical"
            sizes={[65, 35]}
            minSize={0}
            gutterSize={4}
          >
            <Split
              className="flex-grow flex overflow-hidden"
              direction="horizontal"
              sizes={[35, 65]}
              minSize={0}
              gutterSize={4}
            >
              <div className="border-r border-gray-600 max-w-[75%] min-h-0 bg-bg-secondary overflow-y-scroll" style={{ scrollbarWidth: 'thin' }}>
                <div className=' border-b border-gray-600 px-2 py-1 flex gap-2 items-center'>
                  <PiTreeViewFill className='text-gray-300' />
                  <p className=' text-gray-300'>Files</p>
                </div>
                {
                  loading ? <div className=' flex flex-col h-full w-full items-center justify-center'>Generating files...<Spinner /></div> :

                    <FileTreeContructor files={files} handleClick={handleFileClick} />
                }
              </div>
              <div className="h-full flex-grow bg-bg-secondary">
                <EditorComponent setSelectedFileContent={setSelectedFileContent} updateFileContent={updateFileContent} selectedFileContent={selectedFileContent} selectedFileExtension={selectedFileExtension} />
              </div>
            </Split>
            <div className="min-h-0 flex-grow overflow-hidden bg-bg-primary">
              <div className=' flex p-2 bg-bg-secondary items-center gap-3'>
                <div className=' flex justify-center items-center px-3 py-1 rounded-full gap-1 bg-bg-primary'>
                  <RiRobot3Fill className=' text-green-400' />
                  <p>Codexa</p>
                </div>
                <FaPlus />
              </div>
              {/* <div className="w-full h-[80vh] overflow-auto border-t border-gray-600 bg-bg-primary text-white"> */}
              <TerminalComponent webContainerInstance={webContainerInstance} commandToExecute={command} setMessages={setMessages} setAiCmdLoading={setAiCmdLoading}/>
              {/* </div> */}
            </div>
          </Split>
          <div className={` 
              flex-col border-r border-gray-600 overflow-hidden w-full
              ${collapse ? '' : 'tablet:basis-1/2'}
              ${activeTab === CodeTabs.PREVIEW ? 'flex' : 'hidden'}
              ${collapse && activeTab !== CodeTabs.PREVIEW ? 'tablet:hidden' : 'tablet:block'}
            `}>
            {previewUrl ? (
              <div className="w-full h-full">
                <iframe
                  src={previewUrl}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="WebContainer Preview"
                />
              </div>
            ) : <div className=' flex h-full w-full justify-center items-center'>Preview Not available</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorContainer;
