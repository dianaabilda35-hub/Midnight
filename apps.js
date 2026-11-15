// --- ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

let activeCallTimer = null;
let callSeconds = 0;
let recognition = null;
let isListening = false;

function initApp() {
    setupNavigation();
    renderView('chats');
    
    if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            endCallInternal();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            renderView(item.getAttribute('data-tab'));
        });
    });
}

function renderView(tab) {
    const screen = document.getElementById('app-screen');
    if (!screen) return;
    
    if (tab === 'chats') {
        screen.innerHTML = `
            <h1 class="view-title">Messages</h1>
            <p class="view-subtitle">Weak Hero Class 1 Network</p>
            <div class="chat-tabs">
                <button class="chat-tab-btn active" onclick="switchChatTab('dms', this)">DMs</button>
                <button class="chat-tab-btn" onclick="switchChatTab('group', this)">Group Chat</button>
            </div>
            <div id="chat-container"></div>
        `;
        renderDMs();
    } else if (tab === 'feed') {
        screen.innerHTML = `
            <h1 class="view-title">Feed</h1>
            <p class="view-subtitle">Your popular feed (15K+ views)</p>
            <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                <input type="text" id="feed-input" placeholder="Post something to your followers..." style="flex:1; padding: 10px; background: #0b0f19; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color:white; outline:none;">
                <button onclick="createPost()" class="btn-primary" style="width: auto; padding: 0 16px;">Post</button>
            </div>
            <div id="feed-list"></div>
        `;
        renderFeed();
    } else if (tab === 'calls') {
        screen.innerHTML = `
            <h1 class="view-title">Voice Calls</h1>
            <p class="view-subtitle">Real interactive voice lines with mic</p>
            <div style="font-size: 14px; font-weight: 600; color: #9ca3af; margin-bottom: 8px;">Direct Audio Lines:</div>
            <div id="call-contacts-container"></div>
        `;
        renderCallContacts();
    } else if (tab === 'settings') {
        const savedKey = localStorage.getItem('gemini_api_key') || '';
        const savedName = localStorage.getItem('user_name') || 'Diana';
        screen.innerHTML = `
            <h1 class="view-title">Settings</h1>
            <p class="view-subtitle">Profile & API Configuration</p>
            <div class="settings-box">
                <label><strong>Your Name (Nickname):</strong></label>
                <input type="text" id="user-name-input" value="${savedName}" placeholder="Enter your name...">
                
                <label style="margin-top: 12px; display: block;"><strong>Gemini API Key:</strong></label>
                <input type="password" id="api-key-input" value="${savedKey}" placeholder="AIzaSy...">
                
                <button class="btn-primary" style="margin-top: 10px;" onclick="saveSettings()">Save Settings</button>
            </div>
        `;
    }
}

