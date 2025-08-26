import React, { useEffect, useRef, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";
import { Fireworks } from "fireworks-js";

const BigDisplayModal = ({ open, onClose, stats, donors }) => {
  const marqueeRef = useRef(null);
  const [showClose, setShowClose] = useState(false);
  const timeoutRef = useRef(null);
  const [celebrate, setCelebrate] = useState(false);
  const fireworksRef = useRef(null);

  useEffect(() => {
    if (!open || !marqueeRef.current) return;

    const marquee = marqueeRef.current;
    let animationId;
    let scrollPosition = 0;
    const speed = 0.5;

    const animate = () => {
      scrollPosition += speed;
      marquee.scrollTop = scrollPosition;

      if (scrollPosition >= marquee.scrollHeight / 2) {
        scrollPosition = 0;
        marquee.scrollTop = 0;
      }

      animationId = requestAnimationFrame(animate);
    };

    const timeout = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [open, donors]);

  useEffect(() => {
    if (!open) return;

    const handleActivity = () => {
      setShowClose(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowClose(false);
      }, 3000);
    };

    // Attach only when modal is open
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      clearTimeout(timeoutRef.current);
    };
  }, [open]);

  useEffect(() => {
    if (stats.total > 0 && stats.total % 50 === 0) {
      setCelebrate(true);
      const celebrateTimeout = setTimeout(() => {
        setCelebrate(false);
      }, 10000);
      return () => clearTimeout(celebrateTimeout);
    }
  }, [stats.total]);

  useEffect(() => {
    if (!celebrate) return;
    if (!fireworksRef.current) return;

    const fireworks = new Fireworks(fireworksRef.current);
    fireworks.start();

    return () => {
      fireworks.stop();
    };
  }, [celebrate]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[9999] min-h-screen w-full bg-gradient-to-br from-purple-950 via-rose-900 to-slate-900 flex flex-col overflow-y-auto">
      {/* Close Button */}
      {showClose && (
        <button
          className="fixed top-6 right-8 z-50 text-white text-4xl font-bold hover:text-red-400 transition duration-300"
          onClick={onClose}
          aria-label="Close big display"
        >
          ✕
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-6">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <header className="text-center mb-8 lg:mb-6 px-2">
            <h1
              className="text-3xl sm:text-5xl lg:text-8xl yatra-one font-extrabold 
               text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 
               drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] py-4"
            >
              सदगुरु 'माँ ज्ञान' जन्मोत्सव
            </h1>
            <p className="text-lg yatra-one sm:text-2xl lg:text-4xl text-white/90 font-semibold  ">
              🩸 बृहद् रक्तदान महायज्ञ 🩸
            </p>
          </header>

          {/* Layout */}
          <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            {/* Left Column */}
            <div className="flex flex-col gap-5 lg:gap-6">
              {/* Total Heroes */}
              <article className="bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-12 backdrop-blur-sm border-2 border-orange-300/50 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl mb-3 animate-bounce">
                    🏆
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-orange-200 mb-2 font-sans">
                    TOTAL HEROES
                  </h2>
                  <AnimatedNumber
                    key={stats.total}
                    value={stats.total}
                    className="text-3xl sm:text-5xl lg:text-7xl font-mono font-extrabold text-white drop-shadow-2xl glow-hero"
                  />
                  <div className="mt-2 text-base sm:text-lg text-orange-100 font-sans">
                    Lives Saved
                  </div>
                </div>
              </article>

              {/* Male & Female */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Male */}
                <article className="bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-2xl lg:rounded-3xl p-4 sm:p-9 backdrop-blur-sm border-2 border-blue-300/50 shadow-xl">
                  <div className="text-center">
                    <div className="text-3xl sm:text-5xl mb-3">👨🏻</div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-blue-200 mb-2 font-sans">
                      MALE
                    </h3>
                    <AnimatedNumber
                      key={stats.male}
                      value={stats.male}
                      className="text-xl sm:text-3xl lg:text-5xl font-mono font-extrabold text-white drop-shadow-lg lg:mb-1"
                    />
                    <div className="mt-1 text-sm sm:text-base text-blue-100 font-sans">
                      Donors
                    </div>
                  </div>
                </article>

                {/* Female */}
                <article className="bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-2xl lg:rounded-3xl p-4 sm:p-5 backdrop-blur-sm border-2 border-pink-300/50 shadow-xl">
                  <div className="text-center">
                    <div className="text-3xl sm:text-5xl mb-3 lg:mt-4 ">👩🏻</div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-pink-200 mb-1 font-sans">
                      FEMALE
                    </h3>
                    <AnimatedNumber
                      key={stats.female}
                      value={stats.female}
                      className="text-xl sm:text-3xl lg:text-5xl font-mono font-extrabold text-white drop-shadow-lg lg:mb-1"
                    />
                    <div className="mt-1 text-sm sm:text-base text-pink-100 font-sans">
                      Donors
                    </div>
                  </div>
                </article>
              </div>
            </div>

            {/* Right Column - Donor List */}
            <aside className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 backdrop-blur-sm border-2 border-green-300/50 shadow-2xl">
              <h3 className="text-lg sm:text-xl lg:text-3xl font-bold text-center text-green-200 mb-4 flex items-center justify-center gap-2 font-sans">
                <span className="text-xl sm:text-2xl lg:text-3xl">🌟</span>
                ALL DONORS
                <span className="text-xl sm:text-2xl lg:text-3xl">🌟</span>
              </h3>

              <div
                ref={marqueeRef}
                className="h-[260px] sm:h-[340px] lg:h-[480px] overflow-hidden relative"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)",
                }}
              >
                <div className="space-y-3 sm:space-y-4">
                  {[...donors, ...donors].map((donor, idx) => (
                    <div
                      key={`${donor.id || idx}-${Math.floor(
                        idx / donors.length
                      )}`}
                      className="bg-gradient-to-r from-white/15 to-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm border border-white/30 shadow-lg"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-lg sm:text-xl">❤️</div>
                        <div className="flex-1">
                          <div className="text-sm sm:text-base capitalize md:text-lg font-bold text-white font-sans">
                            {donor.name}
                          </div>
                          <div className="text-xs sm:text-sm capitalize text-green-200 mt-1 font-sans">
                            📍 {donor.address}
                          </div>
                          <div className="text-xs sm:text-sm text-red-300 font-semibold mt-1 flex items-center gap-1 sm:gap-2 font-sans">
                            <span className="text-red-400">🩸</span>
                            {donor.blood_type}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
      {celebrate && (
        <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn overflow-hidden">
          <div ref={fireworksRef} className="absolute inset-0"></div>
          <div className="text-center relative z-10">
            <h1 className="text-6xl sm:text-8xl font-extrabold text-yellow-400 drop-shadow-2xl animate-bounce">
              🎉 {stats.total} DONORS 🎉
            </h1>
            <p className="mt-4 text-2xl sm:text-4xl text-white font-bold animate-pulse">
              Milestone Reached!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BigDisplayModal;

// bg-gradient-to-br from-red-950 via-slate-900 to-rose-900

// bg-gradient-to-tr from-indigo-950 to-purple-950