import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Mail,
  Heart,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Pencil,
} from "lucide-react";

const ProfilePage = () => {
  const { user, signOut } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "LocalMart User";

  const email = user?.email || "No email available";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-500">
            My Account
          </p>

          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back, {displayName}!
          </h1>

          <p className="mt-2 text-base text-slate-500">
            Manage your profile, preferences, and LocalMart account.
          </p>
        </div>

        {/* Profile Card */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Banner */}
          <div className="relative h-32 overflow-hidden bg-gradient-to-r from-slate-950 via-slate-800 to-orange-500 sm:h-40">
            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>

          {/* Profile information */}
          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                {/* Avatar */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-orange-500 text-3xl font-bold text-white shadow-lg sm:h-28 sm:w-28">
                  {initial}
                </div>

                <div className="pb-1">
                  <h2 className="font-display text-2xl font-bold capitalize text-slate-900">
                    {displayName}
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Mail className="h-4 w-4" />
                    <span>{email}</span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    LocalMart member
                  </p>
                </div>
              </div>

              {/* Edit Profile */}
              <button
                type="button"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </button>

            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Wishlist */}
          <button
            type="button"
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <Heart className="h-5 w-5" />
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
            </div>

            <h3 className="font-semibold text-slate-900">
              Wishlist
            </h3>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              View products and services you've saved.
            </p>
          </button>

          {/* My Listings */}
          <button
            type="button"
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
            </div>

            <h3 className="font-semibold text-slate-900">
              My Listings
            </h3>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Manage the products and services you've listed.
            </p>
          </button>

          {/* Location */}
          <button
            type="button"
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <MapPin className="h-5 w-5" />
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
            </div>

            <h3 className="font-semibold text-slate-900">
              Location
            </h3>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Set and manage your preferred location.
            </p>
          </button>

        </section>

        {/* Account Settings */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Account Settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your account preferences and security.
            </p>
          </div>

          <div className="divide-y divide-slate-100">

            {/* Personal Information */}
            <button
              type="button"
              className="group flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-slate-50 sm:px-8"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <User className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-slate-900">
                  Personal Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Update your name and profile details.
                </p>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
            </button>

            {/* Location Preferences */}
            <button
              type="button"
              className="group flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-slate-50 sm:px-8"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <MapPin className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-slate-900">
                  Location Preferences
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Choose your preferred marketplace location.
                </p>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
            </button>

            {/* Security */}
            <button
              type="button"
              className="group flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-slate-50 sm:px-8"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-slate-900">
                  Security
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your password and account security.
                </p>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
            </button>

            {/* Sign Out */}
            <button
              type="button"
              onClick={signOut}
              className="group flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-red-50 sm:px-8"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <LogOut className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-red-600">
                  Sign Out
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Sign out of your LocalMart account.
                </p>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-red-300 transition group-hover:translate-x-1 group-hover:text-red-500" />
            </button>

          </div>
        </section>

      </main>
    </div>
  );
};

export default ProfilePage;
