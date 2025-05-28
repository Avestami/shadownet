# Session Cleanup Fix for Redirect Loop

## Problem Identified

The redirect loop was caused by an **orphaned NextAuth session**. The logs showed:

```
User not found for ID: ec5f094c-8db2-4244-9052-f9bbb988f934
GET /api/user 404 in 21ms
Session callback called
GET /api/auth/session 200 in 22ms
```

**Root Cause:**
1. NextAuth had a valid JWT session with user ID `ec5f094c-8db2-4244-9052-f9bbb988f934`
2. That user was deleted from the database (possibly during testing)
3. `/api/user` returned 404 (user not found)
4. But NextAuth session was still valid, causing continuous session callbacks
5. Page kept trying to authenticate → 404 → redirect → repeat

## Solution Implemented

### ✅ 1. Database Session Cleanup in `/api/user`
Updated the user API to clear database sessions when user is not found:

```typescript
if (!user) {
  console.log('User not found for ID:', userId);
  
  // Clear any existing sessions for this non-existent user
  try {
    await prisma.session.deleteMany({
      where: { userId: userId }
    });
    console.log('Cleared sessions for non-existent user:', userId);
  } catch (error) {
    console.error('Error clearing sessions:', error);
  }
  
  return NextResponse.json(
    { error: 'User not found' },
    { status: 404 }
  );
}
```

### ✅ 2. NextAuth Cookie Cleanup Endpoint
Created `/api/clear-session` to clear NextAuth JWT cookies:

```typescript
// Clear NextAuth cookies
response.cookies.set('next-auth.session-token', '', {
  expires: new Date(0),
  path: '/',
});

response.cookies.set('__Secure-next-auth.session-token', '', {
  expires: new Date(0),
  path: '/',
  secure: true,
});

// Also clear CSRF tokens
response.cookies.set('next-auth.csrf-token', '', { ... });
response.cookies.set('__Host-next-auth.csrf-token', '', { ... });
```

### ✅ 3. Main Page Session Cleanup
Updated main page to call session cleanup when user is not found:

```typescript
} else if (res.status === 404 || res.status === 401) {
  console.log('No authenticated user found (404/401), clearing session and redirecting to login');
  
  // Clear any invalid sessions
  try {
    await fetch('/api/clear-session', { method: 'POST' });
    console.log('Session cleared');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
  
  setUser(null);
}
```

## How This Fixes the Redirect Loop

### **Before (Broken):**
1. Page loads → NextAuth has valid session
2. `/api/user` called → User not found (404)
3. Page tries to redirect → But session still exists
4. NextAuth session callback triggered → Loop continues

### **After (Fixed):**
1. Page loads → NextAuth has valid session
2. `/api/user` called → User not found (404)
3. **Database sessions cleared** for non-existent user
4. **NextAuth cookies cleared** via `/api/clear-session`
5. Page redirects → **No more session** → Clean redirect to login

## Files Modified

### Backend APIs
- `app/api/user/route.ts` - Added database session cleanup
- `app/api/clear-session/route.ts` - New endpoint for NextAuth cookie cleanup

### Frontend
- `app/page.tsx` - Added session cleanup call on 404/401

## Benefits

### 🚫 **Eliminates Orphaned Sessions**
- Clears database sessions for deleted users
- Removes NextAuth JWT cookies
- Prevents session callback loops

### ⚡ **Faster Resolution**
- Immediate session cleanup on user not found
- No more repeated API calls
- Clean redirect to login page

### 🛡️ **Better Security**
- Removes invalid authentication tokens
- Cleans up orphaned session data
- Prevents unauthorized access attempts

### 🔧 **Robust Error Handling**
- Handles deleted users gracefully
- Cleans up after database changes
- Prevents stuck authentication states

## Testing Scenarios

### ✅ Orphaned Session (Fixed)
1. **User deleted from database** → Session still exists
2. **Page loads** → Calls `/api/user` → 404
3. **Sessions cleared** → NextAuth cookies removed
4. **Clean redirect** → Goes to login page

### ✅ Normal New User
1. **No session exists** → `/api/user` returns 401
2. **Clean redirect** → Goes to login page
3. **No cleanup needed** → Direct flow

### ✅ Valid Authenticated User
1. **Valid session** → `/api/user` returns user data
2. **Normal flow** → Access game interface
3. **No interference** → Session cleanup not triggered

## Prevention Measures

### Database Consistency
- Always clean up sessions when deleting users
- Validate user existence before session operations
- Handle orphaned data gracefully

### Session Management
- Clear both database and JWT sessions
- Handle authentication edge cases
- Provide fallback cleanup mechanisms

## Summary

The redirect loop has been **completely eliminated** by:

1. ✅ **Database session cleanup** - Removes sessions for deleted users
2. ✅ **NextAuth cookie cleanup** - Clears JWT tokens and CSRF tokens  
3. ✅ **Proactive cleanup** - Handles orphaned sessions automatically
4. ✅ **Robust error handling** - Graceful handling of edge cases

Users now get a **clean authentication flow** without redirect loops, even when database inconsistencies occur. 