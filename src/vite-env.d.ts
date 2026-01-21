/// &lt;reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID: string
    readonly VITE_FACEBOOK_APP_ID: string
    readonly VITE_ZALO_APP_ID: string
    readonly VITE_OAUTH_REDIRECT_URI: string
    readonly VITE_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
