<template>
  <div class="hero-wrapper">
    <section class="hero">
      <!-- LEFT PANEL -->
      <div class="left">
        <div class="left-texture" />
        <div class="left-corner" />
        <div class="left-corner2" />

        <div>
          <div class="eyebrow">
            <span class="eyebrow-dot" />
            <span class="eyebrow-text">Nigerian commodity brokerage</span>
          </div>
          <h1 class="headline">
            From Nigeria's<br />farms to your<br />
            <em>market.</em>
          </h1>
          <p class="sub">
            Connecting international buyers and Nigerian businesses with verified,
            quality-assured suppliers — sourcing, logistics, and documentation handled end
            to end.
          </p>
        </div>

        <div class="btns">
          <RouterLink to="/products" class="btn-primary">
            Browse products
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </RouterLink>
          <RouterLink to="/request-quote" class="btn-secondary">
            Request a quote
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </RouterLink>
        </div>

        <div class="trust-row">
          <div v-for="t in trustItems" :key="t" class="trust-item">
            <span class="trust-check">
              <svg
                width="10"
                height="10"
                fill="none"
                stroke="#86d492"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            {{ t }}
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL -->
      <div class="right">
        <!-- CAROUSEL -->
        <div class="carousel">
          <transition-group name="fade" tag="div" class="slides-wrap">
            <div
              v-for="(slide, i) in slides"
              :key="slide.origin"
              v-show="current === i"
              class="slide"
            >
              <img :src="slide.img" :alt="slide.alt" />
              <div class="slide-overlay" />
              <div class="origin-tag">
                <span class="origin-label">Origin · {{ slide.state }}</span>
                <span class="origin-val">{{ slide.caption }}</span>
              </div>
            </div>
          </transition-group>

          <div class="arrows">
            <button class="arrow-btn" aria-label="Previous" @click="prev">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button class="arrow-btn" aria-label="Next" @click="next">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div class="dots">
            <button
              v-for="(_, i) in slides"
              :key="i"
              :class="['dot', { active: current === i }]"
              :aria-label="`Go to slide ${i + 1}`"
              @click="goTo(i)"
            />
          </div>
        </div>

        <!-- STATS -->
        <div class="stats-row">
          <div v-for="s in stats" :key="s.label" class="stat-cell">
            <span class="stat-num">{{ s.value }}</span>
            <span class="stat-label">{{ s.label }}</span>
          </div>
        </div>

        <!-- WHAT WE SOURCE -->
        <div class="bottom-strip">
          <p class="strip-head">What we source</p>
          <div class="products-grid">
            <div v-for="p in products" :key="p.name" class="product-pill">
              <div class="pill-icon">
                <component :is="p.icon" class="icon-svg" />
              </div>
              <div>
                <div class="pill-name">{{ p.name }}</div>
                <div class="pill-origin">{{ p.origin }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const trustItems = [
  "Verified suppliers across all 36 states",
  "Full export documentation support",
  "Quality-assured, tested at source",
];

const slides = [
  {
    img:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80&fit=crop",
    alt: "Golden farmland fields at sunset",
    state: "Jigawa state",
    caption: "Sesame fields, northern Nigeria",
  },
  {
    img:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=900&q=80&fit=crop",
    alt: "Farmer tending crops in a lush green field",
    state: "Kano state",
    caption: "Hibiscus harvest, northwest Nigeria",
  },
  {
    img:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80&fit=crop",
    alt: "Farmworkers harvesting crops at dawn",
    state: "Oyo state",
    caption: "Cashew orchards, southwest Nigeria",
  },
  {
    img:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80&fit=crop",
    alt: "Close-up of healthy green crops in a field",
    state: "Kaduna state",
    caption: "Ginger farms, northcentral Nigeria",
  },
  {
    img:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=900&q=80&fit=crop",
    alt: "Farmer walking through rows of green farmland",
    state: "Benue state",
    caption: "Soybean fields, food basket state",
  },
];

const stats = [
  { value: "50+", label: "Suppliers" },
  { value: "18", label: "Countries" },
  { value: "24h", label: "Response" },
];

const products = [
  { name: "Sesame seeds", origin: "Jigawa · Kano" },
  { name: "Hibiscus flower", origin: "Kano · Sokoto" },
  { name: "Dried ginger", origin: "Kaduna · Nasarawa" },
  { name: "Cashew nuts", origin: "Oyo · Enugu" },
];

const current = ref(0);
let timer: ReturnType<typeof setInterval>;

function goTo(n: number) {
  current.value = (n + slides.length) % slides.length;
  resetTimer();
}
function next() {
  goTo(current.value + 1);
}
function prev() {
  goTo(current.value - 1);
}

function resetTimer() {
  clearInterval(timer);
  timer = setInterval(() => goTo(current.value + 1), 4500);
}

onMounted(resetTimer);
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
/* ── page wrapper ────────────────────────────────────────── */
.hero-wrapper {
  max-width: 1200px;
  margin: 80px auto 0;
  padding: 0 24px;
}

/* ── layout ──────────────────────────────────────────────── */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 560px;
  font-family: sans-serif;
  border-radius: 16px;
  overflow: hidden;
  border: 0.5px solid rgba(26, 47, 26, 0.15);
}
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .hero-wrapper {
    margin-top: 64px;
    padding: 0 16px;
  }
}

