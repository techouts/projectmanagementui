import { User } from "@/types";
import { mockUsers } from "./mock-data";
import { isSupabaseConfigured, supabase } from "./supabase";

export const signIn = async (email: string, password: string) => {
  try {
    // First, try to authenticate with Supabase Auth

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email,
      password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(
      "http://172.20.2.64:3001/api/auth/login",
      requestOptions
    );

    if (response.ok) {
      const data: any = await response.json();
      return { data, error: null };
    } else {
      const errorText = await response.text();
      return {
        data: null,
        error: {
          message: `Request failed: ${errorText || response.statusText}`,
        },
      };
    }
  } catch (error) {
    return { error };
  }
};

export const signOut = async () => {
  if (!isSupabaseConfigured) {
    // Mock sign out
    return;
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn("Sign out error:", error);
    }
  } catch (error) {
    console.warn("Sign out error:", error);
  }
};

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured) {
    // Check localStorage for mock user
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const user = JSON.parse(stored);
        return { data: user, error: null };
      }
    } catch (error) {
      console.warn("Error getting stored user:", error);
    }
    return { data: null, error: null };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Check localStorage for fallback
      try {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
          const storedUser = JSON.parse(stored);
          return { data: storedUser, error: null };
        }
      } catch (error) {
        console.warn("Error getting stored user:", error);
      }
      return { data: null, error: null };
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (userError || !userData) {
      return {
        data: null,
        error: { message: "User profile not found" },
      };
    }

    const userProfile: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      avatar_url: userData.avatar_url,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    };

    return {
      data: userProfile,
      error: null,
    };
  } catch (error) {
    console.warn("Get current user error (checking localStorage):", error);

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const user = JSON.parse(stored);
        return { data: user, error: null };
      }
    } catch (storageError) {
      console.warn("Error getting stored user:", storageError);
    }

    return {
      data: null,
      error: { message: "Failed to get current user" },
    };
  }
};
