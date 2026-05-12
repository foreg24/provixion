/* ============================================
   PROVIXION S.A.S. — API Backend (index.js)
   Groq AI Chat Integration
   ============================================ */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (frontend)
app.use(express.static('public'));

// System prompt for the AI assistant
const SYSTEM_PROMPT = `Eres X, el asistente virtual oficial de ProviXion S.A.S., una empresa colombiana especializada en dotaciones empresariales, elementos de protección personal (EPP), seguridad industrial, extintores, señalización y productos de aseo.

INFORMACIÓN DE LA EMPRESA:
- Nombre: ProviXion S.A.S.
- Especialidad: Dotación empresarial e institucional, EPP, seguridad industrial
- Productos: Dotaciones corporativas (camisas, pantalones, overoles, chaquetas en jean, botas de seguridad), EPP (cascos, guantes, gafas, respiradores, chalecos reflectivos), extintores, señalización, productos de aseo
- Servicios: Diseño personalizado, distribución nacional, asesoría técnica, productos certificados, atención personalizada, reposición garantizada
- Contacto: WhatsApp/Teléfono +57 311 2882205, Email info@provixion.com.co, Dirección Calle 10 #5-42, Neiva, Huila, Colombia
- Horario: Lunes a viernes 8am-6pm, sábados 8am-12m
- Web: provixion.com.co

MISIÓN: Especializados en diseño, comercialización y distribución de dotaciones empresariales, accesorios, EPP y productos de aseo. Compromiso con excelencia, innovación, cumplimiento y atención personalizada.

VISIÓN: Para 2028, ser líder y referente en dotaciones empresariales con presencia nacional e internacional, consolidando ProviXion como sinónimo de calidad, innovación y confianza.

VALORES: Excelencia, Innovación, Compromiso, Calidad.

INSTRUCCIONES DE COMPORTAMIENTO:
1. Sé amable, profesional y entusiasta. Usa emojis ocasionalmente pero con moderación.
2. Responde en español (Colombia).
3. Si el usuario pregunta por precios específicos, indica que varían según cantidad y personalización, y ofrece contactar un asesor o usar WhatsApp.
4. Si no sabes algo específico, sugiere contactar directamente por WhatsApp +57 311 2882205 o email info@provixion.com.co.
5. Mantén respuestas concisas pero informativas (máximo 3-4 oraciones cuando sea posible).
6. Si preguntan por cotización, solicita: tipo de dotación, cantidad de personas, ciudad.
7. Destaca siempre la calidad, certificación y atención personalizada de ProviXion.
8. No inventes precios, descuentos ni promociones que no existan.
9. Si el usuario escribe algo ofensivo o inapropiado, responde con educación que no puedes ayudar con eso.`;

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

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ProviXion API server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});