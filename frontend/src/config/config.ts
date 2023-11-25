const ENV = import.meta.env.VITE_ENV;
const PROD_URL = import.meta.env.VITE_PROD_URL;
const DEV_URL = import.meta.env.VITE_DEV_URL;

const config = {
  baseUrl: DEV_URL,
};

if (ENV === "prod") {
  config.baseUrl = PROD_URL;
} else {
  config.baseUrl = DEV_URL;
}

export default config;
