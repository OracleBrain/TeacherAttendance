import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Clipboard,
  Calendar,
  Layers,
  Bell,
  User,
  LogOut
} from "lucide-react";

const DashboardPage: React.FC = () => {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const dashboardItems = [
    {
      title: "Mark Attendance",
      description: "Record attendance for your classes",
      icon: <Clipboard className="h-8 w-8 text-blue-500" />,
      path: "/mark-attendance"
    },
    {
      title: "View Attendance",
      description: "Check past attendance records",
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      path: "/view-attendance"
    },
    {
      title: "My Classes",
      description: "Manage your assigned classes",
      icon: <Layers className="h-8 w-8 text-purple-500" />,
      path: "/my-classes"
    },
    {
      title: "Notifications",
      description: "View your latest updates",
      icon: <Bell className="h-8 w-8 text-orange-500" />,
      path: "/notifications"
    },
    {
      title: "Profile",
      description: "Manage your account",
      icon: <User className="h-8 w-8 text-gray-500" />,
      path: "/profile"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </header>

      <div className="dashboard-grid">
        {dashboardItems.map((item, index) => (
          <Card
            key={index}
            className="dashboard-card"
            onClick={() => handleNavigation(item.path)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
