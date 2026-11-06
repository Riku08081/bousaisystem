const districtList = [
  "北区",
  "中央区",
  "天王寺区",
  "浪速区",
  "住之江区",
  "大阪市西部",
];

const shelters = [
  {
    id: "s1",
    name: "大阪市民会館避難所",
    district: "中央区",
    lat: 34.6937,
    lng: 135.5015,
    capacity: 600,
    open: true,
    congestion: 62,
    note: "医療支援が可能",
    type: "市民施設",
  },
  {
    id: "s2",
    name: "天王寺公園避難所",
    district: "天王寺区",
    lat: 34.6479,
    lng: 135.5121,
    capacity: 820,
    open: true,
    congestion: 48,
    note: "車椅子利用可",
    type: "公園",
  },
  {
    id: "s3",
    name: "大阪城北公園避難所",
    district: "北区",
    lat: 34.6877,
    lng: 135.5258,
    capacity: 470,
    open: false,
    congestion: 30,
    note: "一部開設準備中",
    type: "公園",
  },
  {
    id: "s4",
    name: "難波駅前コミュニティセンター",
    district: "浪速区",
    lat: 34.6666,
    lng: 135.5017,
    capacity: 510,
    open: true,
    congestion: 78,
    note: "混雑が高い状況",
    type: "コミュニティセンター",
  },
  {
    id: "s5",
    name: "住之江区総合支所避難所",
    district: "住之江区",
    lat: 34.6108,
    lng: 135.4715,
    capacity: 660,
    open: true,
    congestion: 35,
    note: "ベッド数あり",
    type: "行政施設",
  },
  {
    id: "s6",
    name: "淀川西部避難場所",
    district: "大阪市西部",
    lat: 34.6316,
    lng: 135.4165,
    capacity: 540,
    open: null,
    congestion: 20,
    note: "状況確認中",
    type: "学校",
  },
];

const floodZone = [
  [34.7008, 135.4301],
  [34.7122, 135.4706],
  [34.6998, 135.5355],
  [34.6712, 135.5477],
  [34.6518, 135.4949],
  [34.6617, 135.4531],
];

const landslideZone = [
  [34.6934, 135.5589],
  [34.6727, 135.5882],
  [34.6475, 135.5601],
  [34.6228, 135.5908],
  [34.5952, 135.5481],
  [34.6103, 135.5161],
  [34.6429, 135.5157],
];

const osakaCenter = { lat: 34.6937, lng: 135.5015 };
let userLocation = null;
let selectedShelterId = null;
let routeLayer = null;
let routeMarkers = [];
const map = L.map("map", { zoomControl: true, preferCanvas: true });

const floodLayer = L.polygon(floodZone, {
  color: "#f59e0b",
  fillColor: "#fbbf24",
  fillOpacity: 0.25,
  weight: 2,
  opacity: 0.9,
}).addTo(map);

const landslideLayer = L.polygon(landslideZone, {
  color: "#ef4444",
  fillColor: "#f87171",
  fillOpacity: 0.2,
  weight: 2,
  opacity: 0.9,
}).addTo(map);

function initializeMap() {
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  map.setView([osakaCenter.lat, osakaCenter.lng], 12);

  const floodCheck = document.getElementById("showFlood");
  const landslideCheck = document.getElementById("showLandslide");

  floodCheck.addEventListener("change", () => {
    if (floodCheck.checked) map.addLayer(floodLayer);
    else map.removeLayer(floodLayer);
  });

  landslideCheck.addEventListener("change", () => {
    if (landslideCheck.checked) map.addLayer(landslideLayer);
    else map.removeLayer(landslideLayer);
  });

  renderShelterList();
}

function getDistanceKm(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const hav =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav));
  return earthRadiusKm * c;
}

function getStatusText(openState) {
  if (openState === true) return "開設中";
  if (openState === false) return "準備中";
  return "未確認";
}

function getBadgeClass(openState) {
  if (openState === true) return "open";
  if (openState === false) return "closed";
  return "unknown";
}

function createShelterListElement(shelter) {
  const wrapper = document.createElement("button");
  wrapper.type = "button";
  wrapper.className = "shelter-card";
  if (selectedShelterId === shelter.id) wrapper.classList.add("selected");

  const distanceText = userLocation
    ? `${getDistanceKm(userLocation, { lat: shelter.lat, lng: shelter.lng }).toFixed(1)} km`
    : "現在地未取得";

  wrapper.innerHTML = `
    <div class="card-top">
      <h3>${shelter.name}</h3>
      <span class="badge ${getBadgeClass(shelter.open)}">${getStatusText(shelter.open)}</span>
    </div>
    <div class="meta">${shelter.district} · ${shelter.type}</div>
    <div class="meta">${shelter.note}</div>
    <div class="compact-row">
      <span>収容: ${shelter.capacity}人</span>
      <span>${distanceText}</span>
    </div>
    <div class="compact-row">
      <span>混雑度: ${shelter.congestion}%</span>
      <span>更新: 9:00</span>
    </div>
    <div class="congestion"><span class="congestion-bar" style="width:${shelter.congestion}%"></span></div>
  `;

  wrapper.addEventListener("click", () => {
    selectShelter(shelter.id);
  });

  return wrapper;
}

