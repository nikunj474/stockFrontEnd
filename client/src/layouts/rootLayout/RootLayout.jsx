import { Link, Outlet } from "react-router-dom";
import "./rootLayout.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
      <QueryClientProvider client={queryClient}>
        <div className="rootLayout">
          <header>
            <Link to="/" className="logo">
              <span>STOCK AI</span>
            </Link>
            <div className="user">
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
  );
};

export default RootLayout;