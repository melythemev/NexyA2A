import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// 🔧 Token analysis tool function names
export const TokenToolName = {
  get_token_info: "get_token_info",
  get_token_holders: "get_token_holders",
  get_trending_tokens: "get_trending_tokens",
  dev_check: "dev_check",
  get_tweet_creators_kol: "get_tweet_creators_kol",
} as const;

export type TokenToolNameType = keyof typeof TokenToolName;

// 📦 Zod Schemas for each tool
const GetTokenInfoSchema = z.object({
  tokenCA: z.string().describe("Contract address of the token, if available."),
  symbol: z
    .string()
    .describe("Symbol of the token, if contract address is not provided."),
});

const GetTokenHoldersSchema = GetTokenInfoSchema;

const GetTrendingTokensSchema = z.object({
  orderby: z
    .enum([
      "market_cap",
      "liquidity",
      "volume",
      "holder_count",
      "swaps",
      "price",
      "bluechip_owner_percentage",
      "open_timestamp",
    ])
    .default("market_cap")
    .describe("Criteria to sort trending tokens. Default is 'market_cap'."),

  trending_timeframe: z
    .enum(["1m", "5m", "1h", "6h", "24h"])
    .default("24h")
    .describe("Timeframe for trending tokens. Default is '24h'."),

  direction: z
    .enum(["asc", "desc"])
    .default("desc")
    .describe("Sort direction. Default is 'desc'."),

  min_liquidity: z
    .number()

    .optional()
    .describe("Minimum liquidity."),
  max_liquidity: z
    .number()

    .optional()
    .describe("Maximum liquidity."),

  min_marketcap: z
    .number()

    .optional()
    .describe("Minimum marketcap."),
  max_marketcap: z
    .number()

    .optional()
    .describe("Maximum marketcap."),

  min_volume: z.number().optional().describe("Minimum volume."),
  max_volume: z.number().optional().describe("Maximum volume."),

  min_swaps: z.number().optional().describe("Minimum swaps."),
  max_swaps: z.number().optional().describe("Maximum swaps."),

  min_holder_count: z
    .number()

    .optional()
    .describe("Minimum number of holders."),
  max_holder_count: z
    .number()

    .optional()
    .describe("Maximum number of holders."),

  min_created_time: z
    .string()

    .optional()
    .describe("Minimum age of token (e.g., '30m', '1h')."),
  max_created_time: z
    .string()

    .optional()
    .describe("Maximum age of token (e.g., '1h', '1d')."),

  renounced: z
    .boolean()

    .optional()
    .describe("Filter for renounced ownership."),
  frozen: z
    .boolean()

    .optional()
    .describe("Filter for frozen tokens."),
  burn: z
    .boolean()

    .optional()
    .describe("Filter for tokens with burning."),
  distributed: z
    .boolean()

    .optional()
    .describe("Filter for distributed tokens."),
  token_burnt: z
    .boolean()

    .optional()
    .describe("Filter for burnt tokens."),
});

const DevCheckSchema = z.object({
  tokenCA: z.string().describe("Contract address of the token to analyze."),
});

const GetTweetCreatorsSchema = z.object({
  tokenCA: z.string().describe("Contract address of the token."),
  symbol: z.string().describe("Symbol of the token."),
});

// 🎯 Exported schemas
export const tokenToolSchemas = {
  get_token_info: GetTokenInfoSchema,
  get_token_holders: GetTokenHoldersSchema,
  get_trending_tokens: GetTrendingTokensSchema,
  dev_check: DevCheckSchema,
  get_tweet_creators_kol: GetTweetCreatorsSchema,
};

// 🧠 Tool descriptions
function getTokenToolDescription(toolName: string): string {
  const descriptions: Record<string, string> = {
    get_token_info: "Retrieve token info by contract address or symbol.",
    get_token_holders: "Get top holders and distribution data of a token.",
    get_trending_tokens:
      "List trending tokens based on liquidity, volume, etc.",
    dev_check: "Evaluate developer wallet risk and rug history.",
    get_tweet_creators_kol: "Get X (Twitter) KOLs tweeting about the token.",
  };

  return descriptions[toolName] || "No description provided.";
}

// 📤 Export config (for MCP's ListToolsRequestSchema)
export const tokenToolConfig = Object.entries(tokenToolSchemas).map(
  ([name, schema]) => ({
    name,
    description: getTokenToolDescription(name),
    inputSchema: zodToJsonSchema(schema),
  })
);

// 🧾 Strongly-typed args per tool name
export type TokenToolArgs = {
  [K in keyof typeof tokenToolSchemas]: z.infer<(typeof tokenToolSchemas)[K]>;
};
