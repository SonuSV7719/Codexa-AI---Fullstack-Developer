import React, { useState } from "react";
import EditorContainer from "./components/EditorContainer";
import Chats from "./components/Chats";
import LOGO from './assets/logo1.png';

const App: React.FC = () => {
  const [collapse, setCollapse] = useState(true);
  return (
    <div>
      <header className="text-white bg-bg-secondary h-fit px-3 py-1 fixed top-0 left-0 w-full z-20">
        <div className="flex items-center w-fit">
          <img src={LOGO} alt="" className="w-16" />
          <span className="font-bold text-xl">Codexa AI</span>
        </div>
      </header>
      <div className="flex w-[45vw] justify-center mt-24 flex-col px-11">
        <div className="text-white">
          <Chats />
          {collapse &&
            <div className="fixed bottom-5 h-24 bg-bg-secondary w-[38vw] rounded-md z-50 p-2">
              <input
                type="text"
                className="w-full p-2 bg-transparent text-white border-none outline-none"
                placeholder="Type here..."
                style={{ zIndex: 100 }}
              />
            </div>
          }
        </div>
      </div>

      <div className="flex items-center text-white mx-5 mt-2 justify-end fixed w-full right-1 top-[4.5rem]">
        <EditorContainer collapse={collapse} setCollapse={setCollapse} />
      </div>
    </div>
  );
};

export default App;
