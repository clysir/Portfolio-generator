const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * 作品模型
 * 存储用户的作品信息
 */
const Work = sequelize.define('works', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [1, 100]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    coverImage: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'cover_image'
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: '未分类'
    },
    link: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isUrl: true
        },
        set(value) {
            if (typeof value === 'string' && value.trim() === '') {
                this.setDataValue('link', null);
                return;
            }
            this.setDataValue('link', value);
        }
    },
    sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'sort_order'
    }
});

module.exports = Work;
