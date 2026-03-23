// lib/localdata.ts

export const authUtils = {
  // SAVE ID: Sets a cookie that lasts 7 days
  saveId: (id: string) => {
    if (typeof window !== "undefined") {
      document.cookie = `bekam_user_id=${id}; path=/; max-age=604800; SameSite=Lax`;
    }
  },

  // GET ID: Used by Client Components (like AuthGuard)
  getId: () => {
    if (typeof window !== "undefined") {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; bekam_user_id=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    }
    return null;
  },

  // CLEAR ID: Used for Logout
  clearId: () => {
    if (typeof window !== "undefined") {
      document.cookie = "bekam_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
  }
};