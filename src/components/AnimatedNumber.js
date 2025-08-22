import React, { useEffect, useRef, useState } from 'react';

/**
 * AnimatedNumber with Flip Animation
 * - Counts smoothly from old value → new value
 * - Applies a flip animation whenever the number changes
 */
const easings = {
  linear: (t) => t,
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
};

const clampEasing = (fn) => (t) => fn(Math.min(1, Math.max(0, t)));

const AnimatedNumber = ({
  value,
  className,
  duration = 1000,
  easing = 'easeOutQuart',
  decimals = 0,
  formatter,
}) => {
  const targetNumber = Number(value);
  const [displayValue, setDisplayValue] = useState(
    Number.isFinite(targetNumber) ? targetNumber : 0
  );
  const [flipKey, setFlipKey] = useState(0);

  const rafRef = useRef(null);
  const previousValueRef = useRef(
    Number.isFinite(targetNumber) ? targetNumber : 0
  );

  useEffect(() => {
    const to = Number(value);

    if (!Number.isFinite(to)) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setDisplayValue(0);
      previousValueRef.current = 0;
      return;
    }

    if (duration <= 0 || previousValueRef.current === to) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setDisplayValue(
        decimals > 0 ? Number(to.toFixed(decimals)) : Math.round(to)
      );
      previousValueRef.current = to;
      setFlipKey((prev) => prev + 1); // trigger flip
      return;
    }

    const from = previousValueRef.current;
    let startTime = null;
    const easeFn = clampEasing(easings[easing] || easings.easeOutQuart);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeFn(progress);
      const current = from + (to - from) * eased;
      const rounded =
        decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current);

      setDisplayValue(rounded);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        previousValueRef.current = to;
        setFlipKey((prev) => prev + 1); // trigger flip at end
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, decimals, easing]);

  const rendered = formatter ? formatter(displayValue) : displayValue;

  return (
    <span key={flipKey} className={`inline-block flip ${className || ''}`}>
      {rendered}
    </span>
  );
};

export default AnimatedNumber;