/* ============================================
   PROVIXION S.A.S. — script.js
   ============================================ */

/* ── LOADING SCREEN ──────────────────────────── */
(function () {
    const loader   = document.getElementById('loader');
    const progress = document.getElementById('loaderProgress');
    const xBlast   = document.getElementById('xBlast');

    let pct = 0;
    const tick = setInterval(() => {
        pct += Math.random() * 10 + 4;
        if (pct >= 100) {
            pct = 100;
            clearInterval(tick);
            progress.style.width = '100%';

            setTimeout(() => {
                loader.classList.add('loader-done');
                xBlast.classList.add('x-explode');
                xBlast.addEventListener('animationend', () => {
                    xBlast.style.display = 'none';
                    document.body.classList.remove('loading');
                    triggerHeroAnimation();
                }, { once: true });
            }, 350);
        } else {
            progress.style.width = pct + '%';
        }
    }, 110);
})();

function triggerHeroAnimation() {
    document.querySelector('.hero-content')?.classList.add('hero-animate-in');
}

/* ── NAVBAR SCROLL ───────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── MOBILE MENU ─────────────────────────────── */
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

/* ── HERO SLIDER ─────────────────────────────── */
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
let slideTimer;

function goToSlide(idx) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (idx + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}
function startSlider() {
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5500);
}

document.getElementById('sliderPrev')?.addEventListener('click', () => {
    clearInterval(slideTimer); goToSlide(currentSlide - 1); startSlider();
});
document.getElementById('sliderNext')?.addEventListener('click', () => {
    clearInterval(slideTimer); goToSlide(currentSlide + 1); startSlider();
});
startSlider();

/* ── COLLECTION CAROUSELS ────────────────────── */
function initCarousel(trackId, prevId, nextId) {
    const track = document.getElementById(trackId);
    const prev  = document.getElementById(prevId);
    const next  = document.getElementById(nextId);
    if (!track || !prev || !next) return;
    let pos = 0;
    const itemW = () => {
        const item = track.querySelector('.collection-item');
        return item ? item.offsetWidth + 20 : 270;
    };
    const maxPos = () => Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);

    next.addEventListener('click', () => {
        pos = Math.min(pos + itemW(), maxPos());
        track.style.transform = `translateX(-${pos}px)`;
    });
    prev.addEventListener('click', () => {
        pos = Math.max(pos - itemW(), 0);
        track.style.transform = `translateX(-${pos}px)`;
    });
}
initCarousel('collectionTrack',  'collectionPrev',  'collectionNext');
initCarousel('protectionTrack',  'protectionPrev',  'protectionNext');

/* ── PRODUCT LIST FOCUS ──────────────────────── */
const productItems = document.querySelectorAll('.product-item');
productItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        productItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

/* ── OVERLAY PAGES (NOSOTROS & CONTACTO) ────── */
const overlayIds    = ['nosotros', 'contacto'];
const overlays      = {};
const dimmer        = document.getElementById('pageDimmer');
let   activeOverlay = null;

overlayIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    overlays[id] = el;
});

function openOverlay(id) {
    if (activeOverlay && activeOverlay !== id) closeOverlay(false);
    const el = overlays[id];
    if (!el) return;

    el.classList.add('overlay-active');
    dimmer.classList.add('active');
    document.body.classList.add('overlay-open');
    el.scrollTop = 0;
    activeOverlay = id;

    el.querySelectorAll('.footer-anim-left, .footer-anim-right').forEach(e => {
        e.closest('.footer')?.classList.remove('footer-in');
    });

    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
    });

    // Trigger reveal for elements already in viewport when overlay opens
    setTimeout(() => {
        el.querySelectorAll('.reveal-target').forEach(target => {
            const rect = target.getBoundingClientRect();
            const overlayRect = el.getBoundingClientRect();
            if (rect.top < overlayRect.bottom && rect.bottom > overlayRect.top) {
                target.classList.add('revealed');
            }
        });
    }, 300);
}

function closeOverlay(resetNav = true) {
    if (!activeOverlay) return;
    const id = activeOverlay;
    overlays[id]?.classList.remove('overlay-active');
    dimmer.classList.remove('active');
    document.body.classList.remove('overlay-open');
    activeOverlay = null;

    if (resetNav) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('.nav-link[href="#inicio"]')?.classList.add('active');
    }
}

dimmer.addEventListener('click', () => closeOverlay());

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && activeOverlay) closeOverlay();
});

