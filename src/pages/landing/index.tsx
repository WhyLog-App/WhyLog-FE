import {
  type CSSProperties,
  Fragment,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";
import LogoSymbol from "@/components/logo/LogoSymbol";
import LogoText from "@/components/logo/LogoText";
import { ROUTES } from "@/constants/routes";

const HERO_IMAGE = "/assets/landing/iridescent-flow.png";

/* ---------- Helpers for the FLASHY tier ---------- */

// 13) Per-character cascade reveal — split a string into <span class="char"> tokens.
const splitChars = (text: string, offset = 0): ReactNode[] =>
  Array.from(text).map((ch, i) => (
    <span
      // biome-ignore lint/suspicious/noArrayIndexKey: positional, static text
      key={`${offset}-${i}`}
      className={`char${ch === " " ? " space" : ""}`}
      style={{ "--ci": offset + i } as CSSProperties}
    >
      {ch === " " ? " " : ch}
    </span>
  ));

// 5) 3D tilt wrapper — adjusts perspective rotation based on cursor position.
const TiltCard = ({
  children,
  max = 6,
  className,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt ${className ?? ""}`}
    >
      {children}
    </div>
  );
};

// 3) Count-up number — animates 0 → `to` once it enters the viewport.
const CountUp = ({
  to,
  duration = 1600,
  suffix = "",
}: {
  to: number;
  duration?: number;
  suffix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = `0${suffix}`;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - start) / duration);
          const eased = 1 - (1 - k) ** 3;
          const v = Math.round(to * eased);
          el.textContent = `${v}${suffix}`;
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration, suffix]);
  return <span ref={ref}>0{suffix}</span>;
};

// 13′) Typewriter — types a sequence of text segments one character at a time.
// Supports a gradient-styled segment (used for "Why") and explicit line breaks
// so the layout reserves both lines from frame 0 instead of shifting mid-type.
type TypeSegment = { text: string; gradient?: boolean } | { br: true };

const Typewriter = ({
  segments,
  speed = 75,
  startDelay = 250,
}: {
  segments: TypeSegment[];
  speed?: number;
  startDelay?: number;
}) => {
  const total = useMemo(
    () =>
      segments.reduce(
        (n, s) => n + ("br" in s ? 0 : Array.from(s.text).length),
        0,
      ),
    [segments],
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= total) return;
    const id = window.setTimeout(
      () => setCount((c) => Math.min(total, c + 1)),
      count === 0 ? startDelay : speed,
    );
    return () => window.clearTimeout(id);
  }, [count, total, speed, startDelay]);

  // Render strategy: every glyph is always present in the DOM so the layout
  // (including final line height & wrap) is locked from frame 0. Untyped
  // glyphs use `visibility: hidden` — they keep their box, just don't paint.
  // The caret is inserted *before* the next unrevealed glyph during typing,
  // and pinned at the very end once typing finishes.
  const done = count >= total;
  let globalIdx = 0;

  return (
    <>
      {segments.map((seg, i) => {
        if ("br" in seg) {
          return <br key={`br-${i}`} />;
        }
        const chars = Array.from(seg.text);
        const startIdx = globalIdx;
        globalIdx += chars.length;
        const inner: ReactNode[] = [];
        chars.forEach((ch, j) => {
          const localIdx = startIdx + j;
          if (!done && count === localIdx) {
            inner.push(
              <span
                key={`caret-${localIdx}`}
                className="type-caret"
                aria-hidden
              />,
            );
          }
          inner.push(
            <span
              key={`g-${localIdx}`}
              style={{
                visibility: localIdx < count ? "visible" : "hidden",
              }}
            >
              {ch}
            </span>,
          );
        });
        return seg.gradient ? (
          <span key={`s-${i}`} className="why-grad">
            <Fragment>{inner}</Fragment>
          </span>
        ) : (
          <span key={`s-${i}`}>
            <Fragment>{inner}</Fragment>
          </span>
        );
      })}
      {done && <span className="type-caret done" aria-hidden />}
    </>
  );
};

// 4) Hero custom cursor — a small iridescent morphing blob that smoothly
// lerps toward the cursor inside the hero section. Native cursor stays
// visible; this is purely decorative (pointer-events: none).
const HeroCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hero = document.querySelector(
      ".whylog-landing .hero-spotlight",
    ) as HTMLElement | null;
    const dot = dotRef.current;
    if (!hero || !dot) return;

    // Half of the blob's intrinsic size (18px / 2). Updated when hovering CTAs.
    let half = 9;
    const state = { x: 0, y: 0, tx: 0, ty: 0, started: false };

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      state.tx = e.clientX - r.left;
      state.ty = e.clientY - r.top;
      if (!state.started) {
        // Snap on first move so the blob doesn't sweep in from (0,0).
        state.x = state.tx;
        state.y = state.ty;
        state.started = true;
      }
    };
    const onEnter = () => {
      dot.style.opacity = "1";
    };
    const onLeave = () => {
      dot.style.opacity = "0";
      state.started = false;
    };
    // Grow the blob when hovering interactive elements inside the hero.
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("button, a")) dot.classList.add("is-hover");
      else dot.classList.remove("is-hover");
    };

    let raf = 0;
    const tick = () => {
      state.x += (state.tx - state.x) * 0.18;
      state.y += (state.ty - state.y) * 0.18;
      // Size may change on hover; read the current half-width each frame.
      half = dot.offsetWidth / 2;
      dot.style.transform = `translate3d(${state.x - half}px, ${state.y - half}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseenter", onEnter);
    hero.addEventListener("mouseleave", onLeave);
    hero.addEventListener("mouseover", onOver);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseenter", onEnter);
      hero.removeEventListener("mouseleave", onLeave);
      hero.removeEventListener("mouseover", onOver);
    };
  }, []);

  return <div ref={dotRef} className="iri-morph hero-cursor" aria-hidden />;
};

