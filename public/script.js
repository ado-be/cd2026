// ========================================
// KONFIGURÁCIA – GALÉRIA (TU PRIDAJ SVOJE FOTKY)
// ========================================
const galleryImages = [
    // { src: 'Obrázok3.jpg', title: 'Štart – Čilejkárska desina' },
    // { src: 'images/foto2.jpg', title: 'Trať – Tekov' },
];

// ========================================
// KONFIGURÁCIA – MAPY (GPX + Mapy.com linky)
// ========================================
const ROUTES = {
    "10k": {
        label: "10 km – hlavná trať",
        gpx: "./export.gpx",
        openUrl: "https://mapy.com/s/kohogohuma",
        // color: "#e91e8c"  // ak chceš neskôr odlíšiť farbou
    },
    "5k": {
        label: "5 km – kratšia trať",
        gpx: "./export2.gpx",
        openUrl: "https://mapy.com/s/XXXXX", // doplň svoj 5k link
        // color: "#4a90e2"
    }
};

// ========================================
// COUNTDOWN – cieľový čas
// ========================================
function initCountdown() {
    const target = new Date(2026, 4, 2, 9, 0, 0); // 2.5.2026 09:00 (month 0-index)

    const elDays = document.getElementById("cd-days");
    const elHours = document.getElementById("cd-hours");
    const elMins = document.getElementById("cd-mins");
    const elSecs = document.getElementById("cd-secs");
    const elNote = document.getElementById("cd-note");

    if (!elDays || !elHours || !elMins || !elSecs) return;

    const pad2 = (n) => String(n).padStart(2, "0");

    function tick() {
        const now = new Date();
        let diff = target.getTime() - now.getTime();

        if (diff <= 0) {
            elDays.textContent = "0";
            elHours.textContent = "00";
            elMins.textContent = "00";
            elSecs.textContent = "00";
            if (elNote) elNote.textContent = "Dnes je deň pretekov! 🎉";
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        elDays.textContent = String(days);
        elHours.textContent = pad2(hours);
        elMins.textContent = pad2(mins);
        elSecs.textContent = pad2(secs);

        if (elNote) elNote.textContent = "Štart 2. 5. 2026 o 9:00";
    }

    tick();
    setInterval(tick, 1000);
}

// ========================================
// DRAWER – menu
// ========================================
function initDrawer() {
    const menuBtn = document.getElementById("menuBtn");
    const closeBtn = document.getElementById("closeBtn");
    const overlay = document.getElementById("overlay");
    const drawer = document.getElementById("drawer");

    if (!menuBtn || !drawer || !overlay) return;

    function openDrawer() {
        drawer.classList.remove("translate-x-full");
        overlay.classList.remove("hidden");
        menuBtn.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
        drawer.classList.add("translate-x-full");
        overlay.classList.add("hidden");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    menuBtn.addEventListener("click", openDrawer);
    closeBtn?.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    document.querySelectorAll(".drawerLink").forEach(a => {
        a.addEventListener("click", closeDrawer);
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeDrawer();
    });
}

// ========================================
// REVEAL – animácia pri scrollovaní
// ========================================
function initReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(el => revealObserver.observe(el));
}

// ========================================
// GALÉRIA + LIGHTBOX
// ========================================
function initGallery() {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    if (!Array.isArray(galleryImages) || galleryImages.length === 0) {
        // nič negenerujeme, nech stránka nepadá
        return;
    }

    galleryImages.forEach((image) => {
        const figure = document.createElement("figure");
        figure.className = "tile";
        figure.dataset.full = image.src;
        figure.dataset.title = image.title;

        figure.innerHTML = `
      <img src="${image.src}" alt="${image.title}" loading="lazy">
      <figcaption class="caption">
        <span>${image.title}</span>
        <span>⤢</span>
      </figcaption>
    `;

        gallery.appendChild(figure);
    });

    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    const lbImg = document.getElementById("lbImg");
    const lbTitle = document.getElementById("lbTitle");
    const lbMeta = document.getElementById("lbMeta");
    const lbClose = document.getElementById("lbClose");
    const lbPrev = document.getElementById("lbPrev");
    const lbNext = document.getElementById("lbNext");
    const lbStage = document.getElementById("lbStage");

    if (!lbImg || !lbTitle || !lbMeta || !lbStage) return;

    const tiles = Array.from(document.querySelectorAll(".tile"));
    let currentIndex = 0;
    let touchStartX = 0;

    function updateLightbox() {
        const tile = tiles[currentIndex];
        if (!tile) return;

        lbImg.src = tile.dataset.full || "";
        lbImg.alt = tile.dataset.title || "";
        lbTitle.textContent = tile.dataset.title || "";
        lbMeta.textContent = `${currentIndex + 1} / ${tiles.length}`;

        if (lbPrev) lbPrev.disabled = currentIndex === 0;
        if (lbNext) lbNext.disabled = currentIndex === tiles.length - 1;
    }

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function prevImage() {
        if (currentIndex > 0) { currentIndex--; updateLightbox(); }
    }

    function nextImage() {
        if (currentIndex < tiles.length - 1) { currentIndex++; updateLightbox(); }
    }

    tiles.forEach((tile, idx) => tile.addEventListener("click", () => openLightbox(idx)));

    lbClose?.addEventListener("click", closeLightbox);
    lbPrev?.addEventListener("click", prevImage);
    lbNext?.addEventListener("click", nextImage);

    lbStage.addEventListener("click", (e) => {
        if (e.target === lbStage) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (lightbox.getAttribute("aria-hidden") !== "false") return;

        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "ArrowRight") nextImage();
    });

    lbStage.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lbStage.addEventListener("touchend", (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const swipeThreshold = 50;

        if (Math.abs(diff) > swipeThreshold) {
            diff > 0 ? nextImage() : prevImage();
        }
    }, { passive: true });
}