document.querySelectorAll('.nav-link, .mobile-link, .footer-links a').forEach(link => {
    link.addEventListener('click', e => {
        const href = link.getAttribute('href')?.replace('#', '');
        if (!href) return;

        if (overlayIds.includes(href)) {
            e.preventDefault();
            openOverlay(href);
        } else {
            closeOverlay(false);
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector(`.nav-link[href="#${href}"]`)?.classList.add('active');
        }
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

document.querySelectorAll('.hero-btn-outline').forEach(btn => {
    btn.addEventListener('click', e => {
        const href = btn.getAttribute('href')?.replace('#','');
        if (overlayIds.includes(href)) {
            e.preventDefault();
            openOverlay(href);
        }
    });
});

/* ── SCROLL REVEAL ─────────────────────────── */
function createRevealObserver(root) {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                entry.target.classList.remove('revealed');
            }
        });
    }, { threshold: 0.08, root: root || null });

    const targets = (root || document).querySelectorAll(
        '.collection-item, .service-item, .about-value, .collection-header, .contact-info-item, .mv-card, .mv-card-nosotros'
    );
    targets.forEach(el => {
        el.classList.add('reveal-target');
        obs.observe(el);
    });
    return obs;
}
createRevealObserver(null);

function observeFooters() {
    const footerObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const footer = entry.target;
            if (entry.isIntersecting) {
                footer.classList.add('footer-in');
            } else {
                footer.classList.remove('footer-in');
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.footer').forEach(f => footerObs.observe(f));
}
observeFooters();

overlayIds.forEach(id => {
    const el = overlays[id];
    if (!el) return;
    let overlayObs = null;

    const mo = new MutationObserver(() => {
        if (el.classList.contains('overlay-active') && !overlayObs) {
            overlayObs = createRevealObserver(el);
            observeFooterInEl(el);
        } else if (!el.classList.contains('overlay-active') && overlayObs) {
            overlayObs.disconnect();
            overlayObs = null;
        }
    });
    mo.observe(el, { attributes: true, attributeFilter: ['class'] });
});

function observeFooterInEl(container) {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('footer-in');
            } else {
                entry.target.classList.remove('footer-in');
            }
        });
    }, { threshold: 0.2, root: container });
    container.querySelectorAll('.footer').forEach(f => obs.observe(f));
}

/* ── SCROLL DOWN BUTTON ──────────────────────── */
document.querySelector('.scroll-down')?.addEventListener('click', () => {
    document.getElementById('productos-lista')?.scrollIntoView({ behavior: 'smooth' });
});

/* ── CONTACT FORM ────────────────────────────── */
document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-submit');
    const orig = btn.textContent;
    btn.textContent = '¡Mensaje enviado! ✓';
    btn.style.background = '#25D366';
    setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        e.target.reset();
    }, 3000);
});

/* ── CURSOR GLOW ─────────────────────────────── */
const cursor = document.createElement('div');
cursor.id = 'cursorGlow';
document.body.appendChild(cursor);

let mx = 0, my = 0, cx = 0, cy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function loop() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    cursor.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
    requestAnimationFrame(loop);
})();

// Only apply hover glow to non-form interactive elements
document.querySelectorAll('a, button, .product-item, .collection-item, .service-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// Hide cursor glow entirely over form inputs, textareas and selects
document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.opacity = '0');
    el.addEventListener('mouseleave', () => cursor.style.opacity = '1');
});

// Also hide when hovering over the contact/form card background
document.querySelectorAll('.contact-right, .overlay-page').forEach(el => {
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
    });
});

/* ── STAGGER COLLECTION ITEMS ────────────────── */
window.addEventListener('load', () => {
    document.querySelectorAll('.collection-track .collection-item').forEach((item, i) => {
        item.style.transitionDelay = `${i * 0.05}s`;
    });
});

/* ════════════════════════════════════════════
   VIRTUAL ASSISTANT — CORREGIDO
   ════════════════════════════════════════════ */

const assistantToggle = document.getElementById('assistantToggle');
const assistantPanel = document.getElementById('assistantPanel');
const assistantMinimize = document.getElementById('assistantMinimize');
const assistantModal = document.getElementById('assistantModal');
const assistantModalClose = document.getElementById('assistantModalClose');
const assistantInput = document.getElementById('assistantInput');
const assistantSend = document.getElementById('assistantSend');
const assistantInputMobile = document.getElementById('assistantInputMobile');
const assistantSendMobile = document.getElementById('assistantSendMobile');
const quickReplies = document.getElementById('quickReplies');
const quickRepliesMobile = document.getElementById('quickRepliesMobile');

