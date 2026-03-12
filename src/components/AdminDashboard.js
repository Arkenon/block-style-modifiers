/**
 * Admin Dashboard Component
 * Main admin interface with tabbed navigation
 *
 * @since 1.0.8
 */

import { __ } from '@wordpress/i18n';
import { TabPanel, Card, CardHeader, CardBody, Icon } from '@wordpress/components';
import DashboardHome from './DashboardHome';
import PluginSettings from './PluginSettings';
import AddStyleModifier from './AddStyleModifier';

const AdminDashboard = () => {
    const tabs = [
        {
            name: 'dashboard',
            title: __('Dashboard', 'block-style-modifiers'),
            icon: 'dashboard',
        },
        {
            name: 'settings',
            title: __('Plugin Settings', 'block-style-modifiers'),
            icon: 'admin-settings',
        },
        {
            name: 'modifiers',
            title: __('Add Style Modifier', 'block-style-modifiers'),
            icon: 'admin-appearance',
        },
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '24px auto', padding: '0 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px', color: '#1d2327' }}>{__('Block Style Modifiers', 'block-style-modifiers')}</h1>
                <p style={{ fontSize: '15px', color: '#50575e', margin: 0 }}>
                    {__(
                        'Manage custom style modifiers and categories for your Gutenberg blocks.',
                        'block-style-modifiers'
                    )}
                </p>
            </div>

            <TabPanel
                className="bsm-admin__tabs"
                activeClass="is-active"
                tabs={tabs}
            >
                {(tab) => {
                    switch (tab.name) {
                        case 'dashboard':
                            return <DashboardHome />;
                        case 'settings':
                            return <PluginSettings />;
                        case 'modifiers':
                            return <AddStyleModifier />;
                        default:
                            return null;
                    }
                }}
            </TabPanel>
        </div>
    );
};

export default AdminDashboard;

