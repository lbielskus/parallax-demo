'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function LoadingScreen() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className='fixed inset-0 z-[9999] bg-[#c9af98] flex items-center justify-center'>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className='w-24 h-24'
      >
        <Image
          src='/icons/compass.jpg'
          alt='Loading Compass'
          width={96}
          height={96}
        />
      </motion.div>
    </div>
  );
}
