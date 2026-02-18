import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
const AuthContext = createContext(void 0);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session2) => {
        setSession(session2);
        setUser(session2?.user ?? null);
        if (session2?.user) {
          setTimeout(() => {
            fetchUserData(session2.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
          setLoading(false);
        }
      }
    );
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      setUser(session2?.user ?? null);
      if (session2?.user) {
        fetchUserData(session2.user.id);
      } else {
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const fetchUserData = async (userId) => {
    try {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
      if (profileData) {
        setProfile(profileData);
      }
      const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
      if (roleData) {
        setRole(roleData.role);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  const signUp = async (email, password, name, role2) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
          role: role2
        }
      }
    });
    return { error };
  };
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setRole(null);
  };
  return /* @__PURE__ */ jsx(
    AuthContext.Provider,
    {
      value: {
        user,
        session,
        profile,
        role,
        loading,
        signUp,
        signIn,
        signOut
      },
      children
    }
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
export {
  AuthProvider,
  useAuth
};
