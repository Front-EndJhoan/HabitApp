import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Mail, User as UserIcon, LogOut } from "lucide-react";
import { toast } from "sonner";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Header */}
      <header
        className="bg-card border-b border-border"
        style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-xl font-semibold" style={{ color: "var(--card-foreground)" }}>Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <Card className="p-8 mb-6" style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}>
          <div className="flex flex-col items-center text-center mb-8">
            <div className="size-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-4xl font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-semibold mb-1" style={{ color: "var(--card-foreground)" }}>
              {user?.username}
            </h2>
            <p style={{ color: "var(--muted-foreground)" }}>Keep building great habits!</p>
          </div>

          {/* User Info */}
          <div className="space-y-4 mb-8">
            <div
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
            >
              <div className="size-12 bg-white rounded-lg flex items-center justify-center">
                <UserIcon className="size-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Username</p>
                <p className="text-lg font-medium text-gray-600">{user?.username}</p>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
            >
              <div className="size-12 bg-white rounded-lg flex items-center justify-center">
                <Mail className="size-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full h-12 rounded-xl gap-2"
          >
            <LogOut className="size-5" />
            Logout
          </Button>
        </Card>

        {/* Additional Info */}
        <div className="text-center text-gray-600 text-sm">
          <p>HabitApp v1.0.0</p>
        </div>
      </main>
    </div>
  );
}
