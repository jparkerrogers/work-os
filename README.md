# Take-Home Challenge: User Management Widget Implementation

This is a Next.js application that demonstrates authentication with AuthKit and the WorkOS Node SDK. Your challenge is to implement the **User Management Widget** from WorkOS to allow users to manage team members within their organization.

## Challenge Overview

You will be implementing the [WorkOS User Management Widget](https://workos.com/docs/user-management/widgets/user-management) to provide a complete user management interface. This widget allows organization admins to:

- Invite new users to the organization
- Remove users from the organization
- Manage user roles and permissions
- View all organization members

## Prerequisites

Create a fork of this repository to use for this challenge.

You will need a [WorkOS account](https://dashboard.workos.com/signup) to complete this challenge.

## Setup Instructions

1. In the [WorkOS dashboard](https://dashboard.workos.com), head to the Redirects tab and create a [sign-in callback redirect](https://workos.com/docs/user-management/1-configure-your-project/configure-a-redirect-uri) for `http://localhost:3000/callback` and set the app homepage URL to `http://localhost:3000`.

2. After creating the redirect URI, navigate to the API keys tab and copy the _Client ID_ and the _Secret Key_. Rename the `.env.local.example` file to `.env.local` and supply your Client ID and API key as environment variables.

3. Additionally, create a cookie password as the private key used to encrypt the session cookie. Copy the output into the environment variable `WORKOS_COOKIE_PASSWORD`.

   It has to be at least 32 characters long. You can use https://1password.com/password-generator/ to generate strong passwords.

4. Verify your `.env.local` file has the following variables filled.

   ```bash
   WORKOS_CLIENT_ID=<YOUR_CLIENT_ID>
   WORKOS_API_KEY=<YOUR_API_SECRET_KEY>
   WORKOS_COOKIE_PASSWORD=<YOUR_COOKIE_PASSWORD>

   NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
   ```

5. Run the following command and navigate to [http://localhost:3000](http://localhost:3000).

   ```bash
   npm run dev
   ```

## Implementation

Use the [WorkOS documentation](https://workos.com/docs) as a guide for completing this challenge.

### Your Task

Implement the User Management Widget in this application. You'll need to:

1. Research and install the required dependencies for the WorkOS Widgets
2. Create a new page or component that implements the `UsersManagement` widget
3. Handle authentication properly - you'll need to generate a widget token on the backend
4. Ensure the widget integrates well with the existing application

### Submission

**✅ IMPLEMENTATION COMPLETE**

## Live Application

**Deployed URL:** https://work-os-two.vercel.app/

## Login Credentials

**Demo Account:**
- **Email:** `parker.workos.demo@outlook.com`
- **Password:** `DemoUser123`
- **Role:** Admin (full User Management permissions)

## Testing Instructions

1. **Visit the application:** https://work-os-two.vercel.app/
2. **Sign in using the credentials above**
3. **Navigate to "User Management"** using the navigation menu
4. **Test the User Management Widget functionality:**
   - View organization members
   - Invite new users to the organization
   - Remove users from the organization
   - Manage user roles and permissions

## Implementation Summary

**Completed Requirements:**
- ✅ Installed required WorkOS Widget dependencies
- ✅ Created User Management page with WorkOS `UsersManagement` widget
- ✅ Implemented backend API for widget token generation
- ✅ Integrated seamlessly with existing AuthKit authentication flow
- ✅ Added comprehensive error handling and loading states
- ✅ Deployed to production with proper environment configuration

**Technical Architecture:**
- **Backend:** Next.js API route (`/api/generate-widget-token`) generates widget tokens using WorkOS Node SDK
- **Frontend:** React component fetches tokens and renders WorkOS User Management Widget
- **Authentication:** Full integration with existing WorkOS AuthKit flow
- **Deployment:** Production-ready on Vercel with environment variables configured

No additional setup required - the application is ready for testing.

## Evaluation Criteria

Your implementation will be evaluated on:

- **Functionality**: The widget should work correctly for inviting, removing, and managing users
- **Integration**: Proper integration with the existing authentication flow
- **Code Quality**: Clean, well-structured, and maintainable code
- **User Experience**: Intuitive interface and proper error handling
- **Documentation**: Clear comments and any additional documentation you provide

## Bonus

- Implement additional widgets on top of the User Management widget

## Resources

- [WorkOS Widgets Documentation](https://workos.com/docs/user-management/widgets/user-management)
- [WorkOS User Management Guide](https://workos.com/docs/user-management)
- [Next.js Documentation](https://nextjs.org/docs)

Good luck with your implementation!