let isMobile = window.innerWidth <= 768;
let isOpen = false;
let hasInteracted = false;

window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    if (wasMobile !== isMobile) {
        // Close both when switching breakpoints
        assistantPanel.classList.remove('active');
        assistantModal.classList.remove('active');
        document.body.classList.remove('overlay-open');
        isOpen = false;
    }
});

// Toggle open/close
assistantToggle.addEventListener('click', () => {
    if (isMobile) {
        assistantModal.classList.add('active');
        document.body.classList.add('overlay-open');
        isOpen = true;
    } else {
        assistantPanel.classList.toggle('active');
        isOpen = assistantPanel.classList.contains('active');
    }
});

// Minimize desktop panel
assistantMinimize?.addEventListener('click', () => {
    assistantPanel.classList.remove('active');
    isOpen = false;
});

// Close mobile modal
assistantModalClose?.addEventListener('click', () => {
    assistantModal.classList.remove('active');
    document.body.classList.remove('overlay-open');
    isOpen = false;
});

// Close mobile modal on Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && assistantModal.classList.contains('active')) {
        assistantModal.classList.remove('active');
        document.body.classList.remove('overlay-open');
        isOpen = false;
    }
});

// Hide quick replies function
function hideQuickReplies() {
    if (hasInteracted) return;
    hasInteracted = true;

    if (quickReplies) {
        quickReplies.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        quickReplies.style.opacity = '0';
        quickReplies.style.transform = 'translateY(10px)';
        setTimeout(() => {
            quickReplies.classList.add('hidden');
        }, 300);
    }
    if (quickRepliesMobile) {
        quickRepliesMobile.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        quickRepliesMobile.style.opacity = '0';
        quickRepliesMobile.style.transform = 'translateY(10px)';
        setTimeout(() => {
            quickRepliesMobile.classList.add('hidden');
        }, 300);
    }
}

// Quick replies — click hides them
function setupQuickReplies(container, chatId) {
    container?.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.getAttribute('data-msg');
            hideQuickReplies();
            sendMessage(msg, chatId);
        });
    });
}
setupQuickReplies(quickReplies, 'assistantChat');
setupQuickReplies(quickRepliesMobile, 'assistantChatMobile');

// Send on Enter key
assistantInput?.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        const msg = assistantInput.value.trim();
        if (msg) {
            hideQuickReplies();
            sendMessage(msg, 'assistantChat');
            assistantInput.value = '';
        }
    }
});

assistantInputMobile?.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        const msg = assistantInputMobile.value.trim();
        if (msg) {
            hideQuickReplies();
            sendMessage(msg, 'assistantChatMobile');
            assistantInputMobile.value = '';
        }
    }
});

// Send buttons
assistantSend?.addEventListener('click', () => {
    const msg = assistantInput.value.trim();
    if (msg) {
        hideQuickReplies();
        sendMessage(msg, 'assistantChat');
        assistantInput.value = '';
    }
});

assistantSendMobile?.addEventListener('click', () => {
    const msg = assistantInputMobile.value.trim();
    if (msg) {
        hideQuickReplies();
        sendMessage(msg, 'assistantChatMobile');
        assistantInputMobile.value = '';
    }
});

