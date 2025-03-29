'use client';

import { useTheme } from '@/app/context/ThemeContext';
import styles from './ThemeToggle.module.scss';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button 
      className={styles.toggle} 
      onClick={toggleTheme}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className={styles.iconContainer}>
        <FiSun className={`${styles.icon} ${theme === 'light' ? styles.visible : styles.hidden}`} />
        <FiMoon className={`${styles.icon} ${theme === 'dark' ? styles.visible : styles.hidden}`} />
      </div>
    </motion.button>
  );
};

export default ThemeToggle; 