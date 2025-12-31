const workService = require('../services/workService');

/**
 * 作品控制器
 * 处理作品的 CRUD HTTP 请求
 */

// 获取当前用户的所有作品
exports.getWorks = async (req, res) => {
    try {
        const works = await workService.getWorksByUserId(req.userId);

        res.json({
            success: true,
            data: works
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 创建作品
exports.createWork = async (req, res) => {
    try {
        const { title, description, coverImage, category, link } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: '作品标题不能为空'
            });
        }

        const work = await workService.createWork(req.userId, {
            title,
            description,
            coverImage,
            category,
            link
        });

        res.status(201).json({
            success: true,
            message: '作品创建成功',
            data: work
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 更新作品
exports.updateWork = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const work = await workService.updateWork(id, req.userId, updateData);

        res.json({
            success: true,
            message: '作品更新成功',
            data: work
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 删除作品
exports.deleteWork = async (req, res) => {
    try {
        const { id } = req.params;

        await workService.deleteWork(id, req.userId);

        res.json({
            success: true,
            message: '作品删除成功'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 更新作品排序
exports.updateOrder = async (req, res) => {
    try {
        const { workIds } = req.body;

        if (!Array.isArray(workIds)) {
            return res.status(400).json({
                success: false,
                message: 'workIds 必须是数组'
            });
        }

        await workService.updateWorkOrder(req.userId, workIds);

        res.json({
            success: true,
            message: '排序更新成功'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
