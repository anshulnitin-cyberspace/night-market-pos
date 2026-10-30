import type { UserSession } from "@/lib/types";

/**
 * The QR code at the stall points to this app and establishes a lightweight,
 * mocked session. Swap this module for a real auth/session provider when a
 * backend is connected.
 *
 * Every cart and order request below is scoped with `userId`. That mirrors the
 * Supabase/Firebase model where the database, not the browser, is the final
 * authority over who can read a row.
 */
export const ACTIVE_SESSION: UserSession = {
  sessionId: "sess_nm_7k2f9c",
  userId: "usr_8f3a2c91",
  displayName: "Night Owl 4821",
  table: "07",
};

/**
 * A second user exists in the mock database on purpose. Their rows are never
 * returned by the scoped queries, which makes the row-level filtering visible
 * during development.
 */
export const OTHER_USER_ID = "usr_4d19ba07";
export const OTHER_SESSION_ID = "sess_nm_1b8e44";
