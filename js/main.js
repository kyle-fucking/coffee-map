// SVG icons library for modal features
const ICONS = {
    location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    metro: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 3v18M15 3v18M4 9h16M4 15h16"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    price: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    wifi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>`,
    power: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v10M18.36 6.64a9 9 0 1 1-12.73 0"/></svg>`,
    pet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="8" r="2.5"/><path d="M12 16c2 0 4-1 4-3H8c0 2 2 3 4 3z"/></svg>`,
    outdoor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    dessert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3a5 5 0 0 0-5 5c0 2.5 1 4 1 4s1-1.5 1-4a3 3 0 0 1 6 0c0 2.5 1 4 1 4s1-1.5 1-4a5 5 0 0 0-5-5z"/><path d="M7 14h10c0 4-2.5 7-5 7s-5-3-5-7z"/></svg>`,
    parking: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    cross: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
    thought: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="12" cy="10" r="1" fill="currentColor"/></svg>`,
    close: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
};

// 高德地图配置 — 密钥统一在 config.js 的 CONFIG.AMAP_KEY
function getAmapUrl(shop) {
    // 根据地址在高德地图中搜索定位，使用高德自有地理编码更准确
    const query = encodeURIComponent(shop.address + ' ' + shop.name);
    return `https://ditu.amap.com/search?query=${query}&src=gzcoffee`;
}

// State
let state = {
    activeArea: null,
    activeTags: [],
    searchQuery: '',
};

// DOM References
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Init
document.addEventListener('DOMContentLoaded', init);

function init() {
    try {
        renderHeroStats();
        renderAreasBar();
        renderTagsBar();
        setupFilterListeners();
        renderFeatured();
        renderShopGrid();
        setupToolbar();
        setupSearch();
        setupModal();
        setupThoughtBubble();
        setupPourIndicator();
        setupViewToggle();
    } catch (err) {
        console.error('[CoffeeMap] 初始化失败:', err);
        showInitError(err.message || '未知错误');
    }
}

function showInitError(msg) {
    const main = $('#mainContent');
    if (!main) return;
    main.innerHTML = `
        <div class="init-error">
            <div class="init-error-icon">⚠️</div>
            <h2 class="init-error-title">页面加载遇到问题</h2>
            <p class="init-error-desc">${msg}</p>
            <p class="init-error-hint">请尝试刷新页面，如果问题持续请联系开发者</p>
        </div>
    `;
}

// Hero Stats (animated counter)
function renderHeroStats() {
    const shopCount = coffeeShops.length;
    const areas = [...new Set(coffeeShops.map(s => s.area))];
    const avg = (coffeeShops.reduce((sum, s) => sum + s.rating, 0) / shopCount).toFixed(1);

    animateCounter('shopCount', shopCount);
    animateCounter('areaCount', areas.length);
    animateCounter('avgRating', parseFloat(avg), true);
}

function animateCounter(elId, target, isFloat = false) {
    const el = document.getElementById(elId);
    if (!el) return;
    const duration = 1200;
    const start = performance.now();
    const delay = 1400;

    setTimeout(() => {
        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            el.textContent = isFloat ? current.toFixed(1) : Math.round(current);
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }, delay);
}

// Toolbar (always visible)
function setupToolbar() {
    const toolbar = $('#toolbar');
    if (toolbar) toolbar.classList.add('visible');
}
// Areas Bar
function renderAreasBar() {
    const list = $('#areasList');
    if (!list) return;

    const areas = getAreaStats();

    let html = `<li class="${!state.activeArea ? 'active' : ''}" data-area="">全部</li>`;
    areas.forEach(({ area, count }) => {
        html += `<li class="${state.activeArea === area ? 'active' : ''}" data-area="${area}">${area} (${count})</li>`;
    });
    list.innerHTML = html;
}