function switchChatTab(type, btn) {
    document.querySelectorAll('.chat-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (type === 'dms') renderDMs();
    else renderGroupChat();
}

function renderDMs() {
    const container = document.getElementById('chat-container');
    if (!container) return;
    container.innerHTML = characters.map(char => `
        <div class="card" style="display: flex; align-items: center; gap: 14px; cursor:pointer;" onclick="openChat('${char.id}')">
            <div class="char-avatar">${char.initial}</div>
            <div>
                <h3 style="font-size: 16px; color: #fff; margin-bottom: 2px;">${char.name}</h3>
                <p style="font-size: 13px; color: #9ca3af;">${char.role}</p>
            </div>
        </div>
    `).join('');
}

function renderCallContacts() {
    const container = document.getElementById('call-contacts-container');
    if (!container) return;
    container.innerHTML = characters.map(char => `
        <div class="card" style="display: flex; align-items: center; justify-content: space-between; cursor:pointer;" onclick="startPersonalCall('${char.id}')">
            <div style="display: flex; align-items: center; gap: 14px;">
                <div class="char-avatar">${char.initial}</div>
                <div>
                    <h3 style="font-size: 16px; color: #fff; margin-bottom: 2px;">${char.name}</h3>
                    <p style="font-size: 13px; color: #9ca3af;">Interactive voice call</p>
                </div>
            </div>
            <span style="font-size: 20px;">📞</span>
        </div>
    `).join('');
}

function renderGroupChat() {
    const container = document.getElementById('chat-container');
    if (!container) return;
    container.innerHTML = `
        <div style="height: 310px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 12px; margin-bottom: 12px; display:flex; flex-direction:column; gap:8px;" id="group-messages">
            <div style="background: rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 10px; max-width: 85%;">
                <strong style="color:#60a5fa; display:block; font-size:12px;">Ahn Su-ho</strong>
                Hey everyone. Pretty quiet today.
            </div>
            <div style="background: rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 10px; max-width: 85%;">
                <strong style="color:#f43f5e; display:block; font-size:12px;">Yeon Si-eun</strong>
                Because everyone is focusing on studies.
            </div>
        </div>
        <div style="display: flex; gap: 8px;">
            <input type="text" id="group-input" placeholder="Message group..." style="flex:1; padding: 10px; background: #0b0f19; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color:white; outline:none;">
            <button onclick="sendGroupMessage()" class="btn-primary" style="width: auto; padding: 0 16px;">➤</button>
        </div>
    `;
}

function renderFeed() {
    const container = document.getElementById('feed-list');
    if (!container) return;
    container.innerHTML = feedPosts.map(post => `
        <div class="feed-post">
            <div class="feed-header">
                <div class="char-avatar" style="width: 35px; height: 35px; font-size: 14px;">${post.initial}</div>
                <div>
                    <strong style="font-size: 14px; color: #fff; display: block;">${post.author}</strong>
                    <span style="font-size: 11px; color: #9ca3af;">${post.time}</span>
                </div>
            </div>
            <div class="feed-text">${post.text}</div>
            <div class="post-stats">
                <span>👁️ ${post.views} views</span>
                <span>❤️ ${post.likes} likes</span>
                <span>💬 ${post.comments.length} comments</span>
            </div>
            <div class="comments-container">
                ${post.comments.map(c => `<div class="comment-box"><strong>${c.author}:</strong> ${c.text}</div>`).join('')}
            </div>
            <div class="comment-input-row">
                <input type="text" id="comment-input-${post.id}" placeholder="Reply to this post...">
                <button onclick="addComment(${post.id})">Send</button>
            </div>
        </div>
    `).join('');
}

async function createPost() {
    const input = document.getElementById('feed-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    const myName = getUserName();

    const randomViews = (Math.random() * 15 + 5).toFixed(1) + 'K';
    const randomLikes = (Math.random() * 4 + 1.2).toFixed(1) + 'K';

    const newPost = {
        id: Date.now(),
        author: myName,
        initial: myName.substring(0, 2).toUpperCase(),
        time: "Just now",
        text: text,
        views: randomViews,
        likes: randomLikes,
        comments: [{ author: "System", text: "Generating comments from your followers & strangers..." }]
    };

    feedPosts.unshift(newPost);
    input.value = '';
    renderFeed();

    const prompt = `You are simulating a popular social media post by a user named ${myName} in the 'Weak Hero Class 1' universe. 
The post is: "${text}".
Generate 15 to 18 short, realistic social media comments. 
Include comments from known characters (like Ahn Su-ho, Yeon Si-eun, Baku, Go Tak, U-yeong) and random strangers, rivals, fans, and anonymous accounts.
Format each comment strictly as "Author Name: Comment text" on a new line. No extra intro.`;

    const rawResponse = await callGemini("You are a social media comment simulator.", prompt);
    
    const lines = rawResponse.split('\n').filter(l => l.includes(':'));
    const parsedComments = lines.map(line => {
        const parts = line.split(':');
        const author = parts[0].replace(/[-*#]/g, '').trim();
        const commentText = parts.slice(1).join(':').trim();
        return { author: author || "User", text: commentText || "Nice!" };
    });

    if (parsedComments.length > 0) {
        newPost.comments = parsedComments;
    } else {
        newPost.comments = [
            { author: "Ahn Su-ho", text: "Look at you go!" },
            { author: "Yeon Si-eun", text: "Whatever." },
            { author: "random_kid", text: "Who's this?" }
        ];
    }

    renderFeed();
}

async function addComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    const myName = getUserName();

    const post = feedPosts.find(p => p.id === postId);
    if (!post) return;

    post.comments.push({ author: myName + " (You)", text: text });
    input.value = '';
    renderFeed();

    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    const reply = await callGemini(randomChar.systemPrompt, `User ${myName} commented on a post: "${text}". Reply to this comment briefly in character.`);
    
    post.comments.push({ author: randomChar.name, text: reply });
    renderFeed();
}

function openChat(charId) {
    const char = characters.find(c => c.id === charId);
    const screen = document.getElementById('app-screen');
    screen.innerHTML = `
        <button onclick="renderView('chats')" style="background:none; border:none; color:#60a5fa; cursor:pointer; margin-bottom:12px; font-weight:600;">← Back</button>
        <h1 class="view-title">${char.name}</h1>
        <p class="view-subtitle">${char.role}</p>
        <div id="chat-messages" style="height: 310px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 12px; margin-bottom: 12px; display:flex; flex-direction:column; gap:8px;">
            <div style="background: rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 10px; max-width: 80%;">Hey. What's on your mind?</div>
        </div>
        <div style="display: flex; gap: 8px;">
            <input type="text" id="chat-input" placeholder="Message..." style="flex:1; padding: 10px; background: #0b0f19; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color:white; outline:none;">
            <button onclick="sendDM('${charId}')" class="btn-primary" style="width: auto; padding: 0 16px;">➤</button>
        </div>
    `;
}

async function sendDM(charId) {
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    const myName = getUserName();
    
    messages.innerHTML += `
        <div style="background: #2563eb; padding: 8px 12px; border-radius: 10px; max-width: 80%; align-self: flex-end;">
            <strong style="color:#93c5fd; display:block; font-size:11px;">${myName}</strong>
            ${text}
        </div>
    `;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    let apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        messages.innerHTML += `<div style="background: #ef4444; padding: 8px 12px; border-radius: 10px; max-width: 80%;">Error: API key required in Settings!</div>`;
        return;
    }

    const char = characters.find(c => c.id === charId);
    const typingId = 'typing-' + Date.now();
    messages.innerHTML += `<div id="${typingId}" style="background: rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 10px; max-width: 80%; color: #9ca3af;">${char.name} is typing...</div>`;
    messages.scrollTop = messages.scrollHeight;

    const replyText = await callGemini(char.systemPrompt, `User ${myName} says: "${text}"`);
    
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    messages.innerHTML += `<div style="background: rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 10px; max-width: 80%;"><strong>${char.name}:</strong> ${replyText}</div>`;
    messages.scrollTop = messages.scrollHeight;
    speakCharacterText(charId, replyText);
}

async function sendGroupMessage() {
    const input = document.getElementById('group-input');
    const messages = document.getElementById('group-messages');
    if (!input || !input.value.trim()) return;
    
    const myName = getUserName();
    const text = input.value.trim();
    
    messages.innerHTML += `
        <div style="background: #2563eb; padding: 8px 12px; border-radius: 10px; max-width: 85%; align-self: flex-end;">
            <strong style="color:#93c5fd; display:block; font-size:12px;">${myName} (You)</strong>
            ${text}
        </div>
    `;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    let apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) return;

    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    const typingId = 'group-typing-' + Date.now();
    messages.innerHTML += `<div id="${typingId}" style="background: rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 10px; max-width: 85%; color: #9ca3af;">${randomChar.name} is typing...</div>`;
    messages.scrollTop = messages.scrollHeight;

    const replyText = await callGemini(randomChar.systemPrompt, `You are in a group chat with the Eunjang crew. User ${myName} said: "${text}". Reply briefly in character to this group message.`);
    
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    messages.innerHTML += `
        <div style="background: rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 10px; max-width: 85%;">
            <strong style="color:#60a5fa; display:block; font-size:12px;">${randomChar.name}</strong>
            ${replyText}
        </div>
    `;
    messages.scrollTop = messages.scrollHeight;
}

async function callGemini(systemPrompt, userMessage) {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        return "API key missing in Settings.";
    }
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: `${systemPrompt}\n\nContext/Message: ${userMessage}` }] }
                ]
            })
        });
        const data = await response.json();
        console.log("Gemini API Response:", data);
        
        if (data.error) {
            return `API Error: ${data.error.message}`;
        }
        
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Error: Empty response.";
    } catch (e) {
        console.error("Fetch Connection error:", e);
        return "Connection error. Check internet.";
    }
}

