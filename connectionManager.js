/**
 * Menedżer Połączeń i Automatyzacji (KwsConnectionManager)
 * Odpowiada za monitorowanie stanu połączenia z serwerem gry, obsługę automatycznego
 * ponownego logowania oraz zarządzanie panelami pomocniczymi (RUN oraz Panel R).
 */
class KwsConnectionManager {
  constructor() {
    this.isRunning = false;
    console.log("KWS: utworzono nowy monitor połączenia");
    this.runConnectionMonitor();
  }

  /**
   * Ustawia lub resetuje ciasteczko sesji/rekonnektu gracza.
   * @param {boolean} isReset - czy zresetować ID postaci
   */
  setReconnectionCookie(isReset = false) {
    const expiresDate = new Date();
    expiresDate.setTime(expiresDate.getTime() + 86400000); // 24 godziny
    let expires = "expires=" + expiresDate.toUTCString();
    var charId = isReset ? '' : GAME.char_id;
    console.log("KWS: ustawianie ciasteczka ponownego połączenia = %s", charId);
    document.cookie = "kwsreccharid=" + charId + ';' + expires + ";path=/;domain=kosmiczni.pl";
    document.cookie = "kwsreccharid=" + charId + ';' + expires + ";path=/";
  }

  /**
   * Pobiera ID postaci z ciasteczka rekonnektu.
   * @returns {string} ID postaci lub pusty ciąg
   */
  getReconnectionCookie() {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) == " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf("kwsreccharid=") == 0) {
        return cookie.substring("kwsreccharid=".length, cookie.length);
      }
    }
    return '';
  }

  /**
   * Przekierowuje użytkownika na stronę główną po rozłączeniu.
   */
  redirectToMain() {
    console.log("KWS: przekierowanie do strony głównej po rozłączeniu");
    this.isRunning = false;
    GAME.redirect(locals.main_url, 0);
  }

  /**
   * Wylogowuje użytkownika.
   */
  logout() {
    console.log("KWS: wylogowanie po rozłączeniu");
    const order = { a: 0x1 };
    GAME.emitOrder(order);
    setTimeout(this.redirectToMain, 200);
  }

  /**
   * Ponownie loguje postać na podstawie zapisanego ciasteczka.
   */
  login() {
    var charId = this.getReconnectionCookie();
    if (charId != '') {
      console.log("KWS: ponowne łączenie dla ID postaci = %s", charId);
      const order = {
        a: 0x2,
        char_id: charId
      };
      GAME.emitOrder(order);
      this.setReconnectionCookie(true);
    }
  }

  /**
   * Pierwszy krok logowania (kliknięcie przycisku logowania).
   */
  clickFirstLogin() {
    console.log("KWS: próba logowania - krok 1...");
    $("#cg_login_button1").eq(0).click();
    setTimeout(this.clickSecondLogin, 30000);
  }

  /**
   * Drugi krok logowania.
   */
  clickSecondLogin() {
    console.log("KWS: próba logowania - krok 2...");
    $("#cg_login_button2").eq(0).click();
  }

  /**
   * Główna funkcja weryfikująca stan połączenia i obsługująca rekonnekt.
   */
  runConnectionMonitor() {
    this.isRunning = true;
    console.log("KWS: sprawdzanie monitora połączenia...");
    
    // Sprawdzenie czy wystąpiło rozłączenie (komunikat o wylogowaniu w DOM)
    if ($("#kom_con").find("button[data-option=\"logout\"]").length > 0) {
      console.log("KWS: wykryto rozłączenie!");
      this.setReconnectionCookie();
      this.logout();
      this.isRunning = false;
      return;
    } else {
      var charId = this.getReconnectionCookie();
      if (charId != '') {
        console.log("KWS: próba logowania...");
        var charList = [...$("li[data-option=select_char]")];
        if (charList.length != 0) {
          this.login();
        } else {
          if ($("#server_choose").is(":visible")) {
            this.clickSecondLogin();
          } else {
            this.clickFirstLogin();
          }
        }
      } else {
        console.log("KWS: logowanie nie jest wymagane...");
      }
    }
    this.isRunning = false;
  }
}

