const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { authMiddleware } = require('../middlewares/auth');
const path = require('path');

/**
 * 文件上传路由
 */

// POST /api/upload/image - 上传图片
router.post('/image', authMiddleware, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '请选择要上传的图片'
            });
        }

        // 返回图片 URL
        const imageUrl = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            message: '上传成功',
            data: {
                url: imageUrl,
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 错误处理中间件 (处理 multer 错误)
router.use((error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: '文件大小超过限制 (最大 5MB)'
        });
    }

    res.status(400).json({
        success: false,
        message: error.message
    });
});

module.exports = router;
