const User = require('./User');
const Work = require('./Work');
const Template = require('./Template');
const Portfolio = require('./Portfolio');

/**
 * 定义模型之间的关联关系
 */

// 用户与作品：一对多
User.hasMany(Work, { foreignKey: 'userId', as: 'works' });
Work.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 用户与作品集：一对一
User.hasOne(Portfolio, { foreignKey: 'userId', as: 'portfolio' });
Portfolio.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 模板与作品集：一对多
Template.hasMany(Portfolio, { foreignKey: 'templateId', as: 'portfolios' });
Portfolio.belongsTo(Template, { foreignKey: 'templateId', as: 'template' });

module.exports = {
    User,
    Work,
    Template,
    Portfolio
};
