/**
 * Modifier Manager Component
 * Create, edit, and delete style modifiers
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
    SelectControl,
    Button,
    Notice,
    Spinner,
    CheckboxControl,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const ModifierManager = () => {
    const [modifiers, setModifiers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState(null);
    const [editingModifier, setEditingModifier] = useState(null);

    // Common WordPress blocks
    const commonBlocks = [
        { value: '*', label: __('All Blocks', 'block-style-modifiers') },
        { value: 'core/paragraph', label: __('Paragraph', 'block-style-modifiers') },
        { value: 'core/heading', label: __('Heading', 'block-style-modifiers') },
        { value: 'core/image', label: __('Image', 'block-style-modifiers') },
        { value: 'core/gallery', label: __('Gallery', 'block-style-modifiers') },
        { value: 'core/cover', label: __('Cover', 'block-style-modifiers') },
        { value: 'core/button', label: __('Button', 'block-style-modifiers') },
        { value: 'core/buttons', label: __('Buttons', 'block-style-modifiers') },
        { value: 'core/group', label: __('Group', 'block-style-modifiers') },
        { value: 'core/columns', label: __('Columns', 'block-style-modifiers') },
        { value: 'core/column', label: __('Column', 'block-style-modifiers') },
        { value: 'core/media-text', label: __('Media & Text', 'block-style-modifiers') },
        { value: 'core/list', label: __('List', 'block-style-modifiers') },
        { value: 'core/quote', label: __('Quote', 'block-style-modifiers') },
        { value: 'core/spacer', label: __('Spacer', 'block-style-modifiers') },
        { value: 'core/separator', label: __('Separator', 'block-style-modifiers') },
    ];

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        label: '',
        class: '',
        description: '',
        category: '',
        blocks: [],
        inline_style: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [modifiersResponse, categoriesResponse] = await Promise.all([
                apiFetch({ path: '/block-style-modifiers/v1/modifiers' }),
                apiFetch({ path: '/block-style-modifiers/v1/categories' }),
            ]);
            setModifiers(modifiersResponse);
            setCategories(categoriesResponse);
        } catch (error) {
            setNotice({
                status: 'error',
                message: __('Failed to load data.', 'block-style-modifiers'),
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            label: '',
            class: '',
            description: '',
            category: '',
            blocks: [],
            inline_style: '',
        });
        setEditingModifier(null);
    };

    const validateForm = () => {
        if (!formData.name || !formData.label || !formData.class) {
            setNotice({
                status: 'error',
                message: __('Name, Label, and CSS Class are required fields.', 'block-style-modifiers'),
            });
            return false;
        }

        if (formData.name.includes(' ')) {
            setNotice({
                status: 'error',
                message: __('Name cannot contain spaces.', 'block-style-modifiers'),
            });
            return false;
        }

        if (formData.blocks.length === 0) {
            setNotice({
                status: 'error',
                message: __('Please select at least one block.', 'block-style-modifiers'),
            });
            return false;
        }

        return true;
    };

    const saveModifier = async () => {
        if (!validateForm()) {
            return;
        }

        setSaving(true);
        setNotice(null);

        try {
            if (editingModifier) {
                // Update existing modifier
                await apiFetch({
                    path: `/block-style-modifiers/v1/modifiers/${editingModifier.name}`,
                    method: 'PUT',
                    data: formData,
                });

                setNotice({
                    status: 'success',
                    message: __('Modifier updated successfully!', 'block-style-modifiers'),
                });
            } else {
                // Create new modifier
                await apiFetch({
                    path: '/block-style-modifiers/v1/modifiers',
                    method: 'POST',
                    data: formData,
                });

                setNotice({
                    status: 'success',
                    message: __('Modifier created successfully!', 'block-style-modifiers'),
                });
            }

            resetForm();
            await loadData();
        } catch (error) {
            setNotice({
                status: 'error',
                message: error.message || __('Failed to save modifier.', 'block-style-modifiers'),
            });
        } finally {
            setSaving(false);
        }
    };

    const editModifier = (modifier) => {
        setFormData({ ...modifier });
        setEditingModifier(modifier);
        setNotice(null);
    };

    const deleteModifier = async (name) => {
        if (!confirm(__('Are you sure you want to delete this modifier?', 'block-style-modifiers'))) {
            return;
        }

        try {
            await apiFetch({
                path: `/block-style-modifiers/v1/modifiers/${name}`,
                method: 'DELETE',
            });

            setNotice({
                status: 'success',
                message: __('Modifier deleted successfully!', 'block-style-modifiers'),
            });

            await loadData();
        } catch (error) {
            setNotice({
                status: 'error',
                message: error.message || __('Failed to delete modifier.', 'block-style-modifiers'),
            });
        }
    };

    const toggleBlock = (blockValue) => {
        const blocks = [...formData.blocks];
        const index = blocks.indexOf(blockValue);

        if (index > -1) {
            blocks.splice(index, 1);
        } else {
            blocks.push(blockValue);
        }

        setFormData({ ...formData, blocks });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                <Spinner />
            </div>
        );
    }

    return (
        <div className="bsm-admin__modifier-manager">
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
                        {editingModifier
                            ? __('Edit Modifier', 'block-style-modifiers')
                            : __('Add New Modifier', 'block-style-modifiers')}
                    </h3>
                </CardHeader>
                <CardBody style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <TextControl
                                label={__('Modifier Name', 'block-style-modifiers')}
                                help={__(
                                    'Unique identifier (lowercase, no spaces, use hyphens)',
                                    'block-style-modifiers'
                                )}
                                value={formData.name}
                                onChange={(value) =>
                                    setFormData({ ...formData, name: value.toLowerCase() })
                                }
                                disabled={!!editingModifier}
                                required
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />

                            <TextControl
                                label={__('Modifier Label', 'block-style-modifiers')}
                                help={__('Display name for the modifier', 'block-style-modifiers')}
                                value={formData.label}
                                onChange={(value) => setFormData({ ...formData, label: value })}
                                required
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                            <TextControl
                                label={__('CSS Class', 'block-style-modifiers')}
                                help={__(
                                    'CSS class to apply (e.g., my-custom-style)',
                                    'block-style-modifiers'
                                )}
                                value={formData.class}
                                onChange={(value) => setFormData({ ...formData, class: value })}
                                required
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />

                            <SelectControl
                                label={__('Category', 'block-style-modifiers')}
                                help={__(
                                    'Optional organization',
                                    'block-style-modifiers'
                                )}
                                value={formData.category}
                                options={[
                                    { value: '', label: __('No Category', 'block-style-modifiers') },
                                    ...categories.map((cat) => ({
                                        value: cat.slug,
                                        label: cat.label,
                                    })),
                                ]}
                                onChange={(value) => setFormData({ ...formData, category: value })}
                                __next40pxDefaultSize
                                __nextHasNoMarginBottom
                            />
                        </div>

                        <TextareaControl
                            label={__('Description', 'block-style-modifiers')}
                            help={__('Optional description for the modifier', 'block-style-modifiers')}
                            value={formData.description}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                            rows={2}
                            __nextHasNoMarginBottom
                        />

                        <div style={{ background: '#f8f9f9', padding: '16px', borderRadius: '4px', border: '1px solid #e2e4e7' }}>
                            <div style={{ fontWeight: '600', marginBottom: '4px', color: '#1e1e1e' }}>
                                {__('Apply to Blocks', 'block-style-modifiers')}
                            </div>
                            <p style={{ fontSize: '13px', color: '#646970', margin: '0 0 16px 0' }}>
                                {__(
                                    'Select which blocks this modifier should be available for',
                                    'block-style-modifiers'
                                )}
                            </p>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                    gap: '12px',
                                }}
                            >
                                {commonBlocks.map((block) => (
                                    <CheckboxControl
                                        key={block.value}
                                        label={block.label}
                                        checked={formData.blocks.includes(block.value)}
                                        onChange={() => toggleBlock(block.value)}
                                        __nextHasNoMarginBottom
                                    />
                                ))}
                            </div>
                        </div>

                        <TextareaControl
                            label={__('Inline CSS (Optional)', 'block-style-modifiers')}
                            help={__(
                                'Optional CSS rules for this modifier. Example: .my-custom-style { color: red; }',
                                'block-style-modifiers'
                            )}
                            value={formData.inline_style}
                            onChange={(value) => setFormData({ ...formData, inline_style: value })}
                            rows={4}
                            style={{ fontFamily: 'monospace' }}
                            __nextHasNoMarginBottom
                        />

                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', borderTop: '1px solid #e2e4e7', paddingTop: '20px' }}>
                            <Button
                                variant="primary"
                                onClick={saveModifier}
                                isBusy={saving}
                                disabled={saving}
                            >
                                {saving
                                    ? __('Saving...', 'block-style-modifiers')
                                    : editingModifier
                                        ? __('Update Modifier', 'block-style-modifiers')
                                        : __('Add Modifier', 'block-style-modifiers')}
                            </Button>

                            {editingModifier && (
                                <Button variant="secondary" onClick={resetForm} disabled={saving}>
                                    {__('Cancel', 'block-style-modifiers')}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>

            <div style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1e1e1e' }}>{__('Existing Modifiers', 'block-style-modifiers')}</h3>

                {modifiers.length === 0 ? (
                    <Card style={{ padding: '32px', textAlign: 'center', background: '#f9f9f9' }}>
                        <p style={{ margin: 0, color: '#646970', fontSize: '15px' }}>{__('No custom modifiers created yet.', 'block-style-modifiers')}</p>
                    </Card>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {modifiers.map((modifier) => (
                            <Card key={modifier.name}>
                                <CardHeader style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                                    <div>
                                        <strong style={{ fontSize: '16px' }}>{modifier.label}</strong>
                                        <div style={{ fontSize: '13px', color: '#646970', marginTop: '6px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <span><span style={{ fontWeight: '500' }}>{__('Name:', 'block-style-modifiers')}</span> <span style={{ fontFamily: 'monospace', background: '#f0f0f1', padding: '2px 6px', borderRadius: '3px' }}>{modifier.name}</span></span>
                                            <span style={{ color: '#dcdcde' }}>|</span>
                                            <span><span style={{ fontWeight: '500' }}>{__('Class:', 'block-style-modifiers')}</span> <span style={{ fontFamily: 'monospace', background: '#f0f0f1', padding: '2px 6px', borderRadius: '3px', color: '#007cba' }}>.{modifier.class}</span></span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={() => editModifier(modifier)}
                                        >
                                            {__('Edit', 'block-style-modifiers')}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            isDestructive
                                            size="small"
                                            onClick={() => deleteModifier(modifier.name)}
                                        >
                                            {__('Delete', 'block-style-modifiers')}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardBody style={{ padding: '16px 20px' }}>
                                    {modifier.description && <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3c434a' }}>{modifier.description}</p>}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '13px', color: '#646970', fontWeight: '500' }}>{__('Category:', 'block-style-modifiers')}</span>
                                            <span style={{ fontSize: '12px', background: modifier.category ? '#e0f0fa' : '#f0f0f1', color: modifier.category ? '#007cba' : '#646970', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                                                {modifier.category || __('None', 'block-style-modifiers')}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '13px', color: '#646970', fontWeight: '500' }}>{__('Blocks:', 'block-style-modifiers')}</span>
                                            <span style={{ fontSize: '13px', color: '#3c434a' }}>
                                                {modifier.blocks.includes('*')
                                                    ? __('All Blocks', 'block-style-modifiers')
                                                    : modifier.blocks.join(', ')}
                                            </span>
                                        </div>
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

export default ModifierManager;

