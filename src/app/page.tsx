"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductList } from "../components/ProductList";
import { ThemeToggle } from "../components/ThemeToggle";
import { Plus, Heart, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { logout } from "../store/slices/authSlice";
import { showSuccessToast } from "../lib/toast";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useState } from "react";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    showSuccessToast("Logged out successfully");
    setLogoutDialogOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="text-xl font-semibold text-foreground"
                >
                  BuyBest
                </Link>
              </div>

              <div className="flex items-center space-x-3">
                <ThemeToggle />

                <Link href="/favorites">
                  <button className="relative inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    <Heart className="h-5 w-5" />
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                        {favorites.length}
                      </span>
                    )}
                  </button>
                </Link>

                {user ? (
                  <>
                    <Link href="/product/create">
                      <button className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                        <Plus className="h-5 w-5" />
                      </button>
                    </Link>

                    <div className="hidden sm:block pl-2">
                      <span className="text-sm text-muted-foreground">
                        Hi, {user.name}
                      </span>
                    </div>

                    <button
                      onClick={() => setLogoutDialogOpen(true)}
                      className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </>
                ) : (
                  <Link href="/login">
                    <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                      Sign in
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Products
            </h2>
            <p className="text-muted-foreground">
              Browse a wide collection of amazing products.
            </p>
          </div>

          <ProductList />
        </main>
      </div>

      <ConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Logout"
        description="Are you sure you want to logout? You'll need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
      />
    </>
  );
}
