const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * 作品集配置模型
 * 存储用户作品集的整体配置信息
 */
const Portfolio = sequelize.define('portfolios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,  // 每个用户只有一个作品集
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    templateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'template_id',
        references: {
            model: 'templates',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: '我的作品集'
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    socialLinks: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
        field: 'social_links'
        // 格式: { github: 'url', linkedin: 'url', twitter: 'url' }
    },
    customConfig: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
        field: 'custom_config'
        // 格式: { primaryColor: '#xxx', fontFamily: 'xxx' }
    },
    generatedUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'generated_url'
    }
});

module.exports = Portfolio;
