// src/components/ChatWidget.jsx
import React, { memo, useEffect, useState } from 'react';
import { FaCommentDots } from 'react-icons/fa';
import { Chatbox } from '..';

const ChatWidget = () => {
    const [showChat, setShowChat] = useState(false);
    useEffect(() => {
        const handleClose = () => setShowChat(false);
        window.addEventListener('close-chatbox', handleClose);
        return () => window.removeEventListener('close-chatbox', handleClose);
    }, []);
    return (
        <>
            <button
                onClick={() => setShowChat(!showChat)}
                className="fixed p-3 text-white rounded-full shadow-lg z-29 bg-main bottom-25 right-5 hover:bg-red-700"
            >
                {!showChat && (
                    <span className="absolute w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-75 -z-10 animate-ping bg-main top-1/2 left-1/2"></span>
                )}
                <FaCommentDots size={24} />
            </button>

            {showChat && (
                <div className="fixed z-50 bottom-20 right-5">
                    <Chatbox />
                </div>
            )}
        </>
    );
};

export default memo(ChatWidget);
