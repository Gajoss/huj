/**
 * Automated Training Manager (Trainer / Bot)
 * Twórca: Yasoen dla Tralalelu
 * 
 * Skrypt automatyzuje proces treningu postaci w grze przeglądarkowej:
 * - Pobiera listę wynajętych postaci z klanu,
 * - Przełącza się między nimi i rozpoczyna wybrany trening,
 * - Uruchamia transformacje (SSJ) przed treningiem,
 * - Obsługuje kody treningowe i monitoruje czas zakończenia treningów.
 */

// ==========================================
// SEKCJA 1: Inicjalizacja i automatyczne uruchamianie
// ==========================================
setTimeout(() => {
  console.log("Czekam 8 sekund przed zapisem...");
  const saveBtn = document.getElementById("tr-save");
  if (saveBtn) {
    saveBtn.click();
    console.log("Kliknięto Zapisz");
  } else {
    console.warn("Brak elementu #tr-save");
  }

  setTimeout(() => {
    const powerBtn = document.getElementById('tr-power');
    if (powerBtn) {
      powerBtn.click();
      console.log("Kliknięto OFF/ON");
    } else {
      console.warn("Brak elementu #tr-power");
    }
  }, 5000); // 5 sekund po zapisie
}, 8000); // 8 sekund po załadowaniu skryptu


