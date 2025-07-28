'use client';

import { OrganizationSwitcher, WorkOsWidgets } from '@workos-inc/widgets';
import { useAuth } from '@workos-inc/authkit-react';

/**
 * Organization Switcher Component
 * 
 * Renders the WorkOS Organization Switcher Widget that allows users to switch
 * between organizations they have access to. This is particularly useful for
 * users who belong to multiple organizations.
 * 
 * Features:
 * - Lists all organizations the user has access to
 * - Handles organization switching with proper authentication
 * - Automatically handles SSO/MFA reauthorization when required
 * - Seamlessly integrates with existing AuthKit authentication flow
 * 
 * Requirements:
 * - User must be authenticated (valid AuthKit session)
 * - No special permissions required (uses existing organization access)
 * - Automatically redirects for SSO/MFA if organization requires it
 */
export function OrganizationSwitcherWidget() {
  const { getAccessToken, switchToOrganization } = useAuth();

  return (
    <WorkOsWidgets>
      <OrganizationSwitcher
        authToken={getAccessToken}
        switchToOrganization={switchToOrganization}
      />
    </WorkOsWidgets>
  );
}