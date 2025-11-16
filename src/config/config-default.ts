import type {Config} from "@/config/types";

const companyId = window.location.pathname.split('/')[1];
// 默认配置
const config: Partial<Config> = {
  baseUrl: '/api',
  timeout: 60 * 1000,
  companyId: companyId,
}

export default config
