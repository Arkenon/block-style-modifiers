/**
 * Add Style Modifier Component
 * Manage custom categories and modifiers
 *
 * @since 1.0.8
 */

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Card, CardHeader, CardBody, Button, ButtonGroup } from '@wordpress/components';
import CategoryManager from './CategoryManager';
import ModifierManager from './ModifierManager';

const AddStyleModifier = () => {
    const [activeSection, setActiveSection] = useState('categories');

    return (
        <div className="bsm-admin__modifiers">
            <Card>
                <CardHeader>
                    <h2>{__('Manage Style Modifiers', 'block-style-modifiers')}</h2>
                </CardHeader>
                <CardBody>
                    <p>
                        {__(
                            'Create and manage custom modifier categories and style modifiers. Categories help organize your modifiers, and you can make them exclusive (radio) or non-exclusive (checkbox).',
                            'block-style-modifiers'
                        )}
                    </p>

                    <ButtonGroup style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                        <Button
                            variant={activeSection === 'categories' ? 'primary' : 'secondary'}
                            onClick={() => setActiveSection('categories')}
                        >
                            {__('Modifier Categories', 'block-style-modifiers')}
                        </Button>
                        <Button
                            variant={activeSection === 'modifiers' ? 'primary' : 'secondary'}
                            onClick={() => setActiveSection('modifiers')}
                        >
                            {__('Style Modifiers', 'block-style-modifiers')}
                        </Button>
                    </ButtonGroup>

                    {activeSection === 'categories' && <CategoryManager />}
                    {activeSection === 'modifiers' && <ModifierManager />}
                </CardBody>
            </Card>
        </div>
    );
};

export default AddStyleModifier;

