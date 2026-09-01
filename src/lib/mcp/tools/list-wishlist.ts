import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_wishlist",
  title: "List my wishlist",
  description: "List the signed-in user's saved (wishlisted) listings.",
  inputSchema: { limit: z.number().int().optional().describe("Max results, default 20, capped at 100.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("wishlists")
      .select("id, created_at, listing:listings(id, title, slug, price, price_unit, listing_type, status)")
      .eq("consumer_id", ctx.getUserId())
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 20, 1), 100));
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { wishlist: data ?? [] },
    };
  },
});
