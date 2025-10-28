import type {Config} from "@/config/types";

// 默认配置
const config: Partial<Config> = {
  baseUrl: '/api',
  timeout: 60 * 1000,
}

export default config
