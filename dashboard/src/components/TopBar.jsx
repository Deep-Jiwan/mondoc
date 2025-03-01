import React from 'react';

const TopBar = ({ filterMode, setFilterMode, selectedIP, setSelectedIP, serverips, searchTerm, setSearchTerm }) => {
  const isRunning = filterMode === "running";

  const handleToggleChange = (e) => {
    setFilterMode(e.target.checked ? "running" : "all");
  };

  return (
    <div className="w-full flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <span className="text-white font-medium">Filter:</span>
        <div className="flex items-center">
          <span className="text-white mr-2">Show All</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isRunning} 
              onChange={handleToggleChange} 
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700
                        peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600">
            </div>
          </label>
          <span className="text-white ml-2">Show Running</span>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name or tag..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white border border-gray-500 w-64"
      />

      <div className="flex items-center gap-2">
        <span className="text-white font-medium">Select Server IP:</span>
        <select
          value={selectedIP}
          onChange={(e) => setSelectedIP(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        >
          {serverips.map(ip => (
            <option key={ip} value={ip}>
              {ip}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TopBar;
