'use client';

import { motion } from 'framer-motion';

export function AnimatedList({ children, className }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function AnimatedItem({ children, className }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
