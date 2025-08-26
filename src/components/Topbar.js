import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Menu } from "lucide-react";

const Topbar = ({ onSidebarOpen, onDonorCountClick }) => {
  const [totalDonors, setTotalDonors] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    let channel;
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("donors")
        .select("*", { count: "exact", head: true });
      if (!error && typeof count === "number") {
        setTotalDonors(count);
        setAnimateKey(prev => prev + 1);
      }
    };
    fetchCount();

    channel = supabase
      .channel("donors-count-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donors" },
        (payload) => {
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div
      className="bg-gradient-to-r from-orange-600/30 via-orange-200/10 to-orange-600/30 
                backdrop-blur-md shadow-lg 
                px-3 sm:px-4 py-4 sm:py-3 
                flex items-center justify-between lg:justify-center relative "
    >
      {/* Sidebar open button - left */}
      <button
        className="lg:hidden flex items-center justify-center rounded-full p-1.5 sm:p-2 transition hover:bg-orange-200/50 active:bg-orange-300/50"
        aria-label="Open sidebar"
        onClick={onSidebarOpen}
      >
        <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-orange-900" />
      </button>
      {/* Centered Logo and Website Name */}
      <div className="flex flex-1 justify-center items-center space-x-2 sm:space-x-3">
        <span className="yatra-one text-4xl sm:text-5xl lg:text-6xl font-bold text-blood-red drop-shadow-xl text-outline">
          रक्तदान महायज्ञ
        </span>
      </div>
      {/* Total Donors Counter - right */}
      <div className="flex items-center">
        <div
          onClick={onDonorCountClick}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono font-extrabold shadow-xl text-sm sm:text-sm lg:text-base whitespace-nowrap uppercase cursor-pointer hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-2xl active:from-red-700 active:to-red-800 tracking-wider backdrop-blur-sm border border-red-400/20"
          title="Total Donors - Click to view Big Display"
        >
          <span className="hidden sm:inline">Donors : </span>
          <span key={animateKey} className="inline-block animate-slide-in">
            {totalDonors}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;


