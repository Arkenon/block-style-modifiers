/**
 * Dashboard Home Component
 * Welcome screen with plugin information and quick stats
 *
 * @since 1.0.8
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Card, CardHeader, CardBody, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        customCategories: 0,
        customModifiers: 0,
        defaultsEnabled: true,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        try {
            const [settings, categories, modifiers] = await Promise.all([
                apiFetch({ path: '/block-style-modifiers/v1/settings' }),
                apiFetch({ path: '/block-style-modifiers/v1/categories' }),
                apiFetch({ path: '/block-style-modifiers/v1/modifiers' }),
            ]);

            setStats({
                customCategories: categories.length,
                customModifiers: modifiers.length,
                defaultsEnabled: settings.enable_default_modifiers,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
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
        <div className="bsm-admin__dashboard">
            <Card>
                <CardHeader>
                    <h2>{__('Welcome to Block Style Modifiers!', 'block-style-modifiers')}</h2>
                </CardHeader>
                <CardBody>
                    <p>
                        {__(
                            'This plugin allows you to add custom style modifiers to your Gutenberg blocks. Create categories and modifiers through an intuitive interface without writing any PHP code.',
                            'block-style-modifiers'
                        )}
                    </p>
                    <h3>{__('Getting Started', 'block-style-modifiers')}</h3>
                    <ol>
                        <li>
                            {__(
                                'Go to Plugin Settings to enable or disable default modifiers.',
                                'block-style-modifiers'
                            )}
                        </li>
                        <li>
                            {__(
                                'Create custom categories to organize your modifiers.',
                                'block-style-modifiers'
                            )}
                        </li>
                        <li>
                            {__(
                                'Add custom style modifiers and assign them to specific blocks.',
                                'block-style-modifiers'
                            )}
                        </li>
                    </ol>
                </CardBody>
            </Card>

            <div className="bsm-admin__dashboard-cards">
                <Card>
                    <CardHeader>
                        <h3>{__('Current Statistics', 'block-style-modifiers')}</h3>
                    </CardHeader>
                    <CardBody>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <strong>{__('Custom Categories:', 'block-style-modifiers')}</strong>{' '}
                                {stats.customCategories}
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <strong>{__('Custom Modifiers:', 'block-style-modifiers')}</strong>{' '}
                                {stats.customModifiers}
                            </li>
                            <li>
                                <strong>{__('Default Modifiers:', 'block-style-modifiers')}</strong>{' '}
                                {stats.defaultsEnabled
                                    ? __('Enabled', 'block-style-modifiers')
                                    : __('Disabled', 'block-style-modifiers')}
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <h3>{__('Documentation', 'block-style-modifiers')}</h3>
                    </CardHeader>
                    <CardBody>
                        <p>
                            {__(
                                'For more information about using this plugin, visit the documentation.',
                                'block-style-modifiers'
                            )}
                        </p>
                        <a
                            href="https://github.com/Arkenon/block-style-modifiers"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button-secondary"
                        >
                            {__('View Documentation', 'block-style-modifiers')}
                        </a>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default DashboardHome;

