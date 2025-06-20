import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Favorites from "@/pages/favorites";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { isAuthenticated, getCurrentUser, User } from "@/lib/api";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/login" component={Login} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      const userData = getCurrentUser();
      setUser(userData);
    }
    setLoading(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Router />
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
