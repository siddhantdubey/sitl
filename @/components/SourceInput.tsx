import React from 'react';
import { Button } from "@/components/ui/button";

interface SourceInputProps {
  currentSource: string;
  newSource: string;
  setNewSource: (source: string) => void;
  openAIKey: string;
  setOpenAIKey: (key: string) => void;
}

const SourceInput: React.FC<SourceInputProps> = ({ currentSource, newSource, setNewSource, openAIKey, setOpenAIKey }) => (
  <>
    {currentSource && (
      <div className="w-full px-3">
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          placeholder={`Enter ${currentSource === 'twitter' ? 'Twitter handle' : 'Subreddit name'}`}
          type="text"
          value={newSource}
          onChange={(e) => setNewSource(e.target.value)}
        />
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          placeholder="Enter OpenAI Key"
          type="text"
          value={openAIKey}
          onChange={(e) => setOpenAIKey(e.target.value)}
        />
      </div>
    )}
  </>
);

export default SourceInput;
