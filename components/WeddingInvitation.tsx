"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const fallbackSlides = [
  "/uploads/IMG_0234.JPEG",
  "/uploads/IMG_0233.JPEG",
  "/uploads/IMG_0236.JPEG",
  "/uploads/IMG_0235.JPEG",
  "/uploads/IMG_0239.JPEG",
  "/uploads/IMG_0238.JPEG",
  "/uploads/IMG_0223.JPEG",
];

const slideChromeColors = [
  "#2e5882",
  "#294f7b",
  "#31537c",
  "#335a84",
  "#245081",
  "#204e81",
  "#355983",
];

const sections = [
  "Welcome",
  "Invitation",
  "Ceremony",
  "Registry",
  "RSVP",
  "Together",
];
const weddingDate = new Date("2027-08-27T00:00:00").getTime();

type Countdown = {
  days: string;
  hours: string;
  mins: string;
  secs: string;
};

type RsvpStatus = "pending" | "accepted" | "rejected";

type Invitee = {
  id: string;
  fullName?: string;
  status?: RsvpStatus;
};

type InvitationResponse = {
  invitationCode?: string;
  invitees?: Invitee[];
};

const API_BASE_URL = "https://api.mywedding.events";

function getCountdown(): Countdown {
  const remaining = Math.max(weddingDate - Date.now(), 0);
  const totalSeconds = Math.floor(remaining / 1000);
  const pad = (value: number) => value.toString().padStart(2, "0");

  return {
    days: pad(Math.floor(totalSeconds / 86400)),
    hours: pad(Math.floor((totalSeconds % 86400) / 3600)),
    mins: pad(Math.floor((totalSeconds % 3600) / 60)),
    secs: pad(totalSeconds % 60),
  };
}

function ChurchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21 3v9m-4-5h8M10 38V20l11-8 11 8v18M5 38h32M17 38V27h8v11M13 23h3m10 0h3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="42"
      viewBox="0 0 32 42"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 3v36M6 14h20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CelebrationIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m10 7 5 12c1.6 3.8-.2 8.1-4 9.7s-8.1-.2-9.7-4L.5 22.8M5 38l6-9.3M2 38h7M32 7l-5 12c-1.6 3.8.2 8.1 4 9.7s8.1-.2 9.7-4l.8-1.9M37 38l-6-9.3M33 38h7M14.5 14h-7m20 0h7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GroomIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 5 21 11 28 5l7 7-4 5v20H11V17l-4-5 7-7Zm0 0 2 13 5-7 5 7 2-13M21 11v26m-3-12h6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrideIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17 5c0 3 1.2 5.2 4 7 2.8-1.8 4-4 4-7M17 5h8l2 12 9 20H6l9-20 2-12Zm-2 12c3.8 2.2 8.2 2.2 12 0M12 25c5.8 3 12.2 3 18 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ITINERARY_VIEWBOX_WIDTH = 440;
const ITINERARY_VIEWBOX_HEIGHT = 1000;
const itineraryRoute =
  "M 220 24 C 270 38, 315 52, 315 115 C 315 210, 125 205, 125 310 C 125 420, 315 405, 315 520 C 315 635, 125 620, 125 750 C 125 840, 245 860, 205 910";

