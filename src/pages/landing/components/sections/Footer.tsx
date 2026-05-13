import LogoSymbol from "@/components/logo/LogoSymbol";
import LogoText from "@/components/logo/LogoText";
import { CONTACT_EMAIL, FOOTER_COLUMNS } from "../../constants";

const Footer = () => (
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

      {FOOTER_COLUMNS.map((col) => (
        <div key={col.id} className={`col-span-1 md:col-span-2 ${col.start}`}>
          <p className="text-[12px] font-semibold tracking-wider text-ink-300 uppercase mb-4">
            {col.title}
          </p>
          <ul className="space-y-2.5 text-[14px] text-ink-700">
            {col.items.map((i) => (
              <li key={i}>
                {/* biome-ignore lint/a11y/useValidAnchor: placeholder — 각 서브페이지 라우팅 미정 */}
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
      <p className="text-[12px] text-ink-300">WhyLog · {CONTACT_EMAIL}</p>
      <div className="flex items-center gap-4 text-[12px] text-ink-300">
        {/* biome-ignore lint/a11y/useValidAnchor: placeholder — 정책 페이지 라우팅 미정 */}
        <a href="#" className="hover:text-ink-700 transition">
          개인정보처리방침
        </a>
        <span className="text-line-soft">·</span>
        {/* biome-ignore lint/a11y/useValidAnchor: placeholder — 정책 페이지 라우팅 미정 */}
        <a href="#" className="hover:text-ink-700 transition">
          이용약관
        </a>
        <span className="text-line-soft">·</span>
        {/* biome-ignore lint/a11y/useValidAnchor: placeholder — 정책 페이지 라우팅 미정 */}
        <a href="#" className="hover:text-ink-700 transition">
          보안
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