// 6) Hero starfield — generates positioned, twinkling dots (memoised once).
const Starfield = ({ count = 36 }: { count?: number }) => {
  const stars = useMemo(() => {
    // Deterministic pseudo-random so positions don't shift on re-render.
    const rand = (seed: number) => {
      const x = Math.sin(seed * 9301 + 49297) * 233280;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      top: `${(rand(i + 1) * 100).toFixed(2)}%`,
      left: `${(rand(i + 200) * 100).toFixed(2)}%`,
      size: 1 + Math.round(rand(i + 400) * 2),
      delay: (rand(i + 600) * 4).toFixed(2),
      duration: (3 + rand(i + 800) * 3).toFixed(2),
      opacity: 0.45 + rand(i + 1000) * 0.5,
    }));
  }, [count]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: positional
          key={i}
          className="star"
          style={
            {
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              "--star-op": s.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
};

const WAVEFORM_BARS = [
  30, 70, 90, 50, 65, 40, 80, 95, 55, 75, 35, 60, 88, 48, 70, 32, 82, 58, 42,
  68, 80, 45, 62, 38, 74, 92, 50, 33,
] as const;

const Landing = () => {
  const navigate = useNavigate();
  const goLogin = () => navigate(ROUTES.LOGIN);
  const goSignup = () => navigate(ROUTES.SIGNUP);

  // Intersection-based reveal animation (ported from the prototype).
  useEffect(() => {
    const targets = document.querySelectorAll(
      ".whylog-landing .reveal, .whylog-landing .reveal-stagger",
    );
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );
    for (const el of targets) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // 7) Parallax scroll + 11) flow-tube scroll-progress drawing.
  useEffect(() => {
    const root = document.querySelector(
      ".whylog-landing",
    ) as HTMLElement | null;
    const parallaxNodes = Array.from(
      document.querySelectorAll<HTMLElement>(".whylog-landing [data-parallax]"),
    );
    const tube = document.querySelector(
      ".whylog-landing .tube-progress",
    ) as SVGPathElement | null;
    const howSection = document.getElementById("how");

    let totalLen = 0;
    if (tube) {
      totalLen = tube.getTotalLength();
      tube.style.strokeDasharray = String(totalLen);
      tube.style.strokeDashoffset = String(totalLen);
    }

    const onScroll = () => {
      const y = window.scrollY;
      if (root) root.style.setProperty("--scroll-y", `${y}`);
      for (const el of parallaxNodes) {
        const speed = Number(el.dataset.parallax) || 0;
        el.style.setProperty("--py", `${y * speed}px`);
      }
      if (tube && howSection) {
        const r = howSection.getBoundingClientRect();
        const vh = window.innerHeight;
        // Progress between "section top hits 80% viewport" and "section bottom hits 30% viewport".
        const start = vh * 0.85;
        const end = -r.height + vh * 0.5;
        const k = Math.max(0, Math.min(1, (start - r.top) / (start - end)));
        tube.style.strokeDashoffset = String(totalLen * (1 - k));
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="whylog-landing min-h-screen w-full">
      {/* ==================== NAVBAR ==================== */}
      <header className="fixed top-0 inset-x-0 z-50 nav-glass">
        <div className="max-w-7xl mx-auto h-[68px] flex items-center justify-between px-6">
          <a href="#" className="flex items-center gap-2.5">
            <LogoSymbol className="h-7" aria-hidden="true" />
            <LogoText className="h-6" aria-hidden="true" />
          </a>

          <nav className="hidden lg:flex items-center gap-9 text-[14px] text-ink-500 font-medium">
            <a href="#features" className="hover:text-ink-900 transition">
              기능
            </a>
            <a href="#how" className="hover:text-ink-900 transition">
              작동 방식
            </a>
            <a href="#usecases" className="hover:text-ink-900 transition">
              사용 사례
            </a>
            <a href="#tech" className="hover:text-ink-900 transition">
              기술
            </a>
            <a href="#faq" className="hover:text-ink-900 transition">
              팀
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goLogin}
              className="hidden sm:inline-flex h-10 px-4 items-center text-[14px] font-semibold text-ink-700 hover:text-ink-900 transition"
            >
              로그인
            </button>
            <button
              type="button"
              onClick={goSignup}
              className="btn-primary h-10 px-5 rounded-full text-[14px] font-semibold inline-flex items-center gap-1.5"
            >
              무료로 시작하기
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <title>화살표</title>
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden grain mesh-bg alive hero-spotlight pt-30 pb-32">
        {/* 4) Iridescent custom cursor (lerps to mouse position) */}
        <HeroCursor />

        {/* 6) Twinkling starfield */}
        <Starfield count={42} />

        {/* 7) Parallax-wrapped hero image (slow drift on scroll) */}
        <div
          data-parallax="-0.12"
          className="absolute inset-0 pointer-events-none"
          style={{ transform: "translate3d(0, var(--py, 0px), 0)" }}
        >
          <img
            src={HERO_IMAGE}
            alt=""
            className="absolute -right-[12%] -top-[6%] w-[820px] max-w-[80vw] opacity-90 pointer-events-none float-a select-none"
            style={{
              mixBlendMode: "multiply",
              filter: "saturate(108%) contrast(102%)",
            }}
          />
        </div>

        {/* 7) Parallax-wrapped soft blob behind text */}
        <div
          data-parallax="0.18"
          className="absolute inset-0 pointer-events-none"
          style={{ transform: "translate3d(0, var(--py, 0px), 0)" }}
        >
          <div
            className="absolute -left-32 top-1/3 w-[520px] h-[520px] rounded-full opacity-60 pointer-events-none float-b"
            style={{
              background:
                "radial-gradient(closest-side, rgba(167,139,250,0.45), transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 lg:col-span-7 reveal">
            <div className="chip mb-7">
              <span className="iri-morph w-3.5 h-3.5" aria-hidden="true" />
              AI가 회의의 맥락을 코드까지 잇습니다
            </div>

            <h1 className="font-extrabold tracking-tighter2 text-[64px] md:text-[84px] lg:text-[96px] leading-[1.02] text-ink-900">
              <Typewriter
                segments={[
                  { text: "코드 변경의" },
                  { br: true },
                  { text: '"Why"', gradient: true },
                  { text: "를" },
                  { br: true },
                  { text: "잊지 않도록." },
                ]}
                speed={80}
                startDelay={300}
              />
            </h1>

            <p className="mt-7 max-w-[560px] text-[19px] leading-[1.65] text-ink-500">
              회의에서 결정된 맥락이 코드 커밋까지 자연스럽게 이어지는
              <br className="hidden md:block" />
              AI 기반 의사결정 관리 플랫폼.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={goSignup}
                className="btn-primary h-[52px] px-7 rounded-full text-[15px] font-semibold inline-flex items-center gap-2"
              >
                무료로 시작하기
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <title>화살표</title>
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="btn-ghost h-[52px] px-6 rounded-full text-[15px] font-semibold inline-flex items-center gap-2.5"
              >
                <span className="w-7 h-7 rounded-full bg-primary-50 inline-flex items-center justify-center">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="#1E5BE8"
                  >
                    <title>재생</title>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                데모 영상 보기
              </button>
            </div>

            {/* Tech stack — replaces fake social proof with real credibility. */}
            <div className="mt-14 flex items-center gap-x-7 gap-y-3 flex-wrap">
              <p className="text-[12px] text-ink-300 font-semibold tracking-[0.22em] uppercase">
                Powered by
              </p>
              <div className="flex items-center gap-x-6 gap-y-3 flex-wrap text-ink-500">
                {/* GitHub */}
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  GitHub
                </span>

                {/* LiveKit — 실시간 회의 (WebRTC) */}
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold">
                  <span
                    className="num inline-flex items-center justify-center w-[22px] h-[22px] rounded-md text-white text-[9px] font-extrabold tracking-tight"
                    style={{
                      background: "linear-gradient(135deg, #1c1c28, #28293d)",
                    }}
                    aria-hidden
                  >
                    LK
                  </span>
                  LiveKit
                </span>

                {/* Gemini — 텍스트 이해 + 임베딩 벡터 */}
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient
                        id="whylog-gemini-grad"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#4285F4" />
                        <stop offset="50%" stopColor="#9B72CB" />
                        <stop offset="100%" stopColor="#F0ABFC" />
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#whylog-gemini-grad)"
                      d="M12 1.5q.5 2.6 1.6 4.4 1.1 1.85 2.6 3.1 1.5 1.25 3.3 2 1.8.75 3.9 1.1v.8q-2.1.35-3.9 1.1-1.8.75-3.3 2-1.5 1.25-2.6 3.1Q12.5 19.9 12 22.5q-.5-2.6-1.6-4.4Q9.3 16.25 7.8 15q-1.5-1.25-3.3-2-1.8-.75-3.9-1.1v-.8Q2.7 10.75 4.5 10q1.8-.75 3.3-2 1.5-1.25 2.6-3.1Q11.5 4.1 12 1.5z"
                    />
                  </svg>
                  Gemini
                </span>

                {/* ChromaDB — 벡터 저장 / 유사도 검색 */}
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold">
                  <span
                    className="num inline-flex items-center justify-center w-[22px] h-[22px] rounded-md text-white text-[9px] font-extrabold tracking-tight"
                    style={{
                      background:
                        "linear-gradient(135deg, #ef4444 0%, #f59e0b 50%, #3b82f6 100%)",
                    }}
                    aria-hidden
                  >
                    C
                  </span>
                  ChromaDB
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 relative h-[420px] lg:h-[560px] hidden lg:block" />
        </div>
      </section>

      {/* ==================== PROBLEM ==================== */}
      <section className="relative overflow-hidden grain py-32 mesh-bg-soft">
        <div className="shard w-24 h-24 left-[6%] top-[18%] float-c" />
        <div className="shard w-16 h-16 right-[10%] top-[22%] float-b" />
        <div className="shard w-14 h-14 left-[18%] bottom-[12%] float-a" />
        <div className="shard w-20 h-20 right-[18%] bottom-[18%] float-c" />
        <div className="shard w-10 h-10 left-[44%] top-[10%] float-b" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <p className="text-[12px] tracking-[0.22em] font-bold text-primary-500 uppercase mb-4 reveal">
            PROBLEM
          </p>
          <h2 className="reveal text-[40px] md:text-[52px] font-extrabold tracking-tighter2 text-ink-900 leading-[1.1]">
            이런 일, 한 번쯤 겪어보셨죠?
          </h2>
          <p className="reveal mt-5 text-[18px] text-ink-500 max-w-2xl mx-auto">
            회의에서 정한 결정이 시간이 지나면 사라집니다.
          </p>

          <div className="reveal-stagger mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                n: "01",
                title: '"왜 이렇게 짰지?"',
                body: "3개월 전 결정한 구조인데, 그때 이유가 도무지 기억나지 않습니다.",
                icon: (
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                    stroke="#1E5BE8"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
              },
              {
                n: "02",
                title: '"회의록을 뒤져도"',
                body: "어떤 대안이 논의됐고, 왜 기각됐는지 다시 찾아내기 어렵습니다.",
                icon: (
                  <>
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="#1E5BE8"
                      strokeWidth="1.6"
                    />
                    <path
                      d="m20 20-3.5-3.5"
                      stroke="#1E5BE8"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </>
                ),
              },
              {
                n: "03",
                title: '"Git에는 결과만"',
                body: '커밋 메시지는 "무엇을" 했는지만 남길 뿐, "왜"는 비어 있습니다.',
                icon: (
                  <path
                    d="M9 6 3 12l6 6M15 6l6 6-6 6"
                    stroke="#1E5BE8"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
              },
            ].map((c) => (
              <article
                key={c.n}
                className="glass card-lift rounded-3xl p-8 text-left"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-white/80 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <title>아이콘</title>
                      {c.icon}
                    </svg>
                  </div>
                  <span className="num text-[12px] text-ink-300 font-semibold">
                    {c.n}
                  </span>
                </div>
                <h3 className="text-[22px] font-bold text-ink-900 leading-tight">
                  {c.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-ink-500">
                  {c.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="relative overflow-hidden grain py-32">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 reveal">
            <p className="text-[12px] tracking-[0.22em] font-bold text-primary-500 uppercase mb-4">
              FEATURES
            </p>
            <h2 className="text-[40px] md:text-[52px] font-extrabold tracking-tighter2 text-ink-900 leading-[1.1]">
              회의에서 코드까지, <span className="iri-text">한 흐름으로</span>
            </h2>
            <p className="mt-5 text-[18px] text-ink-500 max-w-2xl mx-auto">
              세 단계가 자연스럽게 연결되어, 결정의 맥락을 코드 한 줄까지
              추적합니다.
            </p>
          </div>

          {/* Feature 1 */}
          <div className="grid grid-cols-12 gap-12 items-center mb-32 reveal">
            <div className="col-span-12 lg:col-span-5">
              <span className="num text-[13px] font-semibold text-primary-500 tracking-wide">
                FEATURE 01 · 회의 자동 분석
              </span>
              <h3 className="mt-3 text-[34px] md:text-[40px] font-extrabold tracking-tighter2 text-ink-900 leading-[1.12]">
                AI가 회의를 듣고
                <br />
                핵심을 정리합니다
              </h3>
              <p className="mt-5 text-[16px] leading-[1.75] text-ink-500">
                음성 회의를 진행하면 AI가 회의 맥락을 분석하여 핵심 결정사항을
                자동으로 추출합니다. 논의 주제, 핵심 맥락, 최종 결정, 결정
                근거가 자동 구조화됩니다.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "실시간 음성 → 텍스트 전사",
                  "주제 / 맥락 / 결정 자동 분리",
                  "발화자 식별 및 신뢰도 점수",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 text-[14px] text-ink-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-12 lg:col-span-7 relative">
              <div
                className="absolute -inset-6 rounded-[40px] opacity-80"
                style={{
                  background:
                    "radial-gradient(60% 60% at 30% 50%, rgba(167,139,250,0.20), transparent 65%), radial-gradient(60% 60% at 80% 70%, rgba(122,183,255,0.25), transparent 65%)",
                }}
              />
              <TiltCard>
                <div className="relative glass-strong rounded-[28px] p-7">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-[0_6px_18px_rgba(30,91,232,0.35)]">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <title>마이크</title>
                          <path
                            d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"
                            stroke="white"
                            strokeWidth="1.6"
                          />
                          <path
                            d="M19 12a7 7 0 0 1-14 0M12 19v3"
                            stroke="white"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-ink-900">
                          서버 개발 팀 4차 회의
                        </p>
                        <p className="text-[12px] text-ink-300 num">
                          2025.01.20 · 47분 · 5명 참여
                        </p>
                      </div>
                    </div>
                    <span className="num text-[12px] font-semibold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full">
                      신뢰도 90점
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-flat rounded-2xl p-4">
                      <p className="text-[11px] font-semibold tracking-wider text-ink-300 uppercase mb-2">
                        논의 주제
                      </p>
                      <p className="text-[13px] font-semibold text-ink-900">
                        Redis 키 정책 변경
                      </p>
                      <p className="text-[12px] text-ink-500 mt-1">
                        세션 유형별 TTL 분리 여부
                      </p>
                    </div>
                    <div className="glass-flat rounded-2xl p-4">
                      <p className="text-[11px] font-semibold tracking-wider text-ink-300 uppercase mb-2">
                        핵심 맥락
                      </p>
                      <p className="text-[12px] text-ink-700 leading-[1.55]">
                        인증·캐시 세션이 같은 TTL을 공유 → 만료 정책 충돌 우려
                      </p>
                    </div>
                    <div className="glass-flat rounded-2xl p-4">
                      <p className="text-[11px] font-semibold tracking-wider text-ink-300 uppercase mb-2">
                        최종 결정
                      </p>
                      <p className="text-[13px] font-semibold text-ink-900">
                        Redis 유지 + 키 네이밍 분리
                      </p>
                    </div>
                    <div className="glass-flat rounded-2xl p-4">
                      <p className="text-[11px] font-semibold tracking-wider text-ink-300 uppercase mb-2">
                        결정 근거
                      </p>
                      <ul className="text-[12px] text-ink-700 space-y-1">
                        <li className="flex gap-1.5">
                          <span className="text-primary-500">✓</span> 운영
                          복잡도 우려
                        </li>
                        <li className="flex gap-1.5">
                          <span className="text-primary-500">✓</span> Mongo 이전
                          비용 부담
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-1.5">
                    <span className="text-[10px] num font-semibold text-ink-300 mr-1">
                      12:24
                    </span>
                    <div className="flex-1 flex items-center gap-[3px] h-8">
                      {WAVEFORM_BARS.map((h, i) => (
                        <span
                          // biome-ignore lint/suspicious/noArrayIndexKey: static waveform
                          key={i}
                          className={`block w-[3px] rounded-full ${
                            h >= 80 ? "bg-primary-500" : "bg-primary-300"
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] num font-semibold text-ink-300 ml-1">
                      12:47
                    </span>
                  </div>
                </div>
              </TiltCard>
              <div className="absolute -top-8 -right-6 iri-morph w-[88px] h-[88px] float-a" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-12 gap-12 items-center mb-32 reveal">
            <div className="col-span-12 lg:col-span-7 order-2 lg:order-1 relative">
              <div
                className="absolute -inset-6 rounded-[40px] opacity-80"
                style={{
                  background:
                    "radial-gradient(60% 60% at 80% 40%, rgba(240,171,252,0.20), transparent 65%), radial-gradient(60% 60% at 20% 80%, rgba(167,139,250,0.22), transparent 65%)",
                }}
              />
              <TiltCard>
                <div className="relative glass-strong rounded-[28px] p-7">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[20px] font-extrabold text-ink-900 tracking-tightish">
                        Redis 키 정책 변경
                      </p>
                      <p className="text-[12px] text-ink-300 num mt-0.5">
                        서버 개발 팀 4차 회의 · 2025.01.20
                      </p>
                    </div>
                    <span className="num text-[11px] font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md">
                      신뢰도 90
                    </span>
                  </div>

                  <div className="glass-flat rounded-2xl p-4 mb-3">
                    <p className="text-[11px] font-semibold tracking-wider text-ink-300 uppercase mb-3">
                      ⏱ 타임라인
                    </p>
                    <div className="space-y-2.5">
                      {[
                        { t: "12:24", label: "장애 이슈 제기", strong: false },
                        {
                          t: "12:26",
                          label: "Redis vs Mongo 논의",
                          strong: false,
                        },
                        { t: "12:28", label: "최종 결정", strong: true },
                      ].map((row) => (
                        <div key={row.t} className="flex items-center gap-3">
                          <span className="num text-[11px] text-ink-300 w-9">
                            {row.t}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          <span
                            className={`text-[13px] ${
                              row.strong
                                ? "font-semibold text-ink-900"
                                : "text-ink-700"
                            }`}
                          >
                            {row.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-flat rounded-2xl p-4">
                    <p className="text-[11px] font-semibold tracking-wider text-ink-300 uppercase mb-3">
                      결정 원문 맥락
                    </p>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex-shrink-0" />
                        <div>
                          <p className="text-[12px] font-semibold text-ink-900">
                            김준용{" "}
                            <span className="num text-ink-300 font-normal">
                              12:24
                            </span>
                          </p>
                          <p className="text-[12.5px] text-ink-700 leading-[1.6] mt-0.5">
                            Redis 키 만료 정책이 지금 TTL 고정인데, 세션
                            유형별로 다르게 가져가야 할 것 같아요.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #a78bfa, #f0abfc)",
                          }}
                        />
                        <div>
                          <p className="text-[12px] font-semibold text-ink-900">
                            유진{" "}
                            <span className="num text-ink-300 font-normal">
                              12:26
                            </span>
                          </p>
                          <p className="text-[12.5px] text-ink-700 leading-[1.6] mt-0.5">
                            Mongo로 옮기자는 의견 있었는데, 운영 복잡도
                            올라가니까 Redis 유지하면서 키 네이밍만 바꾸는 게
                            낫지 않을까요?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
              <div className="absolute -bottom-8 -left-6 iri-sphere w-[68px] h-[68px] float-c" />
            </div>

            <div className="col-span-12 lg:col-span-5 order-1 lg:order-2">
              <span className="num text-[13px] font-semibold text-primary-500 tracking-wide">
                FEATURE 02 · 의사결정 기록
              </span>
              <h3 className="mt-3 text-[34px] md:text-[40px] font-extrabold tracking-tighter2 text-ink-900 leading-[1.12]">
                결정의 근거와 맥락을
                <br />
                그대로 보존
              </h3>
              <p className="mt-5 text-[16px] leading-[1.75] text-ink-500">
                누가, 언제, 왜 그렇게 결정했는지를 타임라인 · 결정근거 · 원문
                맥락으로 함께 저장합니다. 신뢰도 점수와 함께요.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "발화 단위로 묶인 결정 근거",
                  "참여자 합의도 자동 산출",
                  "구조화된 Decision Log 보관",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 text-[14px] text-ink-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid grid-cols-12 gap-12 items-center reveal">
            <div className="col-span-12 lg:col-span-5">
              <span className="num text-[13px] font-semibold text-primary-500 tracking-wide">
                FEATURE 03 · Git 커밋 매칭
              </span>
              <h3 className="mt-3 text-[34px] md:text-[40px] font-extrabold tracking-tighter2 text-ink-900 leading-[1.12]">
                결정과 코드를
                <br />
                잇는 다리
              </h3>
              <p className="mt-5 text-[16px] leading-[1.75] text-ink-500">
                GitHub 레포지토리를 연동하면 커밋 이력을 수집하고, 회의에서 나온
                결정사항과 자동으로 매칭합니다. 추천 사유까지 함께 제공돼 한
                번에 맥락이 이어집니다.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Hybrid Retrieval 기반 추천",
                  "커밋별 매칭 사유 제공",
                  "결정 ↔ 구현 일치율 모니터링",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 text-[14px] text-ink-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-12 lg:col-span-7 relative">
              <div
                className="absolute -inset-6 rounded-[40px] opacity-80"
                style={{
                  background:
                    "radial-gradient(60% 60% at 30% 60%, rgba(122,183,255,0.25), transparent 65%), radial-gradient(60% 60% at 80% 30%, rgba(167,139,250,0.20), transparent 65%)",
                }}
              />
              <TiltCard>
                <div className="relative glass-strong rounded-[28px] p-7">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-[15px] font-bold text-ink-900">
                      커밋 추천 결과
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="num text-[11px] font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md">
                        추천 커밋
                      </span>
                      <span className="num text-[11px] font-medium text-ink-500 bg-white border border-line-soft px-2.5 py-1 rounded-md">
                        연결됨
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-line-soft overflow-hidden bg-white/60">
                    <div className="grid grid-cols-[1fr_84px_1.6fr_72px_60px] px-4 py-2.5 text-[10.5px] tracking-wider font-semibold text-ink-300 uppercase border-b border-line-soft bg-white/50">
                      <span>Repository</span>
                      <span>Commit</span>
                      <span>Message</span>
                      <span>사유</span>
                      <span className="text-right">연결</span>
                    </div>
                    {[
                      {
                        repo: "Nect-Backend",
                        sha: "a13f9c2",
                        msg: "feat: 마이페이지 API 구현",
                      },
                      {
                        repo: "SpeakOn/Fe",
                        sha: "e7c2b1a",
                        msg: "feat: 유저 프로필 컴포넌트",
                      },
                      {
                        repo: "Nect-Backend",
                        sha: "9b3da42",
                        msg: "refactor: 세션 저장소 분리",
                      },
                    ].map((row, idx, arr) => (
                      <div
                        key={row.sha}
                        className={`grid grid-cols-[1fr_84px_1.6fr_72px_60px] px-4 py-3 text-[13px] items-center hover:bg-primary-50/30 transition ${
                          idx < arr.length - 1
                            ? "border-b border-line-faint"
                            : ""
                        }`}
                      >
                        <span className="font-semibold text-ink-900">
                          {row.repo}
                        </span>
                        <span className="num text-[11px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded inline-block w-fit">
                          {row.sha}
                        </span>
                        <span className="text-ink-700 truncate">{row.msg}</span>
                        <a className="text-primary-500 font-semibold text-[12px] cursor-pointer">
                          사유 보기
                        </a>
                        <span className="text-right">
                          <button
                            type="button"
                            className="text-[11px] font-semibold text-white bg-primary-500 px-2.5 py-1 rounded-md"
                          >
                            연결
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2.5">
                    <div className="glass-flat rounded-xl px-3 py-2.5">
                      <p className="text-[10.5px] tracking-wider font-semibold text-ink-300 uppercase">
                        근거 발견
                      </p>
                      <p className="num text-[15px] font-extrabold text-ink-900 mt-1">
                        <CountUp to={42} duration={1400} />
                        <span className="text-[11px] text-ink-500 font-medium ml-0.5">
                          개
                        </span>
                      </p>
                    </div>
                    <div className="glass-flat rounded-xl px-3 py-2.5">
                      <p className="text-[10.5px] tracking-wider font-semibold text-ink-300 uppercase">
                        참여자 합의
                      </p>
                      <p className="text-[13px] font-bold text-primary-500 mt-1">
                        높음
                      </p>
                    </div>
                    <div className="glass-flat rounded-xl px-3 py-2.5">
                      <p className="text-[10.5px] tracking-wider font-semibold text-ink-300 uppercase">
                        결정 ↔ 구현
                      </p>
                      <p className="num text-[15px] font-extrabold text-ink-900 mt-1">
                        <CountUp to={92} duration={1500} suffix="" />
                        <span className="text-[11px] text-ink-500 font-medium ml-0.5">
                          %
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </TiltCard>
              <div className="absolute -top-6 -right-6 iri-sphere w-[72px] h-[72px] float-b" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section
        id="how"
        className="relative overflow-hidden grain py-32 mesh-bg-soft"
      >
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 reveal">
            <p className="text-[12px] tracking-[0.22em] font-bold text-primary-500 uppercase mb-4">
              HOW IT WORKS
            </p>
            <h2 className="text-[40px] md:text-[52px] font-extrabold tracking-tighter2 text-ink-900 leading-[1.1]">
              4단계로 의사결정의
              <br />
              맥락이 살아납니다
            </h2>
          </div>

          <div className="relative">
            <svg
              viewBox="0 0 1200 200"
              preserveAspectRatio="none"
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[200px] hidden md:block pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="whylog-tube" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7AB7FF" stopOpacity="0" />
                  <stop offset="20%" stopColor="#7AB7FF" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.7" />
                  <stop offset="80%" stopColor="#F0ABFC" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#F0ABFC" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="whylog-tubeGlow"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#1E5BE8" />
                  <stop offset="50%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#F0ABFC" />
                </linearGradient>
              </defs>
              <path
                d="M0,100 C200,40 400,160 600,100 C800,40 1000,160 1200,100"
                stroke="url(#whylog-tube)"
                strokeWidth="32"
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />
              <path
                d="M0,100 C200,40 400,160 600,100 C800,40 1000,160 1200,100"
                stroke="url(#whylog-tube)"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M0,100 C200,40 400,160 600,100 C800,40 1000,160 1200,100"
                stroke="url(#whylog-tubeGlow)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className="tube-progress"
              />
            </svg>

            <div className="reveal-stagger relative grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  n: 1,
                  title: "회의 시작",
                  body: "음성 회의를 시작하면 자동으로 녹음·전사됩니다.",
                  offset: false,
                  icon: (
                    <path
                      d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 12a7 7 0 0 1-14 0M12 19v3"
                      stroke="#1E5BE8"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  ),
                },
                {
                  n: 2,
                  title: "AI 분석",
                  body: "논의 주제, 결정 근거, 최종 결정을 AI가 추출합니다.",
                  offset: true,
                  icon: (
                    <>
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="#1E5BE8"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M8 12h8M12 8v8"
                        stroke="#1E5BE8"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </>
                  ),
                },
                {
                  n: 3,
                  title: "결정사항 저장",
                  body: "신뢰도 점수와 함께 구조화된 Decision Log로 보존됩니다.",
                  offset: false,
                  icon: (
                    <>
                      <path
                        d="M5 4h11l3 3v13H5z"
                        stroke="#1E5BE8"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 9h6M9 13h6M9 17h4"
                        stroke="#1E5BE8"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </>
                  ),
                },
                {
                  n: 4,
                  title: "Git 커밋 매칭",
                  body: "Hybrid Retrieval로 관련 커밋을 자동 추천하고 연결합니다.",
                  offset: true,
                  icon: (
                    <>
                      <circle
                        cx="6"
                        cy="6"
                        r="2.4"
                        stroke="#1E5BE8"
                        strokeWidth="1.6"
                      />
                      <circle
                        cx="6"
                        cy="18"
                        r="2.4"
                        stroke="#1E5BE8"
                        strokeWidth="1.6"
                      />
                      <circle
                        cx="18"
                        cy="12"
                        r="2.4"
                        stroke="#1E5BE8"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M6 8.4v7.2M8 6.5c4 0 8 1.5 8 5.5"
                        stroke="#1E5BE8"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </>
                  ),
                },
              ].map((step) => (
                <article
                  key={step.n}
                  className={`glass card-lift rounded-3xl p-7 text-left relative ${
                    step.offset ? "md:mt-10" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-300 text-white flex items-center justify-center shadow-[0_8px_22px_rgba(30,91,232,0.35)] num font-bold text-[15px]">
                      {step.n}
                    </div>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <title>step icon</title>
                      {step.icon}
                    </svg>
                  </div>
                  <h3 className="text-[18px] font-bold text-ink-900 leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.65] text-ink-500">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TECH ==================== */}
      <section id="tech" className="relative overflow-hidden grain py-32">
        <div className="absolute right-[5%] top-[12%] iri-sphere w-32 h-32 float-a opacity-90" />
        <div className="absolute left-[8%] bottom-[14%] iri-sphere w-24 h-24 float-b" />
        <div className="absolute right-[18%] bottom-[8%] iri-sphere w-16 h-16 float-c" />
        <div className="absolute left-[42%] top-[8%] iri-sphere w-12 h-12 float-a opacity-80" />
        <div className="absolute right-[40%] bottom-[20%] iri-sphere w-10 h-10 float-c opacity-90" />

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-12 gap-12 items-center">
          <div className="col-span-12 lg:col-span-6 reveal">
            <p className="text-[12px] tracking-[0.22em] font-bold text-primary-500 uppercase mb-4">
              TECHNOLOGY
            </p>
            <h2 className="text-[38px] md:text-[48px] font-extrabold tracking-tighter2 text-ink-900 leading-[1.1]">
              Hybrid Retrieval로
              <br />
              정확도를 끌어올렸습니다
            </h2>
            <p className="mt-6 text-[17px] leading-[1.75] text-ink-500 max-w-lg">
              의미 기반 벡터 검색(Sentence Embedding)과 키워드 기반 정밀
              검색(BM25)을 가중치 결합하여, 표현이 달라도 같은 맥락을
              찾아냅니다.
            </p>

            <div className="mt-9 glass rounded-2xl p-5 max-w-lg">
              <p className="text-[10.5px] tracking-wider font-semibold text-ink-300 uppercase mb-2">
                Scoring Formula
              </p>
              <div className="mono text-[15.5px] text-ink-900 leading-[1.7] flex flex-wrap items-center gap-x-1.5">
                <span className="text-ink-700">final_score</span>
                <span className="text-ink-300">=</span>
                <span className="text-primary-500 font-bold">0.3</span>
                <span className="text-ink-300">×</span>
                <span>vector_score</span>
                <span className="text-ink-300">+</span>
                <span className="text-primary-500 font-bold">0.7</span>
                <span className="text-ink-300">×</span>
                <span>bm25_score</span>
              </div>
              <div className="mt-4 flex items-center gap-3 text-[12px] text-ink-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary-500" />
                  Vector (의미 검색)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-lavender" />
                  BM25 (키워드 정밀도)
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 reveal">
            <div className="space-y-4">
              <div className="glass card-lift rounded-3xl p-7 flex items-center gap-7">
                <div className="flex-shrink-0">
                  <p className="num text-[64px] font-extrabold text-primary-500 leading-none tracking-tighter2">
                    <CountUp to={80} duration={1700} />
                    <span className="text-[36px] text-primary-300">%</span>
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-ink-900">
                    1위 매칭 정확도
                  </p>
                  <p className="text-[13.5px] text-ink-500 mt-1.5 leading-relaxed">
                    결정사항과 가장 관련된 커밋이 추천 결과 최상단에 노출되는
                    비율
                  </p>
                </div>
                <div className="w-20 h-12 hidden sm:flex items-end gap-1">
                  {[
                    { cls: "bg-primary-100", h: 30 },
                    { cls: "bg-primary-200", h: 50 },
                    { cls: "bg-primary-300", h: 65 },
                    { cls: "bg-primary-400", h: 80 },
                    { cls: "bg-primary-500", h: 100 },
                  ].map((b) => (
                    <span
                      key={b.h}
                      className={`block w-2 rounded ${b.cls}`}
                      style={{ height: `${b.h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="glass card-lift rounded-3xl p-7 flex items-center gap-7">
                <div className="flex-shrink-0">
                  <p className="num text-[64px] font-extrabold leading-none tracking-tighter2 iri-text">
                    <CountUp to={99} duration={1900} />
                    <span className="text-[36px]">%</span>
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-ink-900">
                    상위 5위 내 정답 포함율
                  </p>
                  <p className="text-[13.5px] text-ink-500 mt-1.5 leading-relaxed">
                    관련 커밋이 상위 5개 추천 안에 반드시 포함되는 비율
                  </p>
                </div>
                <div className="hidden sm:flex flex-col gap-1.5 w-20">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-2 rounded-full bg-line-soft overflow-hidden"
                    >
                      <div
                        className="h-full"
                        style={{
                          width: "100%",
                          background:
                            "linear-gradient(to right, #1e5be8, #a78bfa)",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass card-lift rounded-3xl p-7 flex items-center gap-7">
                <div className="flex-shrink-0">
                  <p className="num text-[52px] font-extrabold text-primary-500 leading-none tracking-tighter2">
                    0.5<span className="text-ink-300">–</span>1.8
                    <span className="text-[28px] text-primary-300 ml-1">s</span>
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-ink-900">
                    평균 검색 속도
                  </p>
                  <p className="text-[13.5px] text-ink-500 mt-1.5 leading-relaxed">
                    결정사항 입력부터 추천 커밋 반환까지의 응답 시간
                  </p>
                </div>
                <div className="hidden sm:block w-20">
                  <svg viewBox="0 0 80 40" className="w-full">
                    <title>속도 그래프</title>
                    <path
                      d="M0,30 Q20,5 40,15 T80,12"
                      stroke="#1E5BE8"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <circle cx="80" cy="12" r="3" fill="#1E5BE8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== USE CASES ==================== */}
      <section
        id="usecases"
        className="relative overflow-hidden grain py-32 mesh-bg-soft"
      >
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <p className="text-[12px] tracking-[0.22em] font-bold text-primary-500 uppercase mb-4">
              USE CASES
            </p>
            <h2 className="text-[40px] md:text-[52px] font-extrabold tracking-tighter2 text-ink-900 leading-[1.1]">
              이런 팀에 잘 어울려요
            </h2>
          </div>

          <div className="reveal-stagger grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                tag: "BE",
                gradient: "linear-gradient(135deg, #1e5be8, #589efa)",
                shadow: "0 10px 24px rgba(30,91,232,0.3)",
                kicker: "백엔드 팀",
                title: "아키텍처 결정의 추적",
                body: "스프린트 회의에서 정한 아키텍처 결정을 6개월 후에도 그대로 추적합니다.",
                stat: (
                  <>
                    <span className="num font-bold text-ink-700">42</span>건의
                    결정 / 분기
                  </>
                ),
              },
              {
                tag: "FE",
                gradient: "linear-gradient(135deg, #a78bfa, #f0abfc)",
                shadow: "0 10px 24px rgba(167,139,250,0.35)",
                kicker: "프론트엔드 팀",
                title: "디자인 시스템 변경 추적",
                body: "디자인 시스템 변경 논의의 맥락을 컴포넌트 PR과 자연스럽게 연결합니다.",
                stat: (
                  <>
                    <span className="num font-bold text-ink-700">128</span>개의
                    PR 매칭
                  </>
                ),
              },
              {
                tag: "SU",
                gradient: "linear-gradient(135deg, #7ab7ff, #1e5be8)",
                shadow: "0 10px 24px rgba(30,91,232,0.3)",
                kicker: "스타트업",
                title: "신규 입사자 온보딩",
                body: "새로 합류한 동료가 코드 히스토리의 'Why'를 며칠이 아닌 시간 단위로 학습합니다.",
                stat: (
                  <>
                    온보딩 시간{" "}
                    <span className="num font-bold text-ink-700">−63%</span>
                  </>
                ),
              },
            ].map((c) => (
              <article key={c.tag} className="glass card-lift rounded-3xl p-8">
                <div
                  className="w-14 h-14 rounded-full mb-6 flex items-center justify-center text-white font-bold text-[16px]"
                  style={{ background: c.gradient, boxShadow: c.shadow }}
                >
                  {c.tag}
                </div>
                <p className="text-[12px] font-semibold tracking-wider text-primary-500 uppercase">
                  {c.kicker}
                </p>
                <h3 className="mt-1 text-[22px] font-bold text-ink-900 leading-tight">
                  {c.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-ink-500">
                  {c.body}
                </p>
                <div className="hairline my-6" />
                <div className="flex items-center gap-2 text-[12px] text-ink-300">
                  {c.stat}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIAL ==================== */}
      <section className="relative overflow-hidden grain py-32 mesh-bg">
        <div
          className="iri-blob b2 absolute -left-[10%] top-[8%] w-[460px] h-[460px] opacity-80 pointer-events-none float-b"
          aria-hidden="true"
        />
        <div
          className="iri-blob b3 absolute -left-[2%] top-[42%] w-[180px] h-[180px] opacity-70 pointer-events-none float-c"
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-6 reveal">
          <div className="glass-strong rounded-[36px] p-12 md:p-16 relative overflow-hidden">
            <div
              className="absolute -right-12 -top-10 iri-sphere w-[280px] h-[280px] float-a hidden md:block"
              aria-hidden="true"
            />
            <span
              className="text-[120px] leading-none select-none absolute top-4 left-8"
              style={{ fontFamily: "serif", color: "rgba(30,91,232,0.2)" }}
            >
              "
            </span>
            <p className="relative text-[28px] md:text-[34px] font-semibold leading-[1.4] tracking-tightish text-ink-900 max-w-[560px]">
              회의록을 뒤지는 시간이 사라졌어요. WhyLog가 결정의 맥락을 코드까지
              가져다 줍니다.
            </p>
            <div className="mt-9 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #1e5be8, #a78bfa)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <div>
                <p className="text-[15px] font-bold text-ink-900">김준용</p>
                <p className="text-[13px] text-ink-500">
                  WhyLog PM·백엔드 리드{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section id="faq" className="relative overflow-hidden grain py-32">
        <div className="relative max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <p className="text-[12px] tracking-[0.22em] font-bold text-primary-500 uppercase mb-4">
              FAQ
            </p>
            <h2 className="text-[40px] md:text-[48px] font-extrabold tracking-tighter2 text-ink-900 leading-[1.1]">
              자주 묻는 질문
            </h2>
          </div>

          <div className="reveal-stagger space-y-3">
            {[
              {
                q: "어떤 회의 도구와 연동되나요?",
                a: "자체 음성 회의 기능을 기본 제공합니다. Zoom, Google Meet 연동은 베타 단계로 곧 공개될 예정입니다.",
                open: true,
              },
              {
                q: "어떤 Git 플랫폼을 지원하나요?",
                a: "현재 GitHub 레포지토리 연동을 지원합니다. GitLab, Bitbucket 연동은 로드맵에 포함되어 있습니다.",
                open: false,
              },
              {
                q: "회의 데이터는 안전한가요?",
                a: "모든 데이터는 전송·저장 시 암호화되며, 팀 단위 접근 제어로만 접근할 수 있습니다. SOC2 준수를 진행 중입니다.",
                open: false,
              },
              {
                q: "무료로 사용할 수 있나요?",
                a: "5명 이하 소규모 팀은 무료로 시작할 수 있습니다. 카드 등록 없이 바로 사용할 수 있습니다.",
                open: false,
              },
            ].map((f) => (
              <details
                key={f.q}
                className="glass rounded-2xl px-6 py-5 group"
                {...(f.open ? { open: true } : {})}
              >
                <summary className="flex items-center justify-between gap-4">
                  <span className="text-[16px] font-semibold text-ink-900">
                    {f.q}
                  </span>
                  <span className="faq-icon w-7 h-7 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center text-[16px] font-bold">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-[14.5px] leading-[1.7] text-ink-500">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="relative overflow-hidden grain py-36 mesh-bg-strong alive">
        <div className="relative max-w-4xl mx-auto px-6 text-center reveal">
          <div className="relative mx-auto mb-10 w-[180px] h-[180px]">
            <div
              className="absolute -inset-12 rounded-full opacity-70"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(167,139,250,0.55), transparent 70%)",
                filter: "blur(28px)",
              }}
            />
            <div className="iri-sphere relative w-full h-full float-a" />
          </div>

          <h2 className="text-[44px] md:text-[64px] font-extrabold tracking-tighter2 text-ink-900 leading-[1.05]">
            지금, 첫 결정을 <span className="why-grad">기록해보세요</span>
          </h2>
          <p className="mt-6 text-[18px] text-ink-500 max-w-xl mx-auto leading-[1.65]">
            5분이면 팀 셋업이 끝납니다. 카드 등록 없이 무료로 체험해보세요.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={goSignup}
              className="btn-primary h-[56px] px-8 rounded-full text-[15px] font-semibold inline-flex items-center gap-2"
            >
              무료로 시작하기
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <title>화살표</title>
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="btn-ghost h-[56px] px-7 rounded-full text-[15px] font-semibold"
            >
              팀 데모 요청하기
            </button>
          </div>
          <p className="mt-7 text-[12.5px] text-ink-300">
            신용카드 없이 시작 · 5명까지 무료 · 1분 안에 회의 분석 시작
          </p>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative bg-white/60 backdrop-blur-xl border-t border-line-soft">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <LogoSymbol className="h-7" aria-hidden="true" />
              <LogoText className="h-6" aria-hidden="true" />
            </div>
            <p className="text-[14px] text-ink-500 leading-[1.7] max-w-s">
              회의에서 커밋까지, 의사결정 맥락을 추적하는 AI 협업 플랫폼
            </p>
            <p className="mt-6 text-[12px] text-ink-300">
              © 2026 WhyLog. Made with care for engineering teams.
            </p>
          </div>

          {[
            {
              title: "제품",
              items: ["기능", "가격", "변경사항", "로드맵"],
              start: "md:col-start-6",
            },
            {
              title: "리소스",
              items: ["문서", "블로그", "API", "사용 가이드"],
              start: "",
            },
            {
              title: "회사",
              items: ["팀 소개", "채용", "문의", "이용약관"],
              start: "",
            },
          ].map((col) => (
            <div
              key={col.title}
              className={`col-span-1 md:col-span-2 ${col.start}`}
            >
              <p className="text-[12px] font-semibold tracking-wider text-ink-300 uppercase mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5 text-[14px] text-ink-700">
                {col.items.map((i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-primary-500 transition">
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hairline" />
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[12px] text-ink-300">
            WhyLog · whylog1234@gmail.com
          </p>
          <div className="flex items-center gap-4 text-[12px] text-ink-300">
            <a href="#" className="hover:text-ink-700 transition">
              개인정보처리방침
            </a>
            <span className="text-line-soft">·</span>
            <a href="#" className="hover:text-ink-700 transition">
              이용약관
            </a>
            <span className="text-line-soft">·</span>
            <a href="#" className="hover:text-ink-700 transition">
              보안
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
