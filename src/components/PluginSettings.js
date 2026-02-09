/**
 * Plugin Settings Component
 * Manage global plugin settings
 *
 * @since 1.0.8
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
    Card,
    CardHeader,
    CardBody,
    ToggleControl,
    Button,
    Notice,
    Spinner,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const PluginSettings = () => {
    const [enableDefaultModifiers, setEnableDefaultModifiers] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const response = await apiFetch({
                path: '/block-style-modifiers/v1/settings',
            });
            setEnableDefaultModifiers(response.enable_default_modifiers);
        } catch (error) {
            setNotice({
                status: 'error',
                message: __('Failed to load settings.', 'block-style-modifiers'),
            });
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        setNotice(null);

        try {
            await apiFetch({
                path: '/block-style-modifiers/v1/settings',
                method: 'POST',
                data: {
                    enable_default_modifiers: enableDefaultModifiers,
                },
            });

            setNotice({
                status: 'success',
                message: __('Settings saved successfully!', 'block-style-modifiers'),
            });
        } catch (error) {
            setNotice({
                status: 'error',
                message: error.message || __('Failed to save settings.', 'block-style-modifiers'),
            });
        } finally {
            setSaving(false);
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
        <div className="bsm-admin__settings">
            {notice && (
                <Notice
                    status={notice.status}
                    onRemove={() => setNotice(null)}
                    isDismissible
                >
                    {notice.message}
                </Notice>
            )}

            <Card>
                <CardHeader>
                    <h2>{__('Plugin Settings', 'block-style-modifiers')}</h2>
                </CardHeader>
                <CardBody>
                    <div className="bsm-admin__form-section">
                        <ToggleControl
                            label={__('Enable Default Modifiers', 'block-style-modifiers')}
                            help={__(
                                'When enabled, the plugin will load built-in style modifiers (animations, hover effects, etc.). Disable this if you only want to use custom modifiers.',
                                'block-style-modifiers'
                            )}
                            checked={enableDefaultModifiers}
                            onChange={setEnableDefaultModifiers}
                        />
                    </div>

                    <div className="bsm-admin__button-group">
                        <Button
                            variant="primary"
                            onClick={saveSettings}
                            isBusy={saving}
                            disabled={saving}
                        >
                            {saving
                                ? __('Saving...', 'block-style-modifiers')
                                : __('Save Settings', 'block-style-modifiers')}
                        </Button>
                    </div>
                </CardBody>
            </Card>

            <Card style={{ marginTop: '1.5rem' }}>
                <CardHeader>
                    <h3>{__('About Default Modifiers', 'block-style-modifiers')}</h3>
                </CardHeader>
                <CardBody>
                    <p>
                        {__(
                            'Default modifiers include various animations, hover effects, and text effects that work with common WordPress blocks. They are theme-independent and designed to enhance behavior without conflicting with your theme styles.',
                            'block-style-modifiers'
                        )}
                    </p>
                    <p>
                        <strong>{__('Default Categories:', 'block-style-modifiers')}</strong>
                    </p>
                    <ul>
                        <li>{__('Animations (fade-in, slide-up, scale-in, etc.)', 'block-style-modifiers')}</li>
                        <li>{__('Animation Delay (timing controls)', 'block-style-modifiers')}</li>
                        <li>{__('Hover Effects (zoom, rotate, brightness, etc.)', 'block-style-modifiers')}</li>
                        <li>{__('Text Effects (underline reveal, fade, etc.)', 'block-style-modifiers')}</li>
                    </ul>
                </CardBody>
            </Card>
        </div>
    );
};

export default PluginSettings;

