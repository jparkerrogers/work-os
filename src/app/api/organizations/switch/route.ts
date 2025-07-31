import { authkit } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";
import { NextRequest, NextResponse } from "next/server";

/**
 * WorkOS client instance for server-side operations.
 * Configured with API key for organization switching.
 */
const workos = new WorkOS(process.env.WORKOS_API_KEY!);

/**
 * API Route: Switch Organization
 * 
 * Handles organization switching for authenticated users. This endpoint allows
 * users to switch between organizations they have access to, with proper handling
 * of SSO and MFA reauthorization when required.
 * 
 * Requirements:
 * - User must be authenticated (valid AuthKit session)
 * - User must have access to the target organization
 * - Handles SSO/MFA redirect scenarios automatically
 * 
 * @param request NextRequest with organizationId in request body
 * @returns JSON response with success status or redirect URL for reauth
 */
export const POST = async (request: NextRequest) => {
  console.log('🔄 Organization switch API called');
  
  // Extract user session from AuthKit middleware
  const { session } = await authkit(request);

  // Validate user authentication
  if (!session || !session.user) {
    console.log('❌ No valid session found');
    return NextResponse.json(
      { error: "Authentication required to switch organizations." }, 
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { organizationId } = body;

    console.log('📋 Request details:', {
      userId: session.user.id,
      currentOrgId: session.organizationId,
      targetOrgId: organizationId,
      userEmail: session.user.email
    });

    if (!organizationId) {
      console.log('❌ Missing organizationId in request body');
      return NextResponse.json(
        { error: "Organization ID is required" }, 
        { status: 400 }
      );
    }

    // For AuthKit Next.js, organization switching is handled by redirecting
    // to the AuthKit sign-in URL with the new organization ID
    console.log('🔗 Generating authorization URL for organization switch');
    
    const signInUrl = workos.userManagement.getAuthorizationUrl({
      provider: 'authkit',
      clientId: process.env.WORKOS_CLIENT_ID!,
      redirectUri: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI!,
      organizationId: organizationId,
    });

    console.log('✅ Generated redirect URL for organization switch');

    return NextResponse.json({ 
      redirectUrl: signInUrl,
      message: "Redirecting to reauthorize with new organization",
      debug: {
        targetOrganizationId: organizationId,
        currentOrganizationId: session.organizationId,
        userId: session.user.id
      }
    });

  } catch (error) {
    console.error("❌ Organization switch failed:", error);
    
    return NextResponse.json({ 
      error: "Failed to switch organization",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      debug: {
        userId: session.user?.id,
        currentOrgId: session.organizationId
      }
    }, { status: 500 });
  }
};