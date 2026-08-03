"use client";

import { useEffect } from "react";

const revealSelector = [
  ".section-heading",
  ".product-card",
  ".category-card",
  ".trust-grid > div",
  ".testimonial-grid blockquote",
  ".editorial-copy > *",
  ".newsletter-inner > div",
  ".brand-hero-grid > *",
  ".catalog-toolbar",
  ".filter-sidebar",
  ".catalog-results",
  ".product-gallery",
  ".product-summary",
  ".info-grid > div",
  ".product-concierge .shell > *",
  ".about-intro > *",
  ".mission-grid > div",
  ".values-grid > div",
  ".about-auth > div",
  ".delivery-layout > div",
  ".why-list > div",
  ".styles-section > div",
  ".seo-target > *",
  ".brands-directory-header > *",
  ".brand-directory-card",
  ".brand-empty > *",
  ".contact-layout > *",
  ".visit-section > div",
  ".seo-copy .shell > *",
  ".collection-note .shell > *",
].join(",");

export function ScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("has-scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    const register = (root: ParentNode) => {
      const elements: HTMLElement[] = root instanceof HTMLElement && root.matches(revealSelector)
        ? [root, ...root.querySelectorAll<HTMLElement>(revealSelector)]
        : [...root.querySelectorAll<HTMLElement>(revealSelector)];

      elements.forEach((element) => {
        if (element.classList.contains("scroll-reveal")) return;
        const siblings = element.parentElement ? [...element.parentElement.children] : [];
        const siblingIndex = Math.max(0, siblings.indexOf(element));
        element.classList.add("scroll-reveal");
        element.style.setProperty("--reveal-delay", `${Math.min(siblingIndex % 4, 3) * 85}ms`);
        if (reducedMotion) element.classList.add("is-revealed");
        else observer.observe(element);
      });
    };

    register(document);
    const main = document.querySelector("main");
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) register(node);
      }));
    });
    if (main) mutationObserver.observe(main, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      document.documentElement.classList.remove("has-scroll-reveal");
    };
  }, []);

  return null;
}
