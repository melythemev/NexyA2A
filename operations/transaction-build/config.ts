// transactionSchemas.ts
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const TransactionToolName = {
  swap_token: "swap_token",
  transfer: "transfer",
} as const;

export type TransactionToolNameType = keyof typeof TransactionToolName;

// 🔁 Swap schema
const SwapTokenSchema = z.object({
  input_token_symbol: z.string().optional().describe("Input token symbol"),
  output_token_symbol: z.string().optional().describe("Output token symbol"),
  input_token_ca: z
    .string()
    .optional()
    .describe("Input token contract address"),
  output_token_ca: z
    .string()
    .optional()
    .describe("Output token contract address"),
  amount: z.number().describe("Amount of token to swap"),
});

// 🧾 Transfer schema (Solana only)
const TransferTokenSchema = z.object({
  receive_address: z.string().describe("Recipient wallet address"),
  amount: z.number().describe("Amount of SOL to transfer"),
});

export const transactionSchemas = {
  swap_token: SwapTokenSchema,
  transfer: TransferTokenSchema,
};

function getTokenToolDescription(toolName: string): string {
  const descriptions: Record<string, string> = {
    swap_token:
      "Estimate the output amount for a token swap without executing the transaction or requiring a private key.",
    transfer:
      "Simulate a SOL transfer to another wallet address. No private key or on-chain transaction involved.",
  };
  return descriptions[toolName] || "No description provided.";
}

export const transactionToolConfig = Object.entries(transactionSchemas).map(
  ([name, schema]) => ({
    name,
    description: getTokenToolDescription(name),
    inputSchema: zodToJsonSchema(schema),
  })
);

export type TransactionToolArgs = {
  [K in keyof typeof transactionSchemas]: z.infer<
    (typeof transactionSchemas)[K]
  >;
};
