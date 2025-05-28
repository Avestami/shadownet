# Account Management Features

## New Terminal Commands Added

### Sign Out / Logout Commands
- **Commands**: `sign-out`, `logout`
- **Function**: Safely logs out the user from ShadowNet
- **Available**: In all terminals (main page and level pages)

### Delete Account Commands
- **Commands**: `delete-account`, `confirm-delete-account`
- **Function**: Permanently deletes user account and all associated data
- **Available**: In all terminals (main page and level pages)
- **Safety**: Requires confirmation command to prevent accidental deletion

## Command Details

### Sign Out / Logout
```bash
# Either command works
sign-out
logout
```

**What it does:**
1. Clears all localStorage data (debugUser, userKarma, authToken)
2. Calls the logout API to invalidate server sessions
3. Redirects to home page or reloads interface
4. Works for both debug users and regular authenticated users

**Output:**
```
Signing out of ShadowNet system...
Clearing session data...
Redirecting to login...
```

### Delete Account
```bash
# Step 1: Initiate deletion (shows warning)
delete-account

# Step 2: Confirm deletion (actually deletes)
confirm-delete-account
```

**What it does:**
1. **First command** (`delete-account`): Shows warning and lists what will be deleted
2. **Second command** (`confirm-delete-account`): Actually performs the deletion

**Data Deleted:**
- All progress and karma scores
- Captured flags and achievements
- User profile and statistics
- Traces and multiplayer data
- All database records associated with the user

**Output for Step 1:**
```
WARNING: ACCOUNT DELETION

This action will permanently delete your account and all associated data:
- All progress and karma scores
- Captured flags and achievements
- User profile and statistics
- Traces and multiplayer data

This action CANNOT be undone!

To confirm deletion, type: confirm-delete-account
To cancel, type any other command or press Enter
```

**Output for Step 2:**
```
ACCOUNT DELETION INITIATED...

Removing user data from ShadowNet systems...
Clearing karma and progress records...
Deleting multiplayer traces...
Purging session data...

Account deletion complete.
Redirecting to main page...
```

## API Endpoints Created

### Logout API (`/api/logout`)
- **Method**: POST
- **Purpose**: Invalidate user sessions and clean up server-side data
- **Authentication**: Optional (works even without valid token)
- **Response**: Always returns success to ensure logout completes

```typescript
// Example usage
await fetch('/api/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Delete Account API (`/api/delete-account`)
- **Method**: DELETE (also accepts POST)
- **Purpose**: Permanently delete user account and all related data
- **Authentication**: Required (JWT token)
- **Database Operations**: Cascading delete of all user-related records

```typescript
// Example usage
await fetch('/api/delete-account', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

**Database Deletion Order:**
1. User sessions (`session` table)
2. User level unlocks (`levelUnlock` table)
3. User player choices (`playerChoice` table)
4. User record (`user` table)

## Implementation Details

### Terminal Integration
- Commands added to both main page terminal and level page terminals
- Consistent behavior across all terminal instances
- Proper error handling and user feedback

### Debug Mode Support
- Special handling for debug users (localStorage-only accounts)
- Debug users get localStorage cleared instead of API calls
- Maintains functionality for development and testing

### Security Features
- Two-step confirmation for account deletion
- Clear warnings about permanent data loss
- Graceful handling of authentication failures
- Session cleanup on logout

### Error Handling
- Network failures don't prevent logout completion
- Invalid tokens are handled gracefully
- User feedback for all error conditions
- Fallback behaviors for edge cases

## User Experience

### Help Command Updated
The `help` command now includes the new account management options:

```
Available commands:
...
sign-out / logout - Sign out of your account
delete-account - Permanently delete your account (WARNING!)
...
```

### Safety Measures
1. **Account Deletion Warning**: Clear warning about permanent data loss
2. **Two-Step Process**: Requires confirmation command
3. **Cancel Option**: Any other command cancels the deletion
4. **Clear Feedback**: Detailed progress messages during deletion

### Accessibility
- Commands work in all terminal instances
- Consistent command names (`sign-out` and `logout` both work)
- Clear, descriptive output messages
- Proper error messages for troubleshooting

## Testing Recommendations

### Logout Testing
1. Test logout from main page terminal
2. Test logout from level page terminals
3. Verify localStorage is cleared
4. Verify session is invalidated on server
5. Test with both debug and regular users

### Account Deletion Testing
1. Test the warning message display
2. Test cancellation (typing other commands)
3. Test successful deletion flow
4. Verify all data is removed from database
5. Test with debug users (localStorage only)
6. Test error handling (invalid tokens, network failures)

### Edge Cases
1. Logout without authentication token
2. Delete account with expired token
3. Network failures during operations
4. Multiple logout attempts
5. Deletion attempts on non-existent accounts

## Security Considerations

### Data Privacy
- Complete data removal on account deletion
- No residual data left in database
- localStorage completely cleared
- Session tokens invalidated

### Authentication
- JWT token verification for account deletion
- Graceful handling of invalid/expired tokens
- No sensitive data exposed in error messages

### Audit Trail
- Server-side logging of account deletions
- User identification in logs for security monitoring
- Error logging for troubleshooting

## Files Modified

### Frontend Components
- `app/components/Terminal.tsx` - Added new commands to default commands
- `app/levels/[id]/page.tsx` - Added command handlers and logout/delete functions
- `app/page.tsx` - Added command handlers and logout/delete functions

### Backend APIs
- `app/api/logout/route.ts` - New logout endpoint
- `app/api/delete-account/route.ts` - New account deletion endpoint

### Documentation
- `ACCOUNT_MANAGEMENT_FEATURES.md` - This documentation file

## Future Enhancements

### Potential Improvements
- Account deactivation (temporary disable) option
- Data export before deletion
- Account recovery grace period
- Bulk user management for administrators
- Audit log viewing for users

### Security Enhancements
- Email confirmation for account deletion
- Additional authentication factors
- Rate limiting for deletion attempts
- Account deletion cooldown periods

## Summary

The account management features provide users with:
- ✅ **Easy logout/sign-out** from any terminal
- ✅ **Safe account deletion** with proper warnings and confirmation
- ✅ **Complete data removal** when deleting accounts
- ✅ **Consistent experience** across all game interfaces
- ✅ **Proper error handling** for edge cases
- ✅ **Debug mode support** for development

These features enhance user control over their accounts while maintaining security and preventing accidental data loss. 