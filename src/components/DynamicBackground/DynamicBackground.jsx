import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const DynamicBackground = () => {
  const { scrollYProgress } = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollProgress(latest);
    });
  }, [scrollYProgress]);

  // Color Morph Array Mapping
  // 0% -> Cream (#FFF8F0)
  // 20% -> Warm Caramel Chocolate (#FAF0E6)
  // 45% -> Soft Strawberry (#FFF0F3)
  // 70% -> Belgian Cocoa Tone (#F8EDE8)
  // 100% -> Vanilla Cream (#FFF8F0)

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7, 1],
    ['#FFF8F0', '#FAF0E6', '#FFF0F3', '#F8EDE8', '#FFF8F0']
  );

  const blobColor1 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7, 1],
    ['rgba(255, 77, 109, 0.15)', 'rgba(255, 183, 3, 0.2)', 'rgba(255, 77, 109, 0.25)', 'rgba(92, 61, 46, 0.15)', 'rgba(255, 77, 109, 0.15)']
  );

  const blobColor2 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7, 1],
    ['rgba(255, 183, 3, 0.18)', 'rgba(92, 61, 46, 0.15)', 'rgba(255, 183, 3, 0.2)', 'rgba(255, 77, 109, 0.2)', 'rgba(255, 183, 3, 0.18)']
  );

  return (
    <motion.div
      style={{ backgroundColor: bgColor }}
      className="fixed inset-0 pointer-events-none z-[-1] transition-colors duration-700 overflow-hidden"
    >
      {/* Top Floating Glass Blob 1 */}
      <motion.div
        style={{ backgroundColor: blobColor1 }}
        className="absolute top-[-10%] left-[10%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full blur-[100px] animate-blob-1 opacity-75"
      />

      {/* Center Floating Glass Blob 2 */}
      <motion.div
        style={{ backgroundColor: blobColor2 }}
        className="absolute top-[40%] right-[-5%] w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full blur-[110px] animate-blob-2 opacity-70"
      />

      {/* Bottom Ambient Glow Blob 3 */}
      <motion.div
        style={{ backgroundColor: blobColor1 }}
        className="absolute bottom-[-10%] left-[20%] w-[550px] sm:w-[800px] h-[550px] sm:h-[800px] rounded-full blur-[120px] animate-blob-1 opacity-60"
      />

      {/* Subtle Mesh Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]" 
        style={{
          backgroundImage: `radial-gradient(#2D2D2D 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} 
      />
    </motion.div>
  );
};

export default DynamicBackground;
