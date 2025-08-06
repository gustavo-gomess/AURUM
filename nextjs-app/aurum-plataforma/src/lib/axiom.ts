import { Axiom } from "next-axiom";

export const axiom = new Axiom({
  token: process.env.AXIOM_TOKEN,
  orgId: process.env.AXIOM_ORG_ID,
  projectId: process.env.AXIOM_PROJECT_ID,
});


