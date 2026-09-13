import { BrevoClient } from "@getbrevo/brevo";
import config from "#backend/config/index.js";

const brevo = new BrevoClient({ apiKey: config.BREVO_API_KEY });

export default brevo;
