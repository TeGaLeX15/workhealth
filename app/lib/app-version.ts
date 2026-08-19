// app/lib/app-version.ts
import packageJson from "../../package.json";

/**
 * Текущая версия приложения из package.json.
 */
export const APP_VERSION = packageJson.version;