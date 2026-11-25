// crm retries: every 5 min for 24h, survives restarts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startCrmRetries } = await import("./lib/crm");
    startCrmRetries();
  }
}
