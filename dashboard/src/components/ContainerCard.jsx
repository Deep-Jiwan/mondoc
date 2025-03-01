import React, { useState } from 'react';
import ContainerSummary from './ContainerSummary';
import ContainerModal from './ContainerModal';

const ContainerCard = ({ container, selectedIP, credentials, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <ContainerSummary container={container} openModal={openModal} />
      {isModalOpen && (
        <ContainerModal
          container={container}
          selectedIP={selectedIP}
          credentials={credentials}
          refreshData={refreshData}
          copiedField={copiedField}
          setCopiedField={setCopiedField}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default ContainerCard;
