import React, { useState, useEffect } from 'react';

const ServerIPPrompt = ({ serverips, onSelect, visible }) => {
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (serverips.length > 0 && !selected) {
      setSelected(serverips[0]);
    }
  }, [serverips, selected]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Select Server IP</h2>
        <p className="mb-4">Please select your server IP address:</p>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
        >
          {serverips.map(ip => (
            <option key={ip} value={ip}>
              {ip}
            </option>
          ))}
        </select>
        <button
          className="w-full py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors"
          onClick={() => onSelect(selected)}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ServerIPPrompt;
