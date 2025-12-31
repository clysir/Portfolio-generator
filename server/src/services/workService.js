const { Work } = require('../models');

/**
 * 作品服务
 * 处理作品的 CRUD 操作
 */
class WorkService {
    /**
     * 获取用户的所有作品
     */
    async getWorksByUserId(userId) {
        return Work.findAll({
            where: { userId },
            order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
        });
    }

    /**
     * 创建作品
     */
    async createWork(userId, workData) {
        // 获取当前最大排序值
        const maxOrder = await Work.max('sortOrder', { where: { userId } }) || 0;

        return Work.create({
            ...workData,
            userId,
            sortOrder: maxOrder + 1
        });
    }

    /**
     * 更新作品
     */
    async updateWork(workId, userId, updateData) {
        const work = await Work.findOne({ where: { id: workId, userId } });

        if (!work) {
            throw new Error('作品不存在或无权限修改');
        }

        return work.update(updateData);
    }

    /**
     * 删除作品
     */
    async deleteWork(workId, userId) {
        const work = await Work.findOne({ where: { id: workId, userId } });

        if (!work) {
            throw new Error('作品不存在或无权限删除');
        }

        await work.destroy();
        return { message: '删除成功' };
    }

    /**
     * 更新作品排序
     */
    async updateWorkOrder(userId, workIds) {
        const updates = workIds.map((id, index) =>
            Work.update({ sortOrder: index }, { where: { id, userId } })
        );
        await Promise.all(updates);
        return { message: '排序更新成功' };
    }
}

module.exports = new WorkService();
