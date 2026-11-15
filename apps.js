// MIDNIGHT CHAMPAGNE - Core Application Logic

let activeTab = 'chats';
let currentApiKey = localStorage.getItem('midnight_api_key') || '';

document.addEventListener('DOMContentLoaded', () => {
  // Load saved API key into settings input if present
  const keyInput = document.getElementById('api-key-input');
  if (keyInput && currentApiKey) {
    keyInput.value = currentApiKey;
  }

  // Setup Save Key button listener
  const saveBtn = document.getElementById('save-key-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const val = document.getElementById('api-key-input').value.trim();
      if (val) {
        localStorage.setItem('midnight_api_key', val);
        currentApiKey = val;
        alert('API Key successfully saved!');
      } else {
        alert('Please enter a valid API key.');
      }
    });
  }

  renderChats();
  renderFeed();
  renderCalls();
});

// Tab Navigation Logic
function switchTab(tabName, element) {
  activeTab = tabName;
  
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  
  // Show target screen
  const targetScreen = document.getElementById(`screen-${tabName}`);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
  }

  // Update nav buttons style
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  if (element) {
    element.classList.add('active');
  }
}

// 1. Render Chats List
function renderChats() {
  const container = document.getElementById('chats-list');
  if (!container) return;
  
  container.innerHTML = '';
  CHARACTERS.forEach(char => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.cssText = 'display: flex; align-items: center; gap: 14px; cursor: pointer; transition: transform 0.2s;';
    card.innerHTML = `
      <div style="width: 50px; height: 50px; border-radius: 50%; background: var(--black-tie); display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--champagne); border: 1px solid var(--border-gold);">
        ${char.name.charAt(0)}
      </div>
      <div style="flex: 1;">
        <h4 style="font-size: 16px; color: var(--pearl);">${char.name}</h4>
        <p style="font-size: 12px; opacity: 0.6; margin-top: 2px;">${char.status}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// 2. Render Feed Posts
function renderFeed() {
  const container = document.getElementById('feed-container');
  if (!container) return;

  const mockPosts = [
    { author: 'Ahn Su-ho', time: '10m ago', text: 'Anyone wanna grab some late night snacks? Class was boring as usual.' },
    { author: 'Yeon Si-eun', time: '1h ago', text: 'Leave me alone. I am studying.' },
    { author: 'Park Hu-min', time: '3h ago', text: 'Eunjang is quiet tonight. Let’s keep it that way.' }
  ];

  container.innerHTML = '';
  mockPosts.forEach(post => {
    const postCard = document.createElement('div');
    postCard.className = 'glass-card';
    postCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-weight: 600; color: var(--champagne);">${post.author}</span>
        <span style="font-size: 11px; opacity: 0.5;">${post.time}</span>
      </div>
      <p style="font-size: 14px; line-height: 1.4; opacity: 0.9;">${post.text}</p>
    `;
    container.appendChild(postCard);
  });
}

// 3. Render Calls Grid
function renderCalls() {
  const container = document.getElementById('calls-grid');
  if (!container) return;

  container.innerHTML = '';
  CHARACTERS.forEach(char => {
    const callCard = document.createElement('div');
    callCard.className = 'glass-card';
    callCard.style.cssText = 'display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: 20px 12px;';
    callCard.innerHTML = `
      <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--black-tie); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; color: var(--champagne); border: 1px solid var(--border-gold);">
        ${char.name.charAt(0)}
      </div>
      <div>
        <h4 style="font-size: 14px; color: var(--pearl);">${char.name}</h4>
        <p style="font-size: 11px; opacity: 0.5; margin-top: 2px;">Secure Line</p>
      </div>
      <button class="btn-champagne" style="width: 100%; padding: 8px; font-size: 12px; margin-top: 4px;" onclick="alert('Initiating secure voice call with ${char.name}...')">Call</button>
    `;
    container.appendChild(callCard);
  });
}