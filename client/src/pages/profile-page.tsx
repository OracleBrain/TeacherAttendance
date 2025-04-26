import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ChevronLeft, User, Mail, UserCircle, LogOut } from "lucide-react";

const ProfilePage: React.FC = () => {
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const profileDetails = [
    { label: "Name", value: user.name, icon: <User className="h-5 w-5 text-gray-400" /> },
    { label: "Username", value: user.username, icon: <UserCircle className="h-5 w-5 text-gray-400" /> },
    { label: "Email", value: user.email, icon: <Mail className="h-5 w-5 text-gray-400" /> },
    { label: "Role", value: user.role, icon: <User className="h-5 w-5 text-gray-400" /> },
    { label: "Account Created", value: new Date(user.createdAt).toLocaleDateString(), icon: <User className="h-5 w-5 text-gray-400" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-gray-500">Manage your account information</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <UserCircle className="h-12 w-12 text-blue-500" />
              </div>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-gray-500">{user.role}</p>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full justify-center mt-4"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profileDetails.map((detail, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-10">{detail.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{detail.label}</p>
                      <p>{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
