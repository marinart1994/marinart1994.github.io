"use client";

import { useEffect, useRef, useState } from "react";

type SpotId = "moon" | "wardrobe" | "lamp" | "gallery";

type TourStep = {
  kicker: string;
  title: string;
  copy: string;
  action: string;
  spot: SpotId | null;
};

const spots: Array<{
  id: SpotId;
  label: string;
  symbol: string;
  title: string;
  copy: string;
  x: string;
  y: string;
}> = [
  {
    id: "moon",
    label: "달빛 편지",
    symbol: "☾",
    title: "달빛 편지",
    copy: "오늘 마음에 오래 남은 장면 하나를 떠올려 보세요. 달빛은 작은 기억도 반짝이게 해요.",
    x: "48%",
    y: "16%",
  },
  {
    id: "wardrobe",
    label: "상상의 옷장",
    symbol: "✦",
    title: "상상의 옷장",
    copy: "문을 열면 오늘의 기분에 어울리는 이야기가 시작돼요. 어떤 색의 하루를 입고 싶나요?",
    x: "54.5%",
    y: "50%",
  },
  {
    id: "lamp",
    label: "꿈꾸는 램프",
    symbol: "☀",
    title: "꿈꾸는 램프",
    copy: "불을 켜고 잠깐 쉬어가세요. 서두르지 않아도 괜찮은, 당신만의 작은 빛이에요.",
    x: "85.2%",
    y: "56.5%",
  },
  {
    id: "gallery",
    label: "마음의 갤러리",
    symbol: "♡",
    title: "마음의 갤러리",
    copy: "완벽하지 않아 더 사랑스러운 것들을 모아 둔 벽이에요. 좋아하는 마음은 충분한 이유가 돼요.",
    x: "12.5%",
    y: "33%",
  },
];

const tourSteps: TourStep[] = [
  {
    kicker: "YOUR ROOM GUIDE",
    title: "안녕, 나는 우루야!",
    copy: "이 방에 숨은 네 개의 반짝이는 이야기를 안내해 줄게. 준비됐어?",
    action: "같이 둘러보기",
    spot: null,
  },
  {
    kicker: "STOP 01 · MOON",
    title: "저기 노란 달이 보여?",
    copy: "달빛 편지는 오늘의 작은 기억을 반짝이게 해. 마음에 남은 장면을 하나 떠올려 봐!",
    action: "다음 장소로",
    spot: "moon",
  },
  {
    kicker: "STOP 02 · WARDROBE",
    title: "이번엔 상상의 옷장이야",
    copy: "노란 문을 열면 오늘의 기분에 꼭 맞는 이야기가 시작될지도 몰라.",
    action: "램프 보러 가기",
    spot: "wardrobe",
  },
  {
    kicker: "STOP 03 · LAMP",
    title: "밤에는 이 빛을 따라와",
    copy: "꿈꾸는 램프는 서두르지 않아도 괜찮다고 말해 주는 작은 빛이야.",
    action: "마지막 장소로",
    spot: "lamp",
  },
  {
    kicker: "STOP 04 · GALLERY",
    title: "좋아하는 건 전부 걸어 둬",
    copy: "마음의 갤러리에는 완벽하지 않아 더 사랑스러운 것들이 모여 있어.",
    action: "안내 마치기",
    spot: "gallery",
  },
  {
    kicker: "TOUR COMPLETE",
    title: "이제 이 방은 네 공간이야!",
    copy: "마음에 드는 곳을 다시 눌러 보거나, 밤과 낮을 바꾸며 천천히 놀아 봐.",
    action: "한 번 더 둘러보기",
    spot: null,
  },
];

