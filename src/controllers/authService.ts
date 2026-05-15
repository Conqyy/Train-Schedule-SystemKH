/* ===================================================================
   Controller – AuthService
   Mock authentication for the initial release.
   Uses localStorage to persist session state.
   =================================================================== */

export interface AuthUser {
  email: string;
  name: string;
  role: "admin" | "passenger";
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: AuthUser;
}

const AUTH_KEY = "ksa_auth_user";
const USERS_KEY = "ksa_registered_users";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/* ---------- Registered-User Store ---------- */

interface StoredUser {
  email: string;
  name: string;
  password: string; // plain-text (mock only)
}

function getStoredUsers(): StoredUser[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as StoredUser[]) : [];
}

function saveStoredUsers(users: StoredUser[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* ---------- Public API ---------- */

/**
 * Register a new user.
 */
export function register(
  name: string,
  email: string,
  password: string,
): AuthResult {
  const users = getStoredUsers();

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: "An account with this email already exists." };
  }

  if (password.length < 4) {
    return { success: false, message: "Password must be at least 4 characters." };
  }

  users.push({ email: email.toLowerCase(), name, password });
  saveStoredUsers(users);

  return {
    success: true,
    message: "Account created successfully! Please log in.",
  };
}

/**
 * Log in.
 * - admin@trains.com (any password) → admin role
 * - Any registered email + matching password → passenger role
 */
export function login(email: string, password: string): AuthResult {
  const normalizedEmail = email.toLowerCase().trim();

  // Admin shortcut
  if (normalizedEmail === "admin@trains.com") {
    const user: AuthUser = { email: normalizedEmail, name: "Admin", role: "admin" };
    if (isBrowser()) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return { success: true, message: "Welcome, Admin!", user };
  }

  // Regular user lookup
  const users = getStoredUsers();
  const found = users.find(
    (u) => u.email === normalizedEmail && u.password === password,
  );

  if (!found) {
    return { success: false, message: "Invalid email or password." };
  }

  const user: AuthUser = { email: found.email, name: found.name, role: "passenger" };
  if (isBrowser()) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return { success: true, message: `Welcome back, ${found.name}!`, user };
}

/**
 * Return the currently-logged-in user (or null).
 */
export function getCurrentUser(): AuthUser | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

/**
 * Log out the current user.
 */
export function logout(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_KEY);
}
