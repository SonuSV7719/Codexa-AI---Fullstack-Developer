import React, { useState } from 'react';
import { FaFolder, FaFile, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { FiFileText } from 'react-icons/fi';
import { FileSystemTree, DirectoryNode, FileNode } from '@webcontainer/api';
import { FcFolder } from "react-icons/fc";
import { FaReact } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { FaJsSquare } from "react-icons/fa";
import { FaHtml5 } from "react-icons/fa";
import { BsFiletypeJson } from "react-icons/bs";
import { FaCss3Alt } from "react-icons/fa";

// Helper function to get the file extension for determining icons
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop();

  switch (extension) {
    case 'jsx':
      return <FaReact className=' text-[#00d8ff]' />
    case 'tsx' || 'ts':
      return <SiTypescript className=' text-[#3178C6]' />
    case 'js':
      return <FaJsSquare className=' text-[#FFDF00]' />;
    case 'css':
      return < FaCss3Alt className=' text-[#004CE8]'  />;
    case 'html':
      return <FaHtml5 className=' text-[#FC490B]' />;
    case 'json':
      return <BsFiletypeJson className=' text-[#7CB342]' />;
    default:
      return <FaFile title="File" />;
  }
};

interface FileTreeContructorProps {
  files: FileSystemTree | null | undefined;
  handleClick: (content: string | Uint8Array, filePath: string, parentDir: string | null) => void
}

const FileTreeContructor: React.FC<FileTreeContructorProps> = ({ files, handleClick }) => {
  const [expandedDirectories, setExpandedDirectories] = useState<Set<string>>(new Set());

  // Toggle the visibility of directories
  const toggleDirectory = (path: string) => {
    setExpandedDirectories((prev) => {
      const newExpandedDirectories = new Set(prev);
      if (newExpandedDirectories.has(path)) {
        newExpandedDirectories.delete(path);
      } else {
        newExpandedDirectories.add(path);
      }
      return newExpandedDirectories;
    });
  };

  // Recursively render the file tree structure
  const renderFileTree = (
    files: FileSystemTree | null | undefined,
    handleClick: (content: string | Uint8Array, filePath: string, parentDir: string | null) => void,
    parentDir: string | null = null // Track the parent directory name
  ) => {
    if (!files) return null;

    return Object.entries(files).map(([key, value]) => {
      const path = key;

      if ((value as DirectoryNode).directory) {
        // If it's a directory
        return (
          <div key={key} className="ml-4">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleDirectory(path)}
            >
              {expandedDirectories.has(path) ? (
                <FaChevronDown className="mr-2" />
              ) : (
                <FaChevronRight className="mr-2" />
              )}
              <FcFolder className="mr-2" size={24} />
              <strong>{key}</strong>
            </div>
            <div
              className={`pl-6 overflow-hidden transition-all duration-300 ease-in-out ${expandedDirectories.has(path) ? 'max-h-screen' : 'max-h-0'
                }`}
            >
              {/* Pass the current directory as the parent directory */}
              {renderFileTree((value as DirectoryNode).directory, handleClick, key)}
            </div>
          </div>
        );
      } else if ((value as FileNode).file) {
        // If it's a file
        const content = (value as FileNode).file.contents;
        return (
          <div
            key={key}
            className="ml-4 flex items-center cursor-pointer"
            onClick={() => handleClick(content, path, parentDir)}
          >
            {getFileIcon(key)}
            <span className="ml-2">{key}</span>
          </div>
        );
      }

      return null;
    });
  };


  if (!files) return <div>No files to display</div>;

  return (
    <div className="p-4">
      <div className="mb-4">{renderFileTree(files, handleClick, null)}</div>
    </div>
  );
};

export default FileTreeContructor;