// Tags Bar
function renderTagsBar() {
    const list = $('#categoriesList');
    if (!list) return;

    const filtered = getFilteredShops();
    const allTags = new Set();
    filtered.forEach(s => s.tags.forEach(t => allTags.add(t)));

    const allDataTags = new Set();
    coffeeShops.forEach(s => s.tags.forEach(t => allDataTags.add(t)));

    let html = `<li class="${state.activeTags.length === 0 ? 'active' : ''}" data-tag="">全部</li>`;
    TAG_CATEGORIES.forEach(cat => {
        cat.tags.forEach(tag => {
            if (allDataTags.has(tag)) {
                const isActive = state.activeTags.includes(tag);
                const hasResults = allTags.has(tag);
                html += `<li class="${isActive ? 'active' : ''}" data-tag="${tag}" style="${!hasResults && !isActive ? 'opacity:0.4' : ''}">${tag}</li>`;
            }
        });
    });
    list.innerHTML = html;
}

// Filter listeners (attached once to prevent stacking)
function setupFilterListeners() {
    $('#areasList').addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        state.activeArea = li.dataset.area || null;
        renderAreasBar();
        renderTagsBar();
        renderShopGrid();
        updateResultCount();
    });

    $('#categoriesList').addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        const tag = li.dataset.tag;
        if (!tag) {
            state.activeTags = [];
        } else {
            const idx = state.activeTags.indexOf(tag);
            if (idx >= 0) {
                state.activeTags.splice(idx, 1);
            } else {
                state.activeTags.push(tag);
            }
        }
        renderTagsBar();
        renderShopGrid();
        updateResultCount();
    });
}

// Search
function setupSearch() {
    const input = $('#searchInput');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            state.searchQuery = input.value.trim();
            renderShopGrid();
            updateResultCount();
        }, 200);
    });
}

