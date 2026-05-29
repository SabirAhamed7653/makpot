// Mock data for chats
const mockChats = [
    {
        id: 1,
        name: 'John Doe',
        lastMessage: 'Hey! How are you?',
        timestamp: '2:30 PM',
        unread: 2,
        online: true,
        messages: [
            { type: 'received', text: 'Hi there!', time: '1:15 PM' },
            { type: 'received', text: 'How are you doing?', time: '1:16 PM' },
            { type: 'sent', text: 'I\'m good, thanks for asking!', time: '1:20 PM' },
            { type: 'received', text: 'Hey! How are you?', time: '2:30 PM' }
        ]
    },
    {
        id: 2,
        name: 'Sarah Williams',
        lastMessage: 'See you tomorrow! 👋',
        timestamp: '12:45 PM',
        unread: 0,
        online: true,
        messages: [
            { type: 'received', text: 'The project is looking great!', time: '11:30 AM' },
            { type: 'sent', text: 'Thanks! Just finished the final touches', time: '11:45 AM' },
            { type: 'received', text: 'See you tomorrow! 👋', time: '12:45 PM' }
        ]
    },
    {
        id: 3,
        name: 'Mike Johnson',
        lastMessage: 'Thanks! 🙌',
        timestamp: 'Yesterday',
        unread: 0,
        online: false,
        messages: [
            { type: 'sent', text: 'Can you help me with the presentation?', time: 'Yesterday' },
            { type: 'received', text: 'Sure, what do you need?', time: 'Yesterday' },
            { type: 'sent', text: 'I need help organizing the slides', time: 'Yesterday' },
            { type: 'received', text: 'Thanks! 🙌', time: 'Yesterday' }
        ]
    },
    {
        id: 4,
        name: 'Team Group',
        lastMessage: 'Great work everyone! 💪',
        timestamp: '3 days ago',
        unread: 5,
        online: null,
        messages: [
            { type: 'received', text: 'Let\'s sync up tomorrow', time: '3 days ago' },
            { type: 'sent', text: 'Sure, what time works?', time: '3 days ago' },
            { type: 'received', text: 'Great work everyone! 💪', time: '3 days ago' }
        ]
    },
    {
        id: 5,
        name: 'Design Team',
        lastMessage: 'Love the new design! ✨',
        timestamp: 'Last week',
        unread: 0,
        online: true,
        messages: [
            { type: 'received', text: 'Check out the new mockups', time: 'Last week' },
            { type: 'sent', text: 'These look amazing!', time: 'Last week' },
            { type: 'received', text: 'Love the new design! ✨', time: 'Last week' }
        ]
    }
];

// Emoji list
const emojis = ['😀', '😂', '😍', '🥰', '😘', '😭', '😢', '😡', '😱', '😎', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉', '🎊', '🙌', '👏', '🤝', '💪', '🚀', '✨', '⭐', '🌟', '💫', '🎁', '🎈', '🎀', '🌈', '☀️', '🌙', '⭐', '✌️', '👌'];

// State management
let selectedChatId = null;
let allChats = JSON.parse(JSON.stringify(mockChats)); // Deep copy

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderChatList();
    setupEventListeners();
    initializeEmojiPicker();
});