function WeddingJourney({ id }: { id: string }) {
  const routeContainerRef = useRef<HTMLDivElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const routeContainer = routeContainerRef.current;
    const routePath = routePathRef.current;
    const heart = heartRef.current;
    if (!routeContainer || !routePath || !heart) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    let journeyTop = 0;
    let journeyHeight = 0;
    const routeLength = routePath.getTotalLength();
    const journeySection = routeContainer.closest("section");

    const placeHeart = (progress: number) => {
      const point = routePath.getPointAtLength(routeLength * progress);
      heart.style.left = `${(point.x / ITINERARY_VIEWBOX_WIDTH) * 100}%`;
      heart.style.top = `${(point.y / ITINERARY_VIEWBOX_HEIGHT) * 100}%`;
    };

    const measure = () => {
      if (!journeySection) return;
      journeyTop = (journeySection as HTMLElement).offsetTop;
      journeyHeight = (journeySection as HTMLElement).offsetHeight;
    };

    const update = () => {
      frame = 0;
      if (reducedMotion) {
        placeHeart(0.06);
        return;
      }

      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const progress = Math.max(
        0,
        Math.min(
          1,
          (window.scrollY - journeyTop) /
            Math.max(journeyHeight - viewportHeight, 1),
        ),
      );
      placeHeart(progress);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const measureAndUpdate = () => {
      measure();
      scheduleUpdate();
    };

    measureAndUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measureAndUpdate);
    const resizeObserver = new ResizeObserver(measureAndUpdate);
    resizeObserver.observe(journeySection ?? routeContainer);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measureAndUpdate);
      resizeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id={id}
      className="relative flex min-h-svh flex-col items-center overflow-hidden px-4 pb-[110px] pt-[76px] text-center min-[390px]:px-5 min-[390px]:pb-[120px] min-[390px]:pt-24"
      data-screen-label="03 Ceremony"
    >
      <div className="w-full max-w-[700px]">
        <header className="relative z-10 mx-auto w-full max-w-[430px]">
          <p className="reveal text-shadow-wedding text-[12px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
            Our wedding day
          </p>
          <h2 className="reveal text-shadow-wedding font-script mt-2 text-[clamp(48px,13vw,68px)] leading-[1.04] text-[var(--ink)]">
            September 2027
          </h2>
          <div
            className="reveal mx-auto mt-5 grid max-w-[330px] grid-cols-5 items-center text-[14px] tracking-[0.16em] text-[var(--ink-soft)]"
            aria-label="Wedding date: September 18, 2027"
          >
            <span>25</span>
            <span>26</span>
            <span aria-hidden="true" />
            <span>28</span>
            <span>29</span>
          </div>
        </header>

        <div
          ref={routeContainerRef}
          className="relative mx-auto -mt-8 h-[1120px] w-full min-[700px]:h-[1200px]"
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox={`0 0 ${ITINERARY_VIEWBOX_WIDTH} ${ITINERARY_VIEWBOX_HEIGHT}`}
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              ref={routePathRef}
              d={itineraryRoute}
              stroke="var(--gold-line)"
              strokeWidth="1.6"
              strokeDasharray="5 8"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div
            ref={heartRef}
            className="pointer-events-none absolute z-20 h-[48px] w-[52px] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_3px_9px_rgba(30,18,10,0.4)]"
            style={{ left: "50%", top: "2.4%" }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 52 48" className="h-full w-full">
              <path
                d="M26 45C21.7 40.5 5 28.7 5 15.8 5 8.9 9.9 4 16.4 4c4.1 0 7.7 2.2 9.6 5.7C27.9 6.2 31.5 4 35.6 4 42.1 4 47 8.9 47 15.8 47 28.7 30.3 40.5 26 45Z"
                fill="var(--gold)"
                stroke="var(--ink)"
                strokeWidth="1"
              />
              <text
                x="26"
                y="23"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#3a2615"
                fontFamily="var(--serif)"
                fontSize="16"
                fontWeight="600"
              >
                27
              </text>
            </svg>
          </div>

          <article className="reveal absolute left-0 top-[8%] z-10 w-[42%] pr-2 text-right min-[700px]:pr-8">
            <GroomIcon className="ml-auto h-9 w-9 text-[var(--ink)] drop-shadow-[0_2px_8px_rgba(30,18,10,0.45)] min-[390px]:h-10 min-[390px]:w-10" />
            <p className="text-shadow-wedding mt-2 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)]">
              Groom House
            </p>
            <h3 className="text-shadow-wedding mt-1 text-[clamp(18px,4.8vw,23px)] font-semibold leading-tight text-[var(--ink)]">
              Jbeil
            </h3>
          </article>

          <article className="reveal absolute right-0 top-[29%] z-10 w-[42%] pl-2 text-left min-[700px]:pl-8">
            <BrideIcon className="h-9 w-9 text-[var(--ink)] drop-shadow-[0_2px_8px_rgba(30,18,10,0.45)] min-[390px]:h-10 min-[390px]:w-10" />
            <p className="text-shadow-wedding mt-2 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)]">
              Bride House
            </p>
            <h3 className="text-shadow-wedding mt-1 text-[clamp(18px,4.8vw,23px)] font-semibold leading-tight text-[var(--ink)]">
              Zouk
            </h3>
          </article>

          <article className="reveal absolute left-0 top-[51%] z-10 w-[42%] pr-2 text-right min-[700px]:pr-8">
            <ChurchIcon className="ml-auto h-9 w-9 text-[var(--ink)] drop-shadow-[0_2px_8px_rgba(30,18,10,0.45)] min-[390px]:h-10 min-[390px]:w-10" />
            <p className="text-shadow-wedding mt-2 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)]">
              Wedding Ceremony
            </p>
            <h3 className="text-shadow-wedding mt-1 text-[clamp(18px,4.8vw,23px)] font-semibold leading-tight text-[var(--ink)]">
              Jardin de Stone
            </h3>
            <p className="text-shadow-wedding mt-1 text-[14px] italic text-[var(--ink-soft)]">
              September 18 · 6 pm
            </p>
            <a
              className="mt-3 inline-block min-h-11 py-2 text-[13px] uppercase tracking-[0.14em] text-[var(--ink)] underline decoration-[var(--gold-line)] underline-offset-4 transition-colors hover:text-[var(--gold)]"
              href="https://maps.app.goo.gl/KPi5reeZBWoViTYx7"
              target="_blank"
              rel="noopener noreferrer"
            >
              Map
            </a>
          </article>

          <article className="reveal absolute right-0 top-[74%] z-10 w-[42%] pl-2 text-left min-[700px]:pl-8">
            <CelebrationIcon className="h-9 w-9 text-[var(--ink)] drop-shadow-[0_2px_8px_rgba(30,18,10,0.45)] min-[390px]:h-10 min-[390px]:w-10" />
            <p className="text-shadow-wedding mt-2 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)]">
              Celebration &amp; Party
            </p>
            <h3 className="text-shadow-wedding mt-1 text-[clamp(18px,4.8vw,23px)] font-semibold leading-tight text-[var(--ink)]">
              Jardin de Stone
            </h3>
            <p className="text-shadow-wedding mt-1 text-[14px] italic text-[var(--ink-soft)]">
              Welcome drink · 7:30 pm
              <br />
              Party · 8:30 pm
            </p>
            <a
              className="mt-3 inline-block min-h-11 py-2 text-[13px] uppercase tracking-[0.14em] text-[var(--ink)] underline decoration-[var(--gold-line)] underline-offset-4 transition-colors hover:text-[var(--gold)]"
              href="https://maps.app.goo.gl/KPi5reeZBWoViTYx7"
              target="_blank"
              rel="noopener noreferrer"
            >
              Map
            </a>
          </article>

          <div className="reveal absolute bottom-0 left-1/2 z-10">
            <p className="text-shadow-wedding -translate-x-1/2 whitespace-nowrap font-script text-[clamp(34px,9vw,48px)] text-[var(--ink)]">
              Celebrate with us
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

function RsvpButton({
  label,
  variant,
  active,
  onClick,
}: {
  label: string;
  variant: "accept" | "decline";
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`inline-flex min-w-[82px] cursor-pointer items-center justify-center rounded-[2px] border px-[13px] py-[9px] font-serif-wedding text-xs uppercase tracking-[0.08em] transition duration-300 active:scale-95 ${
        active
          ? variant === "accept"
            ? "border-transparent bg-[oklch(0.82_0.075_78/0.9)] font-semibold text-[#3a2615]"
            : "border-transparent bg-[rgba(252,246,238,0.92)] font-semibold text-[#4a3220]"
          : "border-[var(--gold-line)] bg-white/[0.04] text-[var(--ink)] hover:border-[var(--ink)] hover:bg-white/[0.14]"
      }`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

const STARTUP_TIMEOUT_MS = 6000;

function waitForWindowLoad(signal: AbortSignal) {
  if (document.readyState === "complete") return Promise.resolve();

  return new Promise<void>((resolve) => {
    const done = () => resolve();
    window.addEventListener("load", done, { once: true, signal });
  });
}

function waitForStylesheet(link: HTMLLinkElement, signal: AbortSignal) {
  if (link.sheet) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const done = () => resolve();
    link.addEventListener("load", done, { once: true, signal });
    link.addEventListener("error", done, { once: true, signal });
  });
}

async function waitForPageAssets(signal: AbortSignal) {
  const stylesheetLinks = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel~="stylesheet"]'),
  );
  const ready = async () => {
    await Promise.all([
      waitForWindowLoad(signal),
      ...stylesheetLinks.map((link) => waitForStylesheet(link, signal)),
    ]);
    if ("fonts" in document) await document.fonts.ready;
  };
  const timeout = new Promise<void>((resolve) =>
    window.setTimeout(resolve, STARTUP_TIMEOUT_MS),
  );

  await Promise.race([ready(), timeout]);
}

