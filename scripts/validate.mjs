#!/usr/bin/env node

/**
 * 广州咖啡指南 - 数据验证脚本
 * 运行: node scripts/validate.mjs
 *
 * 校验项:
 *   1. 必需字段 — id, name, area, address, lat, lng, tags, rating, features
 *   2. 无重复 ID
 *   3. 标签一致性 — 所有 shop.tags 必须在 TAG_CATEGORIES 中定义
 *   4. 经纬度范围 — lat ∈ [22.5, 23.8], lng ∈ [113.0, 114.0]
 *   5. 评分范围 — rating ∈ [0, 5]
 *   6. Featured 引用 — featured: true 的 shop.id 必须存在
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataJsPath = resolve(__dirname, '../js/data.js');

// 加载 data.js
let coffeeShops, AREAS, TAG_CATEGORIES;
try {
    const dataJs = readFileSync(dataJsPath, 'utf-8');
    const getData = new Function(dataJs + '\n return { coffeeShops, AREAS, TAG_CATEGORIES, CARD_COLORS };');
    const data = getData();
    coffeeShops = data.coffeeShops;
    AREAS = data.AREAS;
    TAG_CATEGORIES = data.TAG_CATEGORIES;
} catch (err) {
    console.error('❌ 无法加载 data.js:', err.message);
    process.exit(1);
}

// 提取所有允许的标签
const validTags = new Set();
TAG_CATEGORIES.forEach(cat => cat.tags.forEach(t => validTags.add(t)));

// ---- 校验 ----
const errors = [];
let requiredCount = 0;
let idCount = 0;

// 1. 必需字段
const REQUIRED_FIELDS = ['id', 'name', 'area', 'address', 'lat', 'lng', 'tags', 'rating', 'features'];
coffeeShops.forEach(shop => {
    REQUIRED_FIELDS.forEach(field => {
        if (shop[field] === undefined || shop[field] === null) {
            errors.push(`[1] "${shop.id || '(unknown)'}" 缺少必需字段: ${field}`);
        }
    });
});
requiredCount = coffeeShops.length;

// 2. 无重复 ID
const ids = new Map();
coffeeShops.forEach(shop => {
    ids.set(shop.id, (ids.get(shop.id) || 0) + 1);
});
ids.forEach((count, id) => {
    if (count > 1) errors.push(`[2] 重复 ID: "${id}" 出现 ${count} 次`);
});
idCount = ids.size;

// 3. 标签一致性
const validTagNames = [...validTags].sort();
coffeeShops.forEach(shop => {
    (shop.tags || []).forEach(tag => {
        if (!validTags.has(tag)) {
            // 尝试给出建议
            const suggestions = suggestTag(tag, validTagNames);
            const hint = suggestions.length ? ` → 建议: ${suggestions.join(' / ')}` : ' → 不在标签列表中，建议移除';
            errors.push(`[3] "${shop.id}" 使用了未定义标签: "${tag}"${hint}`);
        }
    });
});

// 4. 经纬度范围
coffeeShops.forEach(shop => {
    if (typeof shop.lat === 'number' && (shop.lat < 22.5 || shop.lat > 23.8)) {
        errors.push(`[4] "${shop.id}" 纬度超出广州范围: ${shop.lat} (应为 22.5~23.8)`);
    }
    if (typeof shop.lng === 'number' && (shop.lng < 113.0 || shop.lng > 114.0)) {
        errors.push(`[4] "${shop.id}" 经度超出广州范围: ${shop.lng} (应为 113.0~114.0)`);
    }
});

// 5. 评分范围
coffeeShops.forEach(shop => {
    if (typeof shop.rating === 'number' && (shop.rating < 0 || shop.rating > 5)) {
        errors.push(`[5] "${shop.id}" 评分超出范围: ${shop.rating} (应为 0~5)`);
    }
});

// 6. Featured 引用
const allIds = new Set(coffeeShops.map(s => s.id));
coffeeShops.forEach(shop => {
    if (shop.featured && !allIds.has(shop.id)) {
        errors.push(`[6] featured 店铺 "${shop.id}" 不存在于店铺列表中`);
    }
});

// ---- 输出结果 ----
const areasCovered = new Set(coffeeShops.map(s => s.area));
const avgRating = (coffeeShops.reduce((sum, s) => sum + s.rating, 0) / coffeeShops.length).toFixed(1);

console.log('');
console.log('  广州咖啡指南 - 数据验证');
console.log('  ─────────────────────────────');
console.log(`  店铺总数     ${coffeeShops.length}`);
console.log(`  覆盖区域     ${areasCovered.size} 区`);
console.log(`  标签总数     ${validTags.size}`);
console.log(`  平均评分     ${avgRating}`);
console.log('  ─────────────────────────────');
console.log(`  1. 必需字段   ${requiredCount}/${requiredCount}`);
console.log(`  2. 无重复 ID  ${idCount}/${coffeeShops.length}`);
console.log(`  3. 标签一致性 ${checkStatus(errors, 3)}`);
console.log(`  4. 经纬度范围 ${checkStatus(errors, 4)}`);
console.log(`  5. 评分范围   ${checkStatus(errors, 5)}`);
console.log(`  6. Featured   ${checkStatus(errors, 6)}`);
console.log('  ─────────────────────────────');

if (errors.length === 0) {
    console.log('  ✅ 全部通过！');
    console.log('');
    process.exit(0);
} else {
    console.log(`  ❌ 发现 ${errors.length} 个问题:\n`);
    errors.forEach(e => console.log(`     ${e}`));
    console.log('');
    process.exit(1);
}

// ---- 辅助函数 ----
function checkStatus(errors, checkNum) {
    const has = errors.some(e => e.startsWith(`[${checkNum}]`));
    return has ? `❌ (${errors.filter(e => e.startsWith(`[${checkNum}]`)).length} 个问题)` : '✅';
}

function suggestTag(tag, validTags) {
    const lower = tag.toLowerCase();
    const suggestions = validTags.filter(t => t.toLowerCase() === lower && t !== tag);
    // 模糊匹配（编辑距离 1-2）
    if (suggestions.length === 0) {
        validTags.forEach(t => {
            if (levenshtein(t.toLowerCase(), lower) <= 2 && t !== tag) {
                suggestions.push(t);
            }
        });
    }
    return suggestions;
}

function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}
