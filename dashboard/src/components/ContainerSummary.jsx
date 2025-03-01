// ContainerSummary.jsx
import React from 'react';
import { capitalize, getStatePillColor, calculateRunningTime, parsePorts } from '../utils/utils';

const ContainerSummary = ({ container, openModal }) => {
  // Use tags directly from the container object.
  const tags = container.Tags || [];
  const runningTime = calculateRunningTime(container.CreatedAt);
  const statePillColor = getStatePillColor(container.State);
  const portsArray = parsePorts(container.Ports);

  return (
    <div
      className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-5 rounded-lg shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
      onClick={openModal}
    >
      <div className="flex flex-col mb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{capitalize(container.Names)}</h3>
          <div className="flex items-center gap-2">
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
        {/* Tags Row: Display tags as pills */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
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
      {portsArray.length > 0 && (
        <p className="text-base">
          <strong>Local Connect:</strong> {portsArray.join(', ')}
        </p>
      )}
    </div>
  );
};

export default ContainerSummary;
