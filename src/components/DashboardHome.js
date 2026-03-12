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
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                <Spinner />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card style={{ border: '1px solid #e2e4e7', borderRadius: '4px' }}>
                <CardHeader style={{ padding: '20px 24px', borderBottom: '1px solid #e2e4e7', background: '#f8f9f9', margin: 0 }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1d2327' }}>{__('Welcome to Block Style Modifiers!', 'block-style-modifiers')}</h2>
                </CardHeader>
                <CardBody style={{ padding: '24px' }}>
                    <p style={{ fontSize: '15px', color: '#50575e', marginBottom: '24px' }}>
                        {__(
                            'This plugin allows you to add custom style modifiers to your Gutenberg blocks. Create categories and modifiers through an intuitive interface without writing any PHP code.',
                            'block-style-modifiers'
                        )}
                    </p>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1d2327' }}>{__('Getting Started', 'block-style-modifiers')}</h3>
                    <ol style={{ paddingLeft: '24px', color: '#50575e', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li style={{ fontSize: '14px' }}>
                            {__(
                                'Go to Plugin Settings to enable or disable default modifiers.',
                                'block-style-modifiers'
                            )}
                        </li>
                        <li style={{ fontSize: '14px' }}>
                            {__(
                                'Create custom categories to organize your modifiers.',
                                'block-style-modifiers'
                            )}
                        </li>
                        <li style={{ fontSize: '14px' }}>
                            {__(
                                'Add custom style modifiers and assign them to specific blocks.',
                                'block-style-modifiers'
                            )}
                        </li>
                    </ol>
                </CardBody>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Card style={{ border: '1px solid #e2e4e7', borderRadius: '4px' }}>
                    <CardHeader style={{ padding: '16px 20px', borderBottom: '1px solid #e2e4e7', background: '#f8f9f9', margin: 0 }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1d2327' }}>{__('Current Statistics', 'block-style-modifiers')}</h3>
                    </CardHeader>
                    <CardBody style={{ padding: '20px' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li style={{ fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f1', paddingBottom: '12px' }}>
                                <strong style={{ color: '#1d2327' }}>{__('Custom Categories:', 'block-style-modifiers')}</strong>{' '}
                                <span style={{ background: '#f0f0f1', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>{stats.customCategories}</span>
                            </li>
                            <li style={{ fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f1', paddingBottom: '12px' }}>
                                <strong style={{ color: '#1d2327' }}>{__('Custom Modifiers:', 'block-style-modifiers')}</strong>{' '}
                                <span style={{ background: '#f0f0f1', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>{stats.customModifiers}</span>
                            </li>
                            <li style={{ fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ color: '#1d2327' }}>{__('Default Modifiers:', 'block-style-modifiers')}</strong>{' '}
                                <span style={{ background: stats.defaultsEnabled ? '#e0f0fa' : '#f0f0f1', color: stats.defaultsEnabled ? '#007cba' : '#50575e', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                                    {stats.defaultsEnabled
                                        ? __('Enabled', 'block-style-modifiers')
                                        : __('Disabled', 'block-style-modifiers')}
                                </span>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                <Card style={{ border: '1px solid #e2e4e7', borderRadius: '4px' }}>
                    <CardHeader style={{ padding: '16px 20px', borderBottom: '1px solid #e2e4e7', background: '#f8f9f9', margin: 0 }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1d2327' }}>{__('Documentation', 'block-style-modifiers')}</h3>
                    </CardHeader>
                    <CardBody style={{ padding: '20px' }}>
                        <p style={{ fontSize: '14px', color: '#50575e', marginBottom: '20px' }}>
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
                            style={{ display: 'inline-block' }}
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

