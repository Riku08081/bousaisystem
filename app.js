* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  height: 100%;
  font-family: "Segoe UI", "Hiragino Sans", "Noto Sans JP", sans-serif;
  background: #f4f7fb;
  color: #1f2937;
}

body {
  min-height: 100vh;
}

button, select {
  font: inherit;
}

.app-shell {
  display: flex;
  min-height: 100vh;
}

.panel {
  width: 380px;
  max-width: 36vw;
  background: rgba(255, 255, 255, 0.96);
  border-right: 1px solid #dfeaff;
  padding: 18px 18px 12px;
  overflow-y: auto;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 18px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #2f6fed;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(1.5rem, 2vw, 2rem);
}

h2 {
  margin: 0;
  font-size: 1.1rem;
}

.primary-btn {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #2f6fed, #3db4ff);
  color: white;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(47, 111, 237, 0.22);
}

.filter-group {
  margin-bottom: 14px;
}

.filter-group label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

select {
  border: 1px solid #dfe7f5;
  border-radius: 10px;
  background: #f9fbff;
  padding: 10px 12px;
}

.toggle-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0 16px;
}

.check-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #eef5ff;
  border: 1px solid #dfeafc;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 0.82rem;
  font-weight: 600;
}

.status-banner {
  background: linear-gradient(135deg, #ebf5ff, #eafaf4);
  border: 1px solid #d4e9ff;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.86rem;
  line-height: 1.4;
  color: #23426d;
  margin-bottom: 14px;
}

.legend {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  font-size: 0.8rem;
  color: #4b5563;
  margin-bottom: 18px;
}

.legend div {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.flood { background: #f59e0b; }
.dot.landslide { background: #ef4444; }
.dot.shelter { background: #10b981; }

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

#countLabel {
  color: #49607d;
  font-size: 0.85rem;
  font-weight: 700;
}

.shelter-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shelter-card {
  border: 1px solid #dfeafc;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff, #f7fbff);
  padding: 12px 12px 10px;
  box-shadow: 0 6px 12px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  transition: transform 0.16s ease, border-color 0.16s ease;
  text-align: left;
}

.shelter-card:hover {
  transform: translateY(-1px);
  border-color: #9cc0ff;
}

.shelter-card.selected {
  border-color: #2f6fed;
  background: linear-gradient(180deg, #f0f6ff, #edf7ff);
}

.card-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.card-top h3 {
  margin: 0;
  font-size: 1rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 5px 8px;
  font-size: 0.72rem;
  font-weight: 700;
}

.badge.open {
  background: #defae9;
  color: #0a7e4d;
}

.badge.closed {
  background: #fee2e2;
  color: #b91c1c;
}

.badge.unknown {
  background: #fef3c7;
  color: #9a6400;
}

.meta {
  font-size: 0.78rem;
  color: #5f6b7d;
  margin-bottom: 8px;
}

.compact-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.76rem;
  color: #374151;
  margin-top: 6px;
}

.congestion {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #e5eefb;
  overflow: hidden;
  margin-top: 8px;
}

.congestion-bar {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444);
}

.map-panel {
  flex: 1;
  min-height: 100vh;
}

#map {
  width: 100%;
  height: 100vh;
}

.leaflet-popup-content-wrapper,
.leaflet-popup-content {
  font-size: 13px;
}

.leaflet-container {
  background: #d9edf7;
}

@media (max-width: 980px) {
  .app-shell {
    flex-direction: column;
  }

  .panel {
    width: 100%;
    max-width: none;
    border-right: none;
    border-bottom: 1px solid #dfeaff;
  }

  .map-panel {
    min-height: 60vh;
  }
}
