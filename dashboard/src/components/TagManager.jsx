import React from 'react';

const TagManager = ({ tags, updateTags }) => {
  const addNewTag = () => {
    // Prevent adding a new tag if any tag has an empty name.
    if (tags.some(tag => tag.name.trim() === '')) {
      alert("Please fill in the empty tag name before adding a new tag.");
      return;
    }
    updateTags([...tags, { name: '', color: '#ffffff' }]);
  };

  const updateTag = (index, field, value) => {
    const updatedTags = tags.map((tag, i) =>
      i === index ? { ...tag, [field]: value } : tag
    );
    updateTags(updatedTags);
  };

  const removeTag = (index) => {
    console.log("Removing tag at index", index);
    const updatedTags = tags.filter((_, i) => i !== index);
    console.log("Updated tags:", updatedTags);
    updateTags(updatedTags);
  };

  return (
    <div className="flex flex-col">
      <label className="mb-1">Tags</label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-600 rounded-full px-2 py-1 text-xs"
          >
            <input
              type="text"
              value={tag.name}
              onChange={(e) => updateTag(index, 'name', e.target.value)}
              className="bg-transparent border border-gray-400 text-white px-2 py-1 rounded w-32"
              placeholder="Tag name"
            />
            <input
              type="color"
              value={tag.color}
              onChange={(e) => updateTag(index, 'color', e.target.value)}
              className="ml-1"
            />
            <button 
              type="button" 
              className="ml-1 text-red-400" 
              onClick={() => removeTag(index)}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-500"
          onClick={addNewTag}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TagManager;
