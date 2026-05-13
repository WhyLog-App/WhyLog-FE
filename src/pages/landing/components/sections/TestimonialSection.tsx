const TestimonialSection = () => (
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
            <p className="text-[13px] text-ink-500">WhyLog PM·백엔드 리드 </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialSection;
