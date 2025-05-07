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
            {/* Nút biểu tượng chat */}
            <button
                onClick={() => setShowChat(!showChat)}
                className="fixed z-50 p-3 text-white rounded-full shadow-lg bg-main bottom-5 right-5 hover:bg-red-700"
            >
                <FaCommentDots size={24} />
            </button>

            {/* Khung chatbox */}
            {showChat && (
                <div className="fixed z-50 bottom-20 right-5">
                    <Chatbox />
                </div>
            )}
        </>
    );
};

export default memo(ChatWidget);
