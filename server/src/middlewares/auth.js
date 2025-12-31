const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * JWT 认证中间件
 * 验证请求头中的 Bearer Token
 */
const authMiddleware = (req, res, next) => {
    // 获取 Authorization 头
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: '未提供认证令牌'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 验证 token
        const decoded = jwt.verify(token, config.jwt.secret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: '认证令牌无效或已过期'
        });
    }
};

/**
 * 可选认证中间件
 * 如果提供了 token 则验证，否则继续执行
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, config.jwt.secret);
            req.userId = decoded.userId;
        } catch (error) {
            // Token 无效，但不阻止请求
        }
    }
    next();
};

module.exports = { authMiddleware, optionalAuth };
