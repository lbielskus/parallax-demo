'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Home as HomeIcon, Mail, Users } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

export default function Home() {
  const ref = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use a ref to store the scrollYProgress motion value directly
  // This allows us to set its value programmatically
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Set scroll restoration to manual globally as early as possible
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Simulate loading and then set isLoaded to true
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2500); // Simulate 2.5s load
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top AND reset scrollYProgress ONLY after the component is loaded and rendered
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      // Explicitly set scrollYProgress to 0 to ensure Framer Motion's internal state is correct
      scrollYProgress.set(0);
      console.log('Page loaded and scrolled to top. scrollYProgress set to 0.');
    }
  }, [isLoaded, scrollYProgress]); // Add scrollYProgress to dependencies

  const translateLayer4 = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);
  const translateLayer1 = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const translateLayer3 = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const translateLayer2 = useTransform(scrollYProgress, [0, 1], ['0%', '-24%']);
  const scaleLayer1 = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const welcomeOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const welcomeTranslateY = useTransform(
    scrollYProgress,
    [0, 0.3],
    ['0px', '-40px']
  );
  const buttonsOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const buttonsTranslateY = useTransform(
    scrollYProgress,
    [0.3, 0.6],
    ['30px', '0px']
  );

  const buttons = [
    { label: 'Home', icon: <HomeIcon size={48} /> },
    { label: 'Contact', icon: <Mail size={48} /> },
    { label: 'About Us', icon: <Users size={48} /> },
  ];

  if (!isLoaded) return <LoadingScreen />;

  return (
    <div ref={ref} className='relative h-[1000px] bg-black overflow-hidden'>
      {/* Parallax Layers */}
      <motion.div
        style={{ y: translateLayer4 }}
        className='absolute top-0 left-0 w-full h-[1150px] z-10'
      >
        <Image
          src='/parallax/layer4.svg'
          alt='Layer 4'
          fill
          className='object-cover pointer-events-none'
        />
      </motion.div>

      <motion.div
        style={{ y: translateLayer1, scale: scaleLayer1 }}
        className='absolute top-0 left-0 w-full h-[1150px] z-40 origin-bottom'
      >
        <Image
          src='/parallax/layer1-01-01-01.svg'
          alt='Layer 1'
          fill
          className='object-cover pointer-events-none'
        />
      </motion.div>

      <motion.div
        style={{ y: translateLayer3 }}
        className='absolute top-0 left-0 w-full h-[1150px] z-20'
      >
        <Image
          src='/parallax/layer3.svg'
          alt='Layer 3'
          fill
          className='object-cover pointer-events-none'
        />
      </motion.div>

      <motion.div
        style={{ y: translateLayer2 }}
        className='absolute top-0 left-0 w-full h-[1150px] z-30'
      >
        <Image
          src='/parallax/layer2.svg'
          alt='Layer 2'
          fill
          className='object-cover pointer-events-none'
        />
      </motion.div>

      {/* Welcome Section */}
      <motion.div
        style={{ opacity: welcomeOpacity, y: welcomeTranslateY }}
        className='absolute top-[60px] w-full text-center z-50 px-4'
      >
        <h1 className='text-white text-5xl sm:text-6xl md:text-8xl font-extrabold drop-shadow-lg'>
          Welcome!
        </h1>
        <p className='mt-2 text-white/80 text-base sm:text-lg md:text-xl'>
          Scroll down to see the depth
        </p>
      </motion.div>

      {/* Responsive Button Section */}
      <motion.div
        style={{ opacity: buttonsOpacity, y: buttonsTranslateY }}
        className='absolute bottom-[100px] w-full z-50 flex flex-col sm:flex-row justify-center items-center gap-6 px-4'
      >
        {buttons.map(({ label, icon }) => (
          <button
            key={label}
            className='backdrop-blur-lg bg-white/10 border border-white/20 text-white px-6 py-6 sm:px-8 sm:py-8 rounded-2xl shadow-2xl hover:bg-white/20 transition text-xl sm:text-2xl w-full sm:min-w-[240px] sm:min-h-[240px] max-w-[300px] flex flex-col items-center justify-center gap-3'
          >
            {icon}
            {label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
