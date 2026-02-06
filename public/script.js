// ========================================
// KONFIGURÁCIA - TU PRIDAJ SVOJE FOTKY
// ========================================
/*
const galleryImages = [
    { src: 'Obrázok3.jpg', title: 'Štart – Čilejkárska desina' },
    { src: 'images/foto2.jpg', title: 'Trať – Tekov' },
    { src: 'images/foto3.jpg', title: 'Cieľ – atmosféra' },
    { src: 'images/foto4.jpg', title: 'Medaila – folklórny motív' },
    { src: 'images/foto5.jpg', title: 'Bežci na trati' },
    { src: 'images/foto6.jpg', title: 'Detské behy' },
    { src: 'images/foto7.jpg', title: 'Vyhodnotenie' },
    { src: 'images/foto8.jpg', title: 'Ocenenia' },

];
*/
// ========================================
// HLAVNÝ DOM CONTENT LOADED
// ========================================
document.addEventListener('DOMContentLoaded', function() {

    // ====== DRAWER FUNCTIONALITY ======
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const overlay = document.getElementById('overlay');
    const drawer = document.getElementById('drawer');

    function openDrawer() {
        if (drawer) {
            drawer.classList.remove('translate-x-full');
            overlay?.classList.remove('hidden');
            menuBtn?.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeDrawer() {
        if (drawer) {
            drawer.classList.add('translate-x-full');
            overlay?.classList.add('hidden');
            menuBtn?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
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

    // ========================================
    // GENEROVANIE GALÉRIE
    // ========================================
    const gallery = document.getElementById('gallery');

    if (gallery) {
        // Vygeneruj HTML pre každú fotku
        galleryImages.forEach((image, index) => {
            const figure = document.createElement('figure');
            figure.className = 'tile';
            figure.setAttribute('data-full', image.src);
            figure.setAttribute('data-title', image.title);

            figure.innerHTML = `
                <img src="${image.src}" alt="${image.title}" loading="lazy">
                <figcaption class="caption">
                    <span>${image.title}</span>
                    <span>⤢</span>
                </figcaption>
            `;

            gallery.appendChild(figure);
        });
    }

    // ========================================
    // LIGHTBOX FUNKCIONALITA
    // ========================================
    const lightbox = document.getElementById('lightbox');

    if (lightbox) {
        const lbImg = document.getElementById('lbImg');
        const lbTitle = document.getElementById('lbTitle');
        const lbMeta = document.getElementById('lbMeta');
        const lbClose = document.getElementById('lbClose');
        const lbPrev = document.getElementById('lbPrev');
        const lbNext = document.getElementById('lbNext');
        const lbStage = document.getElementById('lbStage');

        const tiles = Array.from(document.querySelectorAll('.tile'));
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        // Funkcia na otvorenie lightboxu
        function openLightbox(index) {
            currentIndex = index;
            updateLightbox();
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        // Funkcia na zatvorenie lightboxu
        function closeLightbox() {
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        // Funkcia na aktualizáciu obsahu lightboxu
        function updateLightbox() {
            const tile = tiles[currentIndex];
            if (!tile) return;

            const fullSrc = tile.dataset.full;
            const title = tile.dataset.title;

            lbImg.src = fullSrc;
            lbImg.alt = title;
            lbTitle.textContent = title;
            lbMeta.textContent = `${currentIndex + 1} / ${tiles.length}`;

            // Aktualizuj tlačidlá
            lbPrev.disabled = currentIndex === 0;
            lbNext.disabled = currentIndex === tiles.length - 1;
        }

        // Predchádzajúca fotka
        function prevImage() {
            if (currentIndex > 0) {
                currentIndex--;
                updateLightbox();
            }
        }

        // Ďalšia fotka
        function nextImage() {
            if (currentIndex < tiles.length - 1) {
                currentIndex++;
                updateLightbox();
            }
        }

        // Event listenery na kartičky
        tiles.forEach((tile, index) => {
            tile.addEventListener('click', () => openLightbox(index));
        });

        // Zatvorenie lightboxu
        lbClose?.addEventListener('click', closeLightbox);

        // Klik mimo obrázka
        lbStage?.addEventListener('click', (e) => {
            if (e.target === lbStage) {
                closeLightbox();
            }
        });

        // Navigácia
        lbPrev?.addEventListener('click', prevImage);
        lbNext?.addEventListener('click', nextImage);

        // Klávesnica
        document.addEventListener('keydown', (e) => {
            if (lightbox.getAttribute('aria-hidden') === 'false') {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    prevImage();
                } else if (e.key === 'ArrowRight') {
                    nextImage();
                }
            }
        });

        // Touch/swipe podpora pre mobil
        lbStage?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        lbStage?.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next image
                    nextImage();
                } else {
                    // Swipe right - previous image
                    prevImage();
                }
            }
        }
    }

});