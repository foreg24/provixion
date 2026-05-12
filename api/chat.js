/* ============================================
   PROVIXION S.A.S. — api/chat.js
   Vercel Serverless Function — Groq AI Chat
   ============================================ */

const { SYSTEM_PROMPT } = require('./prompt');

module.exports = async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { message } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Groq API error:', errorData);
            return res.status(502).json({
                error: 'AI service temporarily unavailable',
                reply: 'Lo siento, el servicio de IA no está disponible en este momento. Por favor, contáctanos por WhatsApp al +57 311 2882205 y con gusto te atenderemos.'
            });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content ||
            'Lo siento, no pude procesar tu mensaje. Por favor, contáctanos por WhatsApp al +57 311 2882205.';

        return res.status(200).json({ reply });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            reply: 'Lo siento, ocurrió un error. Por favor, contáctanos por WhatsApp al +57 311 2882205 o email info@provixion.com.co.'
        });
    }
};