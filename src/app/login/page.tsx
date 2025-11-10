"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { login, checkAuth, setLoading } from "../../store/slices/authSlice";
import { RootState, AppDispatch } from "../../store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "../../components/ThemeToggle";
import { showErrorToast, showSuccessToast } from "../../lib/toast";
import { LoadingPage } from "../../components/ui/loading-spinner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const redirectUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect") || "/"
      : "/";

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, router, redirectUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      showErrorToast("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    // Mock authentication
    const mockUsers = [
      {
        id: "1",
        email: "user@example.com",
        password: "password123",
        name: "John Doe",
      },
      {
        id: "2",
        email: "admin@example.com",
        password: "admin123",
        name: "Admin User",
      },
    ];

    const user = mockUsers.find(
      (u) => u.email === trimmedEmail && u.password === password
    );

    if (user) {
      dispatch(login({ id: user.id, email: user.email, name: user.name }));
      showSuccessToast("Login successful!");
      router.push(redirectUrl);
    } else {
      showErrorToast("Invalid email or password");
    }

    setIsLoading(false);
    dispatch(setLoading(false));
  };

  if (loading) {
    return <LoadingPage message="Authenticating..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Sign in to continue to BuyBest
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-background/50 border-muted-foreground/20 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-background/50 border-muted-foreground/20 focus:border-primary transition-colors"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : null}
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background/80 backdrop-blur-sm px-2 text-muted-foreground">
                Demo Accounts
              </span>
            </div>
          </div> */}

          {/* <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-muted-foreground/10">
              <div>
                <p className="font-medium text-foreground">User Account</p>
                <p className="text-muted-foreground text-xs">user@example.com</p>
              </div>
              <code className="text-xs bg-background/50 px-2 py-1 rounded border border-muted-foreground/20">password123</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-muted-foreground/10">
              <div>
                <p className="font-medium text-foreground">Admin Account</p>
                <p className="text-muted-foreground text-xs">admin@example.com</p>
              </div>
              <code className="text-xs bg-background/50 px-2 py-1 rounded border border-muted-foreground/20">admin123</code>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