// Inicjalizacja menedżera połączeń w pętli interwału (co 40 sekund)
var kwsConnectionMonitor = undefined;
if (typeof kwsConnectionMonitorVerifier !== "undefined" && kwsConnectionMonitorVerifier) {
  clearInterval(kwsConnectionMonitorVerifier);
  kwsConnectionMonitorVerifier = undefined;
}
var kwsConnectionMonitorVerifier = setInterval(verifyConnectionManager, 40000);

function verifyConnectionManager() {
  if (typeof kwsConnectionMonitor === "undefined") {
    console.log("KWS: brak monitora połączenia - tworzenie nowego");
    kwsConnectionMonitor = new KwsConnectionManager();
  } else {
    console.log("KWS: wykryto monitor połączenia");
    if (kwsConnectionMonitor.isRunning) {
      console.log("KWS: monitor połączenia działa poprawnie!");
    } else {
      console.log("KWS: monitor połączenia nie działa, próba ponownego uruchomienia");
      kwsConnectionMonitor.runConnectionMonitor();
    }
  }
}

// ==========================================
// MODUŁ 1: Panel sterowania "RUN" (Trening)
// ==========================================
(function () {
  const existingPanel = document.getElementById("runtrening_panel");
  if (existingPanel) {
    existingPanel.remove();
  }
  let isRunEnabled = localStorage.getItem("runtrening") === 'on';
  
  const panel = document.createElement("div");
  panel.id = "runtrening_panel";
  panel.style = `
        position:fixed; bottom:10px; right:10px; background:#222; color:#fff;
        padding:8px; border-radius:8px; font-family:sans-serif; font-size:11px;
        z-index:999999; box-shadow:0 0 6px rgba(0,0,0,0.5);
    `;
  panel.innerHTML = `
        <div style="margin-bottom:5px;">RUN</div>
        <div id="toggle" style="width:36px; height:18px; background:#ccc; border-radius:18px; position:relative; cursor:pointer;">
            <div id="circle" style="width:14px; height:14px; background:white; border-radius:50%; position:absolute; top:2px; left:2px;"></div>
        </div>
        <div id="countdown" style="margin-top:5px;"></div>
    `;
  document.body.appendChild(panel);
  
  const toggleBtn = panel.querySelector("#toggle");
  const circle = panel.querySelector("#circle");

  function updateToggleUI() {
    if (isRunEnabled) {
      toggleBtn.style.background = "#4caf50";
      circle.style.left = "20px";
    } else {
      toggleBtn.style.background = "#ccc";
      circle.style.left = "2px";
    }
  }

  toggleBtn.onclick = () => {
    isRunEnabled = !isRunEnabled;
    localStorage.setItem("runtrening", isRunEnabled ? 'on' : "off");
    updateToggleUI();
  };
  updateToggleUI();
})();

