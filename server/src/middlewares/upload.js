const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

/**
 * 文件上传中间件配置
 */

// 配置存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.upload.dir);
    },
    filename: (req, file, cb) => {
        // 使用 UUID 生成唯一文件名，保留原扩展名
        const ext = path.extname(file.originalname);
        const uniqueName = `${uuidv4()}${ext}`;
        cb(null, uniqueName);
    }
});

// 文件过滤器：只允许图片
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('只允许上传图片文件 (JPEG, PNG, GIF, WebP)'), false);
    }
};

// 创建上传实例
const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: config.upload.maxSize
    }
});

module.exports = upload;
