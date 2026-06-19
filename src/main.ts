import { registerSW } from 'virtual:pwa-register';
import './style.css';
import { createIcons, Power, Radio, Settings, X, Heart, ChevronDown, Play, Pause, Search } from 'lucide';
import { stations, type Station } from './data/stations';


// Initialize Lucide icons
createIcons({
  icons: { Power, Radio, Settings, X, Heart, ChevronDown, Play, Pause, Search }
});

// State
let currentStation: Station | null = null;
let isPlaying = false;
let corsAudio = new Audio();
corsAudio.crossOrigin = "anonymous";
let fallbackAudio = new Audio();
let audio = corsAudio; // Current active audio pointer
let favorites: string[] = [];
let searchTerm: string = '';

// DOM Elements
const searchInput = document.getElementById('station-search') as HTMLInputElement;
const grid = document.getElementById('station-grid') as HTMLElement;
const favoritesContainer = document.getElementById('favorites-container') as HTMLElement;
const favoritesSection = document.getElementById('favorites-section') as HTMLElement;
const playerContainer = document.getElementById('player-container') as HTMLElement;
const playerStationName = document.getElementById('player-station-name') as HTMLElement;
const playerStationCity = document.getElementById('player-station-city') as HTMLElement;
const playerNowPlaying = document.getElementById('player-now-playing') as HTMLElement;
const playerStationLogo = document.getElementById('player-station-logo') as HTMLImageElement;
const closePlayerBtn = document.getElementById('close-player-btn') as HTMLButtonElement;
const playPauseBtn = document.getElementById('play-pause-btn') as HTMLButtonElement;
const volumeKnob = document.getElementById('volume-knob') as HTMLElement;
const powerLed = document.getElementById('power-led') as HTMLElement;
const vuNeedleL = document.getElementById('vu-needle-l') as HTMLElement;
const vuNeedleR = document.getElementById('vu-needle-r') as HTMLElement;
// Settings Elements
const settingsBtn = document.getElementById('settings-btn') as HTMLButtonElement;
const closeSettingsBtn = document.getElementById('close-settings-btn') as HTMLButtonElement;
const settingsModal = document.getElementById('settings-modal') as HTMLElement;
const colorPicker = document.getElementById('color-picker') as HTMLInputElement;
const resetColorBtn = document.getElementById('reset-color-btn') as HTMLButtonElement;

// Web Audio API State
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let source: MediaElementAudioSourceNode | null = null;
let dataArray: Uint8Array | null = null;
let animationId: number | null = null;
let corsErrorDetected = false;


// Metadata State
let metadataInterval: number | null = null;

// Initialization
function init() {
  loadFavorites();
  renderAllStations();
  renderFavorites();
  loadColorPreference();
  setupSearch();
  setupEventListeners();
}

function setupSearch() {
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = (e.target as HTMLInputElement).value.toLowerCase().trim();
      renderAllStations();
      renderFavorites();
    });
  }
}

function createStationCardHTML(station: Station): string {
  const isFavorite = favorites.includes(station.id);
  return `
    <div class="station-card" data-id="${station.id}">
      <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" aria-label="Favorite">
        <i data-lucide="heart"></i>
      </button>
      <img src="${station.logoUrl}" alt="${station.name}" class="station-card-logo" />
      <div class="station-card-info">
        <h3 class="station-card-name">${station.name}</h3>
        <p class="station-card-city">
          <i data-lucide="radio" style="width:14px; height:14px;"></i>
          ${station.city}
        </p>
      </div>
      <div class="equalizer-overlay">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
  `;
}

function renderAllStations() {
  const filtered = stations.filter(s => 
    s.name.toLowerCase().includes(searchTerm) || 
    s.city.toLowerCase().includes(searchTerm)
  );
  grid.innerHTML = filtered.map(createStationCardHTML).join('');
  attachCardEvents(grid);
  updateActiveCard();
}

