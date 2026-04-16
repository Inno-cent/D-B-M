/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    WASENDER_API_KEY: string
    ADMIN_PHONE: string
    SHEETDB_URL: string
  }
}