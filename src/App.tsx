import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./components/Layout";
import { Skeleton } from "./components/ui";

const App: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <Router>
      <Layout user={user}>
        {loading && <div className="max-w-md mx-auto">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>}
        {!loading && <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/profile" /> : <LoginPage />}
          />
          <Route
            path="/profile"
            element={
              user ? <ProfilePage user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/profile" />}
          />
        </Routes>}
      </Layout>
    </Router>
  );
};

export default App;
