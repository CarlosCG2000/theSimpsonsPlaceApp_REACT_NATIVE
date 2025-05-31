
export type EpisodeJsonResponse = {
    episodes: EpisodeDTO[]
}

export type EpisodeDTO = {
    title: string | null;
    season: number | null;
    episode: number | null;
    release_date: string | null; // Consider converting to Date in the extension: toEpisode
    directors: string[] | null;
    writers: string[] | null;
    description: string | null;
    disneyplus_id: string | null;
    simpsonsworld_id: number | null;
    good: boolean | null;
    guest_stars: string[] | null;
};

