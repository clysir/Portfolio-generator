const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { authMiddleware } = require('../middlewares/auth');

/**
 * 作品集相关路由
 */

// GET /api/portfolio/config - 获取作品集配置
router.get('/config', authMiddleware, portfolioController.getConfig);

// PUT /api/portfolio/config - 更新作品集配置
router.put('/config', authMiddleware, portfolioController.updateConfig);

// POST /api/portfolio/generate - 生成静态网站
router.post('/generate', authMiddleware, portfolioController.generate);

// GET /api/portfolio/preview - 获取预览数据
router.get('/preview', authMiddleware, portfolioController.preview);

// GET /api/portfolio/templates - 获取所有模板
router.get('/templates', portfolioController.getTemplates);

module.exports = router;
