const { Portfolio, Template } = require('../models');
const generatorService = require('../services/generatorService');

/**
 * 作品集控制器
 * 处理作品集配置和网站生成
 */

// 获取作品集配置
exports.getConfig = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({
            where: { userId: req.userId },
            include: [{ model: Template, as: 'template' }]
        });

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: '作品集不存在'
            });
        }

        res.json({
            success: true,
            data: portfolio
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 更新作品集配置
exports.updateConfig = async (req, res) => {
    try {
        const { title, bio, socialLinks, customConfig, templateId } = req.body;

        let portfolio = await Portfolio.findOne({ where: { userId: req.userId } });

        if (!portfolio) {
            // 如果不存在则创建
            portfolio = await Portfolio.create({
                userId: req.userId,
                title,
                bio,
                socialLinks,
                customConfig,
                templateId
            });
        } else {
            // 更新现有配置
            await portfolio.update({
                title: title ?? portfolio.title,
                bio: bio ?? portfolio.bio,
                socialLinks: socialLinks ?? portfolio.socialLinks,
                customConfig: customConfig ?? portfolio.customConfig,
                templateId: templateId ?? portfolio.templateId
            });
        }

        res.json({
            success: true,
            message: '配置更新成功',
            data: portfolio
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 生成静态网站
exports.generate = async (req, res) => {
    try {
        const result = await generatorService.generatePortfolio(req.userId);

        res.json({
            success: true,
            message: '网站生成成功',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 获取预览数据
exports.preview = async (req, res) => {
    try {
        const data = await generatorService.getPreviewData(req.userId);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取所有可用模板
exports.getTemplates = async (req, res) => {
    try {
        const templates = await Template.findAll({
            where: { isActive: true }
        });

        res.json({
            success: true,
            data: templates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
