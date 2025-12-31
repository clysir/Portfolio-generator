const jwt = require('jsonwebtoken');
const { User, Portfolio } = require('../models');
const config = require('../config');

/**
 * 认证服务
 * 处理用户注册、登录等认证相关逻辑
 */

class AuthService {
    /**
     * 用户注册
     */
    async register(username, email, password) {
        // 检查用户名是否已存在
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            throw new Error('用户名已被使用');
        }

        // 检查邮箱是否已存在
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            throw new Error('邮箱已被注册');
        }

        // 创建用户
        const user = await User.create({
            username,
            email,
            passwordHash: password  // 会在 hook 中自动加密
        });

        // 为新用户创建默认作品集配置
        await Portfolio.create({
            userId: user.id,
            title: `${username}的作品集`
        });

        // 生成 JWT token
        const token = this.generateToken(user.id);

        return {
            user: user.toSafeObject(),
            token
        };
    }

    /**
     * 用户登录
     */
    async login(email, password) {
        // 查找用户
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('邮箱或密码错误');
        }

        // 验证密码
        const isValid = await user.validatePassword(password);
        if (!isValid) {
            throw new Error('邮箱或密码错误');
        }

        // 生成 JWT token
        const token = this.generateToken(user.id);

        return {
            user: user.toSafeObject(),
            token
        };
    }

    /**
     * 生成 JWT Token
     */
    generateToken(userId) {
        return jwt.sign(
            { userId },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );
    }
}

module.exports = new AuthService();
