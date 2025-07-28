'use client';

import { useState, useEffect } from 'react';
import { UsersManagement, WorkOsWidgets } from '@workos-inc/widgets';
import { Heading, Text, Flex, Spinner } from '@radix-ui/themes';

/**
 * User Management Page Component
 * 
 * Renders the WorkOS User Management Widget that allows organization administrators
 * to manage team members, including inviting users, removing users, and managing roles.
 * 
 * Features:
 * - Fetches authentication token from backend API
 * - Displays loading state during token retrieval
 * - Shows user-friendly error messages for failures
 * - Renders WorkOS User Management Widget with proper authentication
 * 
 * Requirements:
 * - User must be authenticated and belong to an organization
 * - User must have 'widgets:users-table:manage' permissions
 * - Backend API must be available at /api/generate-widget-token
 */
export default function UserManagementPage() {
  // State for widget authentication token
  const [authToken, setAuthToken] = useState<string | null>(null);
  // Loading state during token fetch
  const [loading, setLoading] = useState(true);
  // Error state for user-friendly error display
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches authentication token from backend API for widget usage.
     * This token is required by the WorkOS User Management Widget to authenticate
     * requests to WorkOS APIs. Token expires after 1 hour.
     */
    const fetchToken = async () => {
      try {
        // Request widget token from our backend API
        const response = await fetch('/api/generate-widget-token');
        const data = await response.json();
        
        if (response.ok && data.authToken) {
          setAuthToken(data.authToken);
        } else {
          // Display server-provided error message or fallback
          setError(data.error || 'Failed to generate authentication token');
        }
      } catch (err) {
        // Handle network errors or API unavailability
        setError('Unable to connect to authentication service. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []); // Run once on component mount

  if (loading) {
    return (
      <Flex direction="column" align="center" gap="4">
        <Heading size="8">User Management</Heading>
        <Flex align="center" gap="2">
          <Spinner />
          <Text>Loading user management interface...</Text>
        </Flex>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" align="center" gap="4">
        <Heading size="8">User Management</Heading>
        <Text color="red">Error: {error}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4">
      <Flex direction="column" align="center" gap="2">
        <Heading size="8">User Management</Heading>
        <Text size="5" color="gray">
          Manage users and permissions for your organization
        </Text>
      </Flex>
      
      {authToken && (
        <WorkOsWidgets>
          <UsersManagement authToken={authToken} />
        </WorkOsWidgets>
      )}
    </Flex>
  );
}