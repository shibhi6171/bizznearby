import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_listing",
  title: "Get listing details",
  description: "Fetch full details of one listing by id or slug, including category, location and reviews.",
  inputSchema: {
    id: z.string().trim().optional().describe("Listing UUID."),
    slug: z.string().trim().optional().describe("Listing slug."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, slug }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!id && !slug) {
      return { content: [{ type: "text", text: "Provide either id or slug." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("listings")
      .select(
        "id, title, slug, description, listing_type, price, price_unit, images, features, status, is_featured, views_count, leads_count, created_at, category:categories(name, slug), location:locations(name, city, state), reviews(rating, comment, created_at)"
      );
    q = id ? q.eq("id", id) : q.eq("slug", slug!);
    const { data, error } = await q.maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Listing not found" }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { listing: data },
    };
  },
});
