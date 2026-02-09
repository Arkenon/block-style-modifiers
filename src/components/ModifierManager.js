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
            <div style={{ textAlign: 'center', padding: '2rem' }}>
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

            <Card style={{ marginBottom: '1.5rem' }}>
                <CardHeader>
                    <h3>
                        {editingModifier
                            ? __('Edit Modifier', 'block-style-modifiers')
                            : __('Add New Modifier', 'block-style-modifiers')}
                    </h3>
                </CardHeader>
                <CardBody>
                    <div className="bsm-admin__form-row">
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
                        />
                    </div>

                    <div className="bsm-admin__form-row">
                        <TextControl
                            label={__('Modifier Label', 'block-style-modifiers')}
                            help={__('Display name for the modifier', 'block-style-modifiers')}
                            value={formData.label}
                            onChange={(value) => setFormData({ ...formData, label: value })}
                            required
                        />
                    </div>

                    <div className="bsm-admin__form-row">
                        <TextControl
                            label={__('CSS Class', 'block-style-modifiers')}
                            help={__(
                                'CSS class to apply (e.g., my-custom-style)',
                                'block-style-modifiers'
                            )}
                            value={formData.class}
                            onChange={(value) => setFormData({ ...formData, class: value })}
                            required
                        />
                    </div>

                    <div className="bsm-admin__form-row">
                        <TextareaControl
                            label={__('Description', 'block-style-modifiers')}
                            help={__('Optional description for the modifier', 'block-style-modifiers')}
                            value={formData.description}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                            rows={2}
                        />
                    </div>

                    <div className="bsm-admin__form-row">
                        <SelectControl
                            label={__('Category', 'block-style-modifiers')}
                            help={__(
                                'Optional: Assign to a category to organize modifiers',
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
                        />
                    </div>

                    <div className="bsm-admin__form-row">
                        <fieldset>
                            <legend style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                                {__('Apply to Blocks', 'block-style-modifiers')}
                            </legend>
                            <p style={{ fontSize: '0.9em', color: '#646970', marginBottom: '1rem' }}>
                                {__(
                                    'Select which blocks this modifier should be available for',
                                    'block-style-modifiers'
                                )}
                            </p>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                    gap: '0.5rem',
                                }}
                            >
                                {commonBlocks.map((block) => (
                                    <CheckboxControl
                                        key={block.value}
                                        label={block.label}
                                        checked={formData.blocks.includes(block.value)}
                                        onChange={() => toggleBlock(block.value)}
                                    />
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    <div className="bsm-admin__form-row">
                        <TextareaControl
                            label={__('Inline CSS (Optional)', 'block-style-modifiers')}
                            help={__(
                                'Optional CSS rules for this modifier. Example: .my-custom-style { color: red; }',
                                'block-style-modifiers'
                            )}
                            value={formData.inline_style}
                            onChange={(value) => setFormData({ ...formData, inline_style: value })}
                            rows={5}
                        />
                    </div>

                    <div className="bsm-admin__button-group">
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
                </CardBody>
            </Card>

            <div className="bsm-admin__item-list">
                <h3>{__('Existing Modifiers', 'block-style-modifiers')}</h3>

                {modifiers.length === 0 ? (
                    <div className="bsm-admin__empty-state">
                        <p>{__('No custom modifiers created yet.', 'block-style-modifiers')}</p>
                    </div>
                ) : (
                    modifiers.map((modifier) => (
                        <Card key={modifier.name} className="bsm-admin__item-card">
                            <CardHeader>
                                <div style={{ flex: 1 }}>
                                    <strong>{modifier.label}</strong>
                                    <div style={{ fontSize: '0.85em', color: '#646970' }}>
                                        {__('Name:', 'block-style-modifiers')} {modifier.name} |{' '}
                                        {__('Class:', 'block-style-modifiers')} {modifier.class}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                            <CardBody>
                                {modifier.description && <p>{modifier.description}</p>}
                                <p style={{ marginBottom: '0.5rem' }}>
                                    <strong>{__('Category:', 'block-style-modifiers')}</strong>{' '}
                                    {modifier.category || __('None', 'block-style-modifiers')}
                                </p>
                                <p style={{ marginBottom: 0 }}>
                                    <strong>{__('Blocks:', 'block-style-modifiers')}</strong>{' '}
                                    {modifier.blocks.includes('*')
                                        ? __('All Blocks', 'block-style-modifiers')
                                        : modifier.blocks.join(', ')}
                                </p>
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ModifierManager;

