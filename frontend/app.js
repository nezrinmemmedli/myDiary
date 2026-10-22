let currentUser = ""; // Daxil olan istifadəçinin adını tutmaq üçün

// --- GİRİŞ VƏ QEYDİYYAT SİSTEMİ ---
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authMessage = document.getElementById('authMessage');
const authScreen = document.getElementById('auth-screen');
const appContainer = document.querySelector('.app-container');

// Backend serverimizin ünvanı
const API_URL = 'http://localhost:3000';

// 1. QEYDİYYATDAN KEÇ DÜYMƏSİ
registerBtn.addEventListener('click', async () => {
    // Düyməyə basılan an yazılan mətni götürürük və boşluqları təmizləyirik (.trim())
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        authMessage.innerText = "Zəhmət olmasa ad və şifrə yazın!";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            authMessage.style.color = "green";
            authMessage.innerText = "Qeydiyyat uğurlu oldu! İndi 'Daxil ol' düyməsinə basa bilərsiniz.";
        } else {
            authMessage.style.color = "red";
            authMessage.innerText = data.error || "Xəta baş verdi";
        }
    } catch (error) {
        authMessage.style.color = "red";
        authMessage.innerText = "Serverlə əlaqə yoxdur. Terminalda server.js işləyir?";
    }
});

// 2. DAXİL OL DÜYMƏSİ
loginBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        authMessage.innerText = "Zəhmət olmasa ad və şifrə yazın!";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            currentUser = username; // İstifadəçini yadda saxlayırıq
            loadJournal(username);  // Əvvəlki gündlüyü bazadan yükləyirik
            authScreen.style.display = 'none'; 
            appContainer.style.display = 'block'; 
        } else {
            authMessage.style.color = "red";
            authMessage.innerText = data.error || "Ad və ya şifrə səhvdir";
        }
    } catch (error) {
        authMessage.style.color = "red";
        authMessage.innerText = "Serverlə əlaqə yoxdur. Terminalda server.js işləyir?";
    }
});

// --- FABRIC.JS VƏ KƏTAN (CANVAS) İNTERAKTİVLİYİ ---
const canvas = new fabric.Canvas('journalCanvas', {
    selection: true, 
    allowTouchScrolling: true 
});

// MƏTN ƏLAVƏ ET
const addTextBtn = document.getElementById('addTextBtn');
addTextBtn.addEventListener('click', () => {
    const text = new fabric.IText('Bura yazın...', {
        left: 50, top: 50, fontFamily: 'Segoe UI', fontSize: 20, fill: '#333333', transparentCorners: false, cornerColor: '#007bff'
    });
    canvas.add(text);
    canvas.setActiveObject(text);
});

// STİKER ƏLAVƏ ET
const addStickerBtn = document.getElementById('addStickerBtn');
addStickerBtn.addEventListener('click', () => {
    const imageUrl = 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png';
    fabric.Image.fromURL(imageUrl, (img) => {
        img.set({ left: 150, top: 150, scaleX: 0.15, scaleY: 0.15 });
        canvas.add(img);
        canvas.setActiveObject(img);
    }, { crossOrigin: 'anonymous' });
});

// --- SÜRÜKLƏMƏ FUNKSİYASI (VİDEO VƏ SPOTIFY ÜÇÜN) ---
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.onmousedown = function(e) {
        e.preventDefault();
        pos3 = e.clientX; pos4 = e.clientY;
        document.onmouseup = stopDragging; 
        document.onmousemove = dragElement; 
    };

    function dragElement(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
        pos3 = e.clientX; pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// SPOTIFY DÜYMƏSİ
const addSongBtn = document.getElementById('addSongBtn');
const canvasWrapper = document.querySelector('.canvas-wrapper');

addSongBtn.addEventListener('click', () => {
    const container = document.createElement('div');
    container.className = 'widget-container';
    container.style.top = '50px'; container.style.left = '50px';

    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.innerText = '••• Tutub Sürüşdür •••';

    const spotifyWidget = document.createElement('iframe');
    spotifyWidget.src = 'https://open.spotify.com/embed/track/7Ewz6bJ97vGqk8HdaU3dvE'; 
    spotifyWidget.width = '250'; spotifyWidget.height = '80';
    spotifyWidget.style.border = 'none'; spotifyWidget.allow = 'encrypted-media';

    container.appendChild(handle);
    container.appendChild(spotifyWidget);
    canvasWrapper.appendChild(container);

    makeDraggable(container, handle);
});

// VİDEO DÜYMƏSİ
const addVideoBtn = document.getElementById('addVideoBtn');
addVideoBtn.addEventListener('click', () => {
    const container = document.createElement('div');
    container.className = 'widget-container';
    container.style.top = '150px'; container.style.left = '100px';

    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.innerText = '••• Tutub Sürüşdür •••';

    const videoWidget = document.createElement('iframe');
    videoWidget.src = 'https://www.youtube.com/embed/jfKfPfyJRdk'; 
    videoWidget.width = '280'; videoWidget.height = '157';
    videoWidget.style.border = 'none'; videoWidget.allowFullscreen = true;

    container.appendChild(handle);
    container.appendChild(videoWidget);
    canvasWrapper.appendChild(container);

    makeDraggable(container, handle);
});

// --- YADDA SAXLA DÜYMƏSİ ---
const saveBtn = document.getElementById('saveBtn');

saveBtn.addEventListener('click', async () => {
    if (!currentUser) {
        alert("Zəhmət olmasa əvvəlcə sistemə daxil olun!");
        return;
    }

    const journalData = JSON.stringify(canvas.toJSON()); 

    try {
        const response = await fetch(`${API_URL}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentUser, data: journalData })
        });
        
        const result = await response.json();

        if (response.ok) {
            alert("Gündlüyünüz uğurla yadda saxlanıldı! 💾");
        } else {
            alert("Xəta: " + result.error);
        }
    } catch (error) {
        alert("Serverlə əlaqə yoxdur.");
    }
});

// --- GÜNDLÜYÜ BAZADAN YÜKLƏMƏK ÜÇÜN FUNKSİYA ---
async function loadJournal(username) {
    try {
        const response = await fetch(`${API_URL}/load/${username}`);
        const result = await response.json();

        if (response.ok && result.data) {
            canvas.loadFromJSON(result.data, () => {
                canvas.renderAll();
            });
        }
    } catch (error) {
        console.error("Gündlük yüklənərkən xəta:", error);
    }
}