import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fetch from "node-fetch";
import yaml from "js-yaml";
import { VERSION } from "../../common/version.js";
import {
  pluginToolSchemas,
  pluginToolConfig,
  pluginToolActions,
} from "../../operations/agent-kit/config.js";
import { tokenToolActions } from "../../operations/token-analysis/action.js";
import {
  tokenToolSchemas,
  tokenToolConfig,
} from "../../operations/token-analysis/config.js";
import { transactionToolAction } from "../../operations/transaction-build/action.js";
import { transactionToolConfig } from "../../operations/transaction-build/config.js";
import { walletToolActions } from "../../operations/wallet/action.js";
import {
  walletToolSchemas,
  walletToolConfig,
} from "../../operations/wallet/config.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

export const Logger = {
  log: (...args: any[]) => {
    console.error("[INFO]", ...args);
  },
  error: (...args: any[]) => {
    console.error("[ERROR]", ...args);
  },
};

// Merge all schemas
const allToolSchemas: Record<string, z.ZodTypeAny> = {
  ...tokenToolSchemas,
  ...walletToolSchemas,
  ...pluginToolSchemas,
};

type AllToolArgs = {
  [K in keyof typeof allToolSchemas]: z.infer<(typeof allToolSchemas)[K]>;
};

type ToolActionHandler<K extends keyof AllToolArgs> = (
  args: AllToolArgs[K]
) => Promise<{
  name: K;
  arguments: AllToolArgs[K];
  response?: any;
}>;

type AllToolActionMap = {
  [K in keyof AllToolArgs]: ToolActionHandler<K>;
};

// Merge tool configs and actions
const allToolConfig = [
  ...tokenToolConfig,
  ...walletToolConfig,
  ...pluginToolConfig,
];

const allToolActions: AllToolActionMap = {
  ...tokenToolActions,
  ...walletToolActions,
  ...pluginToolActions,
};

// Polyfill fetch for Node < 18
if (!globalThis.fetch) {
  globalThis.fetch = fetch as unknown as typeof global.fetch;
}

// Server class definition
export class SolanaMcpServer extends Server {
  constructor() {
    super(
      {
        name: "solana-mcp-server",
        version: VERSION,
      },
      {
        capabilities: { tools: {} },
      }
    );

    this.registerHandlers();
  }

  private registerHandlers(): void {
    // List tools handler
    this.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: allToolConfig,
    }));

    // Tool execution handler
    this.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        if (!args) throw new Error("Missing arguments");

        const toolFn = allToolActions[name];
        if (!toolFn) throw new Error(`Tool action not implemented: ${name}`);

        const result = await toolFn(args);

        // Optional YAML formatting
        const resultYaml = yaml.dump(result);

        return {
          content: [
            {
              type: "text",
              text: resultYaml,
            },
          ],
        };
      } catch (error: any) {
        const message =
          error instanceof z.ZodError
            ? `Invalid input: ${JSON.stringify(error.errors)}`
            : error?.message || String(error);

        return {
          isError: true,
          content: [{ type: "text", text: `Error: ${message}` }],
        };
      }
    });
  }

  async connect(transport: Transport): Promise<void> {
    await super.connect(transport);

    // Ensure stdout is only used for JSON messages
    const originalStdoutWrite = process.stdout.write.bind(process.stdout);
    process.stdout.write = (chunk: any, encoding?: any, callback?: any) => {
      // Only allow JSON messages to pass through
      if (typeof chunk === "string" && !chunk.startsWith("{")) {
        return true; // Silently skip non-JSON messages
      }
      return originalStdoutWrite(chunk, encoding, callback);
    };

    Logger.log("Server connected and ready to process requests");
  }
}
