import { z } from "zod";

// Definition of the BingoCell schema and type
export const BingoCellSchema = z.object({
  number: z.string(),
  crossed_out: z.boolean(),
});

export type BingoCell = z.infer<typeof BingoCellSchema>;

// Definition of the BingoCard schema and type
export const BingoCardSchema = z.object({
  card_id: z.string(),
  card: z.array(z.array(BingoCellSchema)),
});

export type BingoCardType = z.infer<typeof BingoCardSchema>;

// Definition of the BingoBall schema and type
export const BingoBallSchema = z.object({
  number: z.string(),
});

export type BingoBall = z.infer<typeof BingoBallSchema>;
