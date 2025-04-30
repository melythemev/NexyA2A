import bs58 from "bs58";
import { z, ZodObject, ZodRawShape } from "zod";
import { Keypair } from "@solana/web3.js";
import { SolanaAgentKit, KeypairWallet } from "solana-agent-kit";
import type { Action } from "solana-agent-kit";
import { zodToJsonSchema } from "zod-to-json-schema";
import TokenPlugin from "./index.js";

export function createToolFromAction(action: Action, rpcUrl: string) {
  const baseSchema = action.schema as ZodObject<ZodRawShape>;

  return {
    name: action.name,
    description: action.description,
    inputSchema: baseSchema,
    call: async (args: any) => {
      let agent;
      let input = args;

      if ("privateKey" in args && args.privateKey) {
        const { privateKey, ...rest } = args;
        input = rest;

        try {
          const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
          const wallet = new KeypairWallet(keypair, rpcUrl);
          agent = new SolanaAgentKit(wallet, rpcUrl, {}).use(TokenPlugin);
        } catch (e) {
          throw new Error("Invalid privateKey provided");
        }
      } else {
        agent = new SolanaAgentKit(null as unknown as any, rpcUrl, {}).use(
          TokenPlugin
        );
      }

      const result = await action.handler(agent, input);
      return result;
    },
  };
}

const pluginTools = TokenPlugin.actions.map((action) =>
  createToolFromAction(
    action,
    "https://solana-mainnet.api.syndica.io/api-key/2QS6huFEnyo5tojfpgWyxJda2jKxoCnEaiECDLhB8oPjHbfuq52p1Ny4wo46dsqRQbDx1wZy3495ucHXgcrv6VPPhC4oWX18fxb"
  )
);

// 👇 Convert to map like `allToolActions` expects
const pluginToolActions = Object.fromEntries(
  pluginTools.map((tool) => [tool.name, tool.call])
);

// 👇 And add to schema list
const pluginToolSchemas = Object.fromEntries(
  pluginTools.map((tool) => [tool.name, tool.inputSchema])
);

// 👇 Also create tool config (used in ListTools)
const pluginToolConfig = pluginTools.map((tool) => ({
  name: tool.name,
  description: tool.description,
  inputSchema: zodToJsonSchema(tool.inputSchema),
}));

export { pluginToolSchemas, pluginToolActions, pluginToolConfig };