// Predefined responses
const predefinedResponses = {
    'cotización': '¡Con gusto! Para brindarte una cotización personalizada, necesito saber: ¿qué tipo de dotación necesitas (corporativa, industrial, EPP), para cuántas personas y en qué ciudad te encuentras? También puedes escribirnos directamente por WhatsApp al +57 311 2882205.',
    'cotizacion': '¡Con gusto! Para brindarte una cotización personalizada, necesito saber: ¿qué tipo de dotación necesitas (corporativa, industrial, EPP), para cuántas personas y en qué ciudad te encuentras? También puedes escribirnos directamente por WhatsApp al +57 311 2882205.',
    'más información': 'ProviXion S.A.S. es una empresa especializada en dotaciones empresariales, elementos de protección personal (EPP), seguridad industrial, extintores, señalización y productos de aseo. ¿Sobre qué área específica te gustaría saber más?',
    'mas informacion': 'ProviXion S.A.S. es una empresa especializada en dotaciones empresariales, elementos de protección personal (EPP), seguridad industrial, extintores, señalización y productos de aseo. ¿Sobre qué área específica te gustaría saber más?',
    'nuestros productos': 'Nuestro catálogo incluye: dotación corporativa (camisas, pantalones, overoles), EPP (cascos, guantes, gafas, respiradores, chalecos reflectivos), equipos contra incendios (extintores), señalización y productos de aseo industrial. ¿Te interesa alguna categoría en particular?',
    'chatea conmigo': '¡Perfecto! Estoy aquí para ayudarte. Pregúntame lo que necesites sobre nuestros productos, servicios, cotizaciones o cualquier duda que tengas sobre dotación empresarial y seguridad industrial.',
    'hola': '¡Hola! Soy X, tu asistente virtual de ProviXion. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre cotizaciones, nuestros productos, o cualquier duda que tengas.',
    'buenos días': '¡Buenos días! Bienvenido a ProviXion. ¿En qué puedo ayudarte hoy?',
    'buenos dias': '¡Buenos días! Bienvenido a ProviXion. ¿En qué puedo ayudarte hoy?',
    'buenas tardes': '¡Buenas tardes! Bienvenido a ProviXion. ¿En qué puedo ayudarte hoy?',
    'buenas noches': '¡Buenas noches! Bienvenido a ProviXion. ¿En qué puedo ayudarte hoy?',
    'precio': 'Los precios varían según el tipo de producto, cantidad y personalización. ¿Te gustaría que uno de nuestros asesores te contacte con una cotización personalizada? Puedes dejarnos tu número o escribirnos al WhatsApp +57 311 2882205.',
    'precios': 'Los precios varían según el tipo de producto, cantidad y personalización. ¿Te gustaría que uno de nuestros asesores te contacte con una cotización personalizada? Puedes dejarnos tu número o escribirnos al WhatsApp +57 311 2882205.',
    'contacto': 'Puedes contactarnos por: WhatsApp +57 311 2882205, Teléfono +57 311 2882205, Email info@provixion.com.co, o visitarnos en Calle 10 #5-42, Neiva, Huila. También puedes llenar el formulario de contacto en nuestra página.',
    'whatsapp': 'Nuestro WhatsApp es +57 311 2882205. ¡Escríbenos y te atenderemos de inmediato!',
    'teléfono': 'Nuestro teléfono es +57 311 2882205. ¡Llámanos y con gusto te atenderemos!',
    'telefono': 'Nuestro teléfono es +57 311 2882205. ¡Llámanos y con gusto te atenderemos!',
    'email': 'Nuestro correo electrónico es info@provixion.com.co. Escríbenos y te responderemos en menos de 24 horas.',
    'correo': 'Nuestro correo electrónico es info@provixion.com.co. Escríbenos y te responderemos en menos de 24 horas.',
    'dirección': 'Nuestra dirección es Calle 10 #5-42, Neiva, Huila — Colombia.',
    'direccion': 'Nuestra dirección es Calle 10 #5-42, Neiva, Huila — Colombia.',
    'envíos': 'Realizamos distribución nacional en todo el territorio colombiano. Los tiempos de entrega varían según la ubicación y el volumen del pedido.',
    'envios': 'Realizamos distribución nacional en todo el territorio colombiano. Los tiempos de entrega varían según la ubicación y el volumen del pedido.',
    'entrega': 'Realizamos distribución nacional en todo el territorio colombiano. Los tiempos de entrega varían según la ubicación y el volumen del pedido.',
    'dotación': 'Ofrecemos dotaciones corporativas personalizadas con la imagen de tu empresa: camisas, pantalones, overoles, chaquetas y más. ¿Necesitas dotación para un sector específico?',
    'dotacion': 'Ofrecemos dotaciones corporativas personalizadas con la imagen de tu empresa: camisas, pantalones, overoles, chaquetas y más. ¿Necesitas dotación para un sector específico?',
    'epp': 'Nuestros elementos de protección personal incluyen: cascos de seguridad, guantes de carnaza, gafas de seguridad, respiradores, chalecos reflectivos, botas de seguridad y más. Todos certificados según normativa vigente.',
    'seguridad industrial': 'En ProviXion ofrecemos soluciones completas de seguridad industrial: EPP certificados, señalización, extintores, equipos contra incendios y asesoría técnica para el cumplimiento de normativas.',
    'extintores': 'Contamos con extintores de diferentes tipos (polvo químico seco, CO2, agua, espuma) y equipos contra incendios. Todos cumplen con las normas técnicas colombianas.',
    'señalización': 'Ofrecemos señalización de seguridad industrial: señales de prohibición, advertencia, obligación, emergencia y evacuación. Personalizables según las necesidades de tu empresa.',
    'senalizacion': 'Ofrecemos señalización de seguridad industrial: señales de prohibición, advertencia, obligación, emergencia y evacuación. Personalizables según las necesidades de tu empresa.',
    'aseo': 'Disponemos de productos de aseo industrial de alta calidad para mantener ambientes laborales limpios, higiénicos y seguros.',
    'camisas': 'Nuestras camisas en jean son de alta resistencia, ideales para trabajos industriales. Disponibles en diferentes tallas y con opción de personalización con logo de tu empresa.',
    'pantalones': 'Los pantalones en jean de ProviXion están diseñados para durabilidad y confort en ambientes de trabajo exigentes.',
    'botas': 'Nuestras botas de seguridad cumplen con normas técnicas colombianas. Disponibles con punta de acero, suela antideslizante y diferentes materiales según el riesgo laboral.',
    'overoles': 'Los overoles en drill son resistentes y cómodos, perfectos para trabajos industriales, mecánicos y de construcción.',
    'chaquetas': 'Ofrecemos chaquetas en jean, enguatadas y chalecos acolchados para protección en ambientes fríos o de riesgo.',
    'guantes': 'Nuestros guantes de carnaza son resistentes al desgaste, ideales para trabajos de construcción, mecánica y agricultura.',
    'cascos': 'Los cascos de seguridad cumplen con normas técnicas y están disponibles en diferentes colores. Opción de personalización con el logo de tu empresa.',
    'gafas': 'Las gafas de seguridad ofrecen protección contra impactos, polvo y salpicaduras. Ideales para trabajos industriales y de laboratorio.',
    'chalecos': 'Los chalecos reflectivos garantizan visibilidad en condiciones de baja luz. Disponibles en naranja y amarillo fluorescente.',
    'horario': 'Nuestro horario de atención es de lunes a viernes de 8:00 a.m. a 6:00 p.m. y sábados de 8:00 a.m. a 12:00 m.',
    'pago': 'Aceptamos diferentes métodos de pago: transferencia bancaria, consignación, y pagos con datáfono. Para pedidos corporativos ofrecemos facilidades de pago.',
    'garantía': 'Todos nuestros productos cuentan con garantía de calidad. Si tienes algún problema, contáctanos y lo resolveremos de inmediato.',
    'garantia': 'Todos nuestros productos cuentan con garantía de calidad. Si tienes algún problema, contáctanos y lo resolveremos de inmediato.',
};

