// src/components/ChatBox.jsx
import React, { memo, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { apiCreateChatbox } from '../../apis';
import { formatMoney } from '../../ultils/helpers';

const ChatBox = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn?' },
    ]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        const response = await apiCreateChatbox({ message: input });
        console.log('ledat', response);

        if (response?.success) {
            // Trả lời chính của bot
            const replyMessages = [{ sender: 'bot', text: response?.reply }];

            // Nếu có sản phẩm phù hợp thì liệt kê
            if (
                Array.isArray(response?.products) &&
                response?.products.length > 0
            ) {
                const productMessages = response?.products.map((p) => ({
                    sender: 'bot',
                    text: `${p.title} - ${formatMoney(p.price)} VNĐ`,
                }));
                setMessages((prev) => [
                    ...prev,
                    ...replyMessages,
                    ...productMessages,
                ]);
            } else {
                // Chỉ trả lời bình thường, không thêm gì thêm
                setMessages((prev) => [...prev, ...replyMessages]);
            }
        } else {
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'bot',
                    text: 'Xin lỗi, tôi không hiểu ý bạn. Bạn có thể thử lại?',
                },
            ]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-xl w-80 h-96">
            {/* Header */}
            <div className="flex items-center justify-between p-3 text-white bg-main">
                <span className="font-semibold">Hỗ trợ trực tuyến</span>
                <IoClose
                    className="text-white transition cursor-pointer hover:scale-110"
                    onClick={() => {
                        // Ẩn chatbox bằng sự kiện custom (được lắng nghe bởi ChatWidget)
                        const event = new Event('close-chatbox');
                        window.dispatchEvent(event);
                    }}
                />
            </div>

            {/* Body */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${
                            msg.sender === 'user'
                                ? 'justify-end'
                                : 'justify-start'
                        }`}
                    >
                        <div
                            className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
                                msg.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 border-t border-gray-200">
                <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none "
                />
                <button
                    onClick={handleSend}
                    className="px-3 py-2 text-sm text-white rounded-md bg-main hover:bg-red-700"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default memo(ChatBox);
