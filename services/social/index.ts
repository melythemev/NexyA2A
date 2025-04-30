import axios from "axios";
import { GetCoinChartResponse, TopicInfoV3Response } from "./type.js";

const BASE_URL = "https://social.nexyai.io";

const headersConfig = {
  "Access-Control-Allow-Origin": "*",
  Accept: "application/json",
  "Content-Type": "application/json",
};

const http = axios.create({
  baseURL: BASE_URL + "/api3/",
  headers: {
    ...headersConfig,
    Authorization: `Bearer 6rygzy9j81hbtvkm7ldzkuq1139zvd`,
  },
});

const SocialNexyService = {
  topics: {
    getTopic: async (topic: string) => {
      const response = await http.get(`storm/topic/${topic}`);
      const data = response.data.data as TopicInfoV3Response;
      return data;
    },

    getSummaryChange: async (topic: string, interval: string) => {
      const response = await http.get(
        `storm/change/topic/${topic}?interval=${interval}`
      );
      const data = response.data.data;
      return data;
    },
  },
  coins: {
    getChart: async (symbol: string) => {
      const response = await http.get<GetCoinChartResponse>(
        `storm/time-series/topic/${symbol}?bucket=hour&interval=1y`
      );
      const data = response.data.data;
      return data;
    },
  },
};

export { SocialNexyService };
