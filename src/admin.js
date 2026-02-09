/**
 * Admin Interface Entry Point
 * Initializes the React admin dashboard for Block Style Modifiers
 *
 * @since 1.0.8
 */

import { render } from '@wordpress/element';
import AdminDashboard from './components/AdminDashboard';
import './admin.scss';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const adminRoot = document.getElementById('bsm-admin-root');

    if (adminRoot) {
        render(<AdminDashboard />, adminRoot);
    }
});

