const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * 用户模型
 * 存储用户基本信息和认证数据
 */
const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            len: [2, 50]
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash'
    },
    avatar: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    hooks: {
        // 保存前自动加密密码
        beforeCreate: async (user) => {
            if (user.passwordHash) {
                user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('passwordHash')) {
                user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
            }
        }
    }
});

// 验证密码的实例方法
User.prototype.validatePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

// 返回安全的用户对象（不含密码）
User.prototype.toSafeObject = function () {
    return {
        id: this.id,
        username: this.username,
        email: this.email,
        avatar: this.avatar,
        createdAt: this.createdAt
    };
};

module.exports = User;
