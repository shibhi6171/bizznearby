import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { profileIdForUser, supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_leads",
  title: "List my seller leads",
  description: "List customer enquiries (leads) received by the signed-in seller, newest first.",
  inputSchema: {
    status: z.enum(["new", "contacted", "converted", "closed"]).optional(),
    limit: z.number().int().optional().describe("Max results, default 20, capped at 100."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const profileId = await profileIdForUser(supabase, ctx);
    if (!profileId) return { content: [{ type: "text", text: "Profile not found" }], isError: true };

    let q = supabase
      .from("leads")
      .select("id, message, contact_method, status, created_at, listing:listings(id, title, slug), consumer:profiles!leads_consumer_id_fkey(full_name, email, phone)")
      .eq("seller_id", profileId)
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 20, 1), 100));
    if (status) q = q.eq("status", status);

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { leads: data ?? [] },
    };
  },
});
