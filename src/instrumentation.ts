// Leads the CRM did not accept are retried every 5 minutes for 24 hours, also after a server restart.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startCrmRetries } = await import("./lib/crm");
    startCrmRetries();
  }
}
