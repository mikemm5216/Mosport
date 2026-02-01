/**
 * OAuth 設定檔案
 * 集中管理所有第三方登入的配置
 */

export interface OAuthConfig {
    clientId: string;
    redirectUri: string;
    authUrl: string;
    scope: string;
}

export const oauthConfig = {
    google: {
        clientId: '395326060348-r3av2c3qijuuq2ibdgfkd928ss9vbdbc.apps.googleusercontent.com',
        redirectUri: 'https://mosport.app/auth/callback',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scope: 'openid email profile',
    } as OAuthConfig,

    facebook: {
        clientId: '1356000812963818',
        redirectUri: 'https://mosport.app/auth/callback',
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        scope: 'public_profile,email',
    } as OAuthConfig,

    zalo: {
        clientId: '4270389622263061825',
        redirectUri: 'https://mosport.app/auth/callback',
        authUrl: 'https://oauth.zaloapp.com/v4/permission',
        scope: 'id,name,picture',
    } as OAuthConfig,
};

/**
 * 產生 OAuth 授權 URL
 */
export const generateOAuthUrl = (provider: keyof typeof oauthConfig, state?: string): string => {
    const config = oauthConfig[provider];

    if (!config.clientId) {
        console.error(`Missing client ID for ${provider}`);
        return '#';
    }

    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: config.scope,
        state: state || `${provider}_${Date.now()}`,
    });

    // Facebook 需要額外的參數
    if (provider === 'facebook') {
        params.append('display', 'popup');
    }

    // Zalo 使用不同的參數名稱
    if (provider === 'zalo') {
        params.delete('client_id');
        params.append('app_id', config.clientId);
    }

    return `${config.authUrl}?${params.toString()}`;
};

/**
 * 檢查 OAuth 配置是否完整
 */
export const validateOAuthConfig = (): { provider: string; valid: boolean }[] => {
    return Object.entries(oauthConfig).map(([provider, config]) => ({
        provider,
        valid: Boolean(config.clientId),
    }));
};
