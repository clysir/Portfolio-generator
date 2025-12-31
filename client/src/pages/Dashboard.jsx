import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { workAPI, portfolioAPI, resolveBackendUrl } from '../api';
import './Dashboard.css';

/**
 * 仪表盘页面
 * 用户主控制台
 */
const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [works, setWorks] = useState([]);
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // 加载数据
    useEffect(() => {
        const loadData = async () => {
            try {
                const [worksRes, portfolioRes] = await Promise.all([
                    workAPI.getAll(),
                    portfolioAPI.getConfig()
                ]);
                setWorks(worksRes.data || []);
                setPortfolio(portfolioRes.data);
            } catch (err) {
                console.error('加载数据失败:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // 生成网站
    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const res = await portfolioAPI.generate();
            alert(`网站生成成功！访问地址: ${resolveBackendUrl(res.data.url)}`);
            // 刷新作品集配置以获取新的 URL
            const portfolioRes = await portfolioAPI.getConfig();
            setPortfolio(portfolioRes.data);
        } catch (err) {
            alert('生成失败: ' + (err.message || '请稍后再试'));
        } finally {
            setGenerating(false);
        }
    };

    // 退出登录
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <div className="loading">加载中...</div>;
    }

    const generatedSiteUrl = portfolio?.generatedUrl ? resolveBackendUrl(portfolio.generatedUrl) : '';

    return (
        <div className="dashboard">
            {/* 顶部导航 */}
            <header className="dashboard-header">
                <h1>🎨 作品集管理</h1>
                <div className="header-right">
                    <span className="user-name">👋 {user?.username}</span>
                    <button onClick={handleLogout} className="btn-logout">退出</button>
                </div>
            </header>

            {/* 主内容区 */}
            <main className="dashboard-main">
                {/* 快捷操作卡片 */}
                <section className="quick-actions">
                    <div className="action-card" onClick={() => navigate('/works')}>
                        <span className="action-icon">📁</span>
                        <h3>管理作品</h3>
                        <p>添加、编辑或删除您的作品</p>
                        <span className="badge">{works.length} 个作品</span>
                    </div>

                    <div className="action-card" onClick={() => navigate('/settings')}>
                        <span className="action-icon">⚙️</span>
                        <h3>作品集设置</h3>
                        <p>编辑个人信息和模板</p>
                    </div>

                    <div className="action-card generate" onClick={handleGenerate}>
                        <span className="action-icon">🚀</span>
                        <h3>{generating ? '生成中...' : '生成网站'}</h3>
                        <p>一键生成您的作品集网站</p>
                    </div>
                </section>

                {/* 状态信息 */}
                {portfolio?.generatedUrl && (
                    <section className="status-section">
                        <h2>📌 已生成的网站</h2>
                        <div className="status-card">
                            <p>您的作品集网站已就绪：</p>
                            <a
                                href={generatedSiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="generated-link"
                            >
                                {generatedSiteUrl}
                            </a>
                        </div>
                    </section>
                )}

                {/* 作品预览 */}
                <section className="works-preview">
                    <h2>📚 我的作品</h2>
                    {works.length > 0 ? (
                        <div className="works-grid">
                            {works.slice(0, 4).map(work => (
                                <div key={work.id} className="work-item">
                                    {work.coverImage ? (
                                        <img src={resolveBackendUrl(work.coverImage)} alt={work.title} />
                                    ) : (
                                        <div className="work-placeholder">{work.title.charAt(0)}</div>
                                    )}
                                    <h4>{work.title}</h4>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>还没有添加作品</p>
                            <button onClick={() => navigate('/works')} className="btn-primary">
                                添加第一个作品
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
