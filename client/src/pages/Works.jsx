import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workAPI, uploadAPI, resolveBackendUrl } from '../api';
import './Works.css';

/**
 * 作品管理页面
 */
const Works = () => {
    const navigate = useNavigate();
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingWork, setEditingWork] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        link: '',
        coverImage: ''
    });

    // 加载作品列表
    useEffect(() => {
        loadWorks();
    }, []);

    const loadWorks = async () => {
        try {
            const res = await workAPI.getAll();
            setWorks(res.data || []);
        } catch (err) {
            console.error('加载作品失败:', err);
        } finally {
            setLoading(false);
        }
    };

    // 打开新建/编辑弹窗
    const openModal = (work = null) => {
        if (work) {
            setEditingWork(work);
            setFormData({
                title: work.title || '',
                description: work.description || '',
                category: work.category || '',
                link: work.link || '',
                coverImage: work.coverImage || ''
            });
        } else {
            setEditingWork(null);
            setFormData({
                title: '',
                description: '',
                category: '',
                link: '',
                coverImage: ''
            });
        }
        setShowModal(true);
    };

    // 处理图片上传
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const res = await uploadAPI.uploadImage(file);
            setFormData(prev => ({ ...prev, coverImage: res.data.url }));
        } catch {
            alert('图片上传失败');
        }
    };

    // 提交表单
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingWork) {
                await workAPI.update(editingWork.id, formData);
            } else {
                await workAPI.create(formData);
            }
            setShowModal(false);
            loadWorks();
        } catch (err) {
            alert('保存失败: ' + (err.message || '请稍后再试'));
        }
    };

    // 删除作品
    const handleDelete = async (id) => {
        if (!confirm('确定要删除这个作品吗？')) return;

        try {
            await workAPI.delete(id);
            loadWorks();
        } catch {
            alert('删除失败');
        }
    };

    if (loading) {
        return <div className="loading">加载中...</div>;
    }

    return (
        <div className="works-page">
            {/* 顶部 */}
            <header className="works-header">
                <button onClick={() => navigate('/dashboard')} className="btn-back">
                    ← 返回
                </button>
                <h1>作品管理</h1>
                <button onClick={() => openModal()} className="btn-add">
                    + 添加作品
                </button>
            </header>

            {/* 作品列表 */}
            <main className="works-content">
                {works.length > 0 ? (
                    <div className="works-list">
                        {works.map(work => (
                            <div key={work.id} className="work-card">
                                <div className="work-cover">
                                    {work.coverImage ? (
                                        <img src={resolveBackendUrl(work.coverImage)} alt={work.title} />
                                    ) : (
                                        <div className="cover-placeholder">{work.title.charAt(0)}</div>
                                    )}
                                </div>
                                <div className="work-info">
                                    <h3>{work.title}</h3>
                                    <span className="work-category">{work.category || '未分类'}</span>
                                    {work.description && (
                                        <p className="work-desc">{work.description}</p>
                                    )}
                                </div>
                                <div className="work-actions">
                                    <button onClick={() => openModal(work)} className="btn-edit">
                                        编辑
                                    </button>
                                    <button onClick={() => handleDelete(work.id)} className="btn-delete">
                                        删除
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-works">
                        <p>还没有添加任何作品</p>
                        <button onClick={() => openModal()} className="btn-primary">
                            添加第一个作品
                        </button>
                    </div>
                )}
            </main>

            {/* 新建/编辑弹窗 */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{editingWork ? '编辑作品' : '添加作品'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>作品标题 *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="请输入作品标题"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>作品描述</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="简要描述这个作品..."
                                    rows={3}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>分类</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        placeholder="如：Web设计"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>项目链接</label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>封面图片</label>
                                <div className="image-upload">
                                    {formData.coverImage ? (
                                        <div className="image-preview">
                                            <img src={resolveBackendUrl(formData.coverImage)} alt="封面" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                                            >
                                                移除
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="upload-area">
                                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                                            <span>点击上传封面图片</span>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                                    取消
                                </button>
                                <button type="submit" className="btn-save">
                                    保存
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Works;