function renderFavorites() {
  const favoriteStations = stations.filter(s => 
    favorites.includes(s.id) && 
    (s.name.toLowerCase().includes(searchTerm) || s.city.toLowerCase().includes(searchTerm))
  );
  
  if (favorites.length === 0) {
    favoritesSection.classList.add('hidden');
    favoritesContainer.innerHTML = '';
  } else if (favoriteStations.length === 0) {
    favoritesSection.classList.add('hidden');
    favoritesContainer.innerHTML = '';
  } else {
    favoritesSection.classList.remove('hidden');
    favoritesContainer.innerHTML = favoriteStations.map(createStationCardHTML).join('');
    attachCardEvents(favoritesContainer);
  }
  
  // Re-init icons for all newly rendered cards
  createIcons({
    icons: { Radio, Heart, Play, Search }
  });
  
  updateActiveCard();
}

function attachCardEvents(container: HTMLElement) {
  container.querySelectorAll('.station-card').forEach(card => {
    // Handle Favorite Click
    const favBtn = card.querySelector('.favorite-btn');
    favBtn?.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click
      const id = card.getAttribute('data-id');
      if (id) toggleFavorite(id);
    });

    // Handle Card Click (Play)
    card.addEventListener('click', (e) => {
      // Ignore clicks on favorite button
      if ((e.target as HTMLElement).closest('.favorite-btn')) return;
      const id = card.getAttribute('data-id');
      const station = stations.find(s => s.id === id);
      if (station) {
        if (currentStation?.id === station.id) {
          // If clicking the active station while player is hidden, just bring it up
          if (playerContainer.classList.contains('hidden')) {
            playerContainer.classList.remove('hidden');
          } else {
            // Otherwise, toggle play/pause
            if (isPlaying) {
              audio.pause();
            } else {
              audio.play().catch(e => console.error(e));
            }
          }
        } else {
          playStation(station);
        }
      }
    });
  });
}

function toggleFavorite(id: string) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  saveFavorites();
  renderAllStations();
  renderFavorites();
}

function saveFavorites() {
  localStorage.setItem('orthoradio-favorites', JSON.stringify(favorites));
}

function loadFavorites() {
  const saved = localStorage.getItem('orthoradio-favorites');
  if (saved) {
    try {
      favorites = JSON.parse(saved);
    } catch (e) {
      console.error("Could not parse favorites:", e);
      favorites = [];
    }
  }
}

function setupWebAudio() {
  if (audioContext) return; // Already initialized
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source = audioContext.createMediaElementSource(corsAudio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  } catch (e) {
    console.warn("Web Audio API could not be initialized or CORS is blocking it. Falling back to simulated VU meter.", e);
  }
}

function updateVUMeter() {
  if (!isPlaying) {
    vuNeedleL.style.transform = `translateX(-50%) rotate(-45deg)`;
    vuNeedleR.style.transform = `translateX(-50%) rotate(-45deg)`;
    if (animationId) cancelAnimationFrame(animationId);
    return;
  }

  let rotationL = -45;
  let rotationR = -45;

  if (!analyser || !dataArray) {
    // Fallback simulation when Web Audio API is completely unavailable
    const randomVolL = Math.random() * 0.5 + 0.2;
    const randomVolR = Math.random() * 0.5 + 0.2; 
    rotationL = -45 + (randomVolL * 90);
    rotationR = -45 + (randomVolR * 90);
  } else {
    // Real Audio Data
    analyser.getByteFrequencyData(dataArray as any);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    
    if (sum === 0 && audio.currentTime > 0.5 && !corsErrorDetected) {
      corsErrorDetected = true;
      console.log('CORS block detected or silence, audio data is 0');
    } else if (sum > 0) {
      if (corsErrorDetected) corsErrorDetected = false;
    }
    
    if (sum === 0) {
      // Temporary fallback simulation for this frame (due to silence or CORS block)
      const randomVolL = Math.random() * 0.5 + 0.2;
      const randomVolR = Math.random() * 0.5 + 0.2; 
      rotationL = -45 + (randomVolL * 90);
      rotationR = -45 + (randomVolR * 90);
    } else {
      const average = sum / dataArray.length;
      const normalized = average / 255;
      // Slight pseudo-stereo effect for the visual
      const offsetL = (Math.random() * 0.1) - 0.05;
      const offsetR = (Math.random() * 0.1) - 0.05;
      rotationL = -45 + (Math.min((normalized + offsetL) * 1.5, 1) * 90);
      rotationR = -45 + (Math.min((normalized + offsetR) * 1.5, 1) * 90);
    }
  }

  vuNeedleL.style.transform = `translateX(-50%) rotate(${rotationL}deg)`;
  vuNeedleR.style.transform = `translateX(-50%) rotate(${rotationR}deg)`;
  
  if (isPlaying) {
    setTimeout(() => {
      animationId = requestAnimationFrame(updateVUMeter);
    }, 50);
  }
}

