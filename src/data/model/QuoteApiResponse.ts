
export type QuoteApiResponse = QuoteDTO[]

export type QuoteDTO = {
    quote: string | null;
    character: string | null;
    image: string | null;
    characterDirection: string | null;
}
