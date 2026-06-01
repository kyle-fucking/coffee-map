// 广州咖啡指南 — 主逻辑

(function() {
    'use strict';

    // ═══════════════════════════════
    // State
    // ═══════════════════════════════
    let state = {
        activeArea: null,
        activeTags: [],
        searchQuery: '',
    };

    // ═══════════════════════════════
    // DOM References
    // ═══════════════════════════════
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ═══════════════════════════════
    // Init
    // ═══════════════════════════════
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        renderHeroStats();
        renderAreasBar();
        renderTagsBar();
        renderFeatured();
        renderShopGrid();
        setupToolbar();
        setupSearch();
        setupModal();
        setupThoughtBubble();
        setupPourIndicator();
    }

    // ═══════════════════════════════
    // Hero Stats (animated counter)
    // ═══════════════════════════════
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
        const delay = 1400; // wait for hero animation

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

    // ═══════════════════════════════
    // Toolbar (show on scroll)
    // ═══════════════════════════════
    function setupToolbar() {
        const toolbar = $('#toolbar');
        const hero = $('.hero');
        if (!toolbar || !hero) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                toolbar.classList.toggle('visible', !entry.isIntersecting);
            },
            { threshold: 0.1 }
        );
        observer.observe(hero);
    }

    // ═══════════════════════════════
    // Areas Bar
    // ═══════════════════════════════
    function renderAreasBar() {
        const list = $('#areasList');
        if (!list) return;

        const areas = getAreaStats();

        let html = `<li class="${!state.activeArea ? 'active' : ''}" data-area="">全部</li>`;
        areas.forEach(({ area, count }) => {
            html += `<li class="${state.activeArea === area ? 'active' : ''}" data-area="${area}">${area} (${count})</li>`;
        });
        list.innerHTML = html;

        list.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;
            state.activeArea = li.dataset.area || null;
            renderAreasBar();
            renderTagsBar();
            renderShopGrid();
            updateResultCount();
        });
    }

    // ═══════════════════════════════
    // Tags Bar
    // ═══════════════════════════════
    function renderTagsBar() {
        const list = $('#categoriesList');
        if (!list) return;

        const filtered = getFilteredShops();
        const allTags = new Set();
        filtered.forEach(s => s.tags.forEach(t => allTags.add(t)));

        // Collect all unique tags from the data
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

        list.addEventListener('click', (e) => {
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

    // ═══════════════════════════════
    // Search
    // ═══════════════════════════════
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

    // ═══════════════════════════════
    // Featured Section
    // ═══════════════════════════════
    function renderFeatured() {
        const container = $('#featuredScroll');
        if (!container) return;

        const featured = [...coffeeShops]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);

        container.innerHTML = featured.map((shop, i) => {
            const colorIdx = shop.id.length % CARD_COLORS.length;
            const initial = shop.name.charAt(0);
            return `
                <div class="featured-card" data-shop-id="${shop.id}">
                    <div class="featured-card-img" style="background: ${CARD_COLORS[colorIdx]}">
                        <span class="initial">${initial}</span>
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
                    <button class="why-pick-btn" data-shop-id="${shop.id}" title="我的推荐理由">?</button>
                </div>
            `;
        }).join('');

        // Click on card -> open modal
        container.querySelectorAll('.featured-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.why-pick-btn')) return;
                const shopId = card.dataset.shopId;
                openShopModal(shopId);
            });
        });

        // Why pick button
        container.querySelectorAll('.why-pick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const shopId = btn.dataset.shopId;
                showThoughtBubble(shopId, btn);
            });
        });

        // Scroll progress -> pour indicator
        container.addEventListener('scroll', updatePourFromScroll);
    }

    // ═══════════════════════════════
    // Pour Indicator (coffee cup progress)
    // ═══════════════════════════════
    function setupPourIndicator() {
        const container = $('#featuredScroll');
        if (!container) return;

        // Initial state
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

        // Liquid rises from bottom
        const maxY = 78;
        const minY = 20;
        const currentY = maxY - (progress * (maxY - minY));
        liquid.setAttribute('y', currentY);

        // Surface follows
        const surfaceY = currentY;
        surface.setAttribute('d', `M8,${surfaceY} C14,${surfaceY-2} 20,${surfaceY-1} 26,${surfaceY-2.5} C32,${surfaceY-4} 38,${surfaceY-2} 44,${surfaceY-3} C50,${surfaceY-4} 54,${surfaceY-2} 58,${surfaceY}`);

        // Steam appears when mostly full
        steam.setAttribute('opacity', progress > 0.7 ? (progress - 0.7) / 0.3 : 0);

        // Label
        const cards = container.querySelectorAll('.featured-card');
        if (cards.length === 0) return;

        // Find which card is most visible
        const cardWidth = cards[0].offsetWidth + 20; // gap
        const currentIndex = Math.round(scrollLeft / cardWidth) + 1;
        label.textContent = `${Math.min(currentIndex, cards.length)} / ${cards.length}`;
    }

    // ═══════════════════════════════
    // Shop Grid
    // ═══════════════════════════════
    function renderShopGrid() {
        const container = $('#mainContent');
        if (!container) return;

        const shops = getFilteredShops();

        if (shops.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">☕</div>
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
    }

    function renderShopCard(shop) {
        const colorIdx = shop.id.length % CARD_COLORS.length;
        const initial = shop.name.charAt(0);
        return `
            <div class="shop-card" data-shop-id="${shop.id}">
                <div class="shop-card-img" style="background: ${CARD_COLORS[colorIdx]}">
                    <span class="initial">${initial}</span>
                    <span class="shop-area-badge">${shop.area}</span>
                    <span class="shop-rating-badge">★ ${shop.rating}</span>
                </div>
                <div class="shop-card-body">
                    <div class="shop-card-name">${shop.name}</div>
                    <div class="shop-card-district">${shop.area} · ${shop.district}</div>
                    <div class="shop-card-rec">${shop.recommendation}</div>
                    <div class="shop-card-footer">
                        <div class="shop-card-tags">
                            ${shop.tags.slice(0, 3).map(t => `<span>${t}</span>`).join('')}
                        </div>
                        <span class="shop-card-price">${shop.priceRange}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // ═══════════════════════════════
    // Filtering Logic
    // ═══════════════════════════════
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

        // Sort by rating descending
        result.sort((a, b) => b.rating - a.rating);

        return result;
    }

    function getAreaStats() {
        const stats = new Map();
        coffeeShops.forEach(s => {
            stats.set(s.area, (stats.get(s.area) || 0) + 1);
        });
        return Array.from(stats.entries())
            .map(([area, count]) => ({ area, count }))
            .sort((a, b) => b.count - a.count);
    }

    function updateResultCount() {
        const el = $('#resultCount');
        if (!el) return;
        const count = getFilteredShops().length;
        el.textContent = count > 0 ? `${count} 家` : '';
    }

    // ═══════════════════════════════
    // Shop Modal
    // ═══════════════════════════════
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
            { key: 'wifi', label: 'WiFi', icon: '📶' },
            { key: 'powerOutlets', label: '插座', icon: '🔌' },
            { key: 'petFriendly', label: '宠物友好', icon: '🐾' },
            { key: 'outdoor', label: '户外座位', icon: '☀️' },
            { key: 'dessert', label: '甜品', icon: '🍰' },
            { key: 'parking', label: '好停车', icon: '🅿️' },
        ];

        content.innerHTML = `
            <div class="modal-close-btn">
                <button id="modalCloseBtn">✕</button>
            </div>
            <div style="height: 160px; background: ${CARD_COLORS[colorIdx]}; display: flex; align-items: center; justify-content: center;">
                <span style="font-family: var(--font-display); font-size: 4rem; opacity: 0.4; color: var(--cream);">${shop.name.charAt(0)}</span>
            </div>
            <div class="modal-header">
                <h2 class="modal-shop-name">${shop.name}</h2>
                <p class="modal-shop-location">${shop.area} · ${shop.district}</p>
                <div class="modal-tags">
                    ${shop.tags.map(t => `<span>${t}</span>`).join('')}
                </div>
                <div class="modal-rating-row">
                    <span class="modal-rating-big">${shop.rating}</span>
                    <span class="modal-stars">${stars}</span>
                </div>
            </div>
            <div class="modal-recommendation">
                "${shop.recommendation}"
            </div>
            <div class="modal-info-list">
                <div class="modal-info-item">
                    <span class="modal-info-icon">📍</span>
                    <span>${shop.address}</span>
                </div>
                ${shop.metro ? `<div class="modal-info-item"><span class="modal-info-icon">🚇</span><span>${shop.metro}</span></div>` : ''}
                ${shop.hours ? `<div class="modal-info-item"><span class="modal-info-icon">🕐</span><span>${shop.hours}</span></div>` : ''}
                <div class="modal-info-item">
                    <span class="modal-info-icon">💰</span>
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
                    return `<div class="modal-feature"><span class="${has ? 'check' : 'cross'}">${has ? '✓' : '✗'}</span> ${f.icon} ${f.label}</div>`;
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

        // Close button
        content.querySelector('#modalCloseBtn').addEventListener('click', closeShopModal);

        // Related shop clicks
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

    // ═══════════════════════════════
    // Thought Bubble ("Why I Pick")
    // ═══════════════════════════════
    let thoughtBubbleTimer = null;

    function setupThoughtBubble() {
        // Click outside to dismiss
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

        // Position near the button
        const rect = btnEl.getBoundingClientRect();
        const portalWidth = 300;
        let left = rect.left + rect.width / 2 - portalWidth / 2;
        let top = rect.bottom + 16;

        // Keep within viewport
        if (left < 16) left = 16;
        if (left + portalWidth > window.innerWidth - 16) left = window.innerWidth - portalWidth - 16;
        if (top + 120 > window.innerHeight) top = rect.top - 120;

        portal.style.left = left + 'px';
        portal.style.top = top + 'px';
        portal.style.width = portalWidth + 'px';
        portal.classList.add('visible');

        // Auto-hide after 4s
        clearTimeout(thoughtBubbleTimer);
        thoughtBubbleTimer = setTimeout(hideThoughtBubble, 4000);
    }

    function hideThoughtBubble() {
        const portal = $('#thoughtPortal');
        if (portal) portal.classList.remove('visible');
    }

})();