function setupEventListeners() {
  playPauseBtn.addEventListener('click', () => {
    // Initialize Web Audio API on first user interaction to bypass browser autoplay policies
    setupWebAudio();
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    togglePlay();
  });
  
  // Volume Knob Drag Logic (Rotary Touch)
  let isDraggingVolume = false;
  let knobCenterX = 0;
  let knobCenterY = 0;

  const onVolumeStart = (e: Event, clientX: number, clientY: number) => {
    e.preventDefault();
    isDraggingVolume = true;
    const rect = volumeKnob.getBoundingClientRect();
    knobCenterX = rect.left + rect.width / 2;
    knobCenterY = rect.top + rect.height / 2;
    document.body.style.userSelect = 'none'; // Prevent text selection
    
    updateVolumeFromPosition(clientX, clientY);
  };

  const onVolumeMove = (e: Event, clientX: number, clientY: number) => {
    if (!isDraggingVolume) return;
    e.preventDefault();
    updateVolumeFromPosition(clientX, clientY);
  };

  const updateVolumeFromPosition = (clientX: number, clientY: number) => {
    let atanAngle = Math.atan2(clientY - knobCenterY, clientX - knobCenterX) * (180 / Math.PI);
    let cssAngle = atanAngle + 90;
    
    if (cssAngle > 180) cssAngle -= 360;
    
    // Handle the dead zone at the bottom
    if (cssAngle > 135) cssAngle = 135;
    if (cssAngle < -135) cssAngle = -135;
    
    let newVol = (cssAngle + 135) / 270;
    newVol = Math.max(0, Math.min(1, newVol));
    
    corsAudio.volume = newVol;
    fallbackAudio.volume = newVol;
    updateKnobRotation();
  };

  const onVolumeEnd = () => {
    isDraggingVolume = false;
    document.body.style.userSelect = '';
  };

  volumeKnob.addEventListener('mousedown', (e) => onVolumeStart(e, e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => onVolumeMove(e, e.clientX, e.clientY), { passive: false });
  window.addEventListener('mouseup', onVolumeEnd);

  // Touch support for mobile
  volumeKnob.addEventListener('touchstart', (e) => onVolumeStart(e, e.touches[0].clientX, e.touches[0].clientY), { passive: false });
  window.addEventListener('touchmove', (e) => onVolumeMove(e, e.touches[0].clientX, e.touches[0].clientY), { passive: false });
  window.addEventListener('touchend', onVolumeEnd);

  // Mouse wheel support for Desktop
  volumeKnob.addEventListener('wheel', (e) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    let newVol = corsAudio.volume + (direction * 0.05);
    newVol = Math.max(0, Math.min(1, newVol));
    corsAudio.volume = newVol;
    fallbackAudio.volume = newVol;
    updateKnobRotation();
  }, { passive: false });

  function updateKnobRotation() {
    const deg = -135 + (audio.volume * 270);
    volumeKnob.style.transform = `rotate(${deg}deg)`;
  }

  // Initialize knob position
  updateKnobRotation();

  // Settings Modal
  settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.add('hidden');
    }
  });

  // Color Picker
  colorPicker.addEventListener('input', (e) => {
    const color = (e.target as HTMLInputElement).value;
    applyColor(color);
  });

  resetColorBtn.addEventListener('click', () => {
    const defaultColor = '#d4af37';
    colorPicker.value = defaultColor;
    applyColor(defaultColor);
  });

  // Audio Events
  const attachAudioEvents = (audioElement: HTMLAudioElement) => {
    audioElement.addEventListener('playing', () => {
      if (audio !== audioElement) return;
      isPlaying = true;
      updatePlayerUI();
      if (animationId) cancelAnimationFrame(animationId);
      updateVUMeter();
      if (currentStation) startMetadataPolling(currentStation);
    });

    audioElement.addEventListener('pause', () => {
      if (audio !== audioElement) return;
      isPlaying = false;
      updatePlayerUI();
      updateVUMeter();
      stopMetadataPolling();
    });
    
    audioElement.addEventListener('ended', () => {
      if (audio !== audioElement) return;
      isPlaying = false;
      updatePlayerUI();
      updateVUMeter();
      stopMetadataPolling();
    });
  };

  attachAudioEvents(corsAudio);
  attachAudioEvents(fallbackAudio);

  corsAudio.addEventListener('error', () => {
    if (audio !== corsAudio) return;
    console.error("CORS Audio stream error. Retrying with fallback audio...");
    
    if (currentStation) {
      audio = fallbackAudio;
      audio.src = currentStation.streamUrl;
      audio.volume = corsAudio.volume;
      audio.load();
      audio.play().catch(e => {
        console.error("Fallback play failed:", e);
        if (e.name !== 'NotAllowedError') {
          alert('Το stream δεν είναι διαθέσιμο αυτή τη στιγμή.');
          isPlaying = false;
          updatePlayerUI();
        }
      });
      return;
    }

    isPlaying = false;
    updatePlayerUI();
    updateVUMeter();
    stopMetadataPolling();
  });

  fallbackAudio.addEventListener('error', () => {
    if (audio !== fallbackAudio) return;
    console.error("Fallback Audio stream error");
    isPlaying = false;
    updatePlayerUI();
    updateVUMeter();
    stopMetadataPolling();
  });
}

