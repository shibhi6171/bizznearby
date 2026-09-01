import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchListingsTool from "./tools/search-listings";
import getListingTool from "./tools/get-listing";
import listWishlistTool from "./tools/list-wishlist";
import saveListingTool from "./tools/save-listing";
import contactSellerTool from "./tools/contact-seller";
import myListingsTool from "./tools/my-listings";
import myLeadsTool from "./tools/my-leads";
import updateLeadStatusTool from "./tools/update-lead-status";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "local-connect-hub",
  title: "Local Connect Hub",
  version: "0.1.0",
  instructions:
    "Tools for the LocalMart hyperlocal marketplace. Buyers can search listings, view details, save to a wishlist, and contact sellers. Sellers can review their own listings and leads and update lead statuses. All tools act as the signed-in user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchListingsTool,
    getListingTool,
    listWishlistTool,
    saveListingTool,
    contactSellerTool,
    myListingsTool,
    myLeadsTool,
    updateLeadStatusTool,
  ],
});
