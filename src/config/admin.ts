/**
 * Admin 白名單 - 只有這些 Email 能看到 Staff Mode
 */
export const ADMIN_EMAILS = [
    'mikemm5216@gmail.com',
    // 未來可以新增更多管理員
];

/**
 * 檢查用戶是否為管理員
 */
export const isAdmin = (userEmail: string | undefined): boolean => {
    if (!userEmail) return false;
    return ADMIN_EMAILS.includes(userEmail.toLowerCase());
};