// --- ГОЛОСОВЫЕ ЗВОНКИ С МИКРОФОНОМ И СТРОГО МУЖСКИМИ ГОЛОСАМИ ---
function startPersonalCall(charId) {
    const char = characters.find(c => c.id === charId);
    const screen = document.getElementById('app-screen');
    
    if (!localStorage.getItem('gemini_api_key')) {
        alert('Gemini API key is required in Settings for voice calls!');
        renderView('settings');
        return;
    }

    screen.innerHTML = `
        <div class="call-screen">
            <div>
                <p style="color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Live Voice Call</p>
                <h1 class="view-title" style="margin-top: 8px;">${char.name}</h1>
                <div class="call-timer" id="call-timer">00:00</div>
            </div>
            
            <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                <div class="call-avatar-pulse" id="call-avatar">${char.initial}</div>
                <p id="call-status-text" style="color: #d1d5db; font-size: 14px; margin-top: 10px; text-align: center; padding: 0 10px;">Connecting...</p>
                
                <div id="call-log" style="width: 100%; max-height: 140px; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 10px; padding: 8px; margin-top: 12px; font-size: 12px; text-align: left; display: flex; flex-direction: column; gap: 4px;">
                    <div style="color: #9ca3af;">Call connected. Tap mic and speak to ${char.name}.</div>
                </div>
            </div>

            <div style="display: flex; gap: 12px; width: 100%; justify-content: center; align-items: center;">
                <button id="mic-btn" onclick="toggleMic('${charId}')" style="background: #2563eb; color: white; border: none; width: 60px; height: 60px; border-radius: 50%; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.4);">🎙️</button>
                <button class="btn-danger" onclick="endCall()" style="padding: 14px 24px; border-radius: 30px;">End Call</button>
            </div>
        </div>
    `;

    startTimer();

    setTimeout(async () => {
        const greeting = `Hello, ${getUserName()}? This is ${char.name}. I'm listening.`;
        appendCallLog(char.name, greeting);
        speakCharacterText(charId, greeting, () => {
            const statusEl = document.getElementById('call-status-text');
            if (statusEl) statusEl.innerText = "Tap mic 🎙️ to speak";
        });
    }, 1500);
}

