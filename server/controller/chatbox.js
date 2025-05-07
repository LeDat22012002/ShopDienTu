const asyncHandler = require('express-async-handler');
const axios = require('axios');
const Product = require('../models/product');

const GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_KEY;

const chatBoxAI = asyncHandler(async (req, res) => {
    const { message } = req.body;

    // console.log('Received message:', message);
    // console.log('GEMINI_API_KEY:', GEMINI_API_KEY);

    if (!message) {
        return res
            .status(400)
            .json({ success: false, mess: 'Missing message input' });
    }

    const prompt = `
        Bạn là trợ lý thông minh cho một trang web bán hàng.

        Phân tích câu sau và trả lời theo 1 trong 2 dạng:

        1. Nếu câu liên quan đến sản phẩm (ví dụ: mua gì, giá bao nhiêu, gợi ý sản phẩm...), trả về JSON như sau:
        {
        "intent": "product_query",
        "keywords": ["keyword1", "keyword2"]
        }

        2. Nếu không liên quan đến sản phẩm (ví dụ: hỏi kiến thức, hỏi người nổi tiếng...), trả về JSON như sau:
        {
        "intent": "general_question",
        "reply": "Trả lời của bạn ở đây"
        }

        Câu: "${message}"
        `;

    let geminiResponse;
    try {
        geminiResponse = await axios.post(
            GEMINI_API_URL,
            {
                contents: [{ parts: [{ text: prompt }] }],
            },
            {
                headers: { 'Content-Type': 'application/json' },
                params: { key: GEMINI_API_KEY },
            }
        );
        // console.log(
        //     'Gemini raw response:',
        //     JSON.stringify(geminiResponse.data, null, 2)
        // );
    } catch (error) {
        // console.error(
        //     'Gemini API ERROR:',
        //     error.response?.data || error.message
        // );
        return res.status(500).json({
            success: false,
            mess: 'Gemini API failed',
        });
    }

    const geminiText =
        geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    // console.log('Gemini extracted text:', geminiText);

    let intentData = {};
    try {
        const match = geminiText.match(/\{.*\}/s); // Lấy JSON object
        if (match) {
            intentData = JSON.parse(match[0]);
        }
        // console.log('Intent data:', intentData);
    } catch (e) {
        return res.status(500).json({
            success: false,
            mess: 'Gemini response parse error',
            geminiText,
        });
    }

    if (intentData.intent === 'general_question') {
        // Câu hỏi chung → trả lời trực tiếp
        return res.status(200).json({
            success: true,
            reply: intentData.reply || 'Xin lỗi, tôi chưa có câu trả lời.',
            // products: [],
        });
    }

    if (
        intentData.intent === 'product_query' &&
        Array.isArray(intentData.keywords)
    ) {
        const regexArray = intentData.keywords.map((k) => new RegExp(k, 'i'));

        const products = await Product.find({
            $or: [
                { title: { $in: regexArray } },
                { description: { $in: regexArray } },
                { shortDescription: { $in: regexArray } },
                { brand: { $in: regexArray } },
                { category: { $in: regexArray } },
            ],
        });

        const result = products.map((p) => ({
            id: p._id,
            title: p.title,
            price: p.price,
            category: p.category,
            color: p.color,
            thumb: p.thumb,
        }));

        return res.status(200).json({
            success: true,
            reply: `Tôi tìm thấy ${result.length} sản phẩm phù hợp.`,
            products: result,
        });
    }
});

module.exports = { chatBoxAI };
