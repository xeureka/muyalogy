import { supabase } from '../lib/supabaseClient';

export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
};

async function login(email: string, password: string) {
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });
  if (error) throw error;
  return user;
}

async function register(email: string, password: string) {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return user;
}

async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

function getCurrentUser() {
  return supabase.auth.user();
}