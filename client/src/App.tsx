import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { ToastProvider } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";

// Pages
import DashboardPage from "./pages/dashboard-page";
import AuthPage from "./pages/auth-page";
import MarkAttendancePage from "./pages/mark-attendance-page";
import ViewAttendancePage from "./pages/view-attendance-page";
import MyClassesPage from "./pages/my-classes-page";
import NotificationsPage from "./pages/notifications-page";
import ProfilePage from "./pages/profile-page";
import NotFound from "./pages/not-found";

import "./styles/globals.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <Switch>
            <ProtectedRoute path="/" component={DashboardPage} />
            <ProtectedRoute path="/mark-attendance" component={MarkAttendancePage} />
            <ProtectedRoute path="/view-attendance" component={ViewAttendancePage} />
            <ProtectedRoute path="/my-classes" component={MyClassesPage} />
            <ProtectedRoute path="/notifications" component={NotificationsPage} />
            <ProtectedRoute path="/profile" component={ProfilePage} />
            <Route path="/auth" component={AuthPage} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