// Featured Section
function renderFeatured() {
    const container = $('#featuredScroll');
    if (!container) return;

    const featured = coffeeShops.filter(s => s.featured);

    container.innerHTML = featured.map((shop, i) => {
        const colorIdx = shop.id.length % CARD_COLORS.length;
        const hasPhoto = shop.photos && shop.photos.length > 0;
        const initial = shop.name.charAt(0);
        return `
            <div class="featured-card" data-shop-id="${shop.id}">
                <div class="featured-card-img" style="background: ${CARD_COLORS[colorIdx]}">
                    ${hasPhoto
                        ? `<img class="featured-photo" src="${shop.photos[0]}" alt="${shop.name}" loading="lazy">`
                        : `<span class="initial">${initial}</span>`
                    }
                    <span class="featured-card-area">${shop.area} · ${shop.district}</span>
                    <span class="featured-card-rating">★ ${shop.rating}</span>
                </div>
                <div class="featured-card-body">
                    <div class="featured-card-name">${shop.name}</div>
                    <div class="featured-card-district">${shop.address}</div>
                    <div class="featured-card-tags">
                        ${shop.tags.slice(0, 3).map(t => `<span class="featured-card-tag">${t}</span>`).join('')}
                    </div>
                </div>
                <button class="why-pick-btn" data-shop-id="${shop.id}" title="我的推荐理由">${ICONS.thought}</button>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.featured-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.why-pick-btn')) return;
            const shopId = card.dataset.shopId;
            openShopModal(shopId);
        });
    });

    container.querySelectorAll('.why-pick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const shopId = btn.dataset.shopId;
            showThoughtBubble(shopId, btn);
        });
    });

    // 精选图片懒加载
    container.querySelectorAll('.featured-photo').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
            img.addEventListener('error', () => { img.style.display = 'none'; });
        }
    });

    container.addEventListener('scroll', updatePourFromScroll);
    setupFeaturedScrollbar();
}

// Custom Scrollbar for Featured Section
function setupFeaturedScrollbar() {
    const container = $('#featuredScroll');
    const scrollbar = $('#featuredScrollbar');
    const thumb = $('#featuredScrollbarThumb');
    if (!container || !scrollbar || !thumb) return;

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let thumbWidthRatio = 0;

    function updateThumb() {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll <= 0) {
            scrollbar.classList.remove('visible');
            return;
        }
        scrollbar.classList.add('visible');
        thumbWidthRatio = container.clientWidth / container.scrollWidth;
        thumb.style.width = Math.max(thumbWidthRatio * 100, 8) + '%';
        const progress = container.scrollLeft / maxScroll;
        const availableWidth = scrollbar.clientWidth - thumb.offsetWidth;
        thumb.style.left = progress * availableWidth + 'px';
    }

    function scrollToThumbPosition(x) {
        const trackRect = scrollbar.getBoundingClientRect();
        const thumbRect = thumb.getBoundingClientRect();
        const availableWidth = scrollbar.clientWidth - thumb.offsetWidth;
        let offsetX = x - trackRect.left - thumb.offsetWidth / 2;
        offsetX = Math.max(0, Math.min(offsetX, availableWidth));
        const maxScroll = container.scrollWidth - container.clientWidth;
        container.scrollLeft = (offsetX / availableWidth) * maxScroll;
    }

    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startScrollLeft = container.scrollLeft;
        thumb.classList.add('dragging');
        e.preventDefault();
    });

    thumb.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startScrollLeft = container.scrollLeft;
        thumb.classList.add('dragging');
        e.preventDefault();
    }, { passive: false });

    function onMove(clientX) {
        if (!isDragging) return;
        const deltaX = clientX - startX;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const availableWidth = scrollbar.clientWidth - thumb.offsetWidth;
        const scrollDelta = (deltaX / availableWidth) * maxScroll;
        container.scrollLeft = Math.max(0, Math.min(startScrollLeft + scrollDelta, maxScroll));
    }

    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('touchmove', (e) => {
        if (isDragging) e.preventDefault();
        onMove(e.touches[0].clientX);
    }, { passive: false });

    function onEnd() {
        isDragging = false;
        thumb.classList.remove('dragging');
    }

    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);

    scrollbar.addEventListener('click', (e) => {
        if (e.target === thumb || thumb.contains(e.target)) return;
        scrollToThumbPosition(e.clientX);
    });

    // 窗口大小变化时重新计算
    window.addEventListener('resize', updateThumb);

    // 注意：thumb 位置由 updatePourFromScroll 在滚动时统一更新，这里不再重复监听 scroll

    // 初始化
    updateThumb();
}

// Pour Indicator
function setupPourIndicator() {
    const container = $('#featuredScroll');
    if (!container) return;
    updatePourFromScroll();
}

function updatePourFromScroll() {
    const container = $('#featuredScroll');
    const liquid = $('#pourLiquid');
    const surface = $('#pourSurface');
    const steam = $('#pourSteam');
    const label = $('#pourLabel');
    if (!container || !liquid) return;

    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;

    const maxY = 78;
    const minY = 20;
    const currentY = maxY - (progress * (maxY - minY));
    liquid.setAttribute('y', currentY);

    const surfaceY = currentY;
    surface.setAttribute('d', `M8,${surfaceY} C14,${surfaceY-2} 20,${surfaceY-1} 26,${surfaceY-2.5} C32,${surfaceY-4} 38,${surfaceY-2} 44,${surfaceY-3} C50,${surfaceY-4} 54,${surfaceY-2} 58,${surfaceY}`);

    steam.setAttribute('opacity', progress > 0.7 ? (progress - 0.7) / 0.3 : 0);

    const cards = container.querySelectorAll('.featured-card');
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth + 20;
    const currentIndex = Math.round(scrollLeft / cardWidth) + 1;
    label.textContent = `${Math.min(currentIndex, cards.length)} / ${cards.length}`;

    // 同步滑动条
    const scrollbar = $('#featuredScrollbar');
    const thumb = $('#featuredScrollbarThumb');
    if (scrollbar && thumb) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 0) {
            scrollbar.classList.add('visible');
            const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
            const availableWidth = scrollbar.clientWidth - thumb.offsetWidth;
            thumb.style.left = progress * availableWidth + 'px';
            thumb.style.width = Math.max((container.clientWidth / container.scrollWidth) * 100, 8) + '%';
        } else {
            scrollbar.classList.remove('visible');
        }
    }
}

// Shop Grid
function renderShopGrid() {
    const container = $('#mainContent');
    if (!container) return;

    const shops = getFilteredShops();

    if (shops.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">${ICONS.coffee}</div>
                <p class="empty-state-text">没有找到符合条件的咖啡店</p>
                <p class="empty-state-hint">试试调整筛选条件？</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <h2 class="section-title">全部咖啡店 (${shops.length}家)</h2>
        <div class="shop-grid">
            ${shops.map(shop => renderShopCard(shop)).join('')}
        </div>
    `;

    container.querySelectorAll('.shop-card').forEach(card => {
        card.addEventListener('click', () => {
            openShopModal(card.dataset.shopId);
        });
    });

    container.querySelectorAll('.shop-card-map').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const shopId = btn.closest('.shop-card').dataset.shopId;
            const shop = coffeeShops.find(s => s.id === shopId);
            if (shop) window.open(getAmapUrl(shop), '_blank');
        });
    });

    // 图片懒加载 — 加载完成后渐入
    container.querySelectorAll('.shop-photo').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
            img.addEventListener('error', () => { img.style.display = 'none'; });
        }
    });

    // 同步更新地图标记（如果地图视图激活）
    if (typeof updateMarkers === 'function' && document.getElementById('mapContainer')?.classList.contains('active')) {
        updateMarkers(getFilteredShops());
    }
}

