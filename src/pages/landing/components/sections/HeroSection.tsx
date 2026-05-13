import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import {
  HERO_IMAGE,
  HERO_STAR_COUNT,
  HERO_TYPEWRITER_SPEED,
  HERO_TYPEWRITER_START_DELAY,
} from "../../constants";
import HeroCursor from "../primitives/HeroCursor";
import Starfield from "../primitives/Starfield";
import Typewriter from "../primitives/Typewriter";

const HeroSection = () => {
  const navigate = useNavigate();
  const goSignup = () => navigate(ROUTES.SIGNUP);

  return (
    <section className="relative overflow-hidden grain mesh-bg alive hero-spotlight pt-30 pb-32">
      <HeroCursor />
      <Starfield count={HERO_STAR_COUNT} />

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
              speed={HERO_TYPEWRITER_SPEED}
              startDelay={HERO_TYPEWRITER_START_DELAY}
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
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#1E5BE8">
                  <title>재생</title>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              데모 영상 보기
            </button>
          </div>

          <div className="mt-14 flex items-center gap-x-7 gap-y-3 flex-wrap">
            <p className="text-[12px] text-ink-300 font-semibold tracking-[0.22em] uppercase">
              Powered by
            </p>
            <div className="flex items-center gap-x-6 gap-y-3 flex-wrap text-ink-500">
              <span className="inline-flex items-center gap-2 text-[14px] font-semibold">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </span>

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

              <span className="inline-flex items-center gap-2 text-[14px] font-semibold">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                  <title>Gemini</title>
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
  );
};

export default HeroSection;