function toggleMic(charId) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser. Please use Google Chrome.");
        return;
    }

    if (isListening) {
        if (recognition) recognition.stop();
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        isListening = true;
        const statusEl = document.getElementById('call-status-text');
        const micBtn = document.getElementById('mic-btn');
        if (statusEl) statusEl.innerText = "Listening... Speak now 🎙️";
        if (micBtn) micBtn.style.background = "#ef4444";
    };

    recognition.onresult = async (event) => {
        const speechText = event.results[0][0].transcript;
        appendCallLog(getUserName(), speechText);
        
        const char = characters.find(c => c.id === charId);
        const statusEl = document.getElementById('call-status-text');
        if (statusEl) statusEl.innerText = `${char.name} is thinking...`;

        const reply = await callGemini(char.systemPrompt, `Voice call context. User ${getUserName()} said in voice: "${speechText}"`);
        
        appendCallLog(char.name, reply);
        if (statusEl) statusEl.innerText = `${char.name} is speaking...`;

        speakCharacterText(charId, reply, () => {
            if (statusEl) statusEl.innerText = "Tap mic 🎙️ to speak";
        });
    };

    recognition.onerror = () => {
        isListening = false;
        const statusEl = document.getElementById('call-status-text');
        const micBtn = document.getElementById('mic-btn');
        if (statusEl) statusEl.innerText = "Tap mic 🎙️ to try again";
        if (micBtn) micBtn.style.background = "#2563eb";
    };

    recognition.onend = () => {
        isListening = false;
        const micBtn = document.getElementById('mic-btn');
        if (micBtn) micBtn.style.background = "#2563eb";
    };

    try {
        recognition.start();
    } catch (e) {
        console.error("Recognition start error:", e);
        isListening = false;
    }
}

