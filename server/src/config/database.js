const { Sequelize } = require('sequelize');
const config = require('./index');

// 创建 Sequelize 实例连接 MySQL
const sequelize = new Sequelize(
    config.database.name,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        port: config.database.port,
        dialect: config.database.dialect,
        pool: config.database.pool,
        logging: config.nodeEnv === 'development' ? console.log : false,
        define: {
            timestamps: true,      // 自动添加 createdAt 和 updatedAt
            underscored: true,     // 使用下划线命名
            freezeTableName: true  // 禁止表名自动复数化
        }
    }
);

// 测试数据库连接
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ 数据库连接成功');
    } catch (error) {
        console.error('❌ 数据库连接失败:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, testConnection };
