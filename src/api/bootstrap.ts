import { initMockData } from "./mocks/init";

/**
 * Bootstrap data demo lokal. Dipanggil sekali dari root layout client.
 *
 * TODO(backend): hapus setelah seluruh data berasal dari API nyata.
 */
export function initializeLocalData(): void {
  initMockData();
}
