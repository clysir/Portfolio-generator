const authRoutes = require('./auth');
const workRoutes = require('./works');
const portfolioRoutes = require('./portfolio');
const uploadRoutes = require('./upload');

/**
 * 路由索引
 * 集中导出所有路由模块
 */
module.exports = {
    authRoutes,
    workRoutes,
    portfolioRoutes,
    uploadRoutes
};
