export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  identifier?: string;
  className?: string;
  gradeLevel?: string;
  role: 'student' | 'teacher';
}

export function validateUsernameOrEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Email atau nama pengguna wajib diisi.';
  }
  if (trimmed.length < 3) {
    return 'Panjang minimal 3 karakter.';
  }
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) {
    return 'Kata sandi wajib diisi.';
  }
  if (value.length < 4) {
    return 'Kata sandi minimal 4 karakter.';
  }
  return null;
}
