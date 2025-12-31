import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { portfolioAPI } from '../api';
import './Settings.css';

/**
 * 作品集设置页面
 */
const Settings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        bio: '',
        templateId: null,
        socialLinks: {
            github: '',
            linkedin: '',
            email: ''
        }
    });

    // 加载数据
    useEffect(() => {
        const loadData = async () => {
            try {
                const [configRes, templatesRes] = await Promise.all([
                    portfolioAPI.getConfig(),
                    portfolioAPI.getTemplates()
                ]);

                const config = configRes.data || {};
                setFormData({
                    title: config.title || '',
                    bio: config.bio || '',
                    templateId: config.templateId || null,
                    socialLinks: config.socialLinks || { github: '', linkedin: '', email: '' }
                });
                setTemplates(templatesRes.data || []);
            } catch (err) {
                console.error('加载配置失败:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // 保存设置
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await portfolioAPI.updateConfig(formData);
            alert('设置已保存');
        } catch (err) {
            alert('保存失败: ' + (err.message || '请稍后再试'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading">加载中...</div>;
    }

    return (
        <div className="settings-page">
            <header className="settings-header">
                <button onClick={() => navigate('/dashboard')} className="btn-back">
                    ← 返回
                </button>
                <h1>作品集设置</h1>
                <div></div>
            </header>

            <main className="settings-content">
                <form onSubmit={handleSubmit}>
                    {/* 基本信息 */}
                    <section className="settings-section">
                        <h2>基本信息</h2>

                        <div className="form-group">
                            <label>作品集标题</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="如：我的设计作品集"
                            />
                        </div>

                        <div className="form-group">
                            <label>个人简介</label>
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="介绍一下你自己..."
                                rows={4}
                            />
                        </div>
                    </section>

                    {/* 社交链接 */}
                    <section className="settings-section">
                        <h2>社交链接</h2>

                        <div className="form-group">
                            <label>GitHub</label>
                            <input
                                type="url"
                                value={formData.socialLinks.github}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    socialLinks: { ...prev.socialLinks, github: e.target.value }
                                }))}
                                placeholder="https://github.com/username"
                            />
                        </div>

                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input
                                type="url"
                                value={formData.socialLinks.linkedin}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                                }))}
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>

                        <div className="form-group">
                            <label>邮箱</label>
                            <input
                                type="email"
                                value={formData.socialLinks.email}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    socialLinks: { ...prev.socialLinks, email: e.target.value }
                                }))}
                                placeholder="your@email.com"
                            />
                        </div>
                    </section>

                    {/* 模板选择 */}
                    <section className="settings-section">
                        <h2>选择模板</h2>

                        <div className="template-grid">
                            {templates.length > 0 ? (
                                templates.map(template => (
                                    <div
                                        key={template.id}
                                        className={`template-card ${formData.templateId === template.id ? 'selected' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, templateId: template.id }))}
                                    >
                                        <div className="template-preview">
                                            {template.previewImage ? (
                                                <img src={template.previewImage} alt={template.name} />
                                            ) : (
                                                <div className="template-placeholder">{template.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <span className="template-name">{template.name}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="template-card selected">
                                    <div className="template-preview">
                                        <div className="template-placeholder">M</div>
                                    </div>
                                    <span className="template-name">Minimal (默认)</span>
                                </div>
                            )}
                        </div>
                    </section>

                    <button type="submit" className="btn-save" disabled={saving}>
                        {saving ? '保存中...' : '保存设置'}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default Settings;
