import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { profileIdForUser, supabaseForUser } from "../supabase";

export default defineTool({
  name: "contact_seller",
  title: "Contact seller about a listing",
  description: "Send an enquiry (lead) to the seller of a listing on behalf of the signed-in user.",
  inputSchema: {
    listing_id: z.string().trim().describe("Listing UUID to enquire about."),
    message: z.string().trim().describe("Message for the seller."),
    contact_method: z.enum(["message", "phone", "email"]).optional().describe("Preferred contact method, default 'message'."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ listing_id, message, contact_method }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const profileId = await profileIdForUser(supabase, ctx);
    if (!profileId) return { content: [{ type: "text", text: "Profile not found" }], isError: true };

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, seller_id, title")
      .eq("id", listing_id)
      .maybeSingle();
    if (listingError) return { content: [{ type: "text", text: listingError.message }], isError: true };
    if (!listing) return { content: [{ type: "text", text: "Listing not found" }], isError: true };

    const { data, error } = await supabase
      .from("leads")
      .insert({
        listing_id,
        seller_id: listing.seller_id,
        consumer_id: profileId,
        message,
        contact_method: contact_method ?? "message",
      })
      .select("id, status, created_at")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Enquiry sent for "${listing.title}". ${JSON.stringify(data)}` }],
      structuredContent: { lead: data },
    };
  },
});
