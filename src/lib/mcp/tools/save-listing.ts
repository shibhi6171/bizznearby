import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { profileIdForUser, supabaseForUser } from "../supabase";

export default defineTool({
  name: "save_listing",
  title: "Save listing to wishlist",
  description: "Add a listing to the signed-in user's wishlist.",
  inputSchema: { listing_id: z.string().trim().describe("Listing UUID to save.") },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ listing_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const profileId = await profileIdForUser(supabase, ctx);
    if (!profileId) return { content: [{ type: "text", text: "Profile not found" }], isError: true };

    const { data: existing } = await supabase
      .from("wishlists")
      .select("id")
      .eq("consumer_id", profileId)
      .eq("listing_id", listing_id)
      .maybeSingle();
    if (existing) {
      return { content: [{ type: "text", text: "Listing is already in the wishlist." }] };
    }

    const { data, error } = await supabase
      .from("wishlists")
      .insert({ consumer_id: profileId, listing_id })
      .select("id, listing_id, created_at")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { wishlist_item: data },
    };
  },
});
