import { useRef, useEffect, useCallback } from "react";

const DEFAULT_PARTICLE_COUNT = 8;
const DEFAULT_GLOW_COLOR = "132, 0, 255";
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 4px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
    transform: scale(0);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;
  return el;
};

// Animation helper functions using CSS transitions and transforms
const animateCSS = (element, properties, duration = 300) => {
  return new Promise((resolve) => {
    const originalTransition = element.style.transition;
    element.style.transition = `all ${duration}ms ease-out`;
    
    Object.keys(properties).forEach(prop => {
      element.style[prop] = properties[prop];
    });
    
    setTimeout(() => {
      element.style.transition = originalTransition;
      resolve();
    }, duration);
  });
};

const AnimatedWrapper = ({
  children,
  className = "",
  style = {},
  enableStars = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  disableAnimations = false,
  enableBorderGlow = true,
}) => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const animationFrameRef = useRef(null);

  // Detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;
  const shouldDisableAnimations = disableAnimations || isMobile;

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !containerRef.current || shouldDisableAnimations) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor
      )
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor, shouldDisableAnimations]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    particlesRef.current.forEach((particle) => {
      particle.style.transform = 'scale(0)';
      particle.style.opacity = '0';
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 300);
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!containerRef.current || !isHoveredRef.current || !enableStars || shouldDisableAnimations) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !containerRef.current) return;

        const clone = particle.cloneNode(true);
        containerRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        // Animate particle appearance
        setTimeout(() => {
          clone.style.transform = 'scale(1)';
          clone.style.opacity = '1';
        }, 10);

        // Animate particle movement
        const animateMovement = () => {
          if (!isHoveredRef.current) return;
          
          const moveX = (Math.random() - 0.5) * 80;
          const moveY = (Math.random() - 0.5) * 80;
          const rotation = Math.random() * 360;
          
          clone.style.transform = `scale(1) translate(${moveX}px, ${moveY}px) rotate(${rotation}deg)`;
          clone.style.opacity = Math.random() * 0.5 + 0.3;
          
          setTimeout(() => {
            if (isHoveredRef.current) {
              animateMovement();
            }
          }, 2000 + Math.random() * 2000);
        };
        
        animateMovement();
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles, enableStars, shouldDisableAnimations]);

  useEffect(() => {
    if (shouldDisableAnimations || !containerRef.current) return;

    const element = containerRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        element.style.transform = 'perspective(1000px) rotateX(3deg) rotateY(3deg)';
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      }

      if (enableMagnetism) {
        element.style.transform = element.style.transform.replace(/translate\([^)]*\)/g, '') + ' translate(0px, 0px)';
      }

      // Reset glow
      if (enableBorderGlow) {
        element.style.setProperty("--glow-intensity", "0");
      }
    };

    const handleMouseMove = (e) => {
      if (!enableTilt && !enableMagnetism && !enableBorderGlow) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      let transform = 'perspective(1000px)';

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        transform += ` rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.03;
        const magnetY = (y - centerY) * 0.03;
        transform += ` translate(${magnetX}px, ${magnetY}px)`;
      }

      element.style.transform = transform;

      // Update glow position for border effect
      if (enableBorderGlow) {
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;
        
        element.style.setProperty("--glow-x", `${relativeX}%`);
        element.style.setProperty("--glow-y", `${relativeY}%`);
        element.style.setProperty("--glow-intensity", "1");
      }
    };

    const handleClick = (e) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, rgba(${glowColor}, 0.15) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
        transform: scale(0);
        opacity: 1;
        transition: all 0.8s ease-out;
      `;

      element.appendChild(ripple);

      // Trigger animation
      setTimeout(() => {
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity = '0';
      }, 10);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 800);
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [
    animateParticles,
    clearAllParticles,
    shouldDisableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
    enableBorderGlow,
  ]);

  const containerStyles = {
    ...style,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease-out",
    "--glow-x": "50%",
    "--glow-y": "50%",
    "--glow-intensity": "0",
    "--glow-radius": "200px",
    "--glow-color": glowColor,
  };

  const borderGlowClass = enableBorderGlow ? "animated-border-glow" : "";

  return (
    <>
      <style>
        {`
          .animated-border-glow {
            transition: all 0.3s ease;
          }
          
          .animated-border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(var(--glow-color), calc(var(--glow-intensity) * 0.6)) 0%,
                rgba(var(--glow-color), calc(var(--glow-intensity) * 0.3)) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .animated-border-glow:hover::after {
            opacity: 1;
          }
          
          .animated-border-glow:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 
                        0 0 30px rgba(var(--glow-color), 0.2);
          }
          
          .particle::before {
            content: '';
            position: absolute;
            top: -1px;
            left: -1px;
            right: -1px;
            bottom: -1px;
            background: rgba(var(--glow-color), 0.2);
            border-radius: 50%;
            z-index: -1;
          }
        `}
      </style>
      
      <div
        ref={containerRef}
        className={`${className} ${borderGlowClass} relative overflow-hidden`}
        style={containerStyles}
      >
        {children}
      </div>
    </>
  );
};

export default AnimatedWrapper;