// ==========================================
// SEKCJA 2: Główna logika i weryfikacja licencji
// ==========================================
(() => {
  'use strict';

  // Weryfikacja nagłówka autorstwa za pomocą prostego hasza
  const authorSignatureHash = Array.from("Created by yasoen for Tralalelu")
    .reduce((hash, char) => hash * 31 + char.charCodeAt(0) & 0xffffffff, 0x45a3f1b2);

  if (authorSignatureHash !== 149253103) { // 0x8e56b6f
    console.error("Odezwij sie na dc do: Yasoen.   :)");
    return;
  }

  // Lista dostępnych statystyk do wyboru w interfejsie
  const STATS_OPTIONS = [
    { value: "siła", label: "Siła" },
    { value: "szybkość", label: "Szybkość" },
    { value: "wytrzymałość", label: "Wytrzymałość" },
    { value: "Energia Ki", label: "Ki" },
    { value: "Siła Woli", label: "Siła Woli" }
  ];

  // Mapowanie komend gniazda serwera (Socket Commands)
  const SOCKET_COMMANDS = {
    GET_RENTED: { a: 39, type: 47 },
    USE_CHAR: (targetId) => ({ a: 39, type: 48, target: targetId }),
    TRAINING_START: (statType, duration) => ({ a: 8, type: 2, stat: statType, duration: duration }),
    TRAINING_CODE: { a: 8, type: 5, apud: 'vzaaa' },
    SSJ_START: (techId) => ({ a: 18, type: 5, tech_id: techId }),
    SSJ_STOP: { a: 18, type: 6 },
    LOGOUT: (charId) => ({ a: 2, char_id: charId })
  };

  // Główny stan aplikacji
  const appState = {
    running: false,
    step: 0,
    stat: null,
    duration: null,
    allowedNicks: [],
    includeMainChar: false,
    charQueue: [],
    queueIndex: 0,
    charNames: {},
    charTimers: [],
    mainCharId: null,
    mainCharName: null,
    monitorMode: false,
    monitorInterval: null,
    trainingStartedAt: null,
    countdownTimer: null
  };

  /**
   * Zapisuje bieżącą konfigurację treningu w pamięci podręcznej przeglądarki.
   */
  function saveSettingsToLocalStorage() {
    const settings = {
      stat: null,
      duration: null,
      allowedNicks: appState.allowedNicks,
      includeMainChar: false
    };
    localStorage.setItem('trainer_settings_v1', JSON.stringify(settings));
  }

  /**
   * Odczytuje konfigurację z pamięci podręcznej i aktualizuje pola w UI.
   */
  function loadSettingsFromLocalStorage() {
    try {
      const stored = localStorage.getItem('trainer_settings_v1');
      if (!stored) return;

      const parsed = JSON.parse(stored);
      appState.stat = parsed.stat ?? null;
      appState.duration = parsed.duration ?? null;
      appState.allowedNicks = parsed.allowedNicks ?? [];
      appState.includeMainChar = parsed.includeMainChar ?? false;

      setTimeout(() => {
        const nullStatRadio = document.querySelector('input[name="tr-stat"][value="null"]');
        if (nullStatRadio) nullStatRadio.checked = true;

        const durationInput = document.getElementById("tr-duration");
        if (durationInput) durationInput.value = null;

        const nicksInput = document.getElementById('tr-nicks');
        if (nicksInput && appState.allowedNicks.length) {
          nicksInput.value = appState.allowedNicks.join(';');
        }

        const mainToggle = document.getElementById('tr-main-toggle');
        if (mainToggle) mainToggle.checked = false;

        updateInfoText("✓ Wczytano zapisane ustawienia");
      }, 100);
    } catch (err) {
      console.warn("[Trainer] Błąd odczytu storage:", err);
    }
  }

  // Funkcje pomocnicze
  const delayCall = (callback, ms = 3000) => window.setTimeout(callback, ms);
  const logTrainer = (...args) => console.log('[Trainer]', ...args);

  /**
   * Formatowanie czasu w milisekundach do ciągu hh:mm:ss
   */
  function formatTime(ms) {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(val => String(val).padStart(2, '0')).join(':');
  }

  /**
   * Odczytuje ID głównej postaci z drzewa DOM
   */
  function getMainCharId() {
    try {
      return document.getElementById("char_list_con").children[0].attributes[2].value;
    } catch {
      console.error("[Trainer] Nie można odczytać ID głównej postaci");
      return null;
    }
  }

  /**
   * Pobiera listę wynajętych postaci klanowych
   */
  function getRentedCharacters() {
    const clanRentedEl = document.getElementById("clan_rented");
    if (!clanRentedEl) return [];

    return Array.from(clanRentedEl.children).map(child => {
      try {
        const charAttrEl = child.children[0].children[1];
        const charId = parseInt(charAttrEl.getAttribute('data-char_id'));
        const name = charAttrEl.textContent.trim();
        return { id: charId, name: name };
      } catch {
        return null;
      }
    }).filter(Boolean).filter(item => !isNaN(item.id));
  }

  /**
   * Odczytuje minuty z zegara serwera
   */
  function getServerMinute() {
    const [, minuteStr] = $("#server_time").text().split(':');
    return parseInt(minuteStr);
  }

  /**
   * Pobiera czas zakończenia treningu z paska #train_uptime
   */
  function getTrainingEndTime() {
    const timerSpan = $("#train_uptime span.timer");
    if (!timerSpan.length) return null;

    const timerText = timerSpan.text().trim();
    if (!timerText || timerText === "--:--:--") return null;

    const parts = timerText.split(':').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;

    return Date.now() + (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  }

  /**
   * Zapisuje timer dla ostatnio trenowanej postaci
   */
  function saveCurrentCharTimer() {
    const charId = appState.charQueue[appState.queueIndex - 1];
    if (charId == null) return;

    const endTime = getTrainingEndTime();
    if (!endTime) {
      logTrainer("⚠ Nie udało się odczytać czasu treningu");
      return;
    }

    const name = appState.charNames[charId] || '#' + charId;
    const timerIndex = appState.charTimers.findIndex(t => t.id === charId);

    if (timerIndex >= 0) {
      appState.charTimers[timerIndex].endWallTime = endTime;
    } else {
      appState.charTimers.push({ id: charId, name: name, endWallTime: endTime });
    }
    logTrainer(`Timer zapisany dla "${name}": wygasa o ${new Date(endTime).toLocaleTimeString()}`);
  }

  function filterQueueIds(rentedList) {
    const ids = rentedList.map(item => item.id);
    return ids;
  }

  function clearCountdown() {
    clearInterval(appState.countdownTimer);
    appState.countdownTimer = null;
    updateStatusText('');
  }

  function startMonitorMode() {
    stopMonitorMode();
    clearCountdown();
    renderTimersList();
    document.getElementById("tr-timers").style.display = "block";

    appState.monitorInterval = setInterval(() => {
      renderTimersList();
      checkExpiredTimers();
    }, 1000);
    logTrainer("Tryb monitorowania aktywny.");
  }

  function stopMonitorMode() {
    clearInterval(appState.monitorInterval);
    appState.monitorInterval = null;
  }

  function renderTimersList() {
    const now = Date.now();
    const sortedTimers = [...appState.charTimers].sort((a, b) => a.endWallTime - b.endWallTime);
    const container = document.getElementById("tr-timer-list");
    if (!container) return;

    if (!sortedTimers.length) {
      container.innerHTML = '<div class="tr-empty">brak danych</div>';
      return;
    }

    container.innerHTML = sortedTimers.map(timer => {
      const remainingMs = timer.endWallTime - now;
      const isExpired = remainingMs <= 0;
      return `
        <div class="tr-timer-row${isExpired ? " tr-expired" : ""}">
          <span class="tr-timer-name" title="${timer.name}">${timer.name}</span>
          <span class="tr-timer-val${isExpired ? " tr-blink" : ""}">${isExpired ? "▶ RUN" : formatTime(remainingMs)}</span>
        </div>`;
    }).join('');
  }

  function checkExpiredTimers() {
    const now = Date.now();
    const expiredList = appState.charTimers
      .filter(t => t.endWallTime <= now)
      .sort((a, b) => a.endWallTime - b.endWallTime);

    if (!expiredList.length) return;

    const firstExpired = expiredList[0];
    logTrainer(`Timer wygasł dla: "${firstExpired.name}" — startuję sekwencję`);
    
    stopMonitorMode();
    appState.charTimers = appState.charTimers.filter(t => t.id !== firstExpired.id);
    renderTimersList();

    appState.charQueue = [firstExpired.id];
    appState.queueIndex = 0;
    appState.trainingStartedAt = null;
    jumpToStep(3, 3000);
  }

  function updateStatusText(text) {
    const statusTextEl = document.getElementById("tr-status-text");
    if (statusTextEl) statusTextEl.textContent = text;

    const statusBarEl = document.getElementById('tr-status-bar');
    if (statusBarEl) statusBarEl.style.display = text ? 'flex' : "none";
  }

  function updateInfoText(text) {
    const infoEl = document.getElementById("tr-info");
    if (infoEl) infoEl.textContent = text;
  }

  function toggleSettingsPanel(hide) {
    const settingsEl = document.getElementById('tr-settings');
    if (settingsEl) settingsEl.style.display = hide ? "none" : "block";

    const settingsBtn = document.getElementById('tr-settings-btn');
    if (settingsBtn) settingsBtn.classList.toggle("tr-btn-active", !hide);
  }

  /**
   * Tworzy strukturę HTML i wstrzykuje style CSS dla panelu bocznego
   */
  function injectPanelUI() {
    if (!document.getElementById("tr-fonts")) {
      const fontLink = document.createElement('link');
      fontLink.id = "tr-fonts";
      fontLink.rel = "stylesheet";
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600&display=swap';
      document.head.appendChild(fontLink);
    }

    const styleEl = document.createElement('style');
    styleEl.id = "tr-styles";
    styleEl.textContent = `
      #tr-panel, #tr-panel * { box-sizing: border-box; }
      #tr-panel { font-family: 'Rajdhani', sans-serif; }
      .tr-mono { font-family: 'Share Tech Mono', monospace; }

      #tr-panel {
        position: fixed; top: 60px; right: 0; width: 178px; z-index: 9998;
        background: rgba(9, 11, 16, 0.96);
        border: 1px solid rgba(180, 140, 30, 0.35);
        border-radius: 6px; overflow: hidden;
        box-shadow: 0 0 0 1px rgba(180,140,30,0.08), 0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,220,80,0.06);
        transition: box-shadow 0.2s; user-select: none;
      }
      #tr-panel:hover {
        box-shadow: 0 0 0 1px rgba(180,140,30,0.18), 0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,220,80,0.08);
      }

      #tr-header {
        display: flex; align-items: center; gap: 6px; padding: 7px 8px 7px 10px;
        background: rgba(180,140,30,0.07); border-bottom: 1px solid rgba(180,140,30,0.18);
        cursor: grab;
      }
      #tr-header:active { cursor: grabbing; }
      #tr-drag-dots { display: flex; flex-direction: column; gap: 2px; opacity: 0.4; flex-shrink: 0; margin-right: 2px; }
      #tr-drag-dots span { display: flex; gap: 2px; }
      #tr-drag-dots i { width: 2px; height: 2px; border-radius: 50%; background: #c9a227; display: block; }
      #tr-title { flex: 1; font-weight: 600; font-size: 11px; letter-spacing: 2.5px; color: #c9a227; text-transform: uppercase; }
      
      .tr-hbtn {
        width: 18px; height: 18px; border: 1px solid rgba(180,140,30,0.25); border-radius: 3px;
        background: transparent; color: rgba(180,140,30,0.5); font-size: 11px; line-height: 1;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: all 0.15s; flex-shrink: 0; padding: 0;
      }
      .tr-hbtn:hover { background: rgba(180,140,30,0.12); color: #c9a227; border-color: rgba(180,140,30,0.5); }
      .tr-hbtn.tr-btn-active { background: rgba(180,140,30,0.15); color: #f0c040; border-color: rgba(180,140,30,0.6); }

      #tr-power-dot {
        width: 7px; height: 7px; border-radius: 50%; background: #374151; flex-shrink: 0;
        transition: background 0.3s, box-shadow 0.3s;
      }
      #tr-power-dot.on { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.7); animation: tr-pulse 2s infinite; }
      #tr-power-dot.off { background: #ef4444; box-shadow: 0 0 4px rgba(239,68,68,0.4); }
      @keyframes tr-pulse { 0%, 100% { box-shadow: 0 0 6px rgba(34,197,94,0.7); } 50% { box-shadow: 0 0 12px rgba(34,197,94,0.9); } }

      #tr-body { overflow: hidden; }
      #tr-settings { padding: 10px 10px 8px; border-bottom: 1px solid rgba(180,140,30,0.1); }
      .tr-field-label { font-size: 9px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(180,140,30,0.5); margin-bottom: 5px; }

      #tr-stats { display: flex; flex-direction: column; gap: 3px; margin-bottom: 9px; }
      .tr-stat-label {
        display: flex; align-items: center; gap: 5px; cursor: pointer; padding: 4px 5px;
        border-radius: 4px; border: 1px solid rgba(180,140,30,0.12); transition: all 0.15s;
        font-size: 11.5px; font-weight: 500; color: #6b7280;
      }
      .tr-stat-label:hover { border-color: rgba(180,140,30,0.3); color: #9ca3af; background: rgba(180,140,30,0.05); }
      .tr-stat-label input { display: none; }
      .tr-radio-dot { width: 7px; height: 7px; border-radius: 50%; border: 1px solid #4b5563; flex-shrink: 0; transition: all 0.15s; background: transparent; }
      .tr-stat-label input:checked ~ .tr-radio-dot { background: #c9a227; border-color: #c9a227; box-shadow: 0 0 5px rgba(201,162,39,0.5); }
      .tr-stat-label input:checked ~ span { color: #f0c040; }

      .tr-inputs { display: block; margin-bottom: 7px; }
      .tr-input-wrap { width: 100%; }
      .tr-input-wrap small { display: block; font-size: 8.5px; letter-spacing: 1px; text-transform: uppercase; color: rgba(180,140,30,0.4); margin-bottom: 2px; }
      #tr-panel input[type="number"], #tr-panel input[type="text"] {
        width: 100%; padding: 4px 6px; background: rgba(255,255,255,0.03);
        border: 1px solid rgba(180,140,30,0.2); border-radius: 4px; color: #e5e7eb;
        font-family: 'Rajdhani', sans-serif; font-size: 12px; outline: none; transition: border-color 0.15s;
      }
      #tr-panel input[type="number"]:focus, #tr-panel input[type="text"]:focus { border-color: rgba(180,140,30,0.55); background: rgba(180,140,30,0.04); }
      #tr-panel input::placeholder { color: #374151; }
      #tr-panel input[type="number"]::-webkit-inner-spin-button, #tr-panel input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

      #tr-main-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 5px 0; margin-bottom: 7px; }
      #tr-main-toggle-row span { font-size: 11.5px; font-weight: 500; color: #6b7280; }
      .tr-switch { position: relative; display: inline-block; width: 30px; height: 16px; flex-shrink: 0; }
      .tr-switch input { opacity: 0; width: 0; height: 0; }
      .tr-track { position: absolute; inset: 0; background: rgba(255,255,255,0.07); border: 1px solid rgba(180,140,30,0.2); border-radius: 16px; cursor: pointer; transition: all 0.2s; }
      .tr-track:before { content: ''; position: absolute; width: 10px; height: 10px; left: 2px; top: 2px; border-radius: 50%; background: #4b5563; transition: all 0.2s; }
      .tr-switch input:checked + .tr-track { background: rgba(201,162,39,0.2); border-color: rgba(201,162,39,0.6); }
      .tr-switch input:checked + .tr-track:before { background: #c9a227; transform: translateX(14px); box-shadow: 0 0 5px rgba(201,162,39,0.5); }

      #tr-save {
        width: 100%; padding: 6px; background: rgba(180,140,30,0.1); border: 1px solid rgba(180,140,30,0.3);
        border-radius: 4px; color: #c9a227; font-size: 11px; font-weight: 600; letter-spacing: 1.5px;
        text-transform: uppercase; cursor: pointer; transition: all 0.15s; margin-bottom: 6px;
      }
      #tr-save:hover { background: rgba(180,140,30,0.2); border-color: rgba(180,140,30,0.6); color: #f0c040; }
      #tr-save:active { background: rgba(180,140,30,0.28); transform: translateY(1px); }

      #tr-info { font-size: 10.5px; color: rgba(180,140,30,0.55); min-height: 13px; word-break: break-word; line-height: 1.3; }

      #tr-status-bar { display: none; align-items: center; gap: 6px; padding: 5px 10px; background: rgba(180,140,30,0.04); border-bottom: 1px solid rgba(180,140,30,0.1); }
      #tr-status-dot-sm { width: 5px; height: 5px; border-radius: 50%; background: #c9a227; flex-shrink: 0; animation: tr-pulse 1.5s infinite; }
      #tr-status-text { font-size: 10px; color: #c9a227; letter-spacing: 0.5px; }

      #tr-timers { padding: 8px 10px; }
      .tr-queue-label { font-size: 9px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(180,140,30,0.4); margin-bottom: 5px; }
      #tr-timer-list { display: flex; flex-direction: column; gap: 2px; }
      .tr-timer-row { display: flex; justify-content: space-between; align-items: center; padding: 3px 5px; border-radius: 3px; border: 1px solid transparent; transition: background 0.2s; }
      .tr-timer-row.tr-expired { background: rgba(239,68,68,0.07); border-color: rgba(239,68,68,0.15); }
      .tr-timer-name { font-size: 11px; font-weight: 500; color: #9ca3af; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .tr-timer-val { font-size: 10px; color: #22c55e; white-space: nowrap; }
      .tr-timer-val.tr-blink { color: #ef4444; animation: tr-blink 0.7s step-end infinite; }
      @keyframes tr-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
      .tr-empty { font-size: 10px; color: #374151; text-align: center; padding: 4px 0; }

      #tr-footer { display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-top: 1px solid rgba(180,140,30,0.1); background: rgba(0,0,0,0.2); }
      #tr-power {
        flex: 1; padding: 5px; border-radius: 4px; border: 1px solid rgba(239,68,68,0.35);
        background: rgba(239,68,68,0.07); color: #f87171; font-size: 11px; font-weight: 600;
        letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.15s;
      }
      #tr-power:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.55); }
      #tr-power.tr-power-on { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.08); color: #4ade80; }
      #tr-power.tr-power-on:hover { background: rgba(34,197,94,0.16); border-color: rgba(34,197,94,0.6); }
      #tr-power:active { transform: translateY(1px); }

      #tr-credits {
        width: 16px; height: 16px; border: 1px solid rgba(180,140,30,0.2); border-radius: 50%;
        background: transparent; color: rgba(180,140,30,0.4); font-size: 9px; cursor: pointer;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s;
        position: relative;
      }
      #tr-credits:hover { color: #c9a227; border-color: rgba(180,140,30,0.5); }
      #tr-credits-tip {
        display: none; position: absolute; bottom: 20px; right: 0; width: 140px;
        background: rgba(9,11,16,0.98); border: 1px solid rgba(180,140,30,0.3); border-radius: 4px;
        padding: 6px 8px; font-size: 9px; color: rgba(180,140,30,0.7); white-space: normal; line-height: 1.5; pointer-events: none; z-index: 99999;
      }
      #tr-credits:hover #tr-credits-tip { display: block; }

      #tr-panel.tr-minimized #tr-body, #tr-panel.tr-minimized #tr-footer { display: none; }
      #tr-panel.tr-minimized { border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; }
    `;
    document.head.appendChild(styleEl);

    const radioOptionsHtml = STATS_OPTIONS.map(({ value, label }) => `
      <label class="tr-stat-label">
        <input type="radio" name="tr-stat" value="${value}" />
        <span class="tr-radio-dot"></span>
        <span>${label}</span>
      </label>`).join('');

    const panelHtml = `
      <div id="tr-panel">
        <div id="tr-header">
          <div id="tr-drag-dots">
            <span><i></i><i></i><i></i></span>
            <span><i></i><i></i><i></i></span>
          </div>
          <span id="tr-title">Trainer</span>
          <div id="tr-power-dot" class="off"></div>
          <button class="tr-hbtn tr-btn-active" id="tr-settings-btn" title="Ustawienia">⚙</button>
          <button class="tr-hbtn" id="tr-minimize-btn" title="Minimalizuj">−</button>
        </div>

        <div id="tr-body">
          <div id="tr-settings">
            <div class="tr-field-label">Statystyka</div>
            <div id="tr-stats">${radioOptionsHtml}</div>

            <div class="tr-inputs">
              <div class="tr-input-wrap">
                <small>Czas (h)</small>
                <input type="number" id="tr-duration" placeholder="2" min="1" />
              </div>
              <div class="tr-input-wrap" style="margin-top:5px;">
                <small>Nicki</small>
                <input type="text" id="tr-nicks" placeholder="A;B" />
              </div>
            </div>

            <div id="tr-main-toggle-row">
              <span>Główna postać</span>
              <label class="tr-switch">
                <input type="checkbox" id="tr-main-toggle" />
                <span class="tr-track"></span>
              </label>
            </div>

            <button id="tr-save">Zapisz</button>
            <div id="tr-info"></div>
          </div>

          <div id="tr-status-bar">
            <div id="tr-status-dot-sm"></div>
            <span id="tr-status-text" class="tr-mono"></span>
          </div>

          <div id="tr-timers" style="display:none;">
            <div class="tr-queue-label">Kolejka</div>
            <div id="tr-timer-list"></div>
          </div>
        </div>

        <div id="tr-footer">
          <button id="tr-power">■ OFF</button>
          <div id="tr-credits">?<div id="tr-credits-tip">Created by yasoen for Tralalelu</div></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", panelHtml);

    // Obsługa przeciągania panelu (Drag and Drop)
    const panelEl = document.getElementById("tr-panel");
    const headerEl = document.getElementById("tr-header");
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    headerEl.addEventListener("mousedown", (e) => {
      if (e.target.closest("button, .tr-hbtn")) return;
      isDragging = true;
      panelEl.style.right = 'auto';
      offsetX = e.clientX - panelEl.getBoundingClientRect().left;
      offsetY = e.clientY - panelEl.getBoundingClientRect().top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      let left = e.clientX - offsetX;
      let top = e.clientY - offsetY;
      left = Math.max(0, Math.min(window.innerWidth - panelEl.offsetWidth, left));
      top = Math.max(0, Math.min(window.innerHeight - panelEl.offsetHeight, top));
      panelEl.style.left = left + 'px';
      panelEl.style.top = top + 'px';
    });

    document.addEventListener("mouseup", () => { isDragging = false; });

    document.getElementById('tr-minimize-btn').addEventListener('click', () => {
      const isMinimized = panelEl.classList.toggle("tr-minimized");
      document.getElementById('tr-minimize-btn').textContent = isMinimized ? '+' : '−';
    });

    document.getElementById('tr-settings-btn').addEventListener('click', () => {
      const settingsEl = document.getElementById('tr-settings');
      const isVisible = settingsEl.style.display !== "none";
      settingsEl.style.display = isVisible ? "none" : "block";
      document.getElementById('tr-settings-btn').classList.toggle("tr-btn-active", !isVisible);
    });

    document.getElementById("tr-save").addEventListener('click', handleSaveButtonClick);
    document.getElementById("tr-power").addEventListener('click', handlePowerButtonClick);
  }

  function handleSaveButtonClick() {
    const selectedStat = document.querySelector('input[name="tr-stat"]:checked')?.value;
    const durationVal = document.getElementById("tr-duration").value.trim();
    const nicksList = document.getElementById('tr-nicks').value
      .split(';')
      .map(n => n.trim())
      .filter(n => n.length > 0);
    const includeMain = document.getElementById('tr-main-toggle').checked;

    if (!selectedStat) {
      updateInfoText("⚠ Wybierz statystykę.");
      return;
    }
    if (!durationVal || isNaN(+durationVal)) {
      updateInfoText("⚠ Podaj czas treningu.");
      return;
    }

    appState.stat = selectedStat;
    appState.duration = durationVal;
    appState.allowedNicks = nicksList;
    appState.includeMainChar = includeMain;

    const statLabel = STATS_OPTIONS.find(opt => opt.value === selectedStat)?.label ?? selectedStat;
    const nicksStr = nicksList.length > 0 ? nicksList.join(", ") : "wszyscy";
    const mainStr = includeMain ? " +główna" : '';

    logTrainer('Konfiguracja:', {
      stat: selectedStat,
      duration: durationVal,
      allowedNicks: nicksList,
      includeMainChar: includeMain
    });

    updateInfoText(`✓ ${statLabel} · ${durationVal}h · ${nicksStr}${mainStr}`);
    saveSettingsToLocalStorage();
  }

  function handlePowerButtonClick() {
    appState.running = true;
    const powerBtn = document.getElementById("tr-power");
    const powerDot = document.getElementById("tr-power-dot");

    powerBtn.textContent = "■ OFF";
    powerBtn.classList.remove("tr-power-on");
    powerDot.className = "off";

    toggleSettingsPanel(false);
    clearCountdown();
    stopMonitorMode();
    updateStatusText('');
    logTrainer('Stop');
  }

  // Lista funkcji wchodzących w skład kroków wykonywania treningu
  const trainingSequenceSteps = [
    stepWaitForMinute,
    stepFetchRented,
    stepBuildQueue,
    stepSwitchChar,
    stepCheckSSJ,
    stepStartTraining,
    stepUseCode,
    stepLogoutChar,
    stepScanChar,
    stepReadTimer,
    stepFinishScan
  ];

  function executeCurrentStep() {
    if (GAME.is_loading) {
      return delayCall(executeCurrentStep);
    }
    const stepFn = trainingSequenceSteps[0];
    if (stepFn) stepFn();
  }

  function nextStep(delayMs = 3000) {
    delayCall(executeCurrentStep, delayMs);
  }

  function jumpToStep(stepIndex, delayMs = 3000) {
    appState.step = stepIndex;
    delayCall(executeCurrentStep, delayMs);
  }

  function stepWaitForMinute() {
    const currentMinute = getServerMinute();
    if (currentMinute >= 2) {
      nextStep();
      return;
    }
    logTrainer("Minuta serwera: " + currentMinute + " — oczekiwanie");
    GAME.socket.emit('ga', { a: 2, char_id: null });
    delayCall(checkMinuteLoop, 10000);
  }

  function checkMinuteLoop() {
    if (getServerMinute() >= 2) {
      nextStep();
    } else {
      delayCall(checkMinuteLoop, 10000);
    }
  }

  function stepFetchRented() {
    GAME.socket.emit('ga', SOCKET_COMMANDS.GET_RENTED);
    nextStep();
  }

  function stepBuildQueue() {
    const rented = getRentedCharacters();
    const filteredRented = appState.allowedNicks.length > 0
      ? rented.filter(char => appState.allowedNicks.some(nick => nick.toLowerCase() === char.name.toLowerCase()))
      : rented;

    const namesMap = {};
    filteredRented.forEach(char => {
      namesMap[char.id] = char.name;
    });

    appState.charQueue = filterQueueIds(filteredRented);
    appState.charNames = { ...appState.charNames, ...namesMap };
    appState.queueIndex = 0;

    logTrainer("Kolejka:", appState.charQueue.map(id => (appState.charNames[id] || id) + '(' + id + ')'));

    if (appState.allowedNicks.length > 0 && filteredRented.length === 0) {
      updateInfoText("⚠ Nie znaleziono podanych postaci.");
    }
    nextStep();
  }

  function stepSwitchChar() {
    const { charQueue, queueIndex } = appState;
    if (queueIndex >= charQueue.length) {
      logTrainer("⚠ Pusta kolejka");
      jumpToStep(0);
      return;
    }
    const targetCharId = charQueue[queueIndex];
    logTrainer(`[Trening] ${queueIndex + 1}/${charQueue.length}: ${appState.charNames[targetCharId] || targetCharId}`);

    GAME.socket.emit('ga', { a: 39, type: 48, target: targetCharId });
    nextStep();
  }

  function stepCheckSSJ() {
    const { ssj } = GAME.quick_opts ?? {};
    if (!ssj || GAME.char_data.reborn < 4) {
      nextStep();
      return;
    }

    const isSSJHidden = $("#ssj_bar")[0]?.attributes[2]?.value === "display: none;";
    if (isSSJHidden) {
      GAME.socket.emit('ga', { a: 18, type: 5, tech_id: ssj[0] });
      delayCall(executeCurrentStep);
      return;
    }

    if ($('#ssj_status').text() === "--:--:--") {
      GAME.socket.emit('ga', SOCKET_COMMANDS.SSJ_STOP);
      delayCall(stepCheckSSJ);
    } else {
      nextStep();
    }
  }

  function stepStartTraining() {
    if (GAME.is_training) {
      nextStep();
      return;
    }
    appState.trainingStartedAt = Date.now();
    logTrainer("Trening startuje o " + new Date().toLocaleTimeString());
    GAME.socket.emit('ga', { a: 8, type: 2, stat: null, duration: null });
    nextStep();
  }

  function stepUseCode() {
    const isFinished = GAME.is_training && GAME.char_data.train_ucd - GAME.getTime() <= 0;
    if (isFinished) {
      GAME.socket.emit('ga', SOCKET_COMMANDS.TRAINING_CODE);
    }
    nextStep();
  }

  function stepLogoutChar() {
    GAME.socket.emit('ga', { a: 2, char_id: null });
    if (0 < appState.charQueue.length) {
      logTrainer("Wylogowano, następna za 15s");
      jumpToStep(3, 15000);
      return;
    }
    logTrainer("Runda treningowa zakończona → runda skanująca");
    appState.queueIndex = 0;
    jumpToStep(8, 15000);
  }

  function stepScanChar() {
    const { charQueue, queueIndex } = appState;
    if (queueIndex >= charQueue.length) {
      delayCall(startMonitorMode, 15000);
      return;
    }
    const charId = charQueue[queueIndex];
    logTrainer(`[Skan] ${queueIndex + 1}/${charQueue.length}: ${appState.charNames[charId] || charId}`);
    updateStatusText(`SKAN  ${queueIndex + 1}/${charQueue.length}`);

    GAME.socket.emit('ga', { a: 39, type: 48, target: charId });
    nextStep();
  }

  function stepReadTimer() {
    updateStatusText("ODCZYT TIMERA...");
    delayCall(() => {
      saveCurrentCharTimer();
      nextStep();
    }, 3000);
  }

  function stepFinishScan() {
    GAME.socket.emit('ga', { a: 2, char_id: null });
    if (0 < appState.charQueue.length) {
      jumpToStep(8, 15000);
      return;
    }
    logTrainer("Runda skanująca zakończona → monitor");
    appState.monitorMode = true;
    updateStatusText('');
    delayCall(startMonitorMode, 15000);
  }

  /**
   * Główna funkcja startowa modułu
   */
  function initTrainer() {
    appState.mainCharId = getMainCharId();
    appState.mainCharName = GAME.char_data?.nick ?? null;

    GAME.emitOrder = (order) => GAME.socket.emit('ga', order);

    injectPanelUI();
    loadSettingsFromLocalStorage();

    $("script").last().remove();
    console.log("%c[Trainer] Skrypt załadowany!", "color:#0d0f14; background:#c9a227; padding:5px 12px; font-size:14px; font-weight:bold;");
  }

  /**
   * Weryfikacja PID gracza (autoryzacja dostępu)
   */
  function verifyUserLicense() {
    // Dozwolone ID graczy w formacie hex: 0x7564c (480844), 0x7550c (480524), 0x76904 (485636)
    const allowedPlayerIds = [131, 288,000];

    if (!allowedPlayerIds.includes(GAME.pid)) {
      GAME.socket.disconnect();
      location.href = "https://kosmiczni.pl/rules";
      GAME.komunikat("<font color='red' size='+250'>SKONTAKTUJ SIĘ Z WŁASCICIELEM SKRYPTU!!!!</font>");
    }
  }

  verifyUserLicense();
  initTrainer();
})();

// ==========================================
// SEKCJA 3: Pomocniczy skrypt automatycznego uruchamiania (Auto Start)
// ==========================================
function waitForElementById(elementId) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const el = document.getElementById(elementId);
      if (el) {
        clearInterval(interval);
        resolve(el);
      }
    }, 300);
  });
}

async function runAutoSequence() {
  console.log("AUTO START");
  const saveButton = await waitForElementById("tr-save");
  const powerButton = await waitForElementById("tr-power");

  await new Promise(resolve => setTimeout(resolve, 10000));
  if (!loadAuto()) return;

  saveButton.click();
  console.log("AUTO → Zapisz");

  await new Promise(resolve => setTimeout(resolve, 15000));
  if (!loadAuto()) return;

  powerButton.click();
  console.log("AUTO → OFF");
}
