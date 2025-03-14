
import { ReactNode } from "react";
import Navbar from "../Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="container px-4 sm:px-6">
          <p className="text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Employify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
