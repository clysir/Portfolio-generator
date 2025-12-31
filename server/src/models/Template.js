const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * 模板模型
 * 存储可用的网站模板信息
 */
const Template = sequelize.define('templates', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    previewImage: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'preview_image'
    },
    folderPath: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'folder_path'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    }
});

module.exports = Template;
