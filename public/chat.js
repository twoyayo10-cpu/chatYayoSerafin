// cliente
const socket = io('http://3.137.157.107:9000');

// elementos
const loginCard = document.getElementById('loginCard');
const nameInput = document.getElementById('nameInput');
const enterBtn = document.getElementById('enterBtn');

const chatWrap = document.getElementById('chatWrap');
const messagesEl = document.getElementById('messages');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

let myName = null;

// helper para agregar mensaje al DOM
function appendMessage({ user, text, time }, opts = {}) {
  const div = document.createElement('div');
  if (opts.system) {
    div.className = 'system';
    div.textContent = text;
  } else {
    div.className = 'msg';
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${user} · ${time}`;
    const body = document.createElement('div');
    body.textContent = text;
    div.appendChild(meta);
    div.appendChild(body);
  }
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Entrar al chat
enterBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }
  myName = name;
  socket.emit('join', myName);

  // cambiar vista
  loginCard.classList.add('hidden');
  chatWrap.classList.remove('hidden');
  msgInput.focus();
});

// enviar mensaje
function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;
  socket.emit('chat message', text);
  msgInput.value = '';
  msgInput.focus();
}
sendBtn.addEventListener('click', sendMessage);
msgInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// recibir mensajes del servidor
socket.on('chat message', (payload) => {
  appendMessage(payload);
});

socket.on('system message', (txt) => {
  appendMessage({ user: '', text: txt, time: new Date().toLocaleTimeString() }, { system: true });
});