function renderShopCard(shop) {
    const colorIdx = shop.id.length % CARD_COLORS.length;
    const hasPhoto = shop.photos && shop.photos.length > 0;
    const initial = shop.name.charAt(0);
    return `
        <div class="shop-card ${shop.closed ? 'shop-card--closed' : ''}" data-shop-id="${shop.id}">
            <div class="shop-card-img" style="background: ${CARD_COLORS[colorIdx]}">
                ${hasPhoto
                    ? `<img class="shop-photo" src="${shop.photos[0]}" alt="${shop.name}" loading="lazy">`
                    : `<span class="initial">${initial}</span>`
                }
                <span class="shop-area-badge">${shop.area}</span>
                <span class="shop-rating-badge">★ ${shop.rating}</span>
                ${shop.closed ? `<div class="shop-closed-overlay"><span class="shop-closed-badge">已停业</span></div>` : ''}
            </div>
            <div class="shop-card-body">
                <div class="shop-card-name">${shop.name}</div>
                <div class="shop-card-district">${shop.area} · ${shop.district}</div>
                <div class="shop-card-rec">${shop.recommendation}</div>
                <div class="shop-card-footer">
                    <div class="shop-card-tags">
                        ${shop.tags.slice(0, 3).map(t => `<span>${t}</span>`).join('')}
                    </div>
                    <button class="shop-card-map" title="在高德地图中查看">${ICONS.map}</button>
                    <span class="shop-card-price">${shop.priceRange}</span>
                </div>
            </div>
        </div>
    `;
}

// Filtering Logic
function getFilteredShops() {
    let result = [...coffeeShops];

    if (state.activeArea) {
        result = result.filter(s => s.area === state.activeArea);
    }

    if (state.activeTags.length > 0) {
        result = result.filter(s =>
            state.activeTags.every(tag => s.tags.includes(tag))
        );
    }

    if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        result = result.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.address.toLowerCase().includes(q) ||
            s.district.toLowerCase().includes(q) ||
            s.area.toLowerCase().includes(q) ||
            s.tags.some(t => t.includes(q))
        );
    }

    result.sort((a, b) => b.rating - a.rating);

    return result;
}

function getAreaStats() {
    const stats = new Map();
    coffeeShops.forEach(s => {
        stats.set(s.area, (stats.get(s.area) || 0) + 1);
    });
    const allAreas = AREAS.map(a => ({
        area: a.name,
        count: stats.get(a.name) || 0
    }));
    return allAreas.sort((a, b) => b.count - a.count);
}

