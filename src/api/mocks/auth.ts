import type { MockAccount } from "../auth";
import { readJson, writeJson } from "./storage";

const MOCK_ACCOUNTS_KEY = "schooly.mock.users";

/**
 * Akun demo. Akun hasil registrasi disimpan di localStorage browser.
 *
 * TODO(backend): hapus seed ini setelah endpoint /auth tersedia.
 */
export const SEED_ACCOUNTS: MockAccount[] = [
  {
    id: "admin-1",
    name: "Admin Schooly Shop",
    email: "admin@schoolyshop.test",
    password: "Admin12345",
    role: "admin",
    active: true,
  },
  {
    id: "user-1",
    name: "Nabila Azzahra",
    email: "user@gmail.test",
    password: "12345",
    role: "user",
    active: true,
  },
  {
    id: "user-2",
    name: "Akun Nonaktif",
    email: "nonaktif@schoolyshop.test",
    password: "User12345",
    role: "user",
    active: false,
  },
];

export function readRegisteredAccounts(): MockAccount[] {
  return readJson<MockAccount[]>(MOCK_ACCOUNTS_KEY, []);
}

export function writeRegisteredAccounts(accounts: MockAccount[]): void {
  writeJson(MOCK_ACCOUNTS_KEY, accounts);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