function renderShelterList() {
  const districtFilter = document.getElementById("districtFilter");
  const selectedDistrict = districtFilter.value;

  const filtered = shelters.filter((shelter) => {
    if (selectedDistrict === "all") return true;
    return shelter.district === selectedDistrict;
  });

  const list = document.getElementById("shelterList");
  list.innerHTML = "";

  filtered
    .sort((a, b) => {
      if (!userLocation) return 0;
      const da = getDistanceKm(userLocation, { lat: a.lat, lng: a.lng });
      const db = getDistanceKm(userLocation, { lat: b.lat, lng: b.lng });
      return da - db;
    })
    .forEach((shelter) => {
      list.appendChild(createShelterListElement(shelter));
    });

  document.getElementById("countLabel").textContent = `${filtered.length}件`;
}

function updateShelterMarkers() {
  const selectedDistrict = document.getElementById("districtFilter").value;
  const markers = shelters
    .filter((shelter) => {
      if (selectedDistrict === "all") return true;
      return shelter.district === selectedDistrict;
    })
    .map((shelter) => {
      const marker = L.marker([shelter.lat, shelter.lng]).addTo(map);
      const label = shelter.open === true ? "開設中" : shelter.open === false ? "準備中" : "未確認";
      marker.bindPopup(`
        <strong>${shelter.name}</strong><br />
        ${shelter.district}<br />
        ${label}<br />
        混雑度: ${shelter.congestion}%
      `);
      return marker;
    });

  return markers;
}

let visibleMarkers = [];

function refreshMapMarkers() {
  visibleMarkers.forEach((marker) => map.removeLayer(marker));
  visibleMarkers = updateShelterMarkers();
}

async function getRoute(from, to) {
  const url = `https://router.project-osrm.org/route/v1/foot/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&steps=false`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("経路の取得に失敗しました");
  }

  const data = await response.json();
  if (!data.routes || data.routes.length === 0) {
    throw new Error("経路が見つかりませんでした");
  }

  return data.routes[0];
}

function clearRoute() {
  if (routeLayer) {
    map.removeLayer(routeLayer);
    routeLayer = null;
  }

  routeMarkers.forEach((marker) => map.removeLayer(marker));
  routeMarkers = [];
}

async function selectShelter(shelterId) {
  const shelter = shelters.find((item) => item.id === shelterId);
  if (!shelter) return;

  selectedShelterId = shelter.id;
  renderShelterList();

  if (!userLocation) {
    userLocation = osakaCenter;
  }

  clearRoute();

  const start = userLocation;
  const end = { lat: shelter.lat, lng: shelter.lng };

  const statusBanner = document.getElementById("statusBanner");
  statusBanner.textContent = `${shelter.name}までの経路を計算しています...`;

  try {
    const route = await getRoute(start, end);
    routeLayer = L.geoJSON(route.geometry, {
      style: {
        color: "#ff5b52",
        weight: 6,
        opacity: 0.9,
      },
    }).addTo(map);

    const startMarker = L.circleMarker([start.lat, start.lng], {
      radius: 8,
      color: "#2563eb",
      fillColor: "#60a5fa",
      fillOpacity: 1,
    }).addTo(map);

    const endMarker = L.circleMarker([end.lat, end.lng], {
      radius: 8,
      color: "#16a34a",
      fillColor: "#4ade80",
      fillOpacity: 1,
    }).addTo(map);

    routeMarkers = [startMarker, endMarker];

    const durationMinutes = Math.round(route.duration / 60);
    const distanceKm = (route.distance / 1000).toFixed(1);

    statusBanner.textContent = `選択中: ${shelter.name} / 距離: ${distanceKm}km / 約${durationMinutes}分 / ルートは避難中の安全情報を踏まえた目安です。`;

    const routeCoordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const bounds = L.latLngBounds(routeCoordinates);
    map.fitBounds(bounds.pad(0.2));
  } catch (error) {
    statusBanner.textContent = error.message;
  }
}

function handleLocationSuccess(position) {
  userLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };

  document.getElementById("statusBanner").textContent = `現在地を��得しました。${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`;
  map.setView([userLocation.lat, userLocation.lng], 13);
  L.marker([userLocation.lat, userLocation.lng], {
    title: "現在地",
  })
    .addTo(map)
    .bindPopup("現在地")
    .openPopup();

  renderShelterList();
}

function handleLocationError() {
  userLocation = osakaCenter;
  document.getElementById("statusBanner").textContent = "位置情報の取得に失敗したため、大阪市役所を基準に表示しています。";
  renderShelterList();
}

function bindControls() {
  document.getElementById("districtFilter").addEventListener("change", () => {
    renderShelterList();
    refreshMapMarkers();
  });

  document.getElementById("locateBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    } else {
      handleLocationError();
    }
  });
}

initializeMap();
bindControls();
refreshMapMarkers();

setTimeout(() => {
  if (!userLocation) {
    userLocation = osakaCenter;
    renderShelterList();
  }
}, 250);