function findPredefinedResponse(msg) {
    const lowerMsg = msg.toLowerCase().trim();
    if (predefinedResponses[lowerMsg]) return predefinedResponses[lowerMsg];
    for (const [key, response] of Object.entries(predefinedResponses)) {
        if (lowerMsg.includes(key)) return response;
    }
    return null;
}

function addBubble(text, isUser, chatId) {
    const chat = document.getElementById(chatId);
    if (!chat) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`;
    bubble.innerHTML = `<p>${escapeHtml(text)}</p>`;
    chat.appendChild(bubble);
    // Auto-scroll to bottom smoothly
    chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
    // Also scroll the parent container if needed (for desktop panel)
    const scrollArea = chat.closest('.assistant-scroll-area') || chat.closest('.assistant-modal-scroll');
    if (scrollArea) {
        scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addTypingIndicator(chatId) {
    const chat = document.getElementById(chatId);
    if (!chat) return;
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chat.appendChild(indicator);
    // Auto-scroll to bottom
    chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
    const scrollArea = chat.closest('.assistant-scroll-area') || chat.closest('.assistant-modal-scroll');
    if (scrollArea) {
        scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' });
    }
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

async function sendMessage(msg, chatId) {
    addBubble(msg, true, chatId);
    addTypingIndicator(chatId);

    const predefined = findPredefinedResponse(msg);

    if (predefined) {
        setTimeout(() => {
            removeTypingIndicator();
            addBubble(predefined, false, chatId);
        }, 800 + Math.random() * 400);
        return;
    }

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });

        if (response.ok) {
            const data = await response.json();
            removeTypingIndicator();
            addBubble(data.reply, false, chatId);
        } else {
            throw new Error('API error');
        }
    } catch (err) {
        setTimeout(() => {
            removeTypingIndicator();
            addBubble(
                'Gracias por tu mensaje. Para brindarte una respuesta más precisa, te invito a contactarnos directamente por WhatsApp al +57 311 2882205 o llenar el formulario de contacto en nuestra página. Un asesor especializado te atenderá con gusto.',
                false,
                chatId
            );
        }, 1000);
    }
}