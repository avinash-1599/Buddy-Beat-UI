/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { BASE_URL } from '../utils/constants';
import { useSelector } from 'react-redux';

Modal.setAppElement('#root');

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#121212',
    padding: '20px',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid #444',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
};

const StoriesFeed = () => {
  const [stories, setStories] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const loggedInUserId = useSelector(state => state.user?._id);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/story/all-story`, { withCredentials: true });
      setStories(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const groupedStories = stories.reduce((acc, story) => {
    const uid = story.userId._id;
    if (!acc[uid]) acc[uid] = { user: story.userId, stories: [] };
    acc[uid].stories.push(story);
    return acc;
  }, {});

  const usersWithStories = Object.values(groupedStories);

  const sortedUsersWithStories = [...usersWithStories].sort((a, b) => {
    if (a.user._id === loggedInUserId) return -1;
    if (b.user._id === loggedInUserId) return 1;
    return 0;
  });
  

  useEffect(() => {
    let timer;
    let progressTimer;
  
    if (isModalOpen && activeUserId) {
      setProgress(0); // reset progress
  
      // Animate progress bar over 5s
      progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 2;
        });
      }, 100); // 100ms interval (50 steps = 5s)
  
      // Story change timer
      timer = setTimeout(() => {
        const currentStories = groupedStories[activeUserId].stories;
        if (activeIndex < currentStories.length - 1) {
          setActiveIndex(i => i + 1);
        } else {
          closeModal();
        }
      }, 5000);
    }
  
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [activeIndex, isModalOpen, activeUserId]);
  

  const openModal = userId => {
    setActiveUserId(userId);
    setActiveIndex(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveUserId(null);
    setActiveIndex(0);
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-48 text-white">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="story-row flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1 ml-5 rounded-md" style={{ borderBottom: '1px solid #3b3b3b' }}>
            {sortedUsersWithStories.map(({ user }) => (
              <div key={user._id} onClick={() => openModal(user._id)} className="w-20 flex-shrink-0 text-center cursor-pointer">
                <img
                  src={user.photoUrl || '/default-avatar.png'}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-14 h-14 rounded-full border-2 border-yellow-400 object-cover mx-auto"
                />
                <div className="text-xs mt-1 text-white truncate">{`${user.firstName} ${user.lastName}`}</div>
              </div>
            ))}
          </div>

          {sortedUsersWithStories.length === 0 && (
            <div className="text-center text-gray-400 mt-4">No stories available</div>
          )}
        </>
      )}

      {isModalOpen && activeUserId && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <button onClick={closeModal} className="absolute top-8 right-3 text-white text-2xl">✕</button>
          {/* story progress bar */}
          {/* <div className="w-full h-1 bg-gray-700 rounded overflow-hidden mb-4">
            <div
                className="h-full bg-gray-400 transition-all duration-100 linear"
                style={{ width: `${progress}%` }}
            />
          </div> */}
          <div className="flex gap-1 mb-4">
            {groupedStories[activeUserId].stories.map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-gray-700 rounded overflow-hidden">
                <div
                    className="h-full transition-all duration-75 linear"
                    style={{
                    width:
                        i < activeIndex
                        ? '100%'
                        : i === activeIndex
                        ? `${progress}%`
                        : '0%',
                    backgroundColor: '#d1d5db', // gray-300
                    }}
                />
                </div>
            ))}
            </div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={groupedStories[activeUserId].user.photoUrl || '/default-avatar.png'}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-white text-sm font-semibold">
              {groupedStories[activeUserId].user.firstName} {groupedStories[activeUserId].user.lastName}
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            {groupedStories[activeUserId].stories[activeIndex].mediaType === 'image' ? (
              <img
                src={groupedStories[activeUserId].stories[activeIndex].mediaUrl}
                alt="Story"
                className="h-[70vh] w-auto max-w-full object-contain rounded-md"
              />
            ) : (
              <video
                src={groupedStories[activeUserId].stories[activeIndex].mediaUrl}
                controls
                autoPlay
                muted
                className="h-[70vh] w-auto max-w-full object-contain rounded-md"
              />
            )}

            {groupedStories[activeUserId].stories[activeIndex].caption && (
                <div className="text-white text-sm mt-2">
                {groupedStories[activeUserId].stories[activeIndex].caption}
                </div>
            )}
            </div>
        </Modal>
      )}
    </div>
  );
};

export default StoriesFeed;