function playStation(station: Station) {
  // Initialize WebAudio if not done yet
  setupWebAudio();
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }

  currentStation = station;
  
  // Update UI first for immediate feedback
  playerContainer.classList.remove('hidden');
  playerStationName.textContent = station.name;
  
  // Apply marquee if text overflows
  applyMarquee(playerStationName);

  playerStationCity.textContent = station.city;
  playerStationLogo.src = station.logoUrl;
  playerStationLogo.classList.remove('hidden');
  document.title = `${station.name} - OrthoRadio`;

  if (!station.streamUrl) {
    alert('Το stream για αυτόν τον σταθμό δεν έχει προστεθεί ακόμα!');
    if (isPlaying) {
      audio.pause();
    }
    return;
  }

  // Handle audio
  if (isPlaying) audio.pause();
  
  if ('mediaSession' in navigator) {
    const artworkUrl = new URL(station.logoUrl, window.location.href).href;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: station.name,
      artist: 'OrthoRadio',
      album: station.city,
      artwork: [
        { src: artworkUrl, sizes: '512x512', type: 'image/jpeg' },
        { src: artworkUrl, sizes: '192x192', type: 'image/jpeg' }
      ]
    });
  }

  audio = corsAudio; // Always try with CORS first
  audio.src = station.streamUrl;
  audio.play().catch(e => {
    console.warn("Initial play failed (possibly CORS). Error event handler will retry.", e);
    if (e.name === 'NotAllowedError') {
      alert('Η αναπαραγωγή μπλοκαρίστηκε από τον browser. Πατήστε το Play.');
      isPlaying = false;
      updatePlayerUI();
    }
    // If it's a NotSupportedError or TypeError (CORS), the 'error' event listener will catch it and retry.
  });
  
  updateActiveCard();
}

