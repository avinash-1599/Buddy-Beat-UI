/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { BASE_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const [storyViewers, setStoryViewers] = useState([]);
  const [isViewingViewers, setIsViewingViewers] = useState(false);

  const loggedInUserId = useSelector(state => state.user?._id);

  const navigate = useNavigate();

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

  const handleDeleteStory = async () => {
    try {
      const currentGroup = groupedStories[activeUserId];
      const storyId = currentGroup.stories[activeIndex]._id;
  
      await axios.delete(`${BASE_URL}/story/${storyId}`, { withCredentials: true });
  
      const remainingStories = currentGroup.stories.length - 1;
  
      if (remainingStories === 0) {
        closeModal(); // no more stories for user
      } else {
        setActiveIndex(prev => (prev > 0 ? prev - 1 : 0)); // shift to previous if possible
      }
  
      fetchStories(); // fetch latest stories from backend
    } catch (err) {
      console.error('Error deleting story:', err);
    }
  };  

  const markStoryAsViewed = async (storyId) => {
    try {
      await axios.post(`${BASE_URL}/story/${storyId}/view`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Error marking story as viewed:', err);
    }
  };

  const handleStoryViewers = async () => {
    try{
        const currentGroup = groupedStories[activeUserId];
        const currentStoryId = currentGroup.stories[activeIndex]._id;
        const res = await axios.get(`${BASE_URL}/story/${currentStoryId}/viewers`, { withCredentials: true });
        const viewers = res.data;
        setStoryViewers(viewers);
        setIsViewingViewers(true);
    } catch (err) {
        console.error('Error fetching story viewers:', err);
    }
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
    let viewTimer;
  
    if (isModalOpen && activeUserId && !isViewingViewers) {
      setProgress(0); // reset progress
  
      const currentStories = groupedStories[activeUserId].stories;
      const currentStory = currentStories[activeIndex];
  
      // ✅ Mark story as viewed after 1s
      viewTimer = setTimeout(() => {
        markStoryAsViewed(currentStory._id);
      }, 1000);
  
      // Animate progress bar over 5s
      progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 2;
        });
      }, 100);
  
      // Move to next story after 5s
      timer = setTimeout(() => {
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
      clearTimeout(viewTimer);
    };
  }, [activeIndex, isModalOpen, activeUserId, isViewingViewers]);

  const openModal = userId => {
    setActiveUserId(userId);
    setActiveIndex(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveUserId(null);
    setActiveIndex(0);
    setIsViewingViewers(false);
    setStoryViewers([]);
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
          {groupedStories[activeUserId].user._id === loggedInUserId && (<div className="absolute top-6 right-4 flex items-center gap-4">
          <button
                onClick={handleStoryViewers}
                className="p-1 hover:text-red-500 transition-colors"
                aria-label="List story viewers"
            >
                <Eye size={24} color="white" />
            </button>
            <button
                onClick={handleDeleteStory}
                className="p-1 hover:text-red-500 transition-colors"
                aria-label="Delete story"
            >
                <Trash2 size={24} color="white" />
            </button>
            <button
                onClick={closeModal}
                className="text-white text-2xl p-1 hover:text-gray-300 transition-colors"
                aria-label="Close modal"
            >
                ✕
            </button>
            </div>)}
          {/* story progress bar */}
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
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => navigate(`/user/profile/${groupedStories[activeUserId].user?._id}`)}
            />
            <span className="text-white text-sm font-semibold cursor-pointer" onClick={() => navigate(`/user/profile/${groupedStories[activeUserId].user?._id}`)}>
              {groupedStories[activeUserId].user.firstName} {groupedStories[activeUserId].user.lastName}
            </span>
          </div>

          <div className="relative flex flex-col items-center text-center w-full">
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

            {/* LEFT (Previous) Click Area */}
            <div className="absolute left-0 top-0 h-full w-1/2 pointer-events-none">
              <div
                className="w-full h-full cursor-pointer pointer-events-auto"
                onClick={() => {
                  if (activeIndex > 0) {
                    setActiveIndex((prev) => prev - 1);
                  } else {
                    closeModal();
                  }
                }}
              />
            </div>

            {/* RIGHT (Next) Click Area */}
            <div className="absolute right-0 top-0 h-full w-1/2 pointer-events-none">
              <div
                className="w-full h-full cursor-pointer pointer-events-auto"
                onClick={() => {
                  const currentStories = groupedStories[activeUserId].stories;
                  if (activeIndex < currentStories.length - 1) {
                    setActiveIndex((prev) => prev + 1);
                  } else {
                    closeModal();
                  }
                }}
              />
            </div>

            {groupedStories[activeUserId].stories[activeIndex].caption && (
                <div className="text-white text-sm mt-2 z-10 relative">
                {groupedStories[activeUserId].stories[activeIndex].caption}
                </div>
            )}

            {/* story viewers */}
            {storyViewers.length > 0 && groupedStories[activeUserId].user._id === loggedInUserId && (
            <div className="text-left mt-2 w-full">
              <h3 className="text-white font-semibold mb-2 text-sm">Viewed by:</h3>
              <hr className="border-gray-600 mb-3" />
              <div className="flex flex-col gap-3">
                {storyViewers.map((viewer) => (
                  <div key={viewer._id} className="flex items-center gap-2 text-white text-xs">
                    <img
                      src={viewer.photoUrl || '/default-avatar.png'}
                      alt={`${viewer.firstName} ${viewer.lastName}`}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className='text-gray-400 cursor-pointer'>{viewer.firstName} {viewer.lastName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
            </div>
        </Modal>
      )}
    </div>
  );
};

export default StoriesFeed;