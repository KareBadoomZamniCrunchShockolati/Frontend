// src/stores/useProfileStore.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserState } from "../../types/userTypes"; 

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Hardcoded values
      username: "hardcodedUsername", // Replace with desired username
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMSwiaXNzIjoiY2hhbGxlbmdlLWFwcCIsImV4cCI6MTc2Mjk2MDA3OCwiaWF0IjoxNzYyODczNjc4fQ.a5byDGbFVTWKp86Bm3rswHE6BWFmB81zOBqFraEEYUY", // Replace with desired token
      id: "21",

      setUsername: (username: string) =>
        set((prev) => ({ ...prev, username })),

      setToken: (token: string) =>
        set((prev) => ({ ...prev, token })),

      setId: (id: string) =>
        set((prev) => ({ ...prev, id})),
    }),
    {
      name: "profile-storage", // Store name
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for persistence
    }
  )
);

export default useUserStore;
