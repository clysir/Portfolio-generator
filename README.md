# 简约个人作品集网站生成系统

> 毕业设计项目 - 基于 Node.js 全栈技术

## 📖 项目简介

一个让用户能够快速创建、编辑和发布个人作品集网站的在线平台。用户无需编程知识，通过可视化界面即可生成专业的个人作品集页面。

## ✨ 核心功能

- **用户管理**：注册、登录、个人信息管理
- **作品管理**：上传、编辑、删除作品（支持图片、文本、链接）
- **模板系统**：提供多套简约风格模板供选择
- **页面生成**：根据用户数据和模板，动态生成静态网站
- **在线预览**：实时预览生成效果
- **一键发布**：生成可访问的个人作品集链接

## 🛠️ 技术栈

| 模块 | 技术 |
|------|------|
| **前端** | React 19 + Vite |
| **后端** | Express.js + Node.js |
| **数据库** | MySQL 8.0 + Sequelize ORM |
| **模板引擎** | EJS |
| **认证** | JWT |

## 📁 项目结构

```
portfolio-generator/
├── client/                 # 前端项目 (React + Vite)
│   ├── src/
│   │   ├── api/            # API 接口封装
│   │   ├── contexts/       # React Context
│   │   ├── pages/          # 页面组件
│   │   └── App.jsx         # 主入口
│   └── package.json
│
├── server/                 # 后端项目 (Express)
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   ├── middlewares/    # 中间件
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── services/       # 业务逻辑
│   │   ├── templates/      # 网站模板
│   │   └── app.js          # 主入口
│   ├── uploads/            # 用户上传文件
│   ├── generated/          # 生成的网站
│   └── package.json
│
└── README.md
```

## 🚀 快速开始

### 1. 环境要求

- Node.js >= 16.0
- MySQL >= 8.0
- npm >= 8.0

---

## 💻 Windows 系统详细安装指南

### 第一步：安装 Node.js（包含 npm）

1. **下载 Node.js 安装包**
   - 访问 Node.js 官网：https://nodejs.org/zh-cn/
   - 点击 **LTS（长期支持版）** 下载按钮（推荐 18.x 或 20.x 版本）
   - 下载文件名类似：`node-v20.x.x-x64.msi`

2. **安装 Node.js**
   - 双击下载的 `.msi` 文件
   - 点击 "Next" 同意许可协议
   - 保持默认安装路径（如 `C:\Program Files\nodejs\`）
   - **重要**：确保勾选 "Add to PATH" 选项
   - 点击 "Install" 完成安装

3. **验证安装**
   - 按 `Win + R`，输入 `cmd`，回车打开命令提示符
   - 执行以下命令验证：
   ```cmd
   node --version
   npm --version
   ```
   - 如果显示版本号（如 `v20.10.0` 和 `10.2.0`），说明安装成功

---

### 第二步：安装 MySQL 数据库

1. **下载 MySQL 安装包**
   - 访问 MySQL 官网：https://dev.mysql.com/downloads/installer/
   - 点击 "MySQL Installer for Windows"
   - 选择 **mysql-installer-community-8.x.x.msi**（约 300MB 的完整版）
   - 点击 "Download"，可选择 "No thanks, just start my download"

2. **安装 MySQL**
   - 双击下载的安装包
   - 选择安装类型：**Developer Default**（开发者默认）或 **Server only**（仅服务器）
   - 点击 "Next" 并 "Execute" 安装必需组件
   - 配置选项：
     - Config Type: 选择 **Development Computer**
     - Port: 保持默认 **3306**
     - **设置 root 密码**：请牢记此密码！（建议设置为 `123456` 或其他好记的密码）
   - 完成安装

3. **验证 MySQL 安装**
   - 打开命令提示符（cmd）
   - 执行：
   ```cmd
   mysql -u root -p
   ```
   - 输入你设置的密码，如果进入 MySQL 命令行（显示 `mysql>`），说明安装成功
   - 输入 `exit` 退出

4. **如果 mysql 命令找不到，需要添加环境变量**
   - 右键 "此电脑" → "属性" → "高级系统设置" → "环境变量"
   - 在 "系统变量" 中找到 `Path`，点击 "编辑"
   - 点击 "新建"，添加 MySQL bin 目录路径（通常是）：
     ```
     C:\Program Files\MySQL\MySQL Server 8.0\bin
     ```
   - 点击 "确定" 保存，重新打开命令提示符测试

---

### 第三步：下载项目代码

**方式一：使用 Git（推荐）**
```cmd
# 如果没有 Git，先安装：https://git-scm.com/download/win
git clone <项目仓库地址>
cd portfolio-generator
```

**方式二：直接复制项目文件夹**
- 将项目文件夹复制到你想要的位置，如 `D:\Projects\portfolio-generator`

---

### 第四步：初始化数据库

1. **打开命令提示符，登录 MySQL**
   ```cmd
   mysql -u root -p
   ```

2. **输入密码后，执行以下 SQL 命令**
   ```sql
   -- 创建数据库
   CREATE DATABASE portfolio_generator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

   -- 查看数据库是否创建成功
   SHOW DATABASES;

   -- 退出 MySQL
   EXIT;
   ```

3. **或者直接执行初始化脚本**
   ```cmd
   # 进入项目的 server 目录
   cd D:\Projects\portfolio-generator\server

   # 执行 SQL 脚本
   mysql -u root -p < init.sql
   ```

---

### 第五步：配置后端

1. **打开命令提示符，进入 server 目录**
   ```cmd
   cd D:\Projects\portfolio-generator\server
   ```

2. **安装依赖**
   ```cmd
   npm install
   ```
   > 如果下载慢，可以先设置淘宝镜像：
   > ```cmd
   > npm config set registry https://registry.npmmirror.com
   > ```

3. **创建环境配置文件**
   ```cmd
   # Windows 使用 copy 命令（不是 cp）
   copy .env.example .env
   ```

4. **编辑 .env 文件**
   - 用记事本或 VS Code 打开 `server/.env` 文件
   - 修改数据库配置（主要修改密码）：
   ```env
   PORT=3000
   NODE_ENV=development

   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=portfolio_generator
   DB_USER=root
   DB_PASSWORD=你的MySQL密码

   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