export default function WeddingInvitation({
  invitationCode,
  imageSources,
}: {
  invitationCode?: string;
  imageSources: string[];
}) {
  const slides = imageSources.length > 0 ? imageSources : fallbackSlides;
  const [appReady, setAppReady] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [countdown, setCountdown] = useState<Countdown>({
    days: "00",
    hours: "00",
    mins: "00",
    secs: "00",
  });
  const [activeSection, setActiveSection] = useState(0);
  const [cueHidden, setCueHidden] = useState(false);
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [rsvps, setRsvps] = useState<Record<string, RsvpStatus>>({});
  const [invitationLoading, setInvitationLoading] = useState(false);
  const [invitationError, setInvitationError] = useState("");
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const lockRef = useRef(false);
  const currentRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);
  const touchScrollingJourneyRef = useRef(false);
  const sectionIds = useMemo(
    () => sections.map((_, index) => `section-${index + 1}`),
    [],
  );
  const activeChromeColor =
    slideChromeColors[activeSlide] ?? slideChromeColors[0] ?? "#2e5882";
  const normalizedInvitationCode = invitationCode?.trim();

  useEffect(() => {
    const controller = new AbortController();

    waitForPageAssets(controller.signal)
      .catch(() => undefined)
      .then(() => {
        if (controller.signal.aborted) return;
        document.body.style.visibility = "visible";
        setAppReady(true);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!appReady) return;

    const slideTimer = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % slides.length);
    }, 3000);
    setCountdown(getCountdown());
    const countdownTimer = window.setInterval(
      () => setCountdown(getCountdown()),
      1000,
    );

    return () => {
      window.clearInterval(slideTimer);
      window.clearInterval(countdownTimer);
    };
  }, [appReady]);

  useEffect(() => {
    if (!appReady) return;

    const themeColorMeta =
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]') ??
      document.head.appendChild(document.createElement("meta"));

    themeColorMeta.name = "theme-color";
    themeColorMeta.content = activeChromeColor;
    document.documentElement.style.setProperty(
      "--slide-chrome-color",
      activeChromeColor,
    );
    document.documentElement.style.backgroundColor = activeChromeColor;
    document.body.style.backgroundColor = activeChromeColor;
  }, [activeChromeColor, appReady]);

  useEffect(() => {
    if (!appReady) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const dotButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-dot]"),
    );

    const revealSection = (section: HTMLElement) => {
      if (section.dataset.revealed === "true") return;
      section.dataset.revealed = "true";
      if (reducedMotion) return;

      section
        .querySelectorAll<HTMLElement>(".reveal")
        .forEach((element, index) => {
          const delay = Math.min(index, 5) * 90;
          element.classList.add("go");
          element.style.transitionDelay = `${delay}ms`;
          window.requestAnimationFrame(() => element.classList.remove("pre"));
          window.setTimeout(() => {
            element.style.transition = "none";
            element.style.transitionDelay = "0ms";
            element.classList.remove("pre");
            element.style.opacity = "1";
            element.style.transform = "none";
          }, 900 + delay);
        });
    };

    if (!reducedMotion) {
      document
        .querySelectorAll(".reveal")
        .forEach((element) => element.classList.add("pre"));
    }

    const syncActiveSection = () => {
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      let best = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      sectionElements.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(
          rect.top + rect.height / 2 - viewportHeight / 2,
        );
        if (distance < bestDistance) {
          best = index;
          bestDistance = distance;
        }
      });

      currentRef.current = best;
      setActiveSection(best);
    };

    const revealVisibleSections = () => {
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      sectionElements.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (
          rect.top < viewportHeight * 0.85 &&
          rect.bottom > viewportHeight * 0.15
        )
          revealSection(section);
      });
      syncActiveSection();
    };

    const goTo = (index: number) => {
      const next = Math.max(0, Math.min(sectionElements.length - 1, index));
      if (next === currentRef.current && lockRef.current) return;
      currentRef.current = next;
      lockRef.current = true;
      revealSection(sectionElements[next]);
      setActiveSection(next);
      window.scrollTo({
        top: sectionElements[next].offsetTop,
        behavior: reducedMotion ? "auto" : "smooth",
      });
      window.setTimeout(() => {
        lockRef.current = false;
      }, 760);
    };

    const canScrollInsideJourney = (direction: number) => {
      const journey = sectionElements[2];
      if (!journey) return false;
      const top = journey.offsetTop;
      const bottom = top + journey.offsetHeight;
      const viewportBottom = window.scrollY + window.innerHeight;

      return direction > 0
        ? window.scrollY >= top - 2 && viewportBottom < bottom - 2
        : viewportBottom <= bottom + 2 && window.scrollY > top + 2;
    };

    const onWheel = (event: WheelEvent) => {
      if (canScrollInsideJourney(event.deltaY)) return;
      event.preventDefault();
      if (lockRef.current) return;
      if (event.deltaY > 8) goTo(currentRef.current + 1);
      if (event.deltaY < -8) goTo(currentRef.current - 1);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        if (canScrollInsideJourney(1)) return;
        event.preventDefault();
        goTo(currentRef.current + 1);
      } else if (["ArrowUp", "PageUp"].includes(event.key)) {
        if (canScrollInsideJourney(-1)) return;
        event.preventDefault();
        goTo(currentRef.current - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(sectionElements.length - 1);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartRef.current = event.touches[0]?.clientY ?? null;
      touchScrollingJourneyRef.current = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      if (touchStartRef.current !== null && currentY !== undefined) {
        const direction = touchStartRef.current - currentY;
        if (canScrollInsideJourney(direction)) {
          touchScrollingJourneyRef.current = true;
          return;
        }
      }
      event.preventDefault();
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartRef.current === null || lockRef.current) return;
      if (touchScrollingJourneyRef.current) {
        touchStartRef.current = null;
        touchScrollingJourneyRef.current = false;
        return;
      }
      const distance =
        touchStartRef.current -
        (event.changedTouches[0]?.clientY ?? touchStartRef.current);
      if (Math.abs(distance) > 40)
        goTo(currentRef.current + (distance > 0 ? 1 : -1));
      touchStartRef.current = null;
    };

    const onResize = () => {
      syncActiveSection();
      if (currentRef.current !== 2)
        window.scrollTo({
          top: sectionElements[currentRef.current]?.offsetTop ?? 0,
        });
      revealVisibleSections();
    };

    const onScroll = () => {
      setCueHidden(window.scrollY > 40);
      revealVisibleSections();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    const onDotClick = (event: Event) => {
      const index = Number(
        (event.currentTarget as HTMLButtonElement).dataset.index ?? "0",
      );
      goTo(index);
    };

    dotButtons.forEach((button) =>
      button.addEventListener("click", onDotClick),
    );

    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting)
              revealSection(entry.target as HTMLElement);
          });
          syncActiveSection();
        },
        { threshold: [0, 0.2, 0.6] },
      );
      sectionElements.forEach((section) => observer?.observe(section));
    }

    revealVisibleSections();
    const firstFallback = window.setTimeout(revealVisibleSections, 200);
    const secondFallback = window.setTimeout(revealVisibleSections, 800);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      dotButtons.forEach((button) =>
        button.removeEventListener("click", onDotClick),
      );
      observer?.disconnect();
      window.clearTimeout(firstFallback);
      window.clearTimeout(secondFallback);
    };
  }, [appReady, sectionIds]);

  useEffect(() => {
    if (!normalizedInvitationCode) {
      setInvitees([]);
      setRsvps({});
      setInvitationError("");
      setConfirmed(false);
      return;
    }

    const controller = new AbortController();

    setInvitationLoading(true);
    setInvitationError("");
    setRsvpError("");
    setConfirmed(false);

    fetch(
      `${API_BASE_URL}/api/invitations/${encodeURIComponent(
        normalizedInvitationCode,
      )}`,
      { signal: controller.signal },
    )
      .then(async (response) => {
        if (!response.ok) {
          const fallbackMessage = `Invitation code "${normalizedInvitationCode}" was not found.`;
          const errorBody = (await response
            .json()
            .catch(() => undefined)) as { message?: string } | undefined;
          throw new Error(errorBody?.message ?? fallbackMessage);
        }

        return response.json() as Promise<InvitationResponse>;
      })
      .then((invitation) => {
        const fetchedInvitees = invitation.invitees ?? [];
        setInvitees(fetchedInvitees);
        setRsvps(
          Object.fromEntries(
            fetchedInvitees.map((invitee) => [
              invitee.id,
              invitee.status ?? "pending",
            ]),
          ),
        );
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setInvitees([]);
        setRsvps({});
        setInvitationError(
          error instanceof Error
            ? error.message
            : "Unable to load this invitation.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setInvitationLoading(false);
      });

    return () => controller.abort();
  }, [normalizedInvitationCode]);

  const selectRsvp = (inviteeId: string, value: RsvpStatus) => {
    setConfirmed(false);
    setRsvpError("");
    setRsvps((current) => ({ ...current, [inviteeId]: value }));
  };

  const submitRsvps = async () => {
    if (!normalizedInvitationCode || invitees.length === 0) return;

    setSubmittingRsvp(true);
    setConfirmed(false);
    setRsvpError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/invitations/${encodeURIComponent(
          normalizedInvitationCode,
        )}/rsvp`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invitees: invitees.map((invitee) => ({
              inviteeId: invitee.id,
              status: rsvps[invitee.id] ?? "pending",
            })),
          }),
        },
      );

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => undefined)) as
          | { message?: string }
          | undefined;
        throw new Error(errorBody?.message ?? "Unable to submit your RSVP.");
      }

      const updatedInvitation =
        (await response.json()) as InvitationResponse;
      const updatedInvitees = updatedInvitation.invitees ?? invitees;
      setInvitees(updatedInvitees);
      setRsvps(
        Object.fromEntries(
          updatedInvitees.map((invitee) => [
            invitee.id,
            invitee.status ?? "pending",
          ]),
        ),
      );
      setConfirmed(true);
    } catch (error) {
      setRsvpError(
        error instanceof Error ? error.message : "Unable to submit your RSVP.",
      );
    } finally {
      setSubmittingRsvp(false);
    }
  };

  return (
    <>
      <div
        className="bg-fallback fixed inset-0 z-0"
        style={{ backgroundColor: activeChromeColor }}
        aria-hidden="true"
      >
        {slides.map((slide, index) => (
          <Image
            key={slide}
            src={slide}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover object-[center_30%] transition-opacity duration-[1600ms] ease-in-out ${
              activeSlide === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(180deg,rgba(44,28,18,0.30)_0%,rgba(48,30,20,0.22)_40%,rgba(40,24,16,0.34)_100%)] before:absolute before:inset-0 before:bg-[radial-gradient(130%_100%_at_50%_0%,rgba(58,38,24,0.12),transparent_45%)] after:absolute after:inset-0 after:bg-[radial-gradient(120%_120%_at_50%_120%,rgba(40,24,14,0.38),transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1] shadow-[inset_0_0_180px_25px_rgba(30,18,10,0.32)]"
        aria-hidden="true"
      />

      <main className="relative z-[2]">
        <section
          id={sectionIds[0]}
          className="relative flex min-h-svh flex-col items-center justify-center px-7 pb-[120px] pt-24 text-center"
          data-screen-label="01 Welcome"
        >
          <div className="w-full max-w-[430px]">
            <h1 className="reveal text-shadow-wedding font-script my-[0.12em] pb-[0.08em] text-[clamp(58px,16vw,88px)] leading-[1.08] text-[var(--ink)]">
              George
              <br />
              &amp;
              <br />
              Joey
            </h1>
            <p className="reveal text-shadow-wedding font-serif-wedding text-[clamp(22px,6vw,30px)] italic leading-tight text-(--ink)">
              Are getting married!
            </p>
            <div className="wedding-rule reveal" />
            <p className="reveal text-shadow-wedding text-[15px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
              Friday · September 18 · 2027
            </p>
            <div className="reveal mt-[34px] flex justify-center gap-3.5">
              {[
                ["Days", countdown.days],
                ["Hours", countdown.hours],
                ["Mins", countdown.mins],
                ["Secs", countdown.secs],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex min-w-[62px] flex-col items-center"
                >
                  <span className="text-shadow-wedding [font-variant-numeric:tabular-nums] text-[clamp(40px,11vw,52px)] font-medium leading-none text-[var(--ink)]">
                    {value}
                  </span>
                  <span className="mt-[9px] text-[11px] uppercase tracking-[0.26em] text-[var(--ink-soft)]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button
            className={`text-shadow-wedding absolute bottom-[46px] left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-[var(--ink-soft)] transition-opacity duration-500 ${cueHidden ? "opacity-0" : "opacity-100"}`}
            type="button"
            onClick={() =>
              document
                .getElementById(sectionIds[1])
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className="text-[13px] uppercase tracking-[0.3em]">
              Scroll
            </span>
            <svg
              className="animate-bob"
              width="22"
              height="13"
              viewBox="0 0 22 13"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1l10 10L21 1"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </section>

        <section
          id={sectionIds[1]}
          className="flex min-h-svh flex-col items-center justify-center px-7 pb-[120px] pt-24 text-center"
          data-screen-label="02 Invitation"
        >
          <div className="w-full max-w-[430px]">
            <CrossIcon className="reveal mx-auto mb-5 h-10 w-8 text-[var(--gold)] drop-shadow-[0_2px_8px_rgba(30,18,10,0.45)]" />
            <p className="reveal text-shadow-wedding text-[clamp(19px,5.2vw,22px)] italic leading-[1.7] text-[var(--ink)]">
              &quot;Therefore what God has joined together, let no one separate&quot;
            </p>
            <p className="reveal text-shadow-wedding mt-2.5 text-[15px] tracking-[0.16em] text-[var(--ink-soft)]">
              — Mark 10:9 —
            </p>
            <div className="wedding-rule reveal" />
            <p className="reveal text-shadow-wedding font-script text-[clamp(42px,11vw,58px)] leading-[1.05] text-(--ink)">
              George
              <br />
              &amp; 
              <br />
              Joey
            </p>
            <p className="reveal text-shadow-wedding text-[clamp(18px,4.8vw,21px)] font-semibold leading-[1.75] text-[var(--ink)]">
              Together with their families
            </p>
            <p className="reveal text-shadow-wedding text-[clamp(18px,4.8vw,21px)] leading-[1.75] text-[var(--ink)]">
              Joyfully invite you to celebrate with them <br /> Their Big Day.
            </p>
            <p className="reveal text-shadow-wedding text-[clamp(18px,4.8vw,21px)] leading-[1.75] text-[var(--ink)]">
              Friday, 18 September 2027
            </p>
          </div>
        </section>

        <WeddingJourney id={sectionIds[2]} />

        <section
          id={sectionIds[3]}
          className="flex min-h-svh flex-col items-center justify-center px-7 py-12 text-center min-[390px]:pb-[120px] min-[390px]:pt-24 max-[380px]:px-5 max-[380px]:py-8 max-[380px]:min-h-dvh"
          data-screen-label="04 Registry"
        >
          <div className="flex w-full max-w-[430px] flex-col items-center">
            <h2 className="reveal text-shadow-wedding font-script text-[clamp(42px,12vw,64px)] leading-[1.04] text-(--ink)">
              Gift Registry
            </h2>
            <div className="wedding-rule reveal my-4 max-[380px]:my-3" />
            <div className="reveal relative w-full overflow-hidden rounded-[3px] border border-(--gold-line) bg-[rgba(76,49,33,0.42)] px-5 py-6 shadow-[0_16px_48px_rgba(24,14,8,0.3)] backdrop-blur-[2px] before:pointer-events-none before:absolute before:inset-[6px] before:border before:border-[rgba(252,246,238,0.16)] min-[390px]:px-6 min-[390px]:py-7 max-[380px]:px-4 max-[380px]:py-5">
              <p className="relative text-shadow-wedding text-[clamp(17px,4.6vw,21px)] italic leading-[1.55] text-(--ink) min-[390px]:leading-[1.75]">
                Your presence is enough of a present to us!
                <br />
                For those who desire, a registry is available at:
              </p>
              <div className="wedding-rule relative my-4 min-[390px]:my-5" />
              <div className="relative text-shadow-wedding">
                <div className="mb-1.5 text-[clamp(19px,5vw,22px)] font-semibold tracking-[0.06em] text-(--ink) min-[390px]:mb-2">
                  UAE Emirates NBD
                </div>
                <p className="font-registry-numbers text-[clamp(15px,4vw,17px)] leading-7 tracking-[0.04em] text-(--ink) min-[390px]:leading-8">
                  Joe Antoine Sawaya
                </p>
                <p className="font-registry-numbers text-[clamp(15px,4vw,17px)] leading-7 tracking-[0.04em] text-(--ink) min-[390px]:leading-8">
                  Ac #0125846129002
                </p>
                <p className="font-registry-numbers whitespace-nowrap text-[clamp(11px,3.35vw,16px)] leading-7 tracking-[0.01em] text-(--ink) min-[390px]:leading-8">
                  IBAN AE10 0260 0001 2584 6129 002
                </p>
              </div>
              <div className="wedding-diamond relative my-5 min-[390px]:my-6" />
              <div className="relative text-shadow-wedding">
                <div className="mb-1.5 text-[clamp(19px,5vw,22px)] font-semibold tracking-[0.06em] text-(--ink) min-[390px]:mb-2">
                  Whish Money
                </div>
                <p className="font-registry-numbers whitespace-pre-line text-[clamp(15px,4vw,17px)] leading-7 tracking-[0.04em] text-(--ink) min-[390px]:leading-8">
                  Personal Account{`\n`}Phone number: +971 558951417
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id={sectionIds[4]}
          className="flex min-h-svh flex-col items-center justify-center px-7 pb-[120px] pt-24 text-center"
          data-screen-label="05 RSVP"
        >
          <div className="w-full max-w-[430px]">
            <h2 className="reveal text-shadow-wedding font-script text-[clamp(46px,13vw,64px)] leading-[1.04] text-[var(--ink)]">
              Kindly RSVP
            </h2>
            <p className="reveal text-shadow-wedding mt-1.5 text-[15px] tracking-[0.14em] text-[var(--ink-soft)]">
              Please confirm by July 1, 2027
            </p>
            <div className="wedding-rule reveal" />
            <p className="reveal text-shadow-wedding my-1.5 mb-[18px] text-[17px] tracking-[0.04em] text-[var(--ink-soft)]">
              Number of invitees:{" "}
              <b className="font-semibold text-[var(--ink)]">
                {invitees.length}
              </b>
            </p>
            {invitationLoading ? (
              <p className="reveal text-shadow-wedding text-[17px] italic text-[var(--ink-soft)]">
                Loading your invitation...
              </p>
            ) : invitationError ? (
              <p className="reveal text-shadow-wedding text-[17px] italic text-[var(--ink-soft)]">
                {invitationError}
              </p>
            ) : invitees.length > 0 ? (
              <>
                <div className="reveal space-y-3">
                  {invitees.map((invitee) => (
                    <div
                      key={invitee.id}
                      className="flex items-center justify-between gap-3 border-y border-[rgba(252,246,238,0.16)] py-3 text-left"
                    >
                      <span className="text-shadow-wedding text-[19px] text-[var(--ink)]">
                        {invitee.fullName ?? "Guest"}
                      </span>
                      <div className="flex gap-2">
                        <RsvpButton
                          label="Accept"
                          variant="accept"
                          active={rsvps[invitee.id] === "accepted"}
                          onClick={() => selectRsvp(invitee.id, "accepted")}
                        />
                        <RsvpButton
                          label="Decline"
                          variant="decline"
                          active={rsvps[invitee.id] === "rejected"}
                          onClick={() => selectRsvp(invitee.id, "rejected")}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="reveal mt-[30px] inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-[2px] border border-[var(--gold-line)] bg-white/[0.04] px-[26px] py-[13px] font-serif-wedding text-base uppercase tracking-[0.12em] text-[var(--ink)] transition duration-300 hover:border-[var(--ink)] hover:bg-white/[0.14] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  type="button"
                  onClick={submitRsvps}
                  disabled={submittingRsvp}
                >
                  {submittingRsvp ? "Confirming..." : "Press to Confirm"}
                </button>
                {rsvpError ? (
                  <p className="text-shadow-wedding mt-5 min-h-6 text-lg italic text-[var(--ink-soft)]">
                    {rsvpError}
                  </p>
                ) : (
                  <p
                    className={`text-shadow-wedding mt-5 min-h-6 text-lg italic text-[var(--gold)] transition-opacity duration-500 ${confirmed ? "opacity-100" : "opacity-0"}`}
                  >
                    Thank you. Your response has been noted ♡
                  </p>
                )}
              </>
            ) : (
              <p className="reveal text-shadow-wedding text-[17px] italic text-[var(--ink-soft)]">
                No invitation code was provided.
              </p>
            )}
          </div>
        </section>

        <section
          id={sectionIds[5]}
          className="flex min-h-svh flex-col items-center justify-center px-7 pb-[120px] pt-24 text-center"
          data-screen-label="06 Together"
        >
          <div className="flex w-full max-w-[430px] flex-col items-center">
            <h2 className="reveal text-shadow-wedding font-script text-[clamp(46px,13vw,62px)] leading-[1.04] text-[var(--ink)]">
              See you there!
            </h2>
          </div>
        </section>
      </main>

      <nav
        className="fixed right-[18px] top-1/2 z-30 flex -translate-y-1/2 flex-col gap-[13px]"
        aria-label="Invitation sections"
      >
        {sections.map((section, index) => (
          <button
            key={section}
            data-dot
            data-index={index}
            className={`h-[9px] w-[9px] cursor-pointer rounded-full border p-0 transition duration-300 ${
              activeSection === index
                ? "scale-125 border-[var(--gold)] bg-[var(--gold)]"
                : "border-[rgba(252,246,238,0.7)] bg-transparent"
            }`}
            type="button"
            aria-label={`Go to section ${index + 1}: ${section}`}
          />
        ))}
      </nav>

    </>
  );
}
