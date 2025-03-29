'use client';

import { ReactNode } from 'react';
import styles from './Button.module.scss';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'size'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neumorphic';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: ReactNode;
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  isLoading = false,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <motion.button
      className={`
        ${styles.button}
        ${styles[variant]}
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ''}
        ${className}
      `}
      whileTap={{ scale: isLoading || props.disabled ? 1 : 0.97 }}
      whileHover={{ scale: isLoading || props.disabled ? 1 : 1.03 }}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className={styles.loader}>
          <svg className={styles.spinnerSvg} viewBox="0 0 50 50">
            <circle className={styles.spinnerCircle} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
          </svg>
        </span>
      ) : (
        <>
          {icon && <span className={styles.icon}>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button; 