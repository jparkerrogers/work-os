'use client';

import { useState, useEffect } from 'react';
import { OrganizationSwitcher, WorkOsWidgets } from '@workos-inc/widgets';
import { useAuth } from '@workos-inc/authkit-nextjs/components';

/**
 * Organization Switcher Component
 * 
 * Renders the WorkOS Organization Switcher Widget that allows authenticated users
 * to switch between organizations they have access to. Only visible when user is signed in.
 * 
 * Features:
 * - Lists all organizations the user has access to
 * - Handles organization switching via backend API
 * - Automatically handles SSO/MFA reauthorization when required
 * - Only renders for authenticated users
 * - Uses same token approach as User Management Widget
 * 
 * Requirements:
 * - User must be authenticated (valid AuthKit session)
 * - No special permissions required (uses existing organization access)
 * - Backend API endpoint for organization switching
 */
export function OrganizationSwitcherWidget() {
  const { user, loading } = useAuth();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch token if user is authenticated
    if (!user) return;

    const fetchToken = async () => {
      try {
        console.log('Fetching widget token for organization switcher...');
        const response = await fetch('/api/generate-widget-token');
        const data = await response.json();
        
        console.log('Widget token response:', { status: response.status, hasToken: !!data.authToken });
        
        if (response.ok && data.authToken) {
          setAuthToken(data.authToken);
          console.log('Organization switcher token set successfully');
        } else {
          console.error('Failed to get widget token:', data);
        }
      } catch (error) {
        console.error('Failed to fetch auth token for organization switcher:', error);
      }
    };

    fetchToken();
  }, [user]);

  const handleOrganizationSwitch = async (...args: any[]) => {
    console.log('🔄 Organization switch triggered with args:', args);
    
    // The WorkOS widget might pass different argument structures
    let organizationId: string;
    let pathname: string = window.location.pathname;
    
    // Try to extract organizationId from various possible argument structures
    if (typeof args[0] === 'string') {
      // Direct string argument
      organizationId = args[0];
      pathname = args[1] || pathname;
    } else if (args[0] && typeof args[0] === 'object') {
      // Object with organizationId property
      organizationId = args[0].organizationId || args[0].organization_id;
      pathname = args[0].pathname || pathname;
    } else {
      console.error('❌ Could not extract organization ID from arguments:', args);
      return;
    }
    
    if (!organizationId) {
      console.error('❌ No organization ID found in arguments:', args);
      return;
    }

    console.log('🎯 Switching to organization:', organizationId, 'from pathname:', pathname);

    try {
      // Call backend API to switch organization
      console.log('📡 Making API call to /api/organizations/switch...');
      const response = await fetch('/api/organizations/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId }),
      });

      console.log('📡 API Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(`Failed to switch organization: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response data:', data);
      
      // If backend returns redirect URL (for SSO/MFA reauth), redirect user
      if (data.redirectUrl) {
        console.log('🔀 Redirecting to:', data.redirectUrl);
        window.location.href = data.redirectUrl;
        return;
      }

      // Otherwise reload the current page to reflect organization change
      console.log('🔄 Reloading page to reflect organization change');
      window.location.reload();
    } catch (error) {
      console.error('❌ Error switching organization:', error);
      // You could show a toast notification here in a real app
      alert('Failed to switch organization. Please try again.');
    }
  };

  // Don't render if loading, not authenticated, or no token
  if (loading || !user || !authToken) {
    console.log('Organization switcher not rendering:', { 
      loading, 
      hasUser: !!user, 
      hasToken: !!authToken 
    });
    return null;
  }

  console.log('✅ Rendering Organization Switcher with token');

  return (
    <WorkOsWidgets>
      <OrganizationSwitcher
        authToken={authToken}
        switchToOrganization={handleOrganizationSwitch}
      />
    </WorkOsWidgets>
  );
}