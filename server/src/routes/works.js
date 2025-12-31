const express = require('express');
const router = express.Router();
const workController = require('../controllers/workController');
const { authMiddleware } = require('../middlewares/auth');

/**
 * 作品相关路由
 * 所有路由都需要认证
 */

// GET /api/works - 获取所有作品
router.get('/', authMiddleware, workController.getWorks);

// POST /api/works - 创建作品
router.post('/', authMiddleware, workController.createWork);

// PUT /api/works/order - 更新作品排序
router.put('/order', authMiddleware, workController.updateOrder);

// PUT /api/works/:id - 更新作品
router.put('/:id', authMiddleware, workController.updateWork);

// DELETE /api/works/:id - 删除作品
router.delete('/:id', authMiddleware, workController.deleteWork);

module.exports = router;