// ========================================
// LEAFLET MAPA – prepínanie 10k/5k
// ========================================
function initRouteMap() {
    const el = document.getElementById("leafletMap");
    if (!el || !window.L || !window.L.GPX) return;

    const btn10k = document.getElementById("btn10k");
    const btn5k = document.getElementById("btn5k");
    const title = document.getElementById("routeTitle");
    const openLink = document.getElementById("routeOpenLink");
    const openText = document.getElementById("routeOpenText");

    const map = L.map("leafletMap", { scrollWheelZoom: false, tap: true });

    // stabilnejší tile provider
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap &copy; CARTO"
    }).addTo(map);

    let currentGpxLayer = null;
    let startMarker = null;
    let endMarker = null;

    function clearMarkers() {
        if (startMarker) { map.removeLayer(startMarker); startMarker = null; }
        if (endMarker) { map.removeLayer(endMarker); endMarker = null; }
    }

    function setActive(key) {
        btn10k?.classList.toggle("route-switch--active", key === "10k");
        btn5k?.classList.toggle("route-switch--active", key === "5k");
    }

    function loadRoute(key) {
        const cfg = ROUTES[key];
        if (!cfg) return;

        setActive(key);

        if (title) title.textContent = cfg.label;
        if (openLink) openLink.href = cfg.openUrl || "#";
        if (openText) openText.textContent = key === "10k" ? "Otvoriť 10 km trasu" : "Otvoriť 5 km trasu";

        if (currentGpxLayer) {
            map.removeLayer(currentGpxLayer);
            currentGpxLayer = null;
        }
        clearMarkers();

        const trackStyle = {
            color: cfg.color || "#e91e8c",
            weight: 6,
            opacity: 0.95,
            lineCap: "round"
        };

        currentGpxLayer = new L.GPX(cfg.gpx, {
            async: true,
            polyline_options: trackStyle,
            marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null }
        })
            .on("loaded", (e) => {
                map.fitBounds(e.target.getBounds(), { padding: [20, 20] });
                setTimeout(() => map.invalidateSize(), 150);

                const layers = e.target.getLayers();
                const poly = layers.find(l => l instanceof L.Polyline);
                if (!poly) return;

                const latlngs = poly.getLatLngs();
                const start = latlngs[0];
                const end = latlngs[latlngs.length - 1];

                const startIcon = L.divIcon({ className: "route-pin route-pin--start", html: "S", iconSize: [30, 30] });
                const endIcon = L.divIcon({ className: "route-pin route-pin--end", html: "C", iconSize: [30, 30] });

                startMarker = L.marker(start, { icon: startIcon }).addTo(map).bindPopup("Štart");
                endMarker = L.marker(end, { icon: endIcon }).addTo(map).bindPopup("Cieľ");
            })
            .on("error", (err) => {
                console.error("GPX load error:", cfg.gpx, err);
            })
            .addTo(map);
    }

    btn10k?.addEventListener("click", () => loadRoute("10k"));
    btn5k?.addEventListener("click", () => loadRoute("5k"));

    loadRoute("10k");
}

// ========================================
// HLAVNÝ ŠTART
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    initDrawer();
    initReveal();
    initGallery();
    initCountdown();
    initRouteMap();
});
