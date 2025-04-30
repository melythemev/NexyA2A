import { NexyService } from "../../services/nexy-cron/index.js";
import { Datum } from "../../services/nexy-cron/type.js";
import { TransactionToolArgs, TransactionToolName } from "./config.js";
import axios from "axios";
import { PublicKey } from "@solana/web3.js";
// utils
export async function getBaseUsdPrice(): Promise<number> {
  const url = "https://api.phantom.app/price/v1/solana:101/nativeToken/501";
  try {
    const response = await axios.get(url);
    const price = response.data?.price;
    return typeof price === "number" ? price : 150;
  } catch (error) {
    console.error("Failed to fetch SOL price:", error);
    return 150;
  }
}

const isAddress = (address: string) => {
  try {
    const key = new PublicKey(address);
    return !!key;
  } catch (error) {
    return false;
  }
};

export const transactionToolAction: {
  [K in keyof TransactionToolArgs]: (args: TransactionToolArgs[K]) => Promise<{
    name: K;
    arguments: TransactionToolArgs[K];
    response?: any;
  }>;
} = {
  swap_token: async (args) => {
    const { amount } = args;

    const chain = "sol";
    const SOL_ADDRESS = "So11111111111111111111111111111111111111112";

    let updatedArgs = { ...args, chain };

    // Normalize symbols
    let inputSymbol = updatedArgs.input_token_symbol?.toUpperCase() || "";
    let outputSymbol = updatedArgs.output_token_symbol?.toUpperCase() || "";

    let inputInfo: Datum | null = null;
    let outputInfo: Datum | null = null;

    // Attach SOL address if applicable
    if (inputSymbol === "SOL") {
      updatedArgs.input_token_ca = SOL_ADDRESS;
    }
    if (outputSymbol === "SOL") {
      updatedArgs.output_token_ca = SOL_ADDRESS;
    }

    // 🔄 If symbols are missing but CAs exist, fetch symbol (1 call per token max)
    if (!inputSymbol && updatedArgs.input_token_ca) {
      inputInfo = await NexyService.postCoinInfo([updatedArgs.input_token_ca]);
      inputSymbol = inputInfo?.symbol?.toUpperCase() || "";
      updatedArgs.input_token_symbol = inputSymbol;
    }

    if (!outputSymbol && updatedArgs.output_token_ca) {
      outputInfo = await NexyService.postCoinInfo([
        updatedArgs.output_token_ca,
      ]);
      outputSymbol = outputInfo?.symbol?.toUpperCase() || "";
      updatedArgs.output_token_symbol = outputSymbol;
    }

    // 🔍 Search token by symbol if still missing CA
    if (!updatedArgs.input_token_ca && inputSymbol && inputSymbol !== "SOL") {
      const search = await NexyService.fetchSearch(inputSymbol);
      if (search && search?.length > 0) {
        updatedArgs.input_token_ca = search[0].address;
      }
    }

    if (
      !updatedArgs.output_token_ca &&
      outputSymbol &&
      outputSymbol !== "SOL"
    ) {
      const search = await NexyService.fetchSearch(outputSymbol);
      if (search && search?.length > 0) {
        updatedArgs.output_token_ca = search[0].address;
      }
    }

    // No valid swap pair
    if (!updatedArgs.input_token_ca || !updatedArgs.output_token_ca) {
      return {
        name: TransactionToolName.swap_token,
        arguments: updatedArgs,
        response: {
          token_selection: await NexyService.fetchSearch(
            inputSymbol || outputSymbol
          ),
        },
      };
    }

    if (!amount) {
      return {
        name: TransactionToolName.swap_token,
        arguments: updatedArgs,
        response: "Please enter amount to swap.",
      };
    }

    // ✅ Determine which token to evaluate for pricing
    let tokenToPriceCa =
      inputSymbol === "SOL" || updatedArgs.input_token_ca === SOL_ADDRESS
        ? updatedArgs.output_token_ca
        : updatedArgs.input_token_ca;

    let tokenDetail =
      inputSymbol === "SOL" || updatedArgs.input_token_ca === SOL_ADDRESS
        ? outputInfo
        : inputInfo;

    // Reuse if already fetched, else fetch
    if (!tokenDetail) {
      tokenDetail = await NexyService.postCoinInfo([tokenToPriceCa]);
    }

    if (!tokenDetail?.price?.price) {
      return {
        name: TransactionToolName.swap_token,
        arguments: updatedArgs,
        response: "Token price not found. Cannot estimate swap.",
      };
    }

    const tokenPrice = parseFloat(tokenDetail.price.price || "1");
    const basePrice = await getBaseUsdPrice();

    const amountReceived =
      inputSymbol === "SOL" || updatedArgs.input_token_ca === SOL_ADDRESS
        ? (amount * basePrice) / tokenPrice
        : (amount * tokenPrice) / basePrice;

    return {
      name: TransactionToolName.swap_token,
      arguments: updatedArgs,
      response: {
        token_detail: tokenDetail,
        amount_in: amount,
        amount_received: amountReceived,
        usd_price: basePrice,
      },
    };
  },
  transfer: async (args) => {
    const { receive_address, amount } = args;

    const chain = "sol";

    if (!isAddress(receive_address)) {
      return {
        name: TransactionToolName.transfer,
        arguments: args,
        response:
          "Invalid Solana address. Please enter a valid recipient address.",
      };
    }

    if (!amount || amount <= 0) {
      return {
        name: TransactionToolName.transfer,
        arguments: args,
        response: "Invalid amount. Please enter a positive number.",
      };
    }

    return {
      name: TransactionToolName.transfer,
      arguments: {
        ...args,
        chain,
      },
      response: {
        message: "Transfer payload prepared successfully.",
        receive_address,
        amount,
        chain,
      },
    };
  },
};
