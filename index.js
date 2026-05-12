/* ============================================
   PROVIXION S.A.S. — index.js
   Express server for localhost development
   ============================================ */

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const { SYSTEM_PROMPT } = require('./api/prompt');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from public/
app.use(express.static('public'));

// Chat endpoint
app.post('/api/chat', async (req, res) => {
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

        res.json({ reply });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            reply: 'Lo siento, ocurrió un error. Por favor, contáctanos por WhatsApp al +57 311 2882205 o email info@provixion.com.co.'
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 ProviXion server running → http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});