function appendCallLog(sender, text) {
    const log = document.getElementById('call-log');
    if (!log) return;
    log.innerHTML += `<div><strong>${sender}:</strong> ${text}</div>`;
    log.scrollTop = log.scrollHeight;
}

function speakCharacterTest(charId, text, onEndCallback) {
    speakCharacterText(charId, text, onEndCallback);
}

function speakCharacterText(charId, text, onEndCallback) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const char = characters.find(c => c.id === charId) || { pitch: 1.0, rate: 1.0 };
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = char.pitch;
        utterance.rate = char.rate;
        
        const voices = window.speechSynthesis.getVoices();
        const englishVoices = voices.filter(v => v.lang.includes('en') || v.lang.includes('US') || v.lang.includes('GB') || v.lang.includes('AU'));
        
        // Фильтруем женские голоса, оставляя только мужские
        const femaleKeywords = ['zira', 'hazel', 'victoria', 'samantha', 'karen', 'susan', 'jenny', 'aria', 'female', 'elena', 'catherine'];
        let maleVoices = englishVoices.filter(v => {
            const nameLower = v.name.toLowerCase();
            return !femaleKeywords.some(kw => nameLower.includes(kw));
        });

        const pool = maleVoices.length > 0 ? maleVoices : englishVoices;
        if (pool.length > 0) {
            const charIndex = characters.findIndex(c => c.id === charId);
            const voiceIndex = charIndex % pool.length;
            utterance.voice = pool[voiceIndex];
        }

        utterance.onend = () => {
            if (onEndCallback) onEndCallback();
        };

        window.speechSynthesis.speak(utterance);
    } else {
        if (onEndCallback) onEndCallback();
    }
}

function startTimer() {
    callSeconds = 0;
    const timerEl = document.getElementById('call-timer');
    activeCallTimer = setInterval(() => {
        callSeconds++;
        const mins = Math.floor(callSeconds / 60).toString().padStart(2, '0');
        const secs = (callSeconds % 60).toString().padStart(2, '0');
        if (timerEl) timerEl.innerText = `${mins}:${secs}`;
    }, 1000);
}

function endCall() {
    endCallInternal();
    renderView('calls');
}

function endCallInternal() {
    if (activeCallTimer) {
        clearInterval(activeCallTimer);
        activeCallTimer = null;
    }
    if (recognition) {
        try { recognition.stop(); } catch(e){}
        recognition = null;
    }
    isListening = false;
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

function saveSettings() {
    const keyInput = document.getElementById('api-key-input');
    const nameInput = document.getElementById('user-name-input');
    if (keyInput) localStorage.setItem('gemini_api_key', keyInput.value.trim());
    if (nameInput) localStorage.setItem('user_name', nameInput.value.trim());
    alert('Settings saved successfully!');
}

function getUserName() {
    return localStorage.getItem('user_name') || 'Diana';
}