function togglePlay() {
  if (!currentStation) return;

  if (isPlaying) {
    audio.pause();
  } else {
    audio.play().catch(e => console.error("Could not play audio:", e));
  }
}

function updatePlayerUI() {
  const playIcon = playPauseBtn.querySelector('.play-icon') as HTMLElement;
  const pauseIcon = playPauseBtn.querySelector('.pause-icon') as HTMLElement;

  if (isPlaying) {
    playPauseBtn.classList.add('on');
    powerLed.classList.add('on');
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';
  } else {
    playPauseBtn.classList.remove('on');
    powerLed.classList.remove('on');
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
  }
}

function updateActiveCard() {
  document.querySelectorAll('.station-card').forEach(card => {
    if (card.getAttribute('data-id') === currentStation?.id) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

function applyColor(color: string) {
  document.documentElement.style.setProperty('--color-accent', color);
  localStorage.setItem('orthoradio-accent-color', color);
}

function loadColorPreference() {
  const savedColor = localStorage.getItem('orthoradio-accent-color');
  if (savedColor) {
    applyColor(savedColor);
    colorPicker.value = savedColor;
  }
}

// Metadata Functions
function applyMarquee(element: HTMLElement) {
  element.classList.remove('marquee');
  requestAnimationFrame(() => {
    const parent = element.parentElement;
    if (parent && element.scrollWidth > parent.clientWidth) {
      element.classList.add('marquee');
    }
  });
}

function updateNowPlayingUI(title: string | null) {
  // Ensure city is always visible since it's the 3rd line
  playerStationCity.classList.remove('hidden');

  if (title && title.trim().length > 0) {
    playerStationName.classList.add('hidden');
    playerNowPlaying.classList.remove('hidden');
    playerNowPlaying.textContent = title;
    applyMarquee(playerNowPlaying);
  } else {
    playerNowPlaying.classList.add('hidden');
    playerStationName.classList.remove('hidden');
    applyMarquee(playerStationName);
  }
}

async function fetchNowPlaying(station: Station) {
  if (!station.metadataUrl) return;
  
  try {
    const res = await fetch(station.metadataUrl);
    if (!res.ok) return;
    const data = await res.json();
    
    let title = null;
    
    if (data.icestats && data.icestats.source) {
      const source = Array.isArray(data.icestats.source) ? data.icestats.source[0] : data.icestats.source;
      title = source.title || null;
    } else if (data.title) {
      title = data.title;
    }
    
    updateNowPlayingUI(title);
  } catch (e) {
    console.warn("Could not fetch metadata for", station.name);
  }
}

function startMetadataPolling(station: Station) {
  stopMetadataPolling(); // Clear existing
  updateNowPlayingUI(null); // Reset
  
  if (station.metadataUrl) {
    fetchNowPlaying(station);
    metadataInterval = window.setInterval(() => {
      fetchNowPlaying(station);
    }, 10000);
  }
}

function stopMetadataPolling() {
  if (metadataInterval) {
    clearInterval(metadataInterval);
    metadataInterval = null;
  }
  updateNowPlayingUI(null);
}

// Close Player Logic
closePlayerBtn.addEventListener('click', () => {
  playerContainer.classList.add('hidden');
});

// App Startup app
init();


// PWA Update Logic
const pwaToast = document.getElementById('pwa-toast');
const pwaRefreshBtn = document.getElementById('pwa-refresh');
const pwaCloseBtn = document.getElementById('pwa-close');

if (pwaToast && pwaRefreshBtn && pwaCloseBtn) {
  const updateSW = registerSW({
    onNeedRefresh() {
      pwaToast.classList.remove('hidden');
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  });

  pwaRefreshBtn.addEventListener('click', () => {
    updateSW(true);
  });

  pwaCloseBtn.addEventListener('click', () => {
    pwaToast.classList.add('hidden');
  });
}