function updateResultCount() {
    const el = $('#resultCount');
    if (!el) return;
    const count = getFilteredShops().length;
    el.textContent = count > 0 ? `${count} 家` : '';
}

// Shop Modal
function setupModal() {
    const modal = $('#shopModal');
    const backdrop = $('#shopModalBackdrop');
    if (!modal || !backdrop) return;

    backdrop.addEventListener('click', closeShopModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeShopModal();
    });
}

function openShopModal(shopId) {
    const shop = coffeeShops.find(s => s.id === shopId);
    if (!shop) return;

    const modal = $('#shopModal');
    const content = $('#shopModalContent');

    const colorIdx = shop.id.length % CARD_COLORS.length;
    const stars = '★'.repeat(Math.floor(shop.rating)) + (shop.rating % 1 >= 0.5 ? '½' : '');

    // Related shops (same area or same tags)
    const related = coffeeShops
        .filter(s => s.id !== shop.id && (s.area === shop.area || s.tags.some(t => shop.tags.includes(t))))
        .slice(0, 3);

    const featureList = [
        { key: 'wifi', label: 'WiFi', icon: ICONS.wifi },
        { key: 'powerOutlets', label: '插座', icon: ICONS.power },
        { key: 'petFriendly', label: '宠物友好', icon: ICONS.pet },
        { key: 'outdoor', label: '户外座位', icon: ICONS.outdoor },
        { key: 'dessert', label: '甜品', icon: ICONS.dessert },
        { key: 'parking', label: '好停车', icon: ICONS.parking },
    ];

    const hasPhoto = shop.photos && shop.photos.length > 0;

    content.innerHTML = `
        <div class="modal-close-btn">
            <button id="modalCloseBtn">${ICONS.close}</button>
        </div>
        ${hasPhoto ? `
        <div class="modal-photo-gallery">
            <div class="modal-photo-main">
                <img src="${shop.photos[0]}" alt="${shop.name}" class="modal-photo-img">
            </div>
            ${shop.photos.length > 1 ? `
            <div class="modal-photo-thumbs">
                ${shop.photos.map((p, i) => `
                    <img src="${p}" alt="${shop.name}" class="modal-photo-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}">
                `).join('')}
            </div>` : ''}
        </div>`
        : `<div style="height: 160px; background: ${CARD_COLORS[colorIdx]}; display: flex; align-items: center; justify-content: center;">
            <span style="font-family: var(--font-display); font-size: 4rem; opacity: 0.4; color: rgba(255,255,255,0.6);">${shop.name.charAt(0)}</span>
        </div>`
        }
        <div class="modal-header">
            <h2 class="modal-shop-name">${shop.name}</h2>
            <p class="modal-shop-location">${shop.area} · ${shop.district}</p>
            <div class="modal-tags">
                ${shop.tags.map(t => `<span>${t}</span>`).join('')}
            </div>
            ${shop.closed ? `<div class="modal-closed-banner">该门店已停业</div>` : ''}
            <div class="modal-rating-row">
                <span class="modal-rating-big">${shop.rating}</span>
                <span class="modal-stars">${stars}</span>
            </div>
        </div>
        <div class="modal-recommendation">
            &ldquo;${shop.recommendation}&rdquo;
        </div>
        <div class="modal-info-list">
            <div class="modal-info-item">
                <span class="modal-info-icon">${ICONS.location}</span>
                <a href="${getAmapUrl(shop)}" target="_blank" rel="noopener" class="amap-link">${shop.address}</a>
            </div>
            ${shop.metro ? `<div class="modal-info-item"><span class="modal-info-icon">${ICONS.metro}</span><span>${shop.metro}</span></div>` : ''}
            ${shop.hours ? `<div class="modal-info-item"><span class="modal-info-icon">${ICONS.clock}</span><span>${shop.hours}</span></div>` : ''}
            <div class="modal-info-item">
                <span class="modal-info-icon">${ICONS.price}</span>
                <span>${shop.priceRange}</span>
            </div>
        </div>
        ${shop.highlights.length > 0 ? `
            <h3 class="modal-section-title">推荐饮品</h3>
            <div class="modal-highlights">
                ${shop.highlights.map(h => `<span>${h}</span>`).join('')}
            </div>
        ` : ''}
        <h3 class="modal-section-title">设施</h3>
        <div class="modal-features">
            ${featureList.map(f => {
                const has = shop.features[f.key];
                return `<div class="modal-feature"><span class="modal-feature-icon ${has ? 'check' : 'cross'}">${has ? ICONS.check : ICONS.cross}</span> <span>${f.label}</span></div>`;
            }).join('')}
        </div>
        ${related.length > 0 ? `
            <div class="modal-related">
                <h3 class="modal-related-title">你可能也想试试</h3>
                <div class="modal-related-list">
                    ${related.map(r => `
                        <div class="modal-related-item" data-shop-id="${r.id}">
                            <span class="modal-related-item-name">${r.name}</span>
                            <span class="modal-related-item-info">${r.area} · ${r.district} · ★${r.rating}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    content.querySelector('#modalCloseBtn').addEventListener('click', closeShopModal);

    // 缩略图切换主图
    const modalPhotos = content.querySelector('.modal-photo-gallery');
    if (modalPhotos && shop.photos && shop.photos.length > 1) {
        const mainImg = modalPhotos.querySelector('.modal-photo-img');
        modalPhotos.querySelectorAll('.modal-photo-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const idx = parseInt(thumb.dataset.idx);
                mainImg.src = shop.photos[idx];
                modalPhotos.querySelectorAll('.modal-photo-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }

    content.querySelectorAll('.modal-related-item').forEach(item => {
        item.addEventListener('click', () => {
            openShopModal(item.dataset.shopId);
        });
    });
}

function closeShopModal() {
    const modal = $('#shopModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Thought Bubble
let thoughtBubbleTimer = null;

function setupThoughtBubble() {
    document.addEventListener('click', (e) => {
        const portal = $('#thoughtPortal');
        if (portal && portal.classList.contains('visible') && !e.target.closest('.why-pick-btn') && !e.target.closest('.thought-bubble-portal')) {
            hideThoughtBubble();
        }
    });
}

function showThoughtBubble(shopId, btnEl) {
    const shop = coffeeShops.find(s => s.id === shopId);
    if (!shop) return;

    const portal = $('#thoughtPortal');
    const text = $('#thoughtText');
    if (!portal || !text) return;

    text.textContent = shop.recommendation;

    const rect = btnEl.getBoundingClientRect();
    const portalWidth = 300;
    let left = rect.left + rect.width / 2 - portalWidth / 2;
    let top = rect.bottom + 16;

    if (left < 16) left = 16;
    if (left + portalWidth > window.innerWidth - 16) left = window.innerWidth - portalWidth - 16;
    if (top + 120 > window.innerHeight) top = rect.top - 120;

    portal.style.left = left + 'px';
    portal.style.top = top + 'px';
    portal.style.width = portalWidth + 'px';
    portal.classList.add('visible');

    clearTimeout(thoughtBubbleTimer);
    thoughtBubbleTimer = setTimeout(hideThoughtBubble, 4000);
}

function hideThoughtBubble() {
    const portal = $('#thoughtPortal');
    if (portal) portal.classList.remove('visible');
}




let currentView = 'list';

function setupViewToggle() {
    const toggle = document.getElementById('viewToggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-toggle-btn');
        if (!btn) return;

        const view = btn.dataset.view;
        if (view === currentView) return;

        // Update button states
        toggle.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = view;

        if (view === 'map') {
            const shops = getFilteredShops();
            switchToMapView(shops);
        } else {
            switchToListView();
        }
    });
}

function updateMapForCurrentView() {
    const shops = getFilteredShops();
    // Only update if map is initialized
    if (typeof mapInstance !== 'undefined' && mapInstance) {
        updateMarkers(shops);
    }
}




