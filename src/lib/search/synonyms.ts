export const sportSynonyms: Record<string, string[]> = {
    "football": ["soccer", "fútbol", "epl", "premier league", "laliga", "serie a", "bundesliga", "ligue 1", "ucl", "champions league"],
    "american football": ["nfl", "super bowl", "superbowl", "college football", "ncaa"],
    "baseball": ["wbc", "world baseball classic", "mlb", "cpbl", "npb", "中華隊", "team taiwan", "samurai japan"],
    "formula 1": ["f1", "racing", "grand prix", "ferrari", "red bull", "mercedes", "mclaren"],
    "basketball": ["nba", "basketbal", "b-ball", "lakers", "warriors", "lebron", "curry"],
    "tennis": ["wimbledon", "us open", "roland garros", "australian open"],
    "golf": ["pga", "masters", "ryder cup"],
    "mma": ["ufc", "bellator", "boxing", "fight night"],
    "cricket": ["ipl", "test match", "t20", "odi"],
    "rugby": ["six nations", "world cup", "all blacks", "springboks"],
    "darts": ["pdc", "world championship"],
    "snooker": ["world snooker", "masters snooker"],
    "esports": ["lol", "league of legends", "dota", "csgo", "valorant", "lck", "lpl"]
};

/**
 * Normalizes a search term to its canonical sport category if a synonym is found.
 * @param term User search input
 * @returns Canonical term if synonym found, otherwise original term
 */
export function normalizeSearchTerm(term: string): string {
    if (!term) return term;

    const lowerTerm = term.toLowerCase().trim();

    // Check if term exists in any value array, if so, return the key (Canonical Name)
    for (const [canonical, aliases] of Object.entries(sportSynonyms)) {
        // Check if it matches canonical or any alias
        if (canonical.toLowerCase() === lowerTerm || aliases.includes(lowerTerm)) {
            return canonical;
        }
    }
    return term; // Return original if no synonym found
}

/**
 * Checks if a search term likely relates to a specific sport category synonym
 */
export function getSynonymsFor(term: string): string[] {
    const canonical = normalizeSearchTerm(term);
    return sportSynonyms[canonical] || [];
}
