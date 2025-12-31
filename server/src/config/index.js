require('dotenv').config();
const path = require('path');

const serverRoot = path.join(__dirname, '..', '..');
const resolveFromServerRoot = (p) => (path.isAbsolute(p) ? p : path.join(serverRoot, p));

module.exports = {
  // 服务器配置
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'portfolio_generator',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // 文件上传配置
  upload: {
    dir: resolveFromServerRoot(process.env.UPLOAD_DIR || './uploads'),
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },

  // 生成网站配置
  generated: {
    dir: resolveFromServerRoot(process.env.GENERATED_DIR || './generated')
  }
};
