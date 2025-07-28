import { authkit } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";
import { NextRequest, NextResponse } from "next/server";

/**
 * WorkOS client instance for server-side operations.
 * Configured with API key for widget token generation.
 */
const workos = new WorkOS(process.env.WORKOS_API_KEY!);

/**
 * API Route: Generate Widget Token for User Management
 * 
 * Generates authentication tokens specifically for the WorkOS User Management Widget.
 * The widget requires this token to make authenticated requests to WorkOS APIs.
 * 
 * Requirements:
 * - User must be authenticated (valid AuthKit session)
 * - User must be associated with an organization
 * - User must have 'widgets:users-table:manage' permissions
 * 
 * Token Properties:
 * - Expires after 1 hour
 * - Scoped to user management operations only
 * - Contains user and organization context for security
 * 
 * @param request NextRequest with user session from AuthKit middleware
 * @returns JSON response with authToken or detailed error information
 */
export const GET = async (request: NextRequest) => {
  // Extract user session from AuthKit middleware
  const { session } = await authkit(request);

  // Validate user authentication - required for all operations
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Authentication required. Please sign in to access user management." }, 
      { status: 401 }
    );
  }

  // Validate organization association - users must belong to an org to manage users
  if (!session.organizationId) {
    return NextResponse.json(
      { 
        error: "Organization access required. User must be associated with an organization.",
        suggestion: "Contact your administrator to be added to an organization."
      }, 
      { status: 403 }
    );
  }

  try {
    // Generate widget token with user management scope
    // 'widgets:users-table:manage' allows: view users, invite users, remove users, manage roles
    const authToken = await workos.widgets.getToken({
      userId: session.user.id,
      organizationId: session.organizationId,
      scopes: ['widgets:users-table:manage']
    });

    return NextResponse.json({ authToken });
  } catch (error) {
    console.error("Widget token generation failed:", error);
    
    // Provide comprehensive error information for debugging
    return NextResponse.json({ 
      error: "Failed to generate user management token",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      troubleshooting: {
        permissions: "Ensure user has 'widgets:users-table:manage' permission",
        organization: "Verify user is properly associated with an organization",
        configuration: "Check WorkOS widget configuration and CORS settings"
      },
      sessionContext: {
        userId: session.user.id,
        organizationId: session.organizationId,
        userRole: session.role,
        userPermissions: session.permissions
      }
    }, { status: 500 });
  }
};