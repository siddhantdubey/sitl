import React from 'react';

interface currentSourceProps {
  currentSource: string;
  setCurrentSource: (source: string) => void;
}

const SourceSelector: React.FC<currentSourceProps> = ({ currentSource, setCurrentSource }) => (
  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full px-3">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor="grid-source"
      >
        News Source
      </label>
      <div className="relative inline-flex">
        <select
          onChange={(e) => setCurrentSource(e.target.value)}
          className="border border-gray-300 text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
        >
          <option>Select Source Type</option>
          <option value="twitter">Twitter Account</option>
          <option value="reddit">Subreddit</option>
        </select>
      </div>
    </div>
  </div>
);

export default SourceSelector;
