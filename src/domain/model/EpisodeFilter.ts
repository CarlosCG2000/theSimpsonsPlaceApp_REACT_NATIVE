
export class EpisodeFilter {
    search?: string;
    season?: number | null;
    dateStart?: Date | null;
    dateEnd?: Date | null;

    constructor(search?: string, season?: number | null, dateStart?: Date | null, dateEnd?: Date | null) {
        this.search = search;
        this.season = season;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
    }
}
