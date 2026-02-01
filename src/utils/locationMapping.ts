/**
 * 地區映射工具 - 用於根據使用者位置智能排序賽事
 */

// 城市到地區的映射
export const CITY_TO_REGION: Record<string, string> = {
    // 日本
    'Tokyo': 'Japan',
    'Osaka': 'Japan',
    'Kyoto': 'Japan',
    'Yokohama': 'Japan',

    // 越南
    'Hanoi': 'Vietnam',
    'Ho Chi Minh': 'Vietnam',
    'Bac Ninh': 'Vietnam',
    'Da Nang': 'Vietnam',

    // 台灣
    'Taipei': 'Taiwan',
    'Kaohsiung': 'Taiwan',
    'Taichung': 'Taiwan',

    // 東南亞其他
    'Bangkok': 'SEA',
    'Singapore': 'SEA',
    'Manila': 'SEA',
    'Kuala Lumpur': 'SEA',
};

// 聯賽到地區的映射
export const LEAGUE_TO_REGION: Record<string, string> = {
    // 日本
    'J.League': 'Japan',
    'NPB': 'Japan',

    // 越南
    'V.League': 'Vietnam',
    'V.League 1': 'Vietnam',

    // 台灣
    'CPBL': 'Taiwan',

    // 北美
    'NFL': 'North America',
    'NBA': 'North America',
    'NHL': 'North America',
    'MLB': 'North America',

    // 歐洲/國際
    'Premier League': 'International',
    'Champions League': 'International',
    'La Liga': 'International',
    'Serie A': 'International',
    'Bundesliga': 'International',
    'UEFA': 'International',
    'Wimbledon': 'International',
    'F1': 'International',
    'UFC': 'International',
    'PGA Tour': 'International',
    'WBC': 'International',
    'AFF Cup': 'SEA',
};

/**
 * 計算賽事與使用者位置的關聯性分數
 * @param eventLeague 賽事聯賽
 * @param userCity 使用者所在城市
 * @returns 分數 (越高越相關)
 */
export const calculateEventRelevanceScore = (
    eventLeague: string,
    userCity: string | undefined,
    isHot: boolean
): number => {
    // 基礎分數
    let score = 0;

    // 如果沒有城市過濾，所有賽事平等
    if (!userCity || userCity === 'Near Current Loc') {
        return isHot ? 100 : 50;
    }

    const userRegion = CITY_TO_REGION[userCity];
    const eventRegion = LEAGUE_TO_REGION[eventLeague];

    // 1. 本地賽事 = 最高優先級
    if (userRegion && eventRegion === userRegion) {
        score = 1000;
    }
    // 2. 國際大賽 = 中等優先級
    else if (eventRegion === 'International' || eventRegion === 'North America') {
        score = 500;
    }
    // 3. 同區域（如東南亞）= 較低優先級
    else if (userRegion === 'SEA' && eventRegion === 'SEA') {
        score = 400;
    }
    // 4. 其他地區 = 最低優先級
    else {
        score = 100;
    }

    // Hot 賽事加分
    if (isHot) {
        score += 50;
    }

    return score;
};
