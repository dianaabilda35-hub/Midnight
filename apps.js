document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let activeCallTimer = null;
let callSeconds = 0;

function initApp() {
    setupNavigation();
    renderView('chats');
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
            <p class="view-subtitle">Recent updates from characters</p>
            <div id="feed-list"></div>
        `;
        renderFeed();
    } else if (tab === 'calls') {
        screen.innerHTML = `
            <h1 class="view-title">Voice Calls</h1>
            <p class="view-subtitle">Select contact or start conference</p>
            <button class="btn-primary" style="margin-bottom: 16px;" onclick="startGroupCall()">📞 Start Group Conference</button>
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
        <div class="card" style="display: flex; align-items: center; gap: 14px;" onclick="openChat('${char.id}')">
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
        <div class="card" style="display: flex; align-items: center; justify-content: space-between;" onclick="startPersonalCall('${char.id}')">
            <div style="display: flex; align-items: center; gap: 14px;">
                <div class="char-avatar">${char.initial}</div>
                <div>
                    <h3 style="font-size: 16px; color: #fff; margin-bottom: 2px;">${char.name}</h3>
                    <p style="font-size: 13px; color: #9ca3af;">Audio line active</p>
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
        </div>
    `).join('');
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

function sendDM(charId) {
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
    
    let apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        messages.innerHTML += `<div style="background: #ef4444; padding: 8px 12px; border-radius: 10px; max-width: 80%;">Error: API key required in Settings!</div>`;
        return;
    }

    setTimeout(() => {
        const char = characters.find(c => c.id === charId);
        const replyText = `[${char.name}]: I'm listening. Go on.`;
        messages.innerHTML += `<div style="background: rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 10px; max-width: 80%;">${replyText}</div>`;
        messages.scrollTop = messages.scrollHeight;
        speakText(replyText);
    }, 800);
}

function sendGroupMessage() {
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
}

function startPersonalCall(charId) {
    const char = characters.find(c => c.id === charId);
    const screen = document.getElementById('app-screen');
    
    if (!localStorage.getItem('gemini_api_key')) {
        alert('Gemini API key is required in Settings for voice calls!');
        return;
    }

    screen.innerHTML = `
        <div class="call-screen">
            <div>
                <p style="color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Direct Audio Call</p>
                <h1 class="view-title" style="margin-top: 8px;">${char.name}</h1>
                <div class="call-timer" id="call-timer">Connecting...</div>
            </div>
            
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div class="call-avatar-pulse">${char.initial}</div>
                <p id="call-status-text" style="color: #d1d5db; font-size: 14px; margin-top: 10px;">Calling...</p>
            </div>

            <button class="btn-danger" onclick="endCall()">End Call</button>
        </div>
    `;

    startTimer();

    setTimeout(() => {
        document.getElementById('call-status-text').innerText = 'Call Active';
        const greeting = `Hello, ${getUserName()}? This is ${char.name}. I'm listening.`;
        speakText(greeting);
    }, 2000);
}

function startGroupCall() {
    if (!localStorage.getItem('gemini_api_key')) {
        alert('Gemini API key is required in Settings for voice calls!');
        return;
    }

    const screen = document.getElementById('app-screen');
    screen.innerHTML = `
        <div class="call-screen">
            <div>
                <p style="color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Group Conference</p>
                <h1 class="view-title" style="margin-top: 8px;">Eunjang Crew</h1>
                <div class="call-timer" id="call-timer">Connecting...</div>
            </div>
            
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div class="call-avatar-pulse" style="background: #10b981;">👥</div>
                <p id="call-status-text" style="color: #d1d5db; font-size: 14px; margin-top: 10px;">All members on line (8 participants)...</p>
            </div>

            <button class="btn-danger" onclick="endCall()">Leave Conference</button>
        </div>
    `;

    startTimer();

    setTimeout(() => {
        document.getElementById('call-status-text').innerText = 'Conference Active';
        const greeting = "Hey everyone, group line is open!";
        speakText(greeting);
    }, 2000);
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
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
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