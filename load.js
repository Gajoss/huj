let isScriptLoaded = false;

$("body").on("click", ".qlink.load_afo", () => {
  if (isScriptLoaded) {
    GAME.komunikat("Skrypt został już załadowany.");
    return;
  }
  isScriptLoaded = true;

  // 1. Modifikacja interfejsu (Move Buttons & Hide Main Panel)
  setTimeout(() => {
    const buttons = document.querySelectorAll(
      ".gh_button.gh_resp, .gh_button.gh_code, .gh_button.gh_res, .gh_button.gh_lpvm, .gh_button.gh_pvp"
    );
    const topBar = document.getElementById("top_bar");
    const mainPanel = document.getElementById("main_Panel");

    if (topBar) {
      buttons.forEach((btn) => {
        btn.style.cursor = "pointer";
        const redStatus = btn.querySelector("b.gh_status.red");
        if (redStatus) {
          redStatus.remove();
        }
        topBar.appendChild(btn);
      });
    }

    if (mainPanel) {
      mainPanel.style.display = "none";
    }
  }, 2000);

  // Funkcja pomocnicza do obsługi wysuwanych paneli
  const attachPanelHover = (buttonSelector, panelId) => {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    panel.style.display = "none";

    document.querySelectorAll(buttonSelector).forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        panel.style.display = "block";
        const rect = btn.getBoundingClientRect();
        panel.style.position = "absolute";
        panel.style.left = rect.left + "px";
        panel.style.top = rect.bottom + window.scrollY + 15 + "px";
        panel.style.zIndex = 999;
      });

      btn.addEventListener("mouseleave", () => {
        setTimeout(() => {
          if (!panel.matches(":hover")) {
            panel.style.display = "none";
          }
        }, 100);
      });
    });

    panel.addEventListener("mouseleave", () => {
      panel.style.display = "none";
    });
  };

  setTimeout(() => {
    attachPanelHover(".gh_button.gh_code", "code_Panel");
    attachPanelHover(".gh_button.gh_resp", "resp_Panel");
    attachPanelHover(".gh_button.gh_res", "res_Panel");
    attachPanelHover(".gh_button.gh_lpvm", "lpvm_Panel");
    attachPanelHover(".gh_button.gh_pvp", "pvp_Panel");
  }, 6000);

  // 2. Moduł Nawigacji i Questów
  (function initQuestAndPathfinder() {
    let pathQueue = [];
    let easystarInstance = null;
    let mapGrid = [];
    let isWalking = false;
    let targetCoords = null;
    let lastCharLoc = null;
    let isMapReady = false;

    // Mapa kierunków ruchu gracza
    const directionMap = {
      "1,0": 7,
      "-1,0": 8,
      "0,1": 1,
      "0,-1": 2,
      "1,1": 3,
      "-1,-1": 6,
      "1,-1": 5,
      "-1,1": 4,
    };

    // Ładowanie biblioteki EasyStar.js z CDN
    function loadEasyStar(callback) {
      if (window.EasyStar) return callback();
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/easystarjs@0.4.3/bin/easystar-0.4.3.min.js";
      script.onload = callback;
      document.head.appendChild(script);
    }

    // Budowanie siatki do poruszania się
    function buildMapGrid() {
      const mapKey = Object.keys(GAME).find((k) => GAME[k]?.["1_1"]);
      if (!mapKey) return;

      const gameMap = GAME[mapKey];
      mapGrid = [];

      for (let y = 1; y <= GAME.map.max_y; y++) {
        const row = [];
        for (let x = 1; x <= GAME.map.max_x; x++) {
          const tile = gameMap[x + "_" + y];
          // 1 = pole po którym można chodzić, 0 = przeszkoda
          row.push(tile && tile.m === 1 ? 1 : 0);
        }
        mapGrid.push(row);
      }
    }

    function setupPathfinder() {
      easystarInstance = new EasyStar.js();
      easystarInstance.setGrid(mapGrid);
      easystarInstance.setAcceptableTiles([1]);
      easystarInstance.enableDiagonals();
    }

    function initMapData(callback) {
      const interval = setInterval(() => {
        if (
          GAME.map &&
          GAME.map.max_x > 0 &&
          GAME.map.max_y > 0 &&
          Object.keys(GAME).some((k) => GAME[k]?.["1_1"])
        ) {
          clearInterval(interval);
          buildMapGrid();
          setupPathfinder();
          isMapReady = true;
          if (callback) callback();
        }
      }, 100);
    }

    // Wykrywanie zmiany lokacji/mapy przez gracza
    function monitorLocationChange() {
      setInterval(() => {
        const currentLoc = GAME.char_data?.["loc"];
        if (currentLoc && currentLoc !== lastCharLoc) {
          lastCharLoc = currentLoc;
          isMapReady = false;
          isWalking = false;
          pathQueue = [];
          initMapData(() => updateQuestUI());
        }
      }, 200);
    }

    function calculatePath(startX, startY, endX, endY, onPathFound) {
      if (!isMapReady || !easystarInstance) return;

      easystarInstance.setGrid(mapGrid);
      easystarInstance.findPath(startX - 1, startY - 1, endX - 1, endY - 1, (path) => {
        if (!path) return;
        if (path.length && path[0].x === startX - 1 && path[0].y === startY - 1) {
          path.shift();
        }
        onPathFound(path);
      });
      easystarInstance.calculate();
    }

    // Krok po kroku wysyłanie pakietu o ruchu
    function stepNextPath() {
      if (!isWalking || !pathQueue.length) {
        return (isWalking = false);
      }

      const nextTile = pathQueue.shift();
      const currentX = GAME.char_data.x - 1;
      const currentY = GAME.char_data.y - 1;

      const diffX = nextTile.x - currentX;
      const diffY = nextTile.y - currentY;
      const dirCode = directionMap[diffX + "," + diffY];

      if (dirCode) {
        GAME.socket.emit("ga", {
          a: 4,
          dir: dirCode,
          vo: [1, 1, 0, 1, 1, 1],
        });
      }

      setTimeout(() => {
        const { x, y } = GAME.char_data;
        if (!pathQueue.length) {
          return (isWalking = false);
        }
        // Przeliczanie ścieżki na bieżąco
        calculatePath(x, y, targetCoords.x, targetCoords.y, (newPath) => {
          pathQueue = newPath || [];
          stepNextPath();
        });
      }, 100);
    }

    // Główna funkcja do automatycznego chodzenia do celu (X, Y)
    function walkTo(targetX, targetY) {
      if (!isMapReady) return;

      buildMapGrid();
      setupPathfinder();
      pathQueue = [];
      isWalking = true;
      targetCoords = { x: targetX, y: targetY };

      const { x: curX, y: curY } = GAME.char_data;
      calculatePath(curX, curY, targetX, targetY, (path) => {
        pathQueue = path || [];
        stepNextPath();
      });
    }

    window.walkTo = walkTo;

    // Parsowanie postępu questa (np. "5 / 10" -> 50%)
    function getQuestProgressPercent(questId) {
      const trackerEl = document.querySelector("#track_quest_" + questId);
      if (!trackerEl) return null;

      const span = trackerEl.querySelector("span");
      if (!span) return null;

      const match = span.textContent.match(/([\d\s]+)\s*\/\s*([\d\s]+)/);
      if (!match) return null;

      const current = Number(match[1].replace(/\s/g, ""));
      const total = Number(match[2].replace(/\s/g, ""));

      if (!current || !total) return 0;
      return Math.min(Math.round((current / total) * 100), 100);
    }

    function getMapQuests() {
      const questsList = [];
      const mapQuests = GAME.map_quests;
      if (!mapQuests) return questsList;

      for (const [coordKey, questArray] of Object.entries(mapQuests)) {
        for (const quest of questArray) {
          if (!quest || !quest.name) continue;

          const [qx, qy] = coordKey.split("_").map(Number);
          const percent = getQuestProgressPercent(quest.qb_id);

          questsList.push({
            x: qx,
            y: qy,
            name: quest.name,
            id: quest.qb_id,
            percent: percent,
          });
        }
      }
      return questsList;
    }

    // Tworzenie UI dla Questów
    function createQuestUIContainer() {
      if (document.getElementById("kwa_quest_ui")) return;

      const uiDiv = document.createElement("div");
      uiDiv.id = "kwa_quest_ui";
      uiDiv.style = `
        position: fixed;
        bottom: 20px;
        right: 10px;
        width: 360px;
        max-height: 300px;
        overflow-y: auto;
        background: rgba(0,0,0,0.85);
        border: 1px solid #00bfff;
        border-radius: 6px;
        padding: 10px;
        z-index: 9999;
        font-size: 12px;
        color: white;
      `;
      uiDiv.innerHTML = '<b style="color:#00bfff;">QUESTY LOKACJI</b><div id="kwa_quest_list"></div>';
      document.body.appendChild(uiDiv);
    }

    // Odświeżanie listy questów w UI
    function updateQuestUI() {
      const questContainer = document.getElementById("kwa_quest_list");
      if (!questContainer) return;

      const quests = getMapQuests();
      questContainer.innerHTML = "";

      quests.forEach((q) => {
        const item = document.createElement("div");
        item.style = `
          padding: 6px;
          margin-top: 6px;
          background: rgba(0,191,255,0.15);
          cursor: pointer;
          border-radius: 6px;
        `;
        item.innerHTML = `[${q.x}, ${q.y}] ${q.name}`;

        if (q.percent != null) {
          const progressBarBg = document.createElement("div");
          progressBarBg.style = `
            width: 100%;
            height: 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            margin-top: 4px;
            overflow: hidden;
          `;

          const progressBarFill = document.createElement("div");
          progressBarFill.style = `
            height: 100%;
            width: ${q.percent}%;
            background: linear-gradient(90deg, #00ff00, #00bfff);
            transition: width 0.3s;
          `;

          const progressText = document.createElement("div");
          progressText.style = "font-size:10px;margin-top:2px;color:#00ff00;";
          progressText.textContent = "Postęp: " + q.percent + "%";

          progressBarBg.appendChild(progressBarFill);
          item.appendChild(progressBarBg);
          item.appendChild(progressText);
        }

        // Auto-chodzenie po kliknięciu na quest
        item.onclick = () => walkTo(q.x, q.y);
        questContainer.appendChild(item);
      });
    }

    function startQuestLoop() {
      setInterval(updateQuestUI, 500);
    }

    function boot() {
      if (!window.GAME?.["socket"]) {
        return setTimeout(boot, 500);
      }
      loadEasyStar(() => {
        initMapData();
        monitorLocationChange();
        createQuestUIContainer();
        updateQuestUI();
        startQuestLoop();
        console.log("[KWA] QUESTY + HP BAR ✔ (poprawione minimalne procenty)");
      });
    }

    boot();
  })();

  // 3. Pasek szybkiego filtrowania rzadkości Mobów (Quick Bar)
  const quickBar = document.createElement("div");
  quickBar.id = "quick_bar";
  quickBar.style.display = "flex";
  quickBar.style.gap = "6px";
  quickBar.style.margin = "10px 0";

  const mobRarities = ["Normal", "Champion", "Elita", "Legendarny", "Epicki", "Mistyczny"];

  mobRarities.forEach((rarityName, index) => {
    const btn = document.createElement("div");
    btn.style = `
      width: 30px;
      height: 30px;
      border: 1px solid #222;
      cursor: pointer;
      background-color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: white;
      user-select: none;
      border-radius: 4px;
    `;
    btn.title = rarityName;
    btn.textContent = rarityName[0]; // Pierwsza litera nazwy

    btn.addEventListener("click", () => {
      const checkbox = document.getElementById("kws_spawner_ignore_" + index);
      if (checkbox) {
        checkbox.click();
        btn.style.backgroundColor = checkbox.checked ? "#4caf50" : "#333";
      }
    });

    quickBar.appendChild(btn);
  });

  const locationWrapper = document.getElementById("changeLocationWrapper");
  if (locationWrapper) {
    locationWrapper.insertAdjacentElement("afterend", quickBar);
  }

  const kwsSpawn = document.getElementById("kws_spawn");
  if (kwsSpawn) {
    kwsSpawn.style.display = "none";
  }
});
