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
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                <Spinner />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {notice && (
                <Notice
                    status={notice.status}
                    onRemove={() => setNotice(null)}
                    isDismissible
                    style={{ marginBottom: '24px' }}
                >
                    {notice.message}
                </Notice>
            )}

            <Card style={{ border: '1px solid #e2e4e7', borderRadius: '4px' }}>
                <CardHeader style={{ padding: '16px 20px', borderBottom: '1px solid #e2e4e7', background: '#f8f9f9', margin: 0 }}>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1d2327' }}>{__('Plugin Settings', 'block-style-modifiers')}</h2>
                </CardHeader>
                <CardBody style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <ToggleControl
                            label={__('Enable Default Modifiers', 'block-style-modifiers')}
                            help={__(
                                'When enabled, the plugin will load built-in style modifiers (animations, hover effects, etc.). Disable this if you only want to use custom modifiers.',
                                'block-style-modifiers'
                            )}
                            checked={enableDefaultModifiers}
                            onChange={setEnableDefaultModifiers}
                            __nextHasNoMarginBottom
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f0f0f1' }}>
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

            <Card style={{ border: '1px solid #e2e4e7', borderRadius: '4px' }}>
                <CardHeader style={{ padding: '16px 20px', borderBottom: '1px solid #e2e4e7', background: '#f8f9f9', margin: 0 }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1d2327' }}>{__('About Default Modifiers', 'block-style-modifiers')}</h3>
                </CardHeader>
                <CardBody style={{ padding: '24px' }}>
                    <p style={{ fontSize: '15px', color: '#50575e', marginBottom: '20px' }}>
                        {__(
                            'Default modifiers include various animations, hover effects, and text effects that work with common WordPress blocks. They are theme-independent and designed to enhance behavior without conflicting with your theme styles.',
                            'block-style-modifiers'
                        )}
                    </p>
                    <p style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#1d2327' }}>{__('Default Categories:', 'block-style-modifiers')}</strong>
                    </p>
                    <ul style={{ paddingLeft: '24px', margin: 0, color: '#50575e', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

