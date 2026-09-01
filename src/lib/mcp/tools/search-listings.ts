import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_listings",
  title: "Search listings",
  description:
    "Search active marketplace listings (services and products) by keyword, category slug, location slug, type and max price.",
  inputSchema: {
    query: z.string().trim().optional().describe("Free text matched against listing title and description."),
    category_slug: z.string().trim().optional().describe("Category slug, e.g. 'plumbing'."),
    location_slug: z.string().trim().optional().describe("Location slug, e.g. 'chennai'."),
    listing_type: z.enum(["service", "product"]).optional(),
    max_price: z.number().positive().optional(),
    limit: z.number().int().optional().describe("Max results, default 10, capped at 50."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const limit = Math.min(Math.max(input.limit ?? 10, 1), 50);

    let categoryId: string | undefined;
    if (input.category_slug) {
      const { data } = await supabase.from("categories").select("id").eq("slug", input.category_slug).maybeSingle();
      if (!data) return { content: [{ type: "text", text: `No category with slug '${input.category_slug}'` }], isError: true };
      categoryId = data.id;
    }
    let locationId: string | undefined;
    if (input.location_slug) {
      const { data } = await supabase.from("locations").select("id").eq("slug", input.location_slug).maybeSingle();
      if (!data) return { content: [{ type: "text", text: `No location with slug '${input.location_slug}'` }], isError: true };
      locationId = data.id;
    }

    let q = supabase
      .from("listings")
      .select("id, title, slug, description, listing_type, price, price_unit, is_featured, views_count, category:categories(name, slug), location:locations(name, slug)")
      .eq("status", "active")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (categoryId) q = q.eq("category_id", categoryId);
    if (locationId) q = q.eq("location_id", locationId);
    if (input.listing_type) q = q.eq("listing_type", input.listing_type);
    if (typeof input.max_price === "number") q = q.lte("price", input.max_price);
    if (input.query) q = q.or(`title.ilike.%${input.query}%,description.ilike.%${input.query}%`);

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { listings: data ?? [] },
    };
  },
});
