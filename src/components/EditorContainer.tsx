import React, { useState } from 'react';
import EditorComponent from './EditorComponent';
import { Terminal } from 'primereact/terminal';
import Split from 'react-split';
import { RiRobot3Fill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { PiTreeViewFill } from "react-icons/pi";
import { FaAngleLeft } from "react-icons/fa6";

enum CodeTabs {
  CODE,
  PREVIEW
}

interface EditorContainerProps {
  className?: string
  collapse: boolean,
  setCollapse: (data: boolean) => void
}

const EditorContainer: React.FC<EditorContainerProps> = ({ className,collapse, setCollapse }) => {
  const [activeTab, setActiveTab] = useState<CodeTabs>(CodeTabs.CODE);


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
          {/* Main Section: Files and Code Editor */}
          <Split
            className={` 
              flex-col border-r border-gray-600 overflow-hidden w-full
              ${collapse ? '' : 'tablet:basis-1/2'}
              ${activeTab === CodeTabs.CODE ? 'flex' : 'hidden'}
              ${collapse && activeTab !== CodeTabs.CODE ? 'tablet:hidden' : 'tablet:block'}
            `}
            direction="vertical"
            sizes={[75, 25]}
            minSize={0}
            gutterSize={4}
          >
            {/* Part - File tree and actual code */}
            <Split
              className="flex-grow flex overflow-hidden"
              direction="horizontal"
              sizes={[25, 75]}
              minSize={0}
              gutterSize={4}
            >
              {/* File Tree */}
              <div className="border-r border-gray-600 max-w-[75%] min-h-0 bg-bg-secondary">
                <div className=' border-b border-gray-600 px-2 py-1 flex gap-2 items-center'>
                  <PiTreeViewFill className='text-gray-300' />
                  <p className=' text-gray-300'>Files</p>
                </div>
              </div>

              {/* Actual Code Section */}
              <div className="h-full flex-grow bg-bg-secondary">
                <EditorComponent />
              </div>
            </Split>

            {/* Terminal Section */}
            <div className="min-h-0 flex-grow max-h-[80%] overflow-hidden bg-bg-primary">
              {/* Terminal Menu bas - Add New Terminal etc. */}
              <div className=' flex p-2 bg-bg-secondary items-center gap-3'>
                <div className=' flex justify-center items-center px-3 py-1  rounded-full gap-1 bg-bg-primary'>
                  <RiRobot3Fill className=' text-green-400' />
                  <p>Codexa</p>
                </div>
                <FaPlus />
              </div>

              {/* Actual terminal */}
              <Terminal
                className="w-full h-full overflow-auto border-t border-gray-600 bg-bg-primary text-white"
                welcomeMessage="Welcome to Codexa"
                prompt="&#x279C; Codexa $"
                pt={{
                  root: { className: 'text-white border-round' },
                  prompt: { className: 'text-gray-400 mr-2 text-green-400' },
                  command: { className: 'text-primary-300' },
                  response: { className: 'text-primary-300' },
                }}
              />
            </div>
          </Split>


          {/* Right Section: Preview (Hidden on Tablet and Smaller) */}
          <div className={`basis-1/2 bg-bg-secondary text-white p-2 ${collapse && activeTab !== CodeTabs.PREVIEW ? 'tablet:hidden' : 'tablet:block'}  ${activeTab === CodeTabs.PREVIEW ? 'flex' : 'hidden'}`}>
            <p className="text-gray-400">Preview Content</p>
          </div>

        </div>


      </div>
    </>
  );
};

export default EditorContainer;
