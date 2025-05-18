// src/components/ChatBox.jsx
import React, { memo, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { apiCreateChatbox } from '../../apis';
import { formatMoney } from '../../ultils/helpers';
import { useNavigate } from 'react-router-dom';

const ChatBox = () => {
    const navigate = useNavigate();
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
                    product: {
                        id: p.id,
                        title: p.title,
                        price: formatMoney(p.price),
                        thumb: p.thumb,
                        category: p.category,
                    },
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
            <div className="flex items-center justify-between p-3 text-white bg-main">
                <span className="font-semibold">Hỗ trợ trực tuyến</span>
                <IoClose
                    className="text-white transition cursor-pointer hover:scale-110"
                    onClick={() => {
                        const event = new Event('close-chatbox');
                        window.dispatchEvent(event);
                    }}
                />
            </div>

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
                        {msg.product ? (
                            <div
                                onClick={() =>
                                    navigate(
                                        `/${msg.product?.category}/${msg.product?.id}/${msg.product?.title}`
                                    )
                                }
                                className="flex items-center gap-3 p-2 border border-gray-200 rounded-md shadow max-w-[90%] hover:bg-gray-100 transition"
                            >
                                <img
                                    src={msg.product?.thumb}
                                    alt={msg.product?.title}
                                    className="object-cover w-12 h-12 rounded-md"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                        {msg.product?.title}
                                    </span>
                                    <span className="text-sm font-semibold text-main">
                                        {msg.product?.price} VNĐ
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
                                    msg.sender === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                }`}
                            >
                                {msg.text}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex w-full gap-2 p-3 border-t border-gray-200">
                <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-[85%] px-3 py-2 text-[16px] border border-gray-400 rounded-sm focus:outline-none "
                />
                <button
                    onClick={handleSend}
                    className="w-[15%] px-3 py-2 text-sm text-white rounded-sm bg-main hover:bg-red-700"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default memo(ChatBox);