// Render chat list
function renderChatList() {
    const chatListEl = document.getElementById('chatList');
    chatListEl.innerHTML = '';

    allChats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${selectedChatId === chat.id ? 'active' : ''}`;
        
        const unreadClass = chat.unread > 0 ? 'unread' : '';
        const statusIndicator = chat.online !== null ? `<span class="status-indicator ${chat.online ? 'online' : 'offline'}"></span>` : '';
        const unreadBadge = chat.unread > 0 ? `<span class="unread-badge">${chat.unread}</span>` : '';

        chatItem.innerHTML = `
            <div class="chat-avatar">${chat.name.charAt(0).toUpperCase()}</div>
            <div class="chat-content">
                <div class="chat-header-row">
                    <div class="chat-name">${chat.name}</div>
                    <div class="chat-time">${chat.timestamp}</div>
                </div>
                <div class="chat-preview ${unreadClass}">
                    ${chat.lastMessage}
                    ${unreadBadge}
                </div>
            </div>
        `;

        chatItem.addEventListener('click', () => selectChat(chat.id));
        chatListEl.appendChild(chatItem);
    });
}

// Select a chat
function selectChat(chatId) {
    selectedChatId = chatId;
    const chat = allChats.find(c => c.id === chatId);

    // Update UI
    document.getElementById('chatName').textContent = chat.name;
    const statusText = chat.online !== null ? (chat.online ? 'Online' : 'Offline') : 'Group chat';
    document.getElementById('chatStatus').textContent = statusText;
    document.getElementById('inputArea').style.display = 'flex';

    // Mark as read
    chat.unread = 0;
    renderChatList();

    // Render messages
    renderMessages(chatId);
}

// Render messages for selected chat
function renderMessages(chatId) {
    const messagesContainer = document.getElementById('messagesContainer');
    const chat = allChats.find(c => c.id === chatId);

    messagesContainer.innerHTML = '';

    chat.messages.forEach(msg => {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${msg.type}`;
        
        const checkMark = msg.type === 'sent' ? '<span class="message-check">✓✓</span>' : '';
        
        messageEl.innerHTML = `
            <div style="display: flex; align-items: flex-end;">
                <div class="message-content">${msg.text}</div>
                <div class="message-time">${msg.time}${checkMark}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageEl);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message || !selectedChatId) return;

    const chat = allChats.find(c => c.id === selectedChatId);
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Add message
    chat.messages.push({
        type: 'sent',
        text: message,
        time: time
    });

    // Update last message
    chat.lastMessage = message;
    chat.timestamp = time;

    // Clear input
    input.value = '';
    
    // Simulate response after 1 second
    setTimeout(() => {
        const responses = [
            'That sounds great! 😊',
            'I totally agree! 👍',
            'Let me think about it...',
            'Haha, that\'s funny! 😂',
            'Absolutely! 💯',
            'Cool, let me know more!',
            'Thanks for letting me know! 🙌',
            'I\'m on it! 🚀'
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        chat.messages.push({
            type: 'received',
            text: randomResponse,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        });

        renderMessages(selectedChatId);
    }, 1000);

    renderChatList();
    renderMessages(selectedChatId);
}

// Setup event listeners
function setupEventListeners() {
    // Send message on button click
    document.getElementById('sendBtn').addEventListener('click', sendMessage);

    // Send message on Enter key
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const chatItems = document.querySelectorAll('.chat-item');

        chatItems.forEach(item => {
            const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
            const chatPreview = item.querySelector('.chat-preview').textContent.toLowerCase();
            
            if (chatName.includes(query) || chatPreview.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Emoji button
    document.querySelector('.emoji-btn').addEventListener('click', () => {
        document.getElementById('emojiPickerModal').classList.toggle('show');
    });

    // Close emoji picker
    document.querySelector('.emoji-header .close-btn').addEventListener('click', () => {
        document.getElementById('emojiPickerModal').classList.remove('show');
    });

    // Close emoji picker when clicking outside
    document.getElementById('emojiPickerModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('emojiPickerModal')) {
            document.getElementById('emojiPickerModal').classList.remove('show');
        }
    });

    // Attachment button (placeholder)
    document.querySelector('.attachment-btn').addEventListener('click', () => {
        alert('Attachment feature: Select files, images, or videos');
    });

    // New chat button
    document.querySelector('.icon-btn').addEventListener('click', () => {
        alert('New chat feature: Start a new conversation');
    });

    // Menu button
    document.querySelector('.menu-btn').addEventListener('click', () => {
        alert('Menu options: Settings, Archived chats, Starred messages, etc.');
    });

    // Call buttons in chat header
    const callBtns = document.querySelectorAll('.chat-header .icon-btn');
    callBtns[0].addEventListener('click', () => {
        if (selectedChatId) {
            alert(`Calling ${allChats.find(c => c.id === selectedChatId).name}...`);
        }
    });

    callBtns[1].addEventListener('click', () => {
        if (selectedChatId) {
            alert(`Starting video call with ${allChats.find(c => c.id === selectedChatId).name}...`);
        }
    });

    callBtns[2].addEventListener('click', () => {
        if (selectedChatId) {
            alert(`Opening info for ${allChats.find(c => c.id === selectedChatId).name}`);
        }
    });
}

// Initialize emoji picker
function initializeEmojiPicker() {
    const emojiGrid = document.getElementById('emojiGrid');
    
    emojis.forEach(emoji => {
        const emojiItem = document.createElement('button');
        emojiItem.className = 'emoji-item';
        emojiItem.textContent = emoji;
        emojiItem.type = 'button';

        emojiItem.addEventListener('click', () => {
            const input = document.getElementById('messageInput');
            input.value += emoji;
            input.focus();
            document.getElementById('emojiPickerModal').classList.remove('show');
        });

        emojiGrid.appendChild(emojiItem);
    });
}

// Auto-adjust message input height
document.getElementById('messageInput').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
});
