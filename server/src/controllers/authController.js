const authService = require('../services/authService');

/**
 * 认证控制器
 * 处理用户注册、登录等 HTTP 请求
 */

// 用户注册
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 参数校验
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: '用户名、邮箱和密码不能为空'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: '密码长度至少为6位'
            });
        }

        const result = await authService.register(username, email, password);

        res.status(201).json({
            success: true,
            message: '注册成功',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 用户登录
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: '邮箱和密码不能为空'
            });
        }

        const result = await authService.login(email, password);

        res.json({
            success: true,
            message: '登录成功',
            data: result
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

// 获取当前用户信息
exports.me = async (req, res) => {
    try {
        const { User } = require('../models');
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            data: user.toSafeObject()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
