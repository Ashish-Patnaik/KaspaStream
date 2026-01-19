// App.tsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./features/Dashboard";
import CreateTask from "./features/CreateTask";
import FindWork from "./features/FindWork";
import Analytics from "./features/Analytics";
import DevTools from "./components/DevTools";
import LandingPage from "./features/LandingPage"; // Make sure path matches your folder structure
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Menu } from "lucide-react";

const featureComponents: { [key: string]: React.FC<{ onSelectFeature?: (feature: string) => void }> } = {
  Dashboard,
  CreateTask,
  FindWork,
  Analytics,
};

function App() {
  const [selectedFeature, setSelectedFeature] = useState<string>("Dashboard");
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const FeatureComponent = featureComponents[selectedFeature];

  // Optional: Skip landing if user has already visited (e.g., via localStorage)
  // useEffect(() => {
  //   const hasVisited = localStorage.getItem('hasVisitedKaspaStream');
  //   if (hasVisited) {
  //     setShowLanding(false);
  //   }
  // }, []);

  const handleEnterApp = () => {
    setIsTransitioning(true);
    // Trigger fade-out animation
    setTimeout(() => {
      setShowLanding(false);
      setIsTransitioning(false);
      // Optional: Save visit
      // localStorage.setItem('hasVisitedKaspaStream', 'true');
    }, 300); // Match duration with CSS transition
  };

  // Render Landing Page as full-screen overlay
  if (showLanding) {
    return (
      <div
        className={`min-h-screen w-full ${
          isTransitioning
            ? 'opacity-0 scale-95 transition-all duration-300 ease-in'
            : 'opacity-100 scale-100 transition-all duration-500 ease-out'
        }`}
        style={{ transformOrigin: 'center' }}
      >
        <LandingPage onEnterApp={handleEnterApp} />
      </div>
    );
  }

  // Main App Dashboard
  return (
    <div className="flex min-h-screen w-full text-slate-900 overflow-hidden font-['Space_Grotesk']">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 bg-white border-r-4 border-black">
        <Sidebar onSelectFeature={setSelectedFeature} />
      </div>

      {/* Mobile Sidebar & Main Content */}
      <div className="flex-1 flex flex-col md:pl-72 transition-all duration-300">
        <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b-4 border-black bg-[#f0f0f0] px-6 shadow-[4px_0_0_0_#000]">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="neoSecondary" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 border-r-4 border-black bg-white">
              <Sidebar onSelectFeature={setSelectedFeature} />
            </SheetContent>
          </Sheet>
          <Header />
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {FeatureComponent ? (
              <FeatureComponent onSelectFeature={setSelectedFeature} />
            ) : (
              <div className="text-center py-20 text-slate-500">
                Select a feature to get started.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Uncomment for dev debugging */}
      {/* <DevTools /> */}
    </div>
  );
}

export default App;