/* ================================
   ?????? ? ??????
   ??????????????
   ================================ */

const AMAP_JS_KEY = CONFIG.AMAP_KEY;

let mapInstance = null;
let allMarkers = [];
let clusterer = null;
let infoWindow = null;
let apiLoaded = false;
let apiLoading = false;
let loadCallbacks = [];
let mapInitialized = false;

function loadAmapAPI() {
    return new Promise((resolve, reject) => {
        if (apiLoaded) { resolve(window.AMap); return; }
        if (apiLoading) { loadCallbacks.push(resolve); return; }
        apiLoading = true;
        loadCallbacks.push(resolve);
        const script = document.createElement("script");
        script.src = "https://webapi.amap.com/maps?v=2.0&key=" + AMAP_JS_KEY;
        script.onload = function() {
            apiLoaded = true;
            apiLoading = false;
            loadCallbacks.forEach(function(cb) { cb(window.AMap); });
            loadCallbacks = [];
        };
        script.onerror = function() {
            apiLoading = false;
            reject(new Error("\u9ad8\u5fb7\u5730\u56feJS API\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u6216API Key\u914d\u7f6e"));
        };
        document.head.appendChild(script);
    });
}

async function initMap(containerId) {
    if (mapInitialized && mapInstance) {
        var el = document.getElementById(containerId);
        if (el) { mapInstance.container = el; }
        mapInstance.resize();
        return mapInstance;
    }
    try {
        var AMap = await loadAmapAPI();
        if (!document.getElementById(containerId)) {
            throw new Error("\u5730\u56fe\u5bb9\u5668\u5143\u7d20\u4e0d\u5b58\u5728");
        }
        var center = [113.28, 23.12];
        mapInstance = new AMap.Map(containerId, {
            zoom: 11.5,
            center: center,
            mapStyle: "amap://styles/fresh",
            resizeEnable: true
        });
        infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -36),
            closeWhenClickMap: true
        });
        AMap.plugin(["AMap.ToolBar", "AMap.Scale"], function() {
            mapInstance.addControl(new AMap.ToolBar({ position: "RT" }));
            mapInstance.addControl(new AMap.Scale());
        });
        mapInitialized = true;
        return mapInstance;
    } catch (err) {
        console.error('[CoffeeMap] Map init failed:', err);
        showMapError(err.message);
        throw err;
    }
}

function updateMarkers(shops) {
    if (!mapInstance || !window.AMap) return;
    var AMap = window.AMap;
    clearMarkers();
    if (shops.length === 0) {
        mapInstance.setCenter([113.28, 23.12]);
        mapInstance.setZoom(11.5);
        return;
    }
    // 直接使用 data.js 中的 lat/lng 创建标记
    var markerList = shops.map(function(shop) {
        var isFeatured = shop.featured || shop.rating >= 4.7;
        var content = createMarkerContent(shop, isFeatured);
        var marker = new AMap.Marker({
            position: [shop.lng, shop.lat],
            content: content,
            offset: new AMap.Pixel(-22, -22),
            zIndex: isFeatured ? 120 : 100,
            title: shop.name,
            extData: shop
        });
        marker.on('click', onMarkerClick);
        return marker;
    });
    allMarkers = markerList;
    mapInstance.add(allMarkers);
    console.log('[CoffeeMap] Added', allMarkers.length, 'markers');
    mapInstance.setFitView(null, false, [48, 48, 48, 48]);
}




function createMarkerContent(shop, isFeatured) {
    var initial = shop.name.charAt(0);
    var color = isFeatured ? "#B8963E" : "#2B5F8A";
    var strokeColor = isFeatured ? "#D4B44A" : "#4A7A9E";
    var size = isFeatured ? 40 : 34;
    var starHtml = isFeatured ? '<span class="map-marker-star">\u2605</span>' : "";
    var cls = isFeatured ? 'map-marker map-marker-featured' : 'map-marker';
    return '<div class="' + cls + '" style="width:' + size + 'px;height:' + size + 'px;background:' + color + ';border:2.5px solid ' + strokeColor + ';">'
        + '<span class="map-marker-text">' + initial + '</span>'
        + starHtml
        + '</div>';
}

