"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function HomeHero() {
  return (
    <section className="home-hero">
      <Image className="hero-image" src="/images/hero-black-man-watch.png" alt="Main d’un homme noir portant une montre élégante" fill priority sizes="100vw" />
      <div className="hero-shade" />
      <div className="shell hero-content">
        <motion.p className="eyebrow light" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>The private collection · 2026</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .08 }}>Time, chosen<br /><em>with intention.</em></motion.h1>
        <motion.p className="hero-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, delay: .2 }}>Authenticated watches with enduring character, sourced for collectors who value the story behind every reference.</motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, delay: .28 }}>
          <Link className="button button-gold" href="/shop">Explore the collection</Link>
          <Link className="text-link light" href="/about">Our approach <span>↗</span></Link>
        </motion.div>
      </div>
      <div className="hero-index"><span>01</span><i /><span>08</span></div>
    </section>
  );
}