// ==========================================
// MODUŁ 2: Panel R (Nagrywanie i automatyzacja PVM / PVP)
// ==========================================
(function () {
  function initPanelR() {
    if (window.__r_panel_initialized__) return;
    
    // Warunek wykrycia elementów interfejsu gry na stronie
    if (!(document.getElementById("game") || document.getElementById("map") || document.getElementById("middle") || document.querySelector("#battle") || document.querySelector(".hero") || document.querySelector(".qlink.load_afo") || document.querySelector("#chat") || (typeof GAME !== "undefined" && GAME.char_id))) {
      setTimeout(initPanelR, 500);
      return;
    }

    window.__r_panel_initialized__ = true;
    console.log("[Panel R] 🎮 Wykryto wejście na postać, uruchamianie Panelu R...");
    buildUiAndLogic();
  }

  // Nasłuchiwanie kliknięć w listę postaci
  document.addEventListener("click", function (e) {
    const charListCon = document.getElementById("char_list_con");
    if (!charListCon || !charListCon.contains(e.target)) return;
    
    sessionStorage.setItem("r_panel_char_selected_v1", '1');
    console.log("[Panel R] 👤 Kliknięto postać w #char_list_con");
    setTimeout(() => { initPanelR(); }, 300);
  }, true);

  if (sessionStorage.getItem("r_panel_char_selected_v1") === '1') {
    sessionStorage.removeItem("r_panel_char_selected_v1");
    initPanelR();
  } else {
    initPanelR();
  }

  function buildUiAndLogic() {
    console.log("[Panel R] 🚀 Uruchamianie skryptu panelu...");
    
    // Wstrzyknięcie stylów CSS dla panelu bocznego
    const style = document.createElement("style");
    style.innerHTML = `
            #rToggleBtn {
                position: fixed; right: 0; top: 72%; transform: translateY(-50%);
                background: transparent; color: white; padding: 10px;
                border-radius: 10px 0 0 10px; cursor: pointer; z-index: 9998;
                font-weight: bold; border: 2px solid white; backdrop-filter: blur(4px);
            }
            #rSidePanel {
                position: fixed; top: 55%; right: -280px; transform: translateY(-50%);
                width: 260px; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px);
                border-left: 2px solid rgba(173,216,230,0.5); border-radius: 10px 0 0 10px;
                padding: 15px; z-index: 9999; transition: right 0.3s ease;
            }
            #rSidePanel.open { right: 0; }
            #rSidePanel h3 {
                color: #ffcc66; font-size: 14px; margin: 0 0 12px 0;
                text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2);
                padding-bottom: 8px; letter-spacing: 2px;
            }
            .r-row {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 12px; color: white; font-size: 13px; padding: 6px 8px;
                background: rgba(255,255,255,0.03); border-radius: 4px;
            }
            .r-row .r-label { font-weight: bold; letter-spacing: 1px; }
            .r-row .r-status { font-size: 11px; font-weight: bold; margin-right: 8px; }
            .r-row .r-status.on { color: #4dff88; }
            .r-row .r-status.off { color: #ff6666; }
            .r-switch { position: relative; width: 40px; height: 20px; flex-shrink: 0; }
            .r-switch input { display: none; }
            .r-slider {
                position: absolute; cursor: pointer; inset: 0; background: #555;
                border-radius: 20px; transition: .2s;
            }
            .r-slider:before {
                content: ""; position: absolute; height: 16px; width: 16px;
                left: 2px; bottom: 2px; background: white; border-radius: 50%; transition: .2s;
            }
            input:checked + .r-slider { background: #4dff88; }
            input:checked + .r-slider:before { transform: translateX(20px); }
            .r-info {
                font-size: 10px; color: #999; text-align: center; margin-top: 10px;
                padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); line-height: 1.5;
            }
        `;
    document.head.appendChild(style);

    // Tworzenie przycisku rozwijającego Panel R
    const toggleBtn = document.createElement("div");
    toggleBtn.id = "rToggleBtn";
    toggleBtn.innerText = 'R';
    document.body.appendChild(toggleBtn);

    // Tworzenie elementu bocznego panelu z przełącznikami trybów
    const sidePanel = document.createElement("div");
    sidePanel.id = "rSidePanel";
    sidePanel.innerHTML = `
            <h3>⚙️ TRYBY</h3>
            <div class="r-row" data-mode="pvm">
                <span class="r-label">PVM</span>
                <div style="display:flex;align-items:center;">
                    <span class="r-status off">Off</span>
                    <label class="r-switch"><input type="checkbox" data-toggle="pvm"><span class="r-slider"></span></label>
                </div>
            </div>
            <div class="r-row" data-mode="pvp">
                <span class="r-label">PVP</span>
                <div style="display:flex;align-items:center;">
                    <span class="r-status off">Off</span>
                    <label class="r-switch"><input type="checkbox" data-toggle="pvp"><span class="r-slider"></span></label>
                </div>
            </div>
            <div class="r-row" data-mode="listy">
                <span class="r-label">Listy</span>
                <div style="display:flex;align-items:center;">
                    <span class="r-status off">Off</span>
                    <label class="r-switch"><input type="checkbox" data-toggle="listy"><span class="r-slider"></span></label>
                </div>
            </div>
            <div class="r-row" data-mode="zbierajka">
                <span class="r-label">Zbierajka</span>
                <div style="display:flex;align-items:center;">
                    <span class="r-status off">Off</span>
                    <label class="r-switch"><input type="checkbox" data-toggle="zbierajka"><span class="r-slider"></span></label>
                </div>
            </div>
            <div class="r-row" data-mode="kody">
                <span class="r-label">Kody</span>
                <div style="display:flex;align-items:center;">
                    <span class="r-status off">Off</span>
                    <label class="r-switch"><input type="checkbox" data-toggle="kody"><span class="r-slider"></span></label>
                </div>
            </div>
            <div class="r-info">ℹ️ PVM: moby/fasolki/start<br>PVP: przyciski/start PVP</div>
        `;
    document.body.appendChild(sidePanel);

    toggleBtn.onclick = (e) => {
      e.stopPropagation();
      sidePanel.classList.toggle("open");
    };
    sidePanel.addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("click", () => sidePanel.classList.remove("open"));

    // Funkcje obsługi pamięci lokalnej (localStorage) dla trybów i nagranych akcji
    const getSavedModes = () => {
      try { return JSON.parse(localStorage.getItem("r_panel_modes_v7")) || {}; } catch (e) {}
      return { pvm: false, pvp: false, listy: false, zbierajka: false, kody: false };
    };
    const saveModes = (modes) => localStorage.setItem("r_panel_modes_v7", JSON.stringify(modes));
    const getRecordedClicks = (mode) => {
      try { return JSON.parse(localStorage.getItem("r_panel_clicks_v7_" + mode)) || null; } catch (e) {}
      return null;
    };
    const saveRecordedClicks = (mode, clicks) => localStorage.setItem("r_panel_clicks_v7_" + mode, JSON.stringify(clicks));
    const clearRecordedClicks = (mode) => {
      localStorage.removeItem("r_panel_clicks_v7_" + mode);
      console.log("[Panel R] 🗑️ Skasowano zapamiętane akcje dla trybu: " + mode.toUpperCase());
    };

    const currentModes = getSavedModes();
    function updateRowUI(mode, state) {
      const row = sidePanel.querySelector(`.r-row[data-mode="${mode}"]`);
      if (!row) return;
      const statusSpan = row.querySelector(".r-status");
      const checkbox = row.querySelector("input[type=\"checkbox\"]");
      statusSpan.textContent = state ? 'On' : "Off";
      statusSpan.className = "r-status " + (state ? 'on' : "off");
      checkbox.checked = state;
    }
    Object.keys(currentModes).forEach(m => updateRowUI(m, currentModes[m]));

    let isRecording = false;
    let activeMode = null;
    let recordedActions = [];

    const beanTypes = ["resp_blue", "resp_green", "resp_purple", "resp_yellow", "resp_red", "resp_magic"];
    const pvpTypes = ["pvp_Code", "pvpCODE_konto", "pvp_konto", "pvp_rb_avoid", "pvp_WI", "pvp_WK"];

    /**
     * Symuluje kliknięcie na elemencie docelowym.
     */
    function triggerClick(element) {
      if (!element) return false;
      try {
        if (typeof $ !== "undefined") {
          $(element).trigger("click");
          return true;
        }
      } catch (e) {}
      try {
        element.click();
        return true;
      } catch (e) {}
      return false;
    }

    /**
     * Sprawdza, czy element akcji jest aktywny.
     */
    function isElementActive(el) {
      if (!el) return false;
      return el.classList.contains("kws-on") || 
             el.textContent.includes("STOP") || 
             (el.querySelector(".resp_status, .pvp_status") && 
              (el.querySelector(".resp_status, .pvp_status").classList.contains("green") || 
               el.querySelector(".resp_status, .pvp_status").textContent.trim() === 'On'));
    }

    // Nasłuchiwanie kliknięć użytkownika podczas nagrywania sekwencji
    document.addEventListener("click", (e) => {
      if (!isRecording || !activeMode) return;
      
      if (activeMode === "pvm") {
        const respPanel = document.getElementById("resp_Panel");
        if (!respPanel || !respPanel.contains(e.target)) return;

        const mobTarget = e.target.closest(".kws_quick_bar > div[title]");
        if (mobTarget) {
          const title = mobTarget.getAttribute("title");
          recordedActions.push({
            type: "mob",
            selector: `.kws_quick_bar > div[title="${title}"]`,
            panelId: "resp_Panel",
            label: "Mob: " + title
          });
          saveRecordedClicks(activeMode, recordedActions);
          console.log(`[Panel R] 🔴 NAGRANO: Mob ${title} (łącznie: ${recordedActions.length})`);
          return;
        }

        const beanTarget = e.target.closest(".resp_button");
        if (beanTarget) {
          const beanClass = beanTypes.find(b => beanTarget.classList.contains(b));
          if (beanClass) {
            recordedActions.push({
              type: "bean",
              selector: `.resp_button.${beanClass}`,
              panelId: "resp_Panel",
              label: "Fasolka: " + beanClass.replace("resp_", '').toUpperCase()
            });
            saveRecordedClicks(activeMode, recordedActions);
            console.log(`[Panel R] 🔴 NAGRANO: Fasolka ${beanClass.replace("resp_", '').toUpperCase()} (łącznie: ${recordedActions.length})`);
            return;
          }
        }

        const startTarget = e.target.closest(".resp_button.resp_resp");
        if (startTarget) {
          recordedActions.push({
            type: "start",
            selector: ".resp_button.resp_resp",
            panelId: "resp_Panel",
            label: "START PVM"
          });
          saveRecordedClicks(activeMode, recordedActions);
          console.log(`[Panel R] 🔴 NAGRANO: START PVM (łącznie: ${recordedActions.length})`);
          return;
        }
      }

      if (activeMode === "pvp") {
        const pvpPanel = document.getElementById("pvp_Panel");
        if (!pvpPanel || !pvpPanel.contains(e.target)) return;

        const pvpBtnTarget = e.target.closest(".pvp_button");
        if (pvpBtnTarget) {
          if (pvpBtnTarget.classList.contains("pvp_pvp")) {
            recordedActions.push({
              type: "start",
              selector: ".pvp_button.pvp_pvp",
              panelId: "pvp_Panel",
              label: "START PVP"
            });
            saveRecordedClicks(activeMode, recordedActions);
            console.log(`[Panel R] 🔴 NAGRANO: START PVP (łącznie: ${recordedActions.length})`);
            return;
          }

          const pvpClass = pvpTypes.find(p => pvpBtnTarget.classList.contains(p));
          if (pvpClass) {
            recordedActions.push({
              type: "pvp_btn",
              selector: `.pvp_button.${pvpClass}`,
              panelId: "pvp_Panel",
              label: "PVP: " + pvpBtnTarget.textContent.replace(/On|Off/g, '').trim()
            });
            saveRecordedClicks(activeMode, recordedActions);
            console.log(`[Panel R] 🔴 NAGRANO: PVP ${pvpBtnTarget.textContent.replace(/On|Off/g, '').trim()} (łącznie: ${recordedActions.length})`);
            return;
          }
        }
      }
    }, true);

    /**
     * Odtwarza nagrane akcje automatyzacji.
     */
    async function playbackActions(actions, panelId) {
      if (!actions || actions.length === 0) {
        console.warn("[Panel R] ⚠️ Brak nagranych kliknięć do odtworzenia");
        return;
      }
      let panelEl = null;
      for (let i = 0; i < 20; i++) {
        panelEl = document.getElementById(panelId);
        if (panelEl) break;
        console.log(`[Panel R] ⏳ Oczekiwanie na panel ${panelId}... (${i + 1}/20)`);
        await new Promise(r => setTimeout(r, 500));
      }
      if (!panelEl) {
        console.error(`[Panel R] ❌ Nie znaleziono panelu ${panelId} w ciągu 10 sekund!`);
        return;
      }

      let executedCount = 0;
      console.log(`[Panel R] 🔄 ======= ODTWARZANIE ${actions.length} AKCJI =======`);
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        console.log(`[Panel R] [${i + 1}/${actions.length}] ${action.label}`);
        
        if (action.type === "start") {
          console.log("[Panel R] ⏳ Oczekiwanie 3s przed uruchomieniem START...");
          await new Promise(r => setTimeout(r, 3000));
          const startBtn = panelEl.querySelector(action.selector);
          if (startBtn) {
            for (let attempt = 1; attempt <= 3; attempt++) {
              if (isElementActive(startBtn)) {
                console.log("[Panel R]   ⏭️ Przycisk START jest już włączony (ON)");
                break;
              }
              console.log(`[Panel R]   ▶️ Próba włączenia START ${attempt}/3`);
              triggerClick(startBtn);
              executedCount++;
              await new Promise(r => setTimeout(r, 2000));
              if (isElementActive(startBtn)) {
                console.log("[Panel R]   ✅ Pomyślnie włączono START!");
                break;
              }
              if (attempt === 3) console.error("[Panel R]   ❌ Nie udało się włączyć START!");
            }
          }
          continue;
        }

        const target = panelEl.querySelector(action.selector);
        if (target) {
          triggerClick(target);
          console.log("[Panel R]   👆 Kliknięto element");
          executedCount++;
        } else {
          console.warn("[Panel R]   ⚠️ Nie znaleziono elementu: " + action.selector);
        }
        await new Promise(r => setTimeout(r, 1200));
      }
      console.log(`[Panel R] ✅ ======= ZAKOŃCZONO - wykonano ${executedCount} akcji =======`);
    }

    // Obsługa zdarzeń przełączania trybów w panelu bocznym
    sidePanel.querySelectorAll("input[data-toggle]").forEach(input => {
      input.addEventListener("change", function () {
        const mode = this.dataset.toggle;
        const isChecked = this.checked;
        console.log(`[Panel R] 🔀 Tryb ${mode.toUpperCase()}: ${isChecked ? 'ON' : "OFF"}`);
        
        const modes = getSavedModes();
        modes[mode] = isChecked;
        saveModes(modes);
        updateRowUI(mode, isChecked);

        if (isChecked) {
          clearRecordedClicks(mode);
          recordedActions = [];
          isRecording = true;
          activeMode = mode;
          saveRecordedClicks(mode, []);
          console.log(`[Panel R] ✅ [ON] NAGRYWANIE DLA ${mode.toUpperCase()} - wykonaj akcje w panelu gry`);
        } else {
          isRecording = false;
          activeMode = null;
          recordedActions = [];
          clearRecordedClicks(mode);
          console.log(`[Panel R] 🗑️ [OFF] Wyłączono i wyczyszczono pamięć trybu.`);
        }
      });
    });

    // Sekwencja automatycznego uruchamiania po starcie/odświeżeniu
    (function checkAutoRun() {
      const savedModes = getSavedModes();
      const activeEntryMode = Object.keys(savedModes).find(m => savedModes[m]);
      if (!activeEntryMode) {
        console.log("[Panel R] 🔇 Brak aktywnego trybu automatyzacji");
        return;
      }
      if (activeEntryMode !== "pvm" && activeEntryMode !== "pvp") {
        console.log(`[Panel R] ⏭️ Tryb ${activeEntryMode.toUpperCase()} nie posiada automatycznego odtwarzania`);
        recordedActions = [];
        isRecording = true;
        activeMode = activeEntryMode;
        return;
      }

      const savedActions = getRecordedClicks(activeEntryMode);
      if (!savedActions || savedActions.length === 0) {
        console.log(`[Panel R] ⚠️ Brak zapisanych kroków dla trybu ${activeEntryMode.toUpperCase()}`);
        recordedActions = [];
        isRecording = true;
        activeMode = activeEntryMode;
        return;
      }

      recordedActions = savedActions.slice();
      isRecording = true;
      activeMode = activeEntryMode;

      const targetPanelId = activeEntryMode === "pvm" ? "resp_Panel" : "pvp_Panel";
      const panelIconSelector = activeEntryMode === "pvm" 
        ? ".kws_panel_icon[data-tooltip=\"PVM\"], .kws_panel_icon[data-panel-id=\"resp_Panel\"]" 
        : ".kws_panel_icon[data-tooltip=\"PVP\"], .kws_panel_icon[data-panel-id=\"pvp_Panel\"]";

      console.log(`[Panel R] ⏰ Zaplanowano sekwencję: 48s -> AFO, 58s -> panel ${activeEntryMode.toUpperCase()}, 63s -> odtwarzanie ${savedActions.length} akcji`);
      
      setTimeout(() => {
        const afoBtn = document.querySelector(".qlink.load_afo");
        if (afoBtn) {
          console.log("[Panel R] 🔌 [48s] Klikanie przycisku \"Załaduj AFO\"...");
          triggerClick(afoBtn);
        } else {
          console.warn("[Panel R] ⚠️ Nie znaleziono przycisku AFO");
        }

        setTimeout(() => {
          const panelIcon = document.querySelector(panelIconSelector);
          if (panelIcon) {
            console.log(`[Panel R] 🔘 [58s] Klikanie ikony panelu ${activeEntryMode.toUpperCase()}`);
            triggerClick(panelIcon);
          } else {
            console.warn(`[Panel R] ⚠️ Nie znaleziono ikony panelu ${activeEntryMode.toUpperCase()}`);
          }

          setTimeout(() => {
            console.log(`[Panel R] ▶️ [63s] Uruchamianie odtwarzania akcji dla ${activeEntryMode.toUpperCase()}`);
            playbackActions(savedActions, targetPanelId);
          }, 5000);
        }, 10000);
      }, 48000);
    })();
  }
})();
