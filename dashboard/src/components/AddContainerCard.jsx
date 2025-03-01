import React, { useState } from 'react';
import Modal from './Modal';

const AddContainerCard = ({ onAddContainer, refreshData }) => {
  const [formData, setFormData] = useState({
    Names: '',
    ID: '',
    IP: '',
    ports: [''],
    DummyUsername: '',
    DummyPassword: '',
    Labels: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addMode, setAddMode] = useState(''); // 'single' or 'bulk'

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setAddMode('');
    // Reset form data when closing
    setFormData({
      Names: '',
      ID: '',
      IP: '',
      ports: [''],
      DummyUsername: '',
      DummyPassword: '',
      Labels: '',
    });
  };

  const handleModeSelection = (mode) => {
    setAddMode(mode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePortChange = (index, value) => {
    setFormData(prev => {
      const updatedPorts = [...prev.ports];
      updatedPorts[index] = value;
      return { ...prev, ports: updatedPorts };
    });
  };

  const addPortField = () => {
    setFormData(prev => ({
      ...prev,
      ports: [...prev.ports, ''],
    }));
  };

  const removePortField = (index) => {
    setFormData(prev => {
      const updatedPorts = prev.ports.filter((_, i) => i !== index);
      return { ...prev, ports: updatedPorts };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.Names.trim() || !formData.ID.trim() || !formData.IP.trim()) {
      alert('Name, ID, and IP Address are required.');
      return;
    }
    const validPorts = formData.ports.filter(p => p.trim() !== '');
    if (validPorts.length === 0) {
      alert('At least one Port is required.');
      return;
    }
    const submission = { ...formData, ports: validPorts };
    console.log('Container to add:', submission);
    // Optionally, call onAddContainer(submission) to update state
    closeModal();
    if (refreshData) refreshData();
  };

  return (
    <>
      <div
        className="bg-gray-700 text-white p-5 rounded-lg shadow-lg hover:shadow-2xl transition-shadow cursor-pointer flex items-center justify-center"
        onClick={openModal}
      >
        <span className="text-4xl font-bold">+</span>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {!addMode ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Add Container</h2>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors"
                onClick={() => handleModeSelection('bulk')}
              >
                Bulk Add
              </button>
              <button
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition-colors"
                onClick={() => handleModeSelection('single')}
              >
                Single Add
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Bulk add will be implemented later.
            </p>
          </div>
        ) : addMode === 'single' ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">Single Add Container</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <label className="mb-1">Name*</label>
                <input
                  type="text"
                  name="Names"
                  value={formData.Names}
                  onChange={handleChange}
                  className="p-2 rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1">ID*</label>
                <input
                  type="text"
                  name="ID"
                  value={formData.ID}
                  onChange={handleChange}
                  className="p-2 rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1">IP Address*</label>
                <input
                  type="text"
                  name="IP"
                  value={formData.IP}
                  onChange={handleChange}
                  className="p-2 rounded bg-gray-700 text-white"
                  placeholder="e.g., 192.168.1.100"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1">Ports* (Add multiple if needed)</label>
                {formData.ports.map((port, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={port}
                      onChange={(e) => handlePortChange(index, e.target.value)}
                      className="p-2 rounded bg-gray-700 text-white flex-1"
                      placeholder="e.g., 9000"
                      required={index === 0}
                    />
                    {formData.ports.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePortField(index)}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPortField}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors text-sm"
                >
                  Add Port
                </button>
              </div>
              <div className="flex flex-col">
                <label className="mb-1">Username</label>
                <input
                  type="text"
                  name="DummyUsername"
                  value={formData.DummyUsername}
                  onChange={handleChange}
                  className="p-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1">Password</label>
                <input
                  type="text"
                  name="DummyPassword"
                  value={formData.DummyPassword}
                  onChange={handleChange}
                  className="p-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1">Labels</label>
                <textarea
                  name="Labels"
                  value={formData.Labels}
                  onChange={handleChange}
                  className="p-2 rounded bg-gray-700 text-white"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition-colors"
              >
                Add Container
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </>
  );
};

export default AddContainerCard;