5. **启动后端服务**
   ```cmd
   npm run dev
   ```
   - 看到 `🚀 服务器启动成功: http://localhost:3000` 表示成功
   - **保持此窗口开启，不要关闭**

---

### 第六步：配置前端

1. **新开一个命令提示符窗口**（按 `Win + R`，输入 `cmd`）

2. **进入 client 目录**
   ```cmd
   cd D:\Projects\portfolio-generator\client
   ```

3. **安装依赖**
   ```cmd
   npm install
   ```

4. **（可选）配置前端环境变量**
   ```cmd
   copy .env.example .env
   ```
   - 默认后端地址为 `http://localhost:3000`，如修改了后端端口/域名，请同步修改 `client/.env`

5. **启动前端开发服务器**
   ```cmd
   npm run dev
   ```
   - 看到 `Local: http://localhost:5173/` 表示成功

---

### 第七步：访问应用

打开浏览器，访问：
- **前端应用**: http://localhost:5173
- **后端 API**: http://localhost:3000/api/health

现在你可以：
1. 注册一个新账户
2. 添加作品
3. 配置作品集信息
4. 一键生成你的个人作品集网站！

---

## 🐧 Linux/macOS 系统快速配置

### 数据库配置

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE portfolio_generator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 后端配置

```bash
cd server

# 安装依赖
npm install

# 复制环境变量配置
cp .env.example .env

# 编辑 .env 文件，配置数据库连接信息
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=portfolio_generator
# DB_USER=root
# DB_PASSWORD=your_password

# 启动服务
npm run dev
```

### 前端配置

```bash
cd client

# 安装依赖
npm install

# （可选）配置前端环境变量
cp .env.example .env

# 启动开发服务器
npm run dev
```

### 访问应用

- 前端: http://localhost:5173
- 后端 API: http://localhost:3000/api

---

## ❓ 常见问题

### Q1: npm install 下载很慢怎么办？
```cmd
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 然后重新安装
npm install
```

### Q2: 提示 "mysql 不是内部或外部命令"
- 需要将 MySQL 的 bin 目录添加到系统 PATH 环境变量
- 路径通常是：`C:\Program Files\MySQL\MySQL Server 8.0\bin`

### Q3: 数据库连接失败
- 检查 MySQL 服务是否启动（在 Windows 服务中查看）
- 确认 `.env` 文件中的密码是否正确
- 确认数据库 `portfolio_generator` 是否已创建

### Q4: 端口被占用
- 后端默认端口 3000，前端默认端口 5173
- 如果被占用，可在配置文件中修改端口

---

## 📚 API 接口

| 路径 | 方法 | 描述 |
|------|------|------|
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/me` | GET | 获取当前用户 |
| `/api/works` | GET/POST | 作品列表/创建 |
| `/api/works/:id` | PUT/DELETE | 更新/删除作品 |
| `/api/portfolio/config` | GET/PUT | 作品集配置 |
| `/api/portfolio/generate` | POST | 生成网站 |
| `/api/upload/image` | POST | 上传图片 |

## 📋 开发计划

- [x] 项目架构设计
- [x] 数据库模型设计
- [x] 后端 API 开发
- [x] 前端页面开发
- [x] 网站生成功能
- [ ] 更多模板
- [ ] 部署优化

## 📄 License

MIT License
