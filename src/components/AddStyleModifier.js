/**
 * Add Style Modifier Component
 * Manage custom categories and modifiers
 *
 * @since 1.0.8
 */

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
    Card,
    CardHeader,
    CardBody,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import CategoryManager from './CategoryManager';
import ModifierManager from './ModifierManager';

const AddStyleModifier = () => {
    const [activeSection, setActiveSection] = useState('categories');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card style={{ border: '1px solid #e2e4e7', borderRadius: '4px' }}>
                <CardHeader style={{ padding: '16px 20px', borderBottom: '1px solid #e2e4e7', background: '#f8f9f9', margin: 0 }}>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1d2327' }}>{__('Manage Style Modifiers', 'block-style-modifiers')}</h2>
                </CardHeader>
                <CardBody style={{ padding: '24px' }}>
                    <p style={{ fontSize: '15px', color: '#50575e', marginBottom: '24px' }}>
                        {__(
                            'Create and manage custom modifier categories and style modifiers. Categories help organize your modifiers, and you can make them exclusive (radio) or non-exclusive (checkbox).',
                            'block-style-modifiers'
                        )}
                    </p>

                    <div style={{ marginBottom: '24px', background: '#f0f0f1', padding: '4px', borderRadius: '4px' }}>
                        <ToggleGroupControl
                            value={activeSection}
                            onChange={setActiveSection}
                            isBlock
                        >
                            <ToggleGroupControlOption
                                value="categories"
                                label={__('Modifier Categories', 'block-style-modifiers')}
                            />
                            <ToggleGroupControlOption
                                value="modifiers"
                                label={__('Style Modifiers', 'block-style-modifiers')}
                            />
                        </ToggleGroupControl>
                    </div>

                    <div style={{ background: '#fff' }}>
                        {activeSection === 'categories' && <CategoryManager />}
                        {activeSection === 'modifiers' && <ModifierManager />}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default AddStyleModifier;

