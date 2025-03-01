import React from 'react';
import { updateCredentials, updateTags } from '../utils/utils';
import TagManager from './TagManager';

const EditCredentials = ({
  container,
  editData,
  setEditData,
  cancelEditing,
  refreshData, // Parent function to re-fetch container details/credentials
  setIsEditing,
}) => {
  // Update input field values in editData
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Save function: run both POST requests concurrently, then call refreshData
  const saveEdits = async () => {
    try {
      const credentialsPayload = {
        username: editData.DummyUsername,
        password: editData.DummyPassword,
        containerid: container.ID,
      };

      const tagsPayload = {
        containerId: container.ID,
        tags: editData.Tags,
      };

      // Execute both updates concurrently
      await Promise.all([
        updateCredentials(credentialsPayload),
        updateTags(tagsPayload),
      ]);

      // Close edit mode and refresh parent container details (which includes credentials)
      setIsEditing(false);
      setEditData(null);
      if (refreshData) refreshData();
    } catch (error) {
      console.error('Error updating credentials or tags:', error);
    }
  };

  return (
    <div className="space-y-4 mb-6 text-base">
      <div>
        <strong>Container:</strong> {container.Names}
      </div>
      <div className="flex flex-col">
        <label className="mb-1">Username</label>
        <input
          type="text"
          name="DummyUsername"
          value={editData.DummyUsername}
          onChange={handleEditChange}
          className="p-2 rounded bg-gray-700 text-white"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">Password</label>
        <input
          type="text"
          name="DummyPassword"
          value={editData.DummyPassword}
          onChange={handleEditChange}
          className="p-2 rounded bg-gray-700 text-white"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">Labels</label>
        <textarea
          name="Labels"
          value={editData.Labels}
          onChange={handleEditChange}
          className="p-2 rounded bg-gray-700 text-white"
          rows="3"
        />
      </div>
      {/* TagManager for editing tags; any updates modify editData.Tags */}
      <TagManager
        tags={editData.Tags}
        updateTags={(newTags) =>
          setEditData((prev) => ({ ...prev, Tags: newTags }))
        }
      />
      <div className="flex justify-end gap-3">
        <button
          className="px-3 py-1 bg-green-600 rounded hover:bg-green-500 transition-colors text-sm"
          onClick={saveEdits}
        >
          Save
        </button>
        <button
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 transition-colors text-sm"
          onClick={cancelEditing}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditCredentials;
