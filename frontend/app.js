
// 1. Fabric.js kətanını yaradarkən interaktivliyi mütləq bura yazırıq:
const canvas = new fabric.Canvas('journalCanvas', {
    selection: true, // Kətandakı obyektləri seçə bilmək üçün
    allowTouchScrolling: true // Mobil və toxunuşlar üçün
});

// 2. HTML-dəki "Mətn Əlavə Et" düyməsini tapırıq
const addTextBtn = document.getElementById('addTextBtn');

// 3. Düyməyə klikləndikdə nə baş verəcəyini yazırıq
addTextBtn.addEventListener('click', () => {
    // Fabric.js ilə interaktiv bir mətn qutusu yaradırıq
    const text = new fabric.IText('Bura yazın...', {
        left: 50,               // Vərəqin solundan 50 piksel aralı
        top: 50,                // Vərəqin yuxarısından 50 piksel aralı
        fontFamily: 'Segoe UI', // Şriftin növü
        fontSize: 20,           // Şriftin ölçüsü
        fill: '#333333',        // Mətnin rəngi (tünd boz)
        transparentCorners: false, // Seçim künclərinin dizaynı
        cornerColor: '#007bff'
    });

    // Yaratdığımız mətni kətana (vərəqə) əlavə edirik
    canvas.add(text);
    
    // Mətn yaranan kimi avtomatik seçili (aktiv) vəziyyətdə olsun
    canvas.setActiveObject(text);
});

const addStickerBtn = document.getElementById('addStickerBtn');

addStickerBtn.addEventListener('click', () => {
    // Daha etibarlı bir ulduz şəklinin linki
    const imageUrl = 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png';

    // crossOrigin: 'anonymous' sətri brauzerə şəkli təhlükəsiz yükləməyə icazə verir
    fabric.Image.fromURL(imageUrl, (img) => {
        img.set({
            left: 150,      
            top: 150,       
            scaleX: 0.15,   // Şəkil böyük olduğu üçün ölçüsünü kiçildiririk
            scaleY: 0.15    
        });
        
        canvas.add(img);
        canvas.setActiveObject(img);
    }, { crossOrigin: 'anonymous' });
});


   

// --- SÜRÜKLƏMƏ FUNKSİYASI ---
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    // Siçanla tutqacın üzərinə basıldıqda işə düşür
    handle.onmousedown = function(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = stopDragging; // Siçanı buraxanda
        document.onmousemove = dragElement; // Siçanı hərəkət etdirəndə
    };

    function dragElement(e) {
        e.preventDefault();
        // Yeni koordinatları hesablayırıq
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Elementin yerini dəyişirik
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function stopDragging() {
        // Sürükləməni dayandırırıq
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// --- SPOTIFY DÜYMƏSİ ---
const addSongBtn = document.getElementById('addSongBtn');
const canvasWrapper = document.querySelector('.canvas-wrapper');

addSongBtn.addEventListener('click', () => {
    // 1. Ana çərçivə yaradırıq
    const container = document.createElement('div');
    container.className = 'widget-container';
    container.style.top = '50px';
    container.style.left = '50px';

    // 2. Tutqac yaradırıq
    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.innerText = '••• Tutub Sürüşdür •••';

    // 3. Spotify iframe-ni yaradırıq
    const spotifyWidget = document.createElement('iframe');
    spotifyWidget.src = 'https://open.spotify.com/embed/track/7Ewz6bJ97vGqk8HdaU3dvE'; 
    spotifyWidget.width = '250';
    spotifyWidget.height = '80';
    spotifyWidget.style.border = 'none';
    spotifyWidget.allow = 'encrypted-media';

    // Elementləri bir-birinin içinə yığırıq
    container.appendChild(handle);
    container.appendChild(spotifyWidget);
    canvasWrapper.appendChild(container);

    // Yaratdığımız Sürükləmə funksiyasını bu pleyerə tətbiq edirik
    makeDraggable(container, handle);
});

// --- VİDEO DÜYMƏSİ ---
const addVideoBtn = document.getElementById('addVideoBtn');

addVideoBtn.addEventListener('click', () => {
    const container = document.createElement('div');
    container.className = 'widget-container';
    container.style.top = '150px';
    container.style.left = '100px';

    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.innerText = '••• Tutub Sürüşdür •••';

    const videoWidget = document.createElement('iframe');
    videoWidget.src = 'https://www.youtube.com/embed/jfKfPfyJRdk'; 
    videoWidget.width = '280';
    videoWidget.height = '157';
    videoWidget.style.border = 'none';
    videoWidget.allowFullscreen = true;

    container.appendChild(handle);
    container.appendChild(videoWidget);
    canvasWrapper.appendChild(container);

    makeDraggable(container, handle);
});