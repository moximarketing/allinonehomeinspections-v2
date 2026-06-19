import { handleLead } from "@/lib/lead";

export async function POST(req: Request) {
  return handleLead(req, "contact");
}
