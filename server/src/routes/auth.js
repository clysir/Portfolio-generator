const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

/**
 * 认证相关路由
 */

// POST /api/auth/register - 用户注册
router.post('/register', authController.register);

// POST /api/auth/login - 用户登录
router.post('/login', authController.login);

// GET /api/auth/me - 获取当前用户信息 (需要认证)
router.get('/me', authMiddleware, authController.me);

module.exports = router;
