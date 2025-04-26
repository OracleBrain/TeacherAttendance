import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { FormItem, FormLabel, FormControl, FormMessage } from "../components/ui/form";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Loader2 } from "lucide-react";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    
    if (!isLogin) {
      if (!name.trim()) newErrors.name = "Name is required";
      if (!email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (isLogin) {
      loginMutation.mutate({ username, password });
    } else {
      registerMutation.mutate({
        username,
        password,
        name,
        email,
        role: "teacher",
      });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="max-w-md mx-auto w-full">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">{isLogin ? "Sign In" : "Create an Account"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {!isLogin && (
                    <>
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </FormControl>
                        {errors.name && <FormMessage>{errors.name}</FormMessage>}
                      </FormItem>
                      
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </FormControl>
                        {errors.email && <FormMessage>{errors.email}</FormMessage>}
                      </FormItem>
                    </>
                  )}
                  
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </FormControl>
                    {errors.username && <FormMessage>{errors.username}</FormMessage>}
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </FormControl>
                    {errors.password && <FormMessage>{errors.password}</FormMessage>}
                  </FormItem>
                </div>
                
                <div className="mt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending || registerMutation.isPending}
                  >
                    {(loginMutation.isPending || registerMutation.isPending) ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {isLogin ? "Sign In" : "Create Account"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                className="w-full"
                onClick={toggleAuthMode}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="auth-hero">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Teacher Attendance Portal</h1>
          <p className="mb-6">
            The easy way to manage your class attendance. Mark attendance, view records, manage classes, and access your profile - all in one place.
          </p>
          <ul className="space-y-2">
            <li>✓ Quick attendance marking</li>
            <li>✓ View historical attendance data</li>
            <li>✓ Manage your class assignments</li>
            <li>✓ Stay updated with notifications</li>
            <li>✓ Mobile-friendly interface</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
