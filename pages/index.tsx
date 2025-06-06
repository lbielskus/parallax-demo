'use client';

import { useRef, useState, useLayoutEffect, useEffect } from 'react'; // Import useEffect
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import icons from lucide-react
import { Home as HomeIcon, Mail, Info } from 'lucide-react'; // Renaming Home to HomeIcon to avoid conflict

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  // New state variables to track individual image loading
  const [skyLoaded, setSkyLoaded] = useState(false);
  const [mountainsLoaded, setMountainsLoaded] = useState(false);
  const [foregroundLoaded, setForegroundLoaded] = useState(false);

  const ref = useRef(null); // This ref will now cover the entire scrollable parallax height

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'], // Tracks scroll progress within the 1200px div
  });

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    // isLoaded is initially false, so the loading screen appears.
    // It will be set to true once all images are loaded via the useEffect below.
  }, []);

  // Use useEffect to check when all images are loaded
  useEffect(() => {
    if (skyLoaded && mountainsLoaded && foregroundLoaded) {
      setIsLoaded(true);
    }
  }, [skyLoaded, mountainsLoaded, foregroundLoaded]);

  // --- Parallax Speeds and Transforms ---
  const skyY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const mountainsY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);

  const skyX = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);
  const mountainsX = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const foregroundX = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);

  // Text Fade and Vertical Movement for "Welcome"
  const welcomeTextOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const welcomeTextY = useTransform(scrollYProgress, [0, 1], ['0%', '150%']);

  // Controls for the "More content below..." text and the buttons
  const contentSectionOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.9],
    [0, 1]
  );
  const contentSectionY = useTransform(
    scrollYProgress,
    [0.5, 1],
    ['50px', '0px']
  );

  // Dark Overlay Transform
  const darkOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.6]);

  if (!isLoaded) {
    return (
      <div className='fixed inset-0 bg-[#c9af98] z-[9999] flex items-center justify-center flex-col gap-6'>
        {/* Spinner */}
        <div className='w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin' />

        {/* Fallback loading text */}
        <p className='text-white text-xl font-semibold'>
          Loading parallax scene...
        </p>

        {/* Actual preload images - use <img> instead of <Image> for reliable onLoad */}
        <div className='hidden'>
          <img
            src='/parallax/sky1600.svg'
            onLoad={() => setSkyLoaded(true)}
            alt='Sky preload'
          />
          <img
            src='/parallax/mountains1600.svg'
            onLoad={() => setMountainsLoaded(true)}
            alt='Mountains preload'
          />
          <img
            src='/parallax/priekiskitassssss-01.svg'
            onLoad={() => setForegroundLoaded(true)}
            alt='Foreground preload'
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className='relative h-[1200px] w-full overflow-hidden'>
      {/* SKY Layer */}
      <motion.div
        style={{ y: skyY, x: skyX }}
        className='absolute top-[-500px] left-1/2 w-[3840px] h-[1600px] -translate-x-1/2 z-10'
      >
        <Image
          src='/parallax/sky1600.svg'
          alt='Sky'
          fill
          className='object-cover pointer-events-none'
        />
        {/* Dark overlay for Sky */}
        <motion.div
          style={{ opacity: darkOverlayOpacity }}
          className='absolute inset-0 bg-black'
        />
      </motion.div>

      {/* MOUNTAINS Layer (your prominent Mountain Range or Main Building) */}
      <motion.div
        style={{ y: mountainsY, x: mountainsX }}
        className='absolute top-[100px] left-1/2 w-[2880px] h-[1600px] -translate-x-1/2 z-40'
      >
        <Image
          src='/parallax/mountains1600.svg'
          alt='Mountain Range or Main Building'
          fill
          className='object-cover pointer-events-none'
        />
        {/* Dark overlay for Mountains */}
        <motion.div
          style={{ opacity: darkOverlayOpacity }}
          className='absolute inset-0 bg-black'
        />
      </motion.div>

      {/* Welcome Text - Fades out and now hides under mountains */}
      <motion.div
        className='absolute top-[20vh] w-full z-30 text-center pointer-events-none px-4' // Added px-4 directly
        style={{ opacity: welcomeTextOpacity, y: welcomeTextY }}
      >
        <h1 className='text-white text-5xl md:text-7xl font-bold drop-shadow-lg'>
          Welcome
        </h1>
        <p className='mt-4 text-white/90 text-lg md:text-xl'>
          Scroll down to feel the depth of this parallax scene!
        </p>
      </motion.div>

      {/* FOREGROUND Layer (your Dome Building, Road, or Ski Slope) */}
      <motion.div
        style={{ y: foregroundY, x: foregroundX }}
        className='absolute top-[650px] left-1/2 w-[2300px] h-[1600px] -translate-x-1/2 z-50'
      >
        <Image
          src='/parallax/priekiskitassssss-01.svg'
          alt='Foreground Scene (Dome, Road, or Ski Slope)'
          fill
          className='object-cover pointer-events-none'
        />
      </motion.div>

      {/* Content Section with Glassmorphism Buttons - appears within the parallax scroll */}
      <motion.div
        className='absolute bottom-17 w-full z-60 flex flex-col items-center justify-center gap-8 p-4'
        style={{ opacity: contentSectionOpacity, y: contentSectionY }}
      >
        {/* Buttons Container */}
        <div className='flex flex-wrap justify-center gap-6'>
          {/* Home Button */}
          <button className='backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 text-white shadow-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/20 transition-colors w-64 h-64'>
            <HomeIcon className='w-16 h-16' />
            <span className='text-lg font-semibold'>Home</span>
          </button>

          {/* Contact Button */}
          <button className='backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 text-white shadow-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/20 transition-colors w-64 h-64'>
            <Mail className='w-16 h-16' />
            <span className='text-lg font-semibold'>Contact</span>
          </button>

          {/* About Us Button */}
          <button className='backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 text-white shadow-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/20 transition-colors w-64 h-64'>
            <Info className='w-16 h-16' />
            <span className='text-lg font-semibold'>About Us</span>
          </button>
        </div>
      </motion.div>
      {/* Footer Branding */}
      <div className='absolute bottom-2 w-full z-60 flex flex-col items-center justify-center text-white text-sm opacity-90 '>
        <Image
          src='/42px.png'
          alt='LB Visible Logo'
          width={42}
          height={42}
          className='mb-1'
        />
        <p className='text-xs sm:text-sm text-center'>
          Made by Let’s Be Visible
        </p>
      </div>
    </div>
  );
}
