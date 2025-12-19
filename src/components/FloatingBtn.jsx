import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

/**
 * 收起态悬浮按钮
 */
export function FloatingBtn({ onClick }) {
  const [btnTop, setBtnTop] = useState(() => {
    const saved = localStorage.getItem('cba-floating-btn-top');
    return saved ? Number(saved) : Math.floor(window.innerHeight / 2);
  });
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startTopRef = useRef(btnTop);

  useEffect(() => {
    const handleResize = () => {
      const min = 40;
      const max = Math.max(min, window.innerHeight - 40);
      setBtnTop((t) => Math.min(Math.max(t, min), max));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onMouseDown = (e) => {
    draggingRef.current = true;
    startYRef.current = e.clientY;
    startTopRef.current = btnTop;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  };

  const onMouseMove = (e) => {
    if (!draggingRef.current) return;
    const delta = e.clientY - startYRef.current;
    let next = startTopRef.current + delta;
    const min = 40;
    const max = Math.max(min, window.innerHeight - 40);
    if (next < min) next = min;
    if (next > max) next = max;
    setBtnTop(next);
  };

  const onMouseUp = () => {
    draggingRef.current = false;
    localStorage.setItem('cba-floating-btn-top', String(btnTop));
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      className="pointer-events-auto fixed right-4 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-cba-bg backdrop-blur-lg border border-cba-border flex items-center justify-center hover:bg-cba-orange/20 transition-all duration-300 shadow-lg hover:scale-110"
      style={{ top: btnTop }}
      aria-label="展开数据面板"
    >
      <Activity className="w-6 h-6 text-cba-orange" />
    </button>
  );
}
