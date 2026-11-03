import {
  INVOICES_KEY,
  MOCK_INITIALIZED_KEY,
  ORDERS_KEY,
  RETURNS_KEY,
} from "./keys";
import { SEED_INVOICES } from "./invoices";
import { SEED_ORDERS } from "./orders";
import { SEED_RETURNS } from "./returns";
import { readJson, readRaw, writeJson, writeRaw } from "./storage";

/**
 * Seed data demo sekali per browser, dipertahankan dari src/mockData.ts.
 *
 * TODO(backend): hapus pemanggilan bootstrap ini setelah semua data
 * berasal dari API nyata.
 */
export function initMockData(): void {
  if (typeof window === "undefined") return;
  if (readRaw(MOCK_INITIALIZED_KEY) === "true") return;
  writeRaw(MOCK_INITIALIZED_KEY, "true");

  const orders = readJson<Record<string, unknown[]>>(ORDERS_KEY, {});
  orders["user-1"] = SEED_ORDERS["user-1"];
  writeJson(ORDERS_KEY, orders);

  const returns = readJson<Record<string, unknown[]>>(RETURNS_KEY, {});
  returns["user-1"] = SEED_RETURNS["user-1"];
  writeJson(RETURNS_KEY, returns);

  const invoices = readJson<Record<string, Record<string, string>>>(
    INVOICES_KEY,
    {},
  );
  invoices["user-1"] = SEED_INVOICES["user-1"];
  writeJson(INVOICES_KEY, invoices);
}
