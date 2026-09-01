import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { profileIdForUser, supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_listings",
  title: "List my seller listings",
  description: "List listings owned by the signed-in seller, with views and lead counts.",
  inputSchema: {
    status: z.enum(["draft", "active", "paused", "expired"]).optional(),
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
      .from("listings")
      .select("id, title, slug, listing_type, price, price_unit, status, is_featured, is_boosted, views_count, leads_count, created_at")
      .eq("seller_id", profileId)
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 20, 1), 100));
    if (status) q = q.eq("status", status);

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { listings: data ?? [] },
    };
  },
});
