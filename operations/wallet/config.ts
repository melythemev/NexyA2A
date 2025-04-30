import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// 🔧 Wallet tool names
export const WalletToolName = {
  get_wallet_info: "get_wallet_info",
  get_token_holdings: "get_token_holdings",
  get_wallet_activity: "get_wallet_activity",
  get_recent_pnl: "get_recent_pnl",
} as const;

export type WalletToolNameType = keyof typeof WalletToolName;

// 📦 Wallet input schema (Solana only)
const WalletInputSchema = z.object({
  address: z.string().describe("Solana wallet address to query."),
});

// 🧪 Tool schemas
export const walletToolSchemas = {
  get_wallet_info: WalletInputSchema,
  get_token_holdings: WalletInputSchema,
  get_wallet_activity: WalletInputSchema,
  get_recent_pnl: WalletInputSchema,
};

// 🧠 Tool descriptions
function getWalletToolDescription(toolName: string): string {
  const descriptions: Record<string, string> = {
    get_wallet_info: "Get Solana wallet balance and general stats.",
    get_token_holdings: "Fetch all token holdings for a Solana wallet.",
    get_wallet_activity: "Get recent Solana wallet activity.",
    get_recent_pnl: "Get recent profit/loss for a Solana wallet.",
  };
  return descriptions[toolName] || "No description provided.";
}

// 📤 Final config for MCP server
export const walletToolConfig = Object.entries(walletToolSchemas).map(
  ([name, schema]) => ({
    name,
    description: getWalletToolDescription(name),
    inputSchema: zodToJsonSchema(schema),
  })
);

// 📦 Infer types
export type WalletToolArgs = {
  [K in keyof typeof walletToolSchemas]: z.infer<(typeof walletToolSchemas)[K]>;
};
