import React, { useState, useEffect } from 'react';
import { copyToClipboard, capitalize, getStatePillColor, calculateRunningTime, parsePorts } from '../utils/utils';
import EditCredentials from './EditCredentials';
import Modal from './Modal';
import { constructProxyUrl } from '../utils/proxyUtils';
import config from '../config';

const ContainerModal = ({
  container,
  selectedIP,
  refreshData, // Parent refresh function (if provided)
  copiedField,
  setCopiedField,
  closeModal,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [localCredentials, setLocalCredentials] = useState({ username: '', password: '' });

  const runningTime = calculateRunningTime(container.CreatedAt);
  const statePillColor = getStatePillColor(container.State);
  const portsArray = parsePorts(container.Ports);

  // New state for selected port.
  const [selectedPort, setSelectedPort] = useState('');
  useEffect(() => {
    if (portsArray.length > 0 && !selectedPort) {
      setSelectedPort(String(portsArray[0]));
    }
  }, [portsArray, selectedPort]);

  // Function to fetch credentials
  const fetchCredentials = async () => {
    if (!container.ID) return;
    try {
      const res = await fetch(`${config.baseUrl}/api/credentials?containerId=${container.ID}`);
      if (res.ok) {
        const data = await res.json();
        setLocalCredentials(data);
      } else {
        console.error('Error fetching credentials:', res.status);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    }
  };

  // Initial fetch on mount (and when container.ID changes)
  useEffect(() => {
    fetchCredentials();
    // Clean up credentials on unmount/close
    return () => setLocalCredentials({ username: '', password: '' });
  }, [container.ID]);

  // Combined refresh function to call parent's refresh and reload credentials
  const refreshDataHandler = async () => {
    if (refreshData) refreshData();
    await fetchCredentials();
  };

  const startEditing = () => {
    setEditData({
      DummyUsername: localCredentials.username,
      DummyPassword: localCredentials.password,
      Labels: container.Labels,
      Tags: container.Tags ? [...container.Tags] : [],
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditData(null);
    // Refresh credentials on cancel as well
    refreshDataHandler();
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <Modal isOpen={true} onClose={closeModal}>
      <div onClick={stopPropagation}>
        <div className="mb-6">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{capitalize(container.Names)}</h2>
            <div className="flex items-center gap-2 text-base text-gray-300">
              <span>ID: {container.ID}</span>
              <button
                className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
                onClick={() => copyToClipboard(container.ID, setCopiedField, 'id')}
              >
                {copiedField === 'id' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className={`px-2 py-1 text-xs rounded-full ${statePillColor}`}>
              {container.State || 'Unknown'}
            </span>
            {runningTime && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-600">
                {runningTime}
              </span>
            )}
          </div>
        </div>

        {isEditing && editData ? (
          <EditCredentials
            container={container}
            credentials={localCredentials}
            editData={editData}
            setEditData={setEditData}
            cancelEditing={cancelEditing}
            refreshData={refreshDataHandler}  // Pass our combined refresh function
            setIsEditing={setIsEditing}
          />
        ) : (
          <div className="space-y-4 mb-6 text-base">
            <div>
              <strong>Local Connect:</strong>
              <div className="flex items-center gap-2 mt-1">
                {portsArray.map((port, idx) => (
                  <button
                    key={idx}
                    onClick={() => window.open(`http://${selectedIP}:${port}`, '_blank')}
                    className="px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600"
                  >
                    :{port}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <strong>Username:</strong>
              <span>{localCredentials.username}</span>
              <button
                className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600"
                onClick={() => copyToClipboard(localCredentials.username, setCopiedField, 'username')}
              >
                {copiedField === 'username' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <strong>Password:</strong>
              <span>{localCredentials.password ? '••••••••' : ''}</span>
              <button
                className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600"
                onClick={() => copyToClipboard(localCredentials.password, setCopiedField, 'password')}
              >
                {copiedField === 'password' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div>
              <strong>Networks:</strong> {container.Networks}
            </div>
            <div>
              <strong>Created:</strong> {container.CreatedAt}
            </div>
            <div>
              <strong>Image:</strong> {container.Image}
            </div>
            {container.Tags && container.Tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {container.Tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-gray-600 rounded-full px-2 py-1 text-xs"
                  >
                    <span>{tag.name}</span>
                    <div
                      className="w-3 h-3 ml-1 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    ></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!isEditing && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <button
                className="w-[80%] py-2 px-4 bg-teal-600 rounded hover:bg-teal-500 text-sm"
                onClick={() => window.open(constructProxyUrl(selectedIP, selectedPort), '_blank')}
              >
                Proxy Connect
              </button>
              <select
                value={selectedPort}
                onChange={(e) => setSelectedPort(e.target.value)}
                className="w-[20%] p-2 rounded bg-gray-700 text-white"
              >
                {portsArray.map((port, idx) => (
                  <option key={idx} value={port}>
                    {port}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button className="px-3 py-2 bg-red-600 rounded hover:bg-red-500 text-sm">
                Delete
              </button>
              <button
                className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-500 text-sm"
                onClick={startEditing}
              >
                Edit Login
              </button>
            </div>
            <button
              className="w-full py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors text-sm mb-4"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
            >
              {isMoreOpen ? 'Hide More Details' : 'Show More Details'}
            </button>
          </>
        )}

        {!isEditing && isMoreOpen && (
          <div className="border-t border-gray-600 pt-4 text-base space-y-2 transition-all duration-300 ease-in-out">
            <p>
              <strong>Labels:</strong> {container.Labels}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ContainerModal;
