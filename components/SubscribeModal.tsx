'use client';
import React from 'react';
import Modal from './Modal';
import useSubscribeModal from '@/hooks/useSubscribeModal';

const SubscribeModal = () => {
  const subscribeModal = useSubscribeModal();

  return (
    <Modal
      title="Only for Premium users"
      description="Listen to music with Spotify Premium"
      isOpen={subscribeModal.isOpen}
      onChange={subscribeModal.onClose}
    >
      <div className="text-center">
        No Content Available
      </div>
    </Modal>
  );
};

export default SubscribeModal;
