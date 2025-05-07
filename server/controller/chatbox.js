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
    
    Phân tích câu sau và trả về JSON theo định dạng:
    
    Nếu là tìm kiếm sản phẩm:
    {
      "intent": "product_query",
      "keywords": ["keyword1", "keyword2"],
      "minPrice": 0,
      "maxPrice": 0
    }
    
    Nếu là tìm sản phẩm bán chạy nhất, trả về:
    {
      "intent": "bestseller_query",
      "keywords": ["keyword1", "keyword2"]
    }
    
    Nếu là câu hỏi chung, trả về:
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

        const query = {
            $and: [],
        };

        if (intentData.keywords?.length) {
            const regexArray = intentData.keywords.map(
                (k) => new RegExp(k, 'i')
            );
            query.$and.push({
                $or: [
                    { title: { $in: regexArray } },
                    { color: { $in: regexArray } },
                    { brand: { $in: regexArray } },
                    { category: { $in: regexArray } },
                ],
            });
        }

        // Thêm điều kiện lọc theo giá
        const priceQuery = {};
        if (intentData.minPrice && !isNaN(intentData.minPrice)) {
            priceQuery.$gte = intentData.minPrice;
        }
        if (intentData.maxPrice && !isNaN(intentData.maxPrice)) {
            priceQuery.$lte = intentData.maxPrice;
        }
        if (Object.keys(priceQuery).length > 0) {
            query.$and.push({ price: priceQuery });
        }

        // Nếu không có $and nào thì dùng {} để tránh lỗi
        const products = await Product.find(
            query.$and.length ? { $and: query.$and } : {}
        );

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
    if (
        intentData.intent === 'bestseller_query' &&
        Array.isArray(intentData.keywords)
    ) {
        const regexArray = intentData.keywords.map((k) => new RegExp(k, 'i'));

        const products = await Product.find({
            $or: [
                { title: { $in: regexArray } },
                { color: { $in: regexArray } },
                { brand: { $in: regexArray } },
                { category: { $in: regexArray } },
            ],
        })
            .sort({ sold: -1 }) // Sắp xếp theo số lượng đã bán
            .limit(1);

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
            reply: `Dưới đây là những sản phẩm bán chạy nhất.`,
            products: result,
        });
    }
    return res.status(200).json({
        success: true,
        reply: 'Xin lỗi, tôi không hiểu yêu cầu của bạn.',
    });
});

module.exports = { chatBoxAI };