export default function Home() {
  const [activeSpot, setActiveSpot] = useState<SpotId | null>(null);
  const [night, setNight] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [guideExpanded, setGuideExpanded] = useState(true);
  const [compactLayout, setCompactLayout] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const active = spots.find((spot) => spot.id === activeSpot);
  const guide = tourSteps[guideStep];
  const storyIsMerged = Boolean(active && compactLayout && guideExpanded);

  const selectSpot = (spotId: SpotId) => {
    const nextStep = spots.findIndex((spot) => spot.id === spotId) + 1;
    setActiveSpot(spotId);
    setGuideStep(nextStep);
    setGuideExpanded(true);
  };

  const advanceGuide = () => {
    if (guideStep === tourSteps.length - 1) {
      setGuideStep(0);
      setActiveSpot(null);
      setNight(false);
      return;
    }

    const nextStep = guideStep + 1;
    const nextSpot = tourSteps[nextStep].spot;

    setGuideStep(nextStep);
    setActiveSpot(nextSpot);
    if (nextSpot === "lamp") setNight(true);
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const centerRoom = () => {
      if (window.innerWidth <= 760) {
        viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2;
      }
    };

    centerRoom();
    window.addEventListener("resize", centerRoom);
    return () => window.removeEventListener("resize", centerRoom);
  }, []);

  useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 1180px), (max-height: 720px)");
    const syncLayout = () => setCompactLayout(compactQuery.matches);

    syncLayout();
    compactQuery.addEventListener("change", syncLayout);
    return () => compactQuery.removeEventListener("change", syncLayout);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    if (!activeSpot || !viewport || !stage || viewport.scrollWidth <= viewport.clientWidth + 1) return;

    const target = stage.querySelector<HTMLElement>(`[data-spot="${activeSpot}"]`);
    if (!target) return;

    const targetCenter = target.offsetLeft + target.offsetWidth / 2;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const nextLeft = Math.min(maxScroll, Math.max(0, targetCenter - viewport.clientWidth / 2));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = window.requestAnimationFrame(() => {
      viewport.scrollTo({ left: nextLeft, behavior: reducedMotion ? "auto" : "smooth" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeSpot]);

  return (
    <main className={`room-page ${night ? "is-night" : ""} ${guideExpanded ? "guide-talking" : ""}`}>
      <div className="room-viewport" ref={viewportRef}>
        <div className="room-stage" id="room" aria-label="별빛 방 전경" ref={stageRef}>
          <picture>
            <source srcSet="/starlight-room.avif" type="image/avif" />
            <source srcSet="/starlight-room.webp" type="image/webp" />
            <img
              className="room-image"
              src="/starlight-room.png"
              width="1672"
              height="941"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              alt="달과 별, 알록달록한 그림으로 꾸며진 분홍빛 상상 속 방"
            />
          </picture>
          <div className="color-wash" aria-hidden="true" />
          <div className="lamp-glow" aria-hidden="true" />
          <div className="sparkles" aria-hidden="true">
            <i className="sparkle sparkle-one">✦</i>
            <i className="sparkle sparkle-two">✦</i>
            <i className="sparkle sparkle-three">✦</i>
            <i className="sparkle sparkle-four">✦</i>
          </div>

          {spots.map((spot, index) => (
            <button
              key={spot.id}
              className={`hotspot ${activeSpot === spot.id ? "is-active" : ""}`}
              data-spot={spot.id}
              style={{ left: spot.x, top: spot.y, animationDelay: `${index * 0.35}s` }}
              type="button"
              onClick={() => selectSpot(spot.id)}
              aria-label={`${spot.label} 열기`}
            >
              <span className="hotspot-ring" />
              <span className="hotspot-dot">{spot.symbol}</span>
              <span className="hotspot-label">{spot.label}</span>
            </button>
          ))}
        </div>
      </div>

      <header className="topbar">
        <a className="brand" href="#room" aria-label="별빛 방 처음으로">
          <span className="brand-mark">✦</span>
          <span>별빛 방</span>
        </a>
        <p className="room-status">
          <span /> 지금은 상상하는 시간
        </p>
        <button
          className="mode-toggle"
          type="button"
          onClick={() => setNight((value) => !value)}
          aria-pressed={night}
          aria-label={night ? "낮 모드로 보기" : "밤 모드로 보기"}
        >
          <span aria-hidden="true">{night ? "☀" : "☾"}</span>
          {night ? "낮으로" : "밤으로"}
        </button>
      </header>

      <section className={`welcome-card ${active || guideExpanded ? "is-hidden" : ""}`} aria-label="별빛 방 소개">
        <p className="eyebrow">WELCOME TO MY LITTLE UNIVERSE</p>
        <h1>
          오늘도,
          <br />
          마음껏 상상해
        </h1>
        <p className="welcome-copy">
          달빛이 번지고 색깔이 말을 거는 곳.
          <br /> 반짝이는 네 곳을 찾아 눌러보세요.
        </p>
        <button className="explore-button" type="button" onClick={() => selectSpot("moon")}>
          첫 번째 별 찾기 <span aria-hidden="true">↗</span>
        </button>
      </section>

      <aside
        className={`story-card ${active && !storyIsMerged ? "is-open" : ""}`}
        aria-live="polite"
        aria-hidden={!active || storyIsMerged}
      >
        {active && (
          <>
            <button className="close-button" type="button" onClick={() => setActiveSpot(null)} aria-label="닫기">
              ×
            </button>
            <p className="story-number">0{spots.findIndex((spot) => spot.id === active.id) + 1} / 04</p>
            <span className="story-symbol" aria-hidden="true">{active.symbol}</span>
            <h2>{active.title}</h2>
            <p>{active.copy}</p>
            <div className="story-footer">
              <span>천천히 머물러도 좋아요</span>
              <button
                type="button"
                onClick={() => {
                  const current = spots.findIndex((spot) => spot.id === active.id);
                  selectSpot(spots[(current + 1) % spots.length].id);
                }}
              >
                다음 발견 <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        )}
      </aside>

      <div className={`room-guide ${guideStep > 0 ? "is-touring" : ""} ${guideExpanded ? "is-speaking" : ""}`}>
        {guideExpanded && (
          <section className="guide-bubble" aria-live="polite" aria-label="우루의 방 안내">
            <button
              className="guide-close"
              type="button"
              onClick={() => setGuideExpanded(false)}
              aria-label="우루 안내 접기"
            >
              ×
            </button>
            <div className="guide-mobile-header" aria-hidden="true">
              <span className="guide-mobile-avatar">
                <picture>
                  <source srcSet="/axolotl-guide.avif" type="image/avif" />
                  <img src="/axolotl-guide.webp" width="768" height="768" decoding="async" alt="" />
                </picture>
              </span>
              <span>우루의 방 안내</span>
            </div>
            <p className="guide-kicker">{guide.kicker}</p>
            <h2>{guide.title}</h2>
            <p className="guide-copy">{guide.copy}</p>
            <div className="guide-actions">
              <div className="guide-progress" aria-label={`안내 ${guideStep + 1}단계, 총 ${tourSteps.length}단계`}>
                {tourSteps.map((step, index) => (
                  <span key={step.kicker} className={index === guideStep ? "is-current" : ""} />
                ))}
              </div>
              <button className="guide-next" type="button" onClick={advanceGuide}>
                {guide.action} <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        )}

        <button
          className="guide-character"
          type="button"
          onClick={() => setGuideExpanded((value) => !value)}
          aria-expanded={guideExpanded}
          aria-label={guideExpanded ? "우루 안내 접기" : "우루와 방 둘러보기"}
        >
          <span className="guide-name">우루 · ROOM GUIDE</span>
          <picture>
            <source srcSet="/axolotl-guide.avif" type="image/avif" />
            <img
              src="/axolotl-guide.webp"
              width="768"
              height="768"
              loading="eager"
              decoding="async"
              alt="웃으며 별빛 방을 안내하는 우파루파 우루"
            />
          </picture>
        </button>
      </div>

      <div className="drag-hint" aria-hidden="true">
        <span>←</span> 방을 밀어 둘러보세요 <span>→</span>
      </div>

      <p className="signature">ROOM № 08 · DREAMS NEVER CLOSE</p>
    </main>
  );
}
