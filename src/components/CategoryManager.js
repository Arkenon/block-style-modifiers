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
            <div style={{ textAlign: 'center', padding: '2rem' }}>
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

            <Card style={{ marginBottom: '1.5rem' }}>
                <CardHeader>
                    <h3>
                        {editingCategory
                            ? __('Edit Category', 'block-style-modifiers')
                            : __('Add New Category', 'block-style-modifiers')}
                    </h3>
                </CardHeader>
                <CardBody>
                    <div className="bsm-admin__form-row">
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
                    </div>

                    <div className="bsm-admin__form-row">
                        <TextControl
                            label={__('Category Label', 'block-style-modifiers')}
                            help={__('Display name for the category', 'block-style-modifiers')}
                            value={formData.label}
                            onChange={(value) => setFormData({ ...formData, label: value })}
                            required
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom
                        />
                    </div>

                    <div className="bsm-admin__form-row">
                        <TextareaControl
                            label={__('Description', 'block-style-modifiers')}
                            help={__('Optional description for the category', 'block-style-modifiers')}
                            value={formData.description}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                            rows={3}
                            __nextHasNoMarginBottom
                        />
                    </div>

                    <div className="bsm-admin__form-row">
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
                    </div>

                    <div className="bsm-admin__button-group">
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
                </CardBody>
            </Card>

            <div className="bsm-admin__item-list">
                <h3>{__('Existing Categories', 'block-style-modifiers')}</h3>

                {categories.length === 0 ? (
                    <div className="bsm-admin__empty-state">
                        <p>{__('No custom categories created yet.', 'block-style-modifiers')}</p>
                    </div>
                ) : (
                    categories.map((category) => (
                        <Card key={category.slug} className="bsm-admin__item-card">
                            <CardHeader>
                                <div style={{ flex: 1 }}>
                                    <strong>{category.label}</strong>
                                    <div style={{ fontSize: '0.85em', color: '#646970' }}>
                                        {__('Slug:', 'block-style-modifiers')} {category.slug}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                            <CardBody>
                                {category.description && <p>{category.description}</p>}
                                <p style={{ marginBottom: 0 }}>
                                    <strong>{__('Type:', 'block-style-modifiers')}</strong>{' '}
                                    {category.exclusive
                                        ? __('Exclusive (Radio)', 'block-style-modifiers')
                                        : __('Non-Exclusive (Checkbox)', 'block-style-modifiers')}
                                </p>
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default CategoryManager;

