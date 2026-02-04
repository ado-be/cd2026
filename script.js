// ====== DRAWER FUNCTIONALITY ======
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const overlay = document.getElementById('overlay');
const drawer = document.getElementById('drawer');

function openDrawer() {
    drawer.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    menuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    drawer.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

menuBtn?.addEventListener('click', openDrawer);
closeBtn?.addEventListener('click', closeDrawer);
overlay?.addEventListener('click', closeDrawer);

document.querySelectorAll('.drawerLink').forEach(a => {
    a.addEventListener('click', () => closeDrawer());
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
});

// ====== REVEAL ON SCROLL ======
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    }
);

const reveals = document.querySelectorAll('.reveal');
reveals.forEach(reveal => {
    revealObserver.observe(reveal);
});