function onMarkerClick(e) {
    var marker = e.target || e;
    var shop = marker.getExtData();
    if (!shop) return;
    var pos = marker.getPosition();
    var fullStars = Math.floor(shop.rating);
    var stars = "";
    for (var i = 0; i < fullStars; i++) { stars += "\u2605"; }
    if (shop.rating % 1 >= 0.5) { stars += "\u00bd"; }
    var tagsHtml = "";
    for (var j = 0; j < Math.min(shop.tags.length, 3); j++) {
        tagsHtml += '<span class="map-info-tag">' + shop.tags[j] + '</span>';
    }
    infoWindow.setContent(
        '<div class="map-info-window">'
        + '<div class="map-info-name">' + shop.name + '</div>'
        + '<div class="map-info-row">'
        + '<span class="map-info-area">' + shop.area + ' \u00b7 ' + shop.district + '</span>'
        + '<span class="map-info-rating">' + stars + ' ' + shop.rating + '</span>'
        + '</div>'
        + '<div class="map-info-tags">' + tagsHtml + '</div>'
        + '<button class="map-info-btn" data-shop-id="' + shop.id + '">\u67e5\u770b\u8be6\u60c5 \u2192</button>'
        + '</div>'
    );
    infoWindow.open(mapInstance, pos);
    var btn = document.querySelector(".map-info-btn");
    if (btn) {
        btn.addEventListener("click", function() {
            var sid = this.getAttribute("data-shop-id");
            infoWindow.close();
            if (typeof window.openShopModal === "function") {
                window.openShopModal(sid);
            }
        });
    }
}

function clearMarkers() {
    if (clusterer) { clusterer.clearMarkers(); clusterer = null; }
    if (allMarkers.length > 0) {
        allMarkers.forEach(function(m) {
            if (mapInstance) mapInstance.remove(m);
        });
        allMarkers = [];
    }
}

function switchToListView() {
    var mapContainer = document.getElementById("mapContainer");
    var mainContent = document.getElementById("mainContent");
    if (mapContainer) mapContainer.classList.remove("active");
    if (mainContent) mainContent.classList.remove("map-hidden");
    if (mapInstance) {
        mapInstance.destroy();
        mapInstance = null;
        mapInitialized = false;
        allMarkers = [];
        clusterer = null;
    }
}

async function switchToMapView(shops) {
    var mapContainer = document.getElementById("mapContainer");
    var mainContent = document.getElementById("mainContent");
    if (!mapContainer) return;
    mapContainer.classList.add("active");
    if (mainContent) mainContent.classList.add("map-hidden");
    try {
        console.log('[CoffeeMap] Switching to map view with', shops.length, 'shops');
        await initMap("mapContainer");
        updateMarkers(shops);
    } catch (err) {
        console.error('[CoffeeMap] Map view error:', err);
        showMapError(err.message || '地图加载失败');
    }
}

function showMapError(msg) {
    var container = document.getElementById("mapContainer");
    if (!container) return;
    container.innerHTML = '<div class="map-error">'
        + '<div class="map-error-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>'
        + '<p class="map-error-title">\u5730\u56fe\u52a0\u8f7d\u5931\u8d25</p>'
        + '<p class="map-error-desc">' + msg + '</p>'
        + '<p class="map-error-hint">\u8bf7\u5728 <a href="https://console.amap.com/" target="_blank" rel="noopener">\u9ad8\u5fb7\u5f00\u653e\u5e73\u53f0</a> \u7533\u8bf7\u300cWeb\u7aef(JS API)\u300d\u5bc6\u94a5\uff0c\u5e76\u914d\u7f6e\u57df\u540d\u767d\u540d\u5355\u3002</p>'
        + '</div>';
}

window.addEventListener("resize", function() {
    if (mapInstance && typeof mapInstance.resize === "function") {
        mapInstance.resize();
    }
});
