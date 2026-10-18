export type Role = "admin" | "user";

export type Session = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  phone: string; // format internasional, contoh: +6281234567890
  password: string;
};

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_INACTIVE"
  | "EMAIL_TAKEN"
  | "NETWORK"
  | "UNKNOWN";

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}