/* ── left panel ──────────────────────────────────────────── */
.left {
  background: #1a2f1a;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 36px;
  position: relative;
  overflow: hidden;
  gap: 32px;
}
.left-texture {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.015) 0px,
      rgba(255, 255, 255, 0.015) 1px,
      transparent 1px,
      transparent 60px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.015) 0px,
      rgba(255, 255, 255, 0.015) 1px,
      transparent 1px,
      transparent 60px
    );
}
.left-corner {
  position: absolute;
  bottom: -60px;
  left: -60px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 1px solid rgba(134, 212, 146, 0.1);
}
.left-corner2 {
  position: absolute;
  bottom: -20px;
  left: -20px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid rgba(134, 212, 146, 0.07);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(134, 212, 146, 0.12);
  border: 0.5px solid rgba(134, 212, 146, 0.25);
  border-radius: 20px;
  padding: 5px 14px;
  margin-bottom: 20px;
}
.eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #86d492;
  flex-shrink: 0;
}
.eyebrow-text {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #86d492;
  font-weight: 500;
}

.headline {
  font-size: clamp(32px, 3.5vw, 42px);
  font-weight: 500;
  color: #f0f5f0;
  line-height: 1.05;
  letter-spacing: -0.5px;
  position: relative;
  z-index: 1;
}
.headline em {
  font-style: normal;
  color: #86d492;
}

.sub {
  font-size: 13px;
  color: rgba(200, 220, 200, 0.6);
  line-height: 1.7;
  max-width: 260px;
  margin-top: 12px;
  position: relative;
  z-index: 1;
}

.btns {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.btn-primary,
.btn-secondary {
  font-size: 13px;
  font-weight: 500;
  padding: 13px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  transition: opacity 0.15s;
}
.btn-primary {
  background: #86d492;
  color: #0f1f0f;
  border: none;
}
.btn-secondary {
  background: transparent;
  color: #86d492;
  border: 0.5px solid rgba(134, 212, 146, 0.35);
}
.btn-primary:hover,
.btn-secondary:hover {
  opacity: 0.85;
}

.trust-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
}
.trust-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(190, 215, 190, 0.7);
}
.trust-check {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(134, 212, 146, 0.15);
  border: 0.5px solid rgba(134, 212, 146, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── right panel ─────────────────────────────────────────── */
.right {
  display: flex;
  flex-direction: column;
  background: #f5f2eb;
}

/* ── carousel ────────────────────────────────────────────── */
.carousel {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 340px;
}

.slides-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  inset: 0;
}
.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
.slide-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 27, 15, 0.22);
}

.origin-tag {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(10, 22, 10, 0.78);
  border: 0.5px solid rgba(134, 212, 146, 0.28);
  border-radius: 8px;
  padding: 9px 14px;
}
.origin-label {
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #86d492;
  display: block;
  margin-bottom: 2px;
}
.origin-val {
  font-size: 12px;
  color: #e8f0e8;
  font-weight: 500;
}

.arrows {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  pointer-events: none;
}
.arrow-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(10, 22, 10, 0.55);
  border: 0.5px solid rgba(134, 212, 146, 0.25);
  color: #86d492;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: all;
}

.dots {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 6px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.3s, transform 0.3s;
}
.dot.active {
  background: #86d492;
  transform: scale(1.3);
}

/* fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── stats ───────────────────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #1a2f1a;
}
.stat-cell {
  padding: 18px 16px;
  border-right: 0.5px solid rgba(134, 212, 146, 0.1);
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.stat-cell:last-child {
  border-right: none;
}
.stat-num {
  font-size: 22px;
  font-weight: 500;
  color: #86d492;
}
.stat-label {
  font-size: 10px;
  color: rgba(190, 215, 190, 0.5);
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* ── what we source ──────────────────────────────────────── */
.bottom-strip {
  background: #f5f2eb;
  padding: 18px 20px;
  border-top: 0.5px solid rgba(26, 47, 26, 0.1);
}
.strip-head {
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #3b5c3b;
  font-weight: 500;
  margin-bottom: 12px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.product-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(26, 47, 26, 0.06);
  border-radius: 8px;
  border: 0.5px solid rgba(26, 47, 26, 0.1);
}
.pill-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #1a2f1a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-svg {
  width: 14px;
  height: 14px;
  stroke: #86d492;
  fill: none;
}
.pill-name {
  font-size: 12px;
  font-weight: 500;
  color: #1a2f1a;
}
.pill-origin {
  font-size: 10px;
  color: #5c7a5c;
}
</style>
