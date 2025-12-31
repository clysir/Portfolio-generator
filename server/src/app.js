require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const config = require('./config');
const { sequelize, testConnection } = require('./config/database');
const { authRoutes, workRoutes, portfolioRoutes, uploadRoutes } = require('./routes');

const app = express();

// ============ 中间件配置 ============

// 解析 JSON 请求体
app.use(express.json());

// 解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true }));

// 启用 CORS
app.use(cors({
    origin: config.nodeEnv === 'development'
        ? ['http://localhost:5173', 'http://localhost:3001']  // 开发环境允许前端地址
        : process.env.ALLOWED_ORIGINS?.split(',') || [],
    credentials: true
}));

// 静态文件服务
app.use('/uploads', express.static(config.upload.dir));
app.use('/generated', express.static(config.generated.dir));

// ============ API 路由 ============

app.use('/api/auth', authRoutes);
app.use('/api/works', workRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/upload', uploadRoutes);

// 健康检查接口
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '服务运行正常',
        timestamp: new Date().toISOString()
    });
});

// ============ 错误处理 ============

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在'
    });
});

// 全局错误处理
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: config.nodeEnv === 'development' ? err.message : '服务器内部错误'
    });
});

// ============ 启动服务器 ============

const startServer = async () => {
    try {
        // 确保目录存在
        await Promise.all([
            fs.mkdir(config.upload.dir, { recursive: true }),
            fs.mkdir(config.generated.dir, { recursive: true })
        ]);

        // 测试数据库连接
        await testConnection();

        // 同步数据库模型（开发环境）
        if (config.nodeEnv === 'development') {
            await sequelize.sync({ alter: true });
            console.log('✅ 数据库模型同步完成');
        }

        // 启动服务器
        app.listen(config.port, () => {
            console.log(`🚀 服务器启动成功: http://localhost:${config.port}`);
            console.log(`📚 API 文档: http://localhost:${config.port}/api/health`);
        });
    } catch (error) {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
