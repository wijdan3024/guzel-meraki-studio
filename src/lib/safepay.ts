import Safepay from "@sfpy/node-core";

export function getSafepayClient() {
  const secretKey = process.env.SAFEPAY_SECRET_KEY;

  if (!secretKey) {
    throw new Error("SAFEPAY_SECRET_KEY is missing in .env");
  }

  return new Safepay(secretKey, {
    authType: "secret",
    host:
      process.env.SAFEPAY_ENV === "production"
        ? "https://api.getsafepay.com"
        : "https://sandbox.api.getsafepay.com",
  });
}