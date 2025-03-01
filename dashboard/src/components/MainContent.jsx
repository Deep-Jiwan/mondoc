import React from 'react';
import ContainerCard from './ContainerCard';
import AddContainerCard from './AddContainerCard';
import TopBar from './TopBar';
import ServerIPPrompt from './ServerIPPrompt';
import { parseContainers } from '../utils/dockerParser';
import useContainers from '../hooks/useContainers';
import useServerIPs from '../hooks/useServerIPs';

const MainContent = () => {
  // Get server IPs from /api/serverips
  const { serverips } = useServerIPs();

  // selectedIP will be set when the user selects a server IP via the prompt.
  const [selectedIP, setSelectedIP] = React.useState('');
  const [filterMode, setFilterMode] = React.useState("running");
  const [searchTerm, setSearchTerm] = React.useState("");

  // When no server IP is selected, useContainers runs with pollingEnabled=false,
  // which means it only fetches /api/containers/force on page load.
  // Once selectedIP is set, pollingEnabled becomes true and useContainers polls /api/containers every 5 seconds.
  const pollingEnabled = selectedIP !== '';
  const { containers: rawContainers, fetchContainers } = useContainers(pollingEnabled);

  // Parse the raw container data.
  const parsedContainers = parseContainers({ containers: rawContainers });

  let filteredContainers = filterMode === "running"
    ? parsedContainers.filter(c => c.State.toLowerCase() === "running")
    : parsedContainers;

  if (searchTerm) {
    const lowerTerm = searchTerm.toLowerCase();
    filteredContainers = filteredContainers.filter(c => {
      const nameMatches = c.Names.toLowerCase().includes(lowerTerm);
      const tagMatches =
        Array.isArray(c.Tags) &&
        c.Tags.some(tag => tag.name && tag.name.toLowerCase().includes(lowerTerm));
      return nameMatches || tagMatches;
    });
  }
    
  return (
    <main className="flex-grow flex flex-col items-center justify-start bg-gray-900 p-6 pt-30">
      <TopBar 
        filterMode={filterMode} 
        setFilterMode={setFilterMode}
        selectedIP={selectedIP} 
        setSelectedIP={setSelectedIP}
        serverips={serverips} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
      />
      <ServerIPPrompt
        serverips={serverips}
        visible={!selectedIP}
        onSelect={setSelectedIP}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredContainers.map((container) => {
          // Use container.ID as the key.
          return (
            <ContainerCard
              key={container.ID}
              container={container}
              selectedIP={selectedIP}
              credentials={null}
              refreshData={() => {
                fetchContainers();
              }}
            />
          );
        })}
        <AddContainerCard refreshData={() => {
          fetchContainers();
        }} />
      </div>
    </main>
  );
};

export default MainContent;
