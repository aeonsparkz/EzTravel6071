import supabase from "../supabaseClient";
import { AuthError, Session, User } from '@supabase/supabase-js';

interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  const { data: existingUser, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (existingUser?.user) {
    return {
      user: null,
      session: null,
      error: { message: 'Email is already in use.' } as AuthError,
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    error,
  };
};


export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    error,
  };
};

export const signOut = async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signOut();
    return { error };
};
