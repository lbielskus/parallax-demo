'use client';

import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Home as HomeIcon, Mail, Info } from 'lucide-react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const totalImagesToPreload = 3;

  const ref = useRef(null);
  const initialScrollPerformedRef = useRef(false); // New ref to track initial scroll

  // --- Scroll Management ---
  // Ensure scroll restoration is manual early on
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Use useEffect for operations that might involve DOM painting after render
  useEffect(() => {
    if (isLoaded && !initialScrollPerformedRef.current) {
      // Small timeout to allow browser to finish initial layout after isLoaded is true
      const scrollCorrectionTimeout = setTimeout(() => {
        if (typeof window !== 'undefined') {
          console.log('Performing scroll correction...');
          // Scroll slightly down then immediately back to 0
          // This can force a re-render of scroll position
          window.scrollTo({ top: 1, behavior: 'auto' });
          window.scrollTo({ top: 0, behavior: 'auto' });

          // Also explicitly set for body/documentElement
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;

          initialScrollPerformedRef.current = true; // Mark as performed
          console.log(
            'Scroll correction attempted. Current scrollY:',
            window.scrollY
          );
        }
      }, 100); // Increased to 100ms for more reliability

      return () => clearTimeout(scrollCorrectionTimeout);
    }
  }, [isLoaded]); // Dependency on isLoaded

  // --- Image Loading Logic ---
  const handleImageLoad = () => {
    setLoadedImagesCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (loadedImagesCount >= totalImagesToPreload) {
      setIsLoaded(true);
    }
  }, [loadedImagesCount, totalImagesToPreload]);

  // Timeout failsafe for loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        console.warn('Loading timeout. Forcing page display.');
        setIsLoaded(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  // --- Framer Motion Scroll Transforms ---
  // These calculations remain the same, they respond to scrollYProgress
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const skyY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const mountainsY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);

  const skyX = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);
  const mountainsX = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const foregroundX = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);

  const welcomeTextOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const welcomeTextY = useTransform(scrollYProgress, [0, 1], ['0%', '150%']);

  const contentSectionOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.4],
    [0, 1]
  );
  const contentSectionY = useTransform(
    scrollYProgress,
    [0.15, 0.4],
    ['80px', '0px']
  );

  const darkOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.6]);

  // --- Conditional Rendering for Loading Screen vs. Main Content ---
  if (!isLoaded) {
    return (
      <div className='fixed inset-0 bg-[#c9af98] z-[9999] flex items-center justify-center flex-col gap-6'>
        <div className='w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin' />
        <p className='text-white text-xl font-semibold'>
          Loading parallax scene...
        </p>
        <div className='absolute -left-[9999px] top-0'>
          <Image
            src='/parallax/sky1600.svg'
            alt='Sky Preload'
            width={1}
            height={1}
            onLoad={handleImageLoad}
            priority
          />
          <Image
            src='/parallax/mountains1600.svg'
            alt='Mountains Preload'
            width={1}
            height={1}
            onLoad={handleImageLoad}
            priority
          />
          <Image
            src='/parallax/priekiskitassssss-01.svg'
            alt='Foreground Preload'
            width={1}
            height={1}
            onLoad={handleImageLoad}
            priority
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
        <motion.div
          style={{ opacity: darkOverlayOpacity }}
          className='absolute inset-0 bg-black'
        />
      </motion.div>

      {/* MOUNTAINS Layer */}
      <motion.div
        style={{ y: mountainsY, x: mountainsX }}
        className='absolute top-[100px] left-1/2 w-[2880px] h-[1600px] -translate-x-1/2 z-40'
      >
        <Image
          src='/parallax/mountains1600.svg'
          alt='Mountains'
          fill
          className='object-cover pointer-events-none'
        />
        <motion.div
          style={{ opacity: darkOverlayOpacity }}
          className='absolute inset-0 bg-black'
        />
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        className='absolute top-[20vh] w-full z-30 text-center pointer-events-none px-4'
        style={{ opacity: welcomeTextOpacity, y: welcomeTextY }}
      >
        <h1 className='text-white text-5xl md:text-7xl font-bold drop-shadow-lg'>
          Welcome
        </h1>
        <p className='mt-4 text-white/90 text-lg md:text-xl'>
          Scroll down to feel the depth of this parallax scene!
        </p>
      </motion.div>

      {/* FOREGROUND Layer */}
      <motion.div
        style={{ y: foregroundY, x: foregroundX }}
        className='absolute top-[650px] left-1/2 w-[2300px] h-[1600px] -translate-x-1/2 z-50'
      >
        <Image
          src='/parallax/priekiskitassssss-01.svg'
          alt='Foreground'
          fill
          className='object-cover pointer-events-none'
        />
      </motion.div>

      {/* Buttons */}
      <motion.div
        className='absolute bottom-28 w-full z-60 flex flex-col items-center justify-center gap-8 p-4'
        style={{ opacity: contentSectionOpacity, y: contentSectionY }}
      >
        <div className='flex flex-wrap justify-center gap-6'>
          {[
            {
              label: 'Home',
              icon: <HomeIcon className='w-12 h-12 sm:w-14 sm:h-14' />,
            },
            {
              label: 'Contact',
              icon: <Mail className='w-12 h-12 sm:w-14 sm:h-14' />,
            },
            {
              label: 'About Us',
              icon: <Info className='w-12 h-12 sm:w-14 sm:h-14' />,
            },
          ].map(({ label, icon }) => (
            <button
              key={label}
              className='backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 text-white shadow-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/20 transition-colors w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64'
            >
              {icon}
              <span className='text-base sm:text-lg font-semibold'>
                {label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className='absolute bottom-4 w-full z-60 flex flex-col items-center justify-center text-white text-sm opacity-90'>
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
