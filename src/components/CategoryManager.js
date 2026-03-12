/**
 * Category Manager Component
 * Create, edit, and delete modifier categories
 *
 * @since 1.0.8
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
    Card,
    CardHeader,
    CardBody,
    TextControl,
    TextareaControl,
    ToggleControl,
    Button,
    Notice,
    Spinner,
    Modal,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        slug: '',
        label: '',
        description: '',
        exclusive: true,
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const response = await apiFetch({
                path: '/block-style-modifiers/v1/categories',
            });
            setCategories(response);
        } catch (error) {
            setNotice({
                status: 'error',
                message: __('Failed to load categories.', 'block-style-modifiers'),
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            slug: '',
            label: '',
            description: '',
            exclusive: true,
        });
        setEditingCategory(null);
    };

    const validateForm = () => {
        if (!formData.slug || !formData.label) {
            setNotice({
                status: 'error',
                message: __('Slug and Label are required fields.', 'block-style-modifiers'),
            });
            return false;
        }

        if (formData.slug.includes(' ')) {
            setNotice({
                status: 'error',
                message: __('Slug cannot contain spaces.', 'block-style-modifiers'),
            });
            return false;
        }

        return true;
    };

    const saveCategory = async () => {
        if (!validateForm()) {
            return;
        }

        setSaving(true);
        setNotice(null);

        try {
            if (editingCategory) {
                // Update existing category
                await apiFetch({
                    path: `/block-style-modifiers/v1/categories/${editingCategory.slug}`,
                    method: 'PUT',
                    data: formData,
                });

                setNotice({
                    status: 'success',
                    message: __('Category updated successfully!', 'block-style-modifiers'),
                });
            } else {
                // Create new category
                await apiFetch({
                    path: '/block-style-modifiers/v1/categories',
                    method: 'POST',
                    data: formData,
                });

                setNotice({
                    status: 'success',
                    message: __('Category created successfully!', 'block-style-modifiers'),
                });
            }

            resetForm();
            await loadCategories();
        } catch (error) {
            setNotice({
                status: 'error',
                message: error.message || __('Failed to save category.', 'block-style-modifiers'),
            });
        } finally {
            setSaving(false);
        }
    };

    const editCategory = (category) => {
        setFormData({ ...category });
        setEditingCategory(category);
        setNotice(null);
    };

    const deleteCategory = async (slug) => {
        if (!confirm(__('Are you sure you want to delete this category?', 'block-style-modifiers'))) {
            return;
        }

        try {
            await apiFetch({
                path: `/block-style-modifiers/v1/categories/${slug}`,
                method: 'DELETE',
            });

            setNotice({
                status: 'success',
                message: __('Category deleted successfully!', 'block-style-modifiers'),
            });

            await loadCategories();
        } catch (error) {
            setNotice({
                status: 'error',
                message: error.message || __('Failed to delete category.', 'block-style-modifiers'),
            });
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                <Spinner />
            </div>
        );
    }

    return (
        <div className="bsm-admin__category-manager">
            {notice && (
                <Notice
                    status={notice.status}
                    onRemove={() => setNotice(null)}
                    isDismissible
                >
                    {notice.message}
                </Notice>
            )}

            <Card style={{ marginBottom: '24px', border: '1px solid #e2e4e7', borderRadius: '4px' }}>
                <CardHeader style={{ padding: '16px 24px', borderBottom: '1px solid #e2e4e7', background: '#f8f9f9', margin: 0 }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                        {editingCategory
                            ? __('Edit Category', 'block-style-modifiers')
                            : __('Add New Category', 'block-style-modifiers')}
                    </h3>
                </CardHeader>
                <CardBody style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <TextControl
                            label={__('Category Slug', 'block-style-modifiers')}
                            help={__(
                                'Unique identifier (lowercase, no spaces, use hyphens)',
                                'block-style-modifiers'
                            )}
                            value={formData.slug}
                            onChange={(value) =>
                                setFormData({ ...formData, slug: value.toLowerCase() })
                            }
                            disabled={!!editingCategory}
                            required
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom
                        />

                        <TextControl
                            label={__('Category Label', 'block-style-modifiers')}
                            help={__('Display name for the category', 'block-style-modifiers')}
                            value={formData.label}
                            onChange={(value) => setFormData({ ...formData, label: value })}
                            required
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom
                        />

                        <TextareaControl
                            label={__('Description', 'block-style-modifiers')}
                            help={__('Optional description for the category', 'block-style-modifiers')}
                            value={formData.description}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                            rows={3}
                            __nextHasNoMarginBottom
                        />

                        <ToggleControl
                            label={__('Exclusive Category', 'block-style-modifiers')}
                            help={__(
                                'If enabled, only one modifier from this category can be selected at a time (radio behavior). Otherwise, multiple modifiers can be selected (checkbox behavior).',
                                'block-style-modifiers'
                            )}
                            checked={formData.exclusive}
                            onChange={(value) => setFormData({ ...formData, exclusive: value })}
                            __nextHasNoMarginBottom
                        />

                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <Button
                                variant="primary"
                                onClick={saveCategory}
                                isBusy={saving}
                                disabled={saving}
                            >
                                {saving
                                    ? __('Saving...', 'block-style-modifiers')
                                    : editingCategory
                                        ? __('Update Category', 'block-style-modifiers')
                                        : __('Add Category', 'block-style-modifiers')}
                            </Button>

                            {editingCategory && (
                                <Button variant="secondary" onClick={resetForm} disabled={saving}>
                                    {__('Cancel', 'block-style-modifiers')}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>

            <div style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1e1e1e' }}>{__('Existing Categories', 'block-style-modifiers')}</h3>

                {categories.length === 0 ? (
                    <Card style={{ padding: '32px', textAlign: 'center', background: '#f9f9f9' }}>
                        <p style={{ margin: 0, color: '#646970', fontSize: '15px' }}>{__('No custom categories created yet.', 'block-style-modifiers')}</p>
                    </Card>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {categories.map((category) => (
                            <Card key={category.slug}>
                                <CardHeader style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                                    <div>
                                        <strong style={{ fontSize: '16px' }}>{category.label}</strong>
                                        <div style={{ fontSize: '13px', color: '#646970', marginTop: '4px' }}>
                                            <span style={{ fontWeight: '500' }}>{__('Slug:', 'block-style-modifiers')}</span> <span style={{ fontFamily: 'monospace', background: '#f0f0f1', padding: '2px 6px', borderRadius: '3px' }}>{category.slug}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={() => editCategory(category)}
                                        >
                                            {__('Edit', 'block-style-modifiers')}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            isDestructive
                                            size="small"
                                            onClick={() => deleteCategory(category.slug)}
                                        >
                                            {__('Delete', 'block-style-modifiers')}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardBody style={{ padding: '16px 20px' }}>
                                    {category.description && <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3c434a' }}>{category.description}</p>}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '13px', color: '#646970', fontWeight: '500' }}>{__('Type:', 'block-style-modifiers')}</span>
                                        <span style={{ fontSize: '12px', background: category.exclusive ? '#e0f0fa' : '#f0f0f1', color: category.exclusive ? '#007cba' : '#3c434a', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                                            {category.exclusive
                                                ? __('Exclusive (Radio)', 'block-style-modifiers')
                                                : __('Non-Exclusive (Checkbox)', 'block-style-modifiers')}
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManager;

