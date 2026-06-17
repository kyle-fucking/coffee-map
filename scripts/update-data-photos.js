/**
 * 广州咖啡指南 - 自动更新 data.js 中的 photos 字段
 *
 * 扫描 images/ 目录中的图片，自动为 data.js 添加 photos 字段。
 *
 * 使用方法：
 *   node scripts/update-data-photos.js
 *
 * 运行前确保：
 *   1. 已在 images/<shop-id>/ 下存放了图片
 *   2. data.js 在项目根目录
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'js', 'data.js');
const IMAGE_DIR = path.join(__dirname, '..', 'images');
const IMAGE_EXT = /\.(jpg|jpeg|png|webp|gif|avif)$/i;

function scanImages() {
    const result = {};
    if (!fs.existsSync(IMAGE_DIR)) return result;

    const shopDirs = fs.readdirSync(IMAGE_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory());

    for (const dir of shopDirs) {
        const dirPath = path.join(IMAGE_DIR, dir.name);
        const images = fs.readdirSync(dirPath)
            .filter(f => IMAGE_EXT.test(f))
            .sort();

        if (images.length > 0) {
            result[dir.name] = images.map(f => `images/${dir.name}/${f}`);
        }
    }

    return result;
}

function updateDataJS(shopPhotos) {
    let content = fs.readFileSync(DATA_FILE, 'utf-8');

    // 找到每个咖啡店对象，添加 photos 字段
    for (const [shopId, photos] of Object.entries(shopPhotos)) {
        // 查找该店铺对象
        const regex = new RegExp(`(id:\\s*"${shopId}"[\\s\\S]*?)(\\n\\s*\\},|\\n\\s*\\];)`);
        const match = content.match(regex);

        if (!match) {
            console.log(`  ⚠ 未找到店铺: ${shopId}`);
            continue;
        }

        const shopBlock = match[1];
        const endBlock = match[2];

        // 如果已有 photos 字段，跳过
        if (shopBlock.includes('photos:')) {
            console.log(`  - ${shopId}: photos 字段已存在`);
            continue;
        }

        // 构建 photos 字段字符串
        const photosStr = photos.map(p => `"${p}"`).join(', ');
        const newShopBlock = shopBlock + `\n        photos: [${photosStr}],`;

        const fullMatch = match[0];
        const newFullMatch = newShopBlock + endBlock;

        content = content.replace(fullMatch, newFullMatch);
        console.log(`  ✓ ${shopId}: 已添加 ${photos.length} 张图片`);
    }

    fs.writeFileSync(DATA_FILE, content, 'utf-8');
    console.log('\n✅ data.js 更新完成！');
}

// 主流程
console.log('☕ 正在扫描 images/ 目录...\n');
const shopPhotos = scanImages();

if (Object.keys(shopPhotos).length === 0) {
    console.log('⚠ 未找到任何图片。');
    console.log('');
    console.log('请先在 images/ 目录下为各店铺创建子目录并放入图片，例如：');
    console.log('  images/qianyuan-coffee/');
    console.log('  images/kaqi-coffee/');
    console.log('  ...');
    console.log('');
    console.log('图片文件名任意，支持 jpg/png/webp/gif 格式。');
    process.exit(0);
}

console.log(`找到 ${Object.keys(shopPhotos).length} 家店铺的图片：`);
for (const [shopId, photos] of Object.entries(shopPhotos)) {
    console.log(`  ${shopId}: ${photos.length} 张`);
}

console.log('\n正在更新 data.js...\n');
updateDataJS(shopPhotos);
