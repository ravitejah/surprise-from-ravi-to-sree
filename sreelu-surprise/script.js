// --- DATA: The Content for Each Day ---
const days = [
    { date: "Feb 7", title: "Rose Day 🌹", msg: "Like this crystal rose, my love for you is rare and forever glowing.", image: "assets/day1.png" },
    { date: "Feb 8", title: "Propose Day 💍", msg: "A ring is a circle with no end. That's how long I want to be yours.", image: "assets/day2.png" },
    { date: "Feb 9", title: "Chocolate Day 🍫", msg: "You are sweeter, richer, and more addictive than any chocolate in the galaxy.", image: "assets/day3.png" },
    { date: "Feb 10", title: "Teddy Day 🧸", msg: "Sending you a holographic hug that never fades. You're my comfort.", image: "assets/day4.png" },
    { date: "Feb 11", title: "Promise Day 🤞", msg: "I promise to be your partner in crime, your safe space, and your biggest fan.", image: "assets/day5.png" },
    { date: "Feb 12", title: "Hug Day 🫂", msg: "If I could, I'd teleport to you right now for the biggest hug ever.", image: "assets/day6.png" },
    { date: "Feb 13", title: "Kiss Day 💋", msg: "Saving all my cosmic kisses just for you, my Sree Baby.", image: "assets/day7.png" }
];

let currentIndex = 0;

// --- 0. PRELOADER (Fixes flickering) ---
// This downloads all images in the background as soon as the site opens
function preloadImages() {
    days.forEach(day => {
        const img = new Image();
        img.src = day.image;
    });
    new Image().src = "assets/finale.png";
}
preloadImages(); // Run immediately

// --- 1. LOGIN LOGIC ---
function checkLogin() {
    const input = document.getElementById('nickname-input');
    const val = input.value.toLowerCase().trim();
    
    if (val.startsWith('rt')) {
        const loginScreen = document.getElementById('login-screen');
        loginScreen.style.opacity = '0';
        setTimeout(() => {
            loginScreen.classList.add('hidden');
            const mainScreen = document.getElementById('main-screen');
            mainScreen.classList.remove('hidden');
            loadDay(0);
        }, 500);
    } else {
        const error = document.getElementById('error-msg');
        error.classList.remove('hidden');
        input.classList.add('shake');
        setTimeout(() => {
            error.classList.add('hidden');
            input.classList.remove('shake');
        }, 2000);
    }
}

// --- 2. JOURNEY LOGIC (Smoother Transition) ---
function loadDay(index) {
    const data = days[index];
    const contentArea = document.getElementById('content-area');
    const img = document.getElementById('day-image');

    // Step A: Hide current content
    contentArea.style.opacity = '0';
    
    // Step B: Wait for fade out (500ms), then load new data
    setTimeout(() => {
        document.getElementById('day-header').innerText = data.date;
        document.getElementById('day-title').innerText = data.title;
        document.getElementById('day-msg').innerText = data.msg;
        
        // Start loading the new image
        img.src = data.image;

        // Define what happens when image is ready
        const showContent = () => {
            contentArea.style.opacity = '1'; // Show only when ready
            img.classList.remove('fade-in');
            void img.offsetWidth; // Trigger reflow
            img.classList.add('fade-in');
        };

        // Check if image is already loaded (from cache) or needs to wait
        if (img.complete) {
            showContent();
        } else {
            img.onload = showContent;
        }

    }, 500); // This matches the CSS transition time

    // Update Progress Bar
    const progress = ((index + 1) / days.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;

    // Handle Buttons
    document.getElementById('prev-btn').classList.toggle('hidden', index === 0);
    
    const nextBtn = document.getElementById('next-btn');
    if (index === days.length - 1) {
        nextBtn.innerHTML = "The Final Question... ❤️";
        nextBtn.onclick = showProposal;
    } else {
        nextBtn.innerHTML = "Next Surprise >";
        nextBtn.onclick = nextDay;
    }
}

function nextDay() {
    if (currentIndex < days.length - 1) {
        currentIndex++;
        loadDay(currentIndex);
    }
}

function prevDay() {
    if (currentIndex > 0) {
        currentIndex--;
        loadDay(currentIndex);
    }
}

// --- 3. PROPOSAL LOGIC ---
function showProposal() {
    const mainScreen = document.getElementById('main-screen');
    mainScreen.style.opacity = '0';
    setTimeout(() => {
        mainScreen.classList.add('hidden');
        const proposalScreen = document.getElementById('proposal-screen');
        proposalScreen.classList.remove('hidden');
    }, 500);
}

// --- 4. THE RUNAWAY 'NO' BUTTON GAME ---
function moveNoButton() {
    const btn = document.getElementById('no-btn');
    const container = document.querySelector('.proposal-card');
    
    // Switch to absolute positioning on first interact
    if (!btn.classList.contains('running')) {
        btn.classList.add('running');
    }

    const maxX = container.clientWidth - btn.offsetWidth - 20;
    const maxY = container.clientHeight - btn.offsetHeight - 20;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    btn.style.left = `${randomX}px`;
    btn.style.top = `${randomY}px`;
}

// Attach Event Listeners for Runaway Button
const noBtn = document.getElementById('no-btn');
noBtn.addEventListener('mouseover', moveNoButton); // Desktop
noBtn.addEventListener('click', moveNoButton);     // Backup
noBtn.addEventListener('touchstart', (e) => {      // Mobile
    e.preventDefault();
    moveNoButton();
});

// --- 5. SUCCESS FINALE ---
function handleYes() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff00cc', '#3333ff', '#ffd700'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff00cc', '#3333ff', '#ffd700'] });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
    
    setTimeout(() => {
        document.getElementById('success-modal').classList.add('visible');
    }, 500);
}