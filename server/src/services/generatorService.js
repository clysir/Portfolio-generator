const ejs = require('ejs');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { User, Work, Portfolio, Template } = require('../models');
const config = require('../config');

/**
 * 网站生成服务
 * 根据用户数据和模板生成静态网站
 */
class GeneratorService {
    /**
     * 将任意字符串转换为安全的目录名片段
     */
    toSafePathSegment(value, fallback) {
        const input = (value ?? '').toString();
        const cleaned = input
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '')
            .slice(0, 32);

        return cleaned || fallback;
    }

    /**
     * 生成用户的作品集网站
     */
    async generatePortfolio(userId) {
        // 获取用户信息
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('用户不存在');
        }

        // 获取作品集配置
        const portfolio = await Portfolio.findOne({
            where: { userId },
            include: [{ model: Template, as: 'template' }]
        });

        if (!portfolio) {
            throw new Error('请先配置作品集信息');
        }

        // 获取用户作品
        const works = await Work.findAll({
            where: { userId },
            order: [['sortOrder', 'ASC']]
        });

        // 确定使用的模板
        const templatePath = portfolio.template
            ? path.join(__dirname, '..', 'templates', portfolio.template.folderPath)
            : path.join(__dirname, '..', 'templates', 'minimal');

        // 准备模板数据
        const templateData = {
            user: user.toSafeObject(),
            portfolio: {
                title: portfolio.title,
                bio: portfolio.bio,
                socialLinks: portfolio.socialLinks || {},
                customConfig: portfolio.customConfig || {}
            },
            works: works.map(w => ({
                id: w.id,
                title: w.title,
                description: w.description,
                coverImage: w.coverImage,
                category: w.category,
                link: w.link
            }))
        };

        // 生成唯一的输出目录
        const outputId = uuidv4().slice(0, 8);
        const safeUserPart = this.toSafePathSegment(user.username, `user-${user.id}`);
        const outputDirName = `${safeUserPart}-${outputId}`;
        const outputDir = path.join(config.generated.dir, outputDirName);

        // 创建输出目录
        await fs.mkdir(outputDir, { recursive: true });

        // 读取并渲染模板
        const templateFile = path.join(templatePath, 'index.ejs');
        const templateContent = await fs.readFile(templateFile, 'utf-8');
        const html = ejs.render(templateContent, templateData);

        // 写入生成的 HTML
        await fs.writeFile(path.join(outputDir, 'index.html'), html);

        // 复制模板的静态资源 (CSS, JS, images)
        await this.copyStaticAssets(templatePath, outputDir);

        // 更新作品集的生成 URL
        const generatedUrl = `/generated/${outputDirName}`;
        await portfolio.update({ generatedUrl });

        return {
            url: generatedUrl
        };
    }

    /**
     * 复制静态资源
     */
    async copyStaticAssets(srcDir, destDir) {
        const items = ['css', 'js', 'images', 'assets'];

        for (const item of items) {
            const srcPath = path.join(srcDir, item);
            const destPath = path.join(destDir, item);

            try {
                await fs.access(srcPath);
                await this.copyDir(srcPath, destPath);
            } catch (e) {
                // 目录不存在，跳过
            }
        }
    }

    /**
     * 递归复制目录
     */
    async copyDir(src, dest) {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                await this.copyDir(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    /**
     * 获取预览数据（不生成文件）
     */
    async getPreviewData(userId) {
        const user = await User.findByPk(userId);
        const portfolio = await Portfolio.findOne({ where: { userId } });
        const works = await Work.findAll({
            where: { userId },
            order: [['sortOrder', 'ASC']]
        });

        return {
            user: user.toSafeObject(),
            portfolio,
            works
        };
    }
}

module.exports = new GeneratorService();
