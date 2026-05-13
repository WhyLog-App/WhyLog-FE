import { memo, useEffect, useRef } from "react";

/**
 * Hero 영역 안에서 마우스를 따라 lerp 로 움직이는 iridescent blob.
 * 모든 좌표 갱신은 RAF + style.transform 으로 처리 — React state 미사용.
 */
const HeroCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hero = document.querySelector(
      ".whylog-landing .hero-spotlight",
    ) as HTMLElement | null;
    const dot = dotRef.current;
    if (!hero || !dot) return;

    let half = 9;
    const state = { x: 0, y: 0, tx: 0, ty: 0, started: false };
    let raf = 0;

    const tick = () => {
      state.x += (state.tx - state.x) * 0.18;
      state.y += (state.ty - state.y) * 0.18;
      half = dot.offsetWidth / 2;
      dot.style.transform = `translate3d(${state.x - half}px, ${state.y - half}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const startLoop = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      state.tx = e.clientX - r.left;
      state.ty = e.clientY - r.top;
      if (!state.started) {
        state.x = state.tx;
        state.y = state.ty;
        state.started = true;
      }
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      startLoop();
    };
    const onLeave = () => {
      dot.style.opacity = "0";
      state.started = false;
      stopLoop();
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("button, a")) dot.classList.add("is-hover");
      else dot.classList.remove("is-hover");
    };

    hero.addEventListener("mousemove", onMove, { passive: true });
    hero.addEventListener("mouseenter", onEnter);
    hero.addEventListener("mouseleave", onLeave);
    hero.addEventListener("mouseover", onOver);

    return () => {
      stopLoop();
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseenter", onEnter);
      hero.removeEventListener("mouseleave", onLeave);
      hero.removeEventListener("mouseover", onOver);
    };
  }, []);

  return <div ref={dotRef} className="iri-morph hero-cursor" aria-hidden />;
};

export default memo(HeroCursor);
