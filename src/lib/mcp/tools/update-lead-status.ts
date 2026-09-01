import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { profileIdForUser, supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_lead_status",
  title: "Update lead status",
  description: "Update the status of a lead owned by the signed-in seller.",
  inputSchema: {
    lead_id: z.string().trim().describe("Lead UUID."),
    status: z.enum(["new", "contacted", "converted", "closed"]),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ lead_id, status }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const profileId = await profileIdForUser(supabase, ctx);
    if (!profileId) return { content: [{ type: "text", text: "Profile not found" }], isError: true };

    const { data, error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", lead_id)
      .eq("seller_id", profileId)
      .select("id, status")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Lead not found or not yours." }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { lead: data } };
  },
});
