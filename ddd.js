let recordingInterval;
let recordingEnabled = JSON.parse(localStorage.getItem("recordingEnabled")) || false;
let stopReplaying = false;

// Funkcja odpowiedzialna za odtwarzanie zapisanych kliknięć
function replaySavedClicks() {
  console.log("Próba odtworzenia zapamiętanych kliknięć...");
  const savedClicks = JSON.parse(localStorage.getItem("savedClicks")) || {};
  const clickKeys = Object.keys(savedClicks);
  
  if (clickKeys.length > 0 && !stopReplaying) {
    console.log("Znaleziono zapisane kliknięcia:", clickKeys);
    clickKeys.forEach(function (className, index) {
      setTimeout(function () {
        if (!stopReplaying) {
          // Znajduje elementy po klasie i klika je
          const elements = document.querySelectorAll('.' + className);
          elements.forEach(function (element) {
            console.log("Klikanie przycisku:", className);
            element.click();
            console.log("Wykonano kliknięcie.");
            savedClicks[className] = { 'clicked': true };
            localStorage.setItem("savedClicks", JSON.stringify(savedClicks));
          });
        }
      }, index * 800); // odstęp 800ms (0x320) między kliknięciami
    });
  } else {
    console.log("Brak zapisanych kliknięć w pamięci lub zatrzymano odtwarzanie.");
  }
}

// Rozpoczęcie nagrywania kliknięć
function startRecording() {
  bindButtonsToRecord();
  recordingInterval = setInterval(checkMainPanel, 1000);
  console.log("Rozpoczęto nagrywanie kliknięć.");
  recordingEnabled = true;
  localStorage.setItem("recordingEnabled", true);
  setInterval(saveSpawnerSettings, 2000);
}

// Zatrzymanie nagrywania i wyczyszczenie danych
function stopRecording() {
  clearInterval(recordingInterval);
  localStorage.removeItem("savedClicks");
  localStorage.removeItem("selectedSpawners");
  console.log("Zatrzymano nagrywanie i wyczyszczono dane.");
  recordingEnabled = false;
  localStorage.setItem("recordingEnabled", false);
  stopReplaying = true;
}

// Sprawdzanie stanu paneli w grze
function checkMainPanel() {
  const mainPanel = document.getElementById("main_Panel");
  if (mainPanel) {
    bindButtonsToRecord();
    clearInterval(recordingInterval);
    replaySavedClicks();
  }
  const respPanel = document.getElementById("resp_Panel");
  if (respPanel) {
    bindRespButtons(".resp_button");
  }
}

// Zapisywanie pojedynczego kliknięcia do localStorage
function handleElementClick(event) {
  const targetClass = event.target.className.replace(/\s+/g, '.');
  let savedClicks = JSON.parse(localStorage.getItem('savedClicks')) || {};
  if (!savedClicks[targetClass]) {
    savedClicks[targetClass] = { 'clicked': false };
    localStorage.setItem('savedClicks', JSON.stringify(savedClicks));
    console.log("Zapisano kliknięcie klasy:", targetClass);
  }
}

function bindRespButtons(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(function (element) {
    element.addEventListener("click", handleElementClick);
  });
}

// Przypisywanie nasłuchiwania kliknięć do konkretnych przycisków automatyzacji w grze
function bindButtonsToRecord() {
  const buttonSelectors = [
    ".gh_button", ".pvp_button", ".lpvm_button", ".res_button", 
    ".code_button", ".resp_button", 
    ".qlink.manage_auto_abyss", ".qlink.manage_auto_arena", ".qlink.manage_autoExpeditions"
  ];
  
  buttonSelectors.forEach(function (selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
      element.addEventListener("click", handleElementClick);
    });
  });
}

// Tworzenie wizualnego przycisku sterującego (On/Off) w prawym górnym rogu
const toggleButton = document.createElement('button');
toggleButton.textContent = recordingEnabled ? "Off" : 'On';
toggleButton.id = "startStopButton";
toggleButton.style.position = "fixed";
toggleButton.style.top = "28px";
toggleButton.style.background = "#333";
toggleButton.style.borderRadius = '5px';
toggleButton.style.borderWidth = "5px 6px 5px 6px";
toggleButton.style.display = "block";
toggleButton.style.color = "gold";
toggleButton.style.borderColor = "rgba(0,0,0,0.9)";
toggleButton.style.right = "5px";
toggleButton.style.zIndex = '9999';

toggleButton.addEventListener('click', function () {
  if (recordingEnabled) {
    stopRecording();
  } else {
    startRecording();
  }
  toggleButton.textContent = recordingEnabled ? 'Off' : 'On';
});
document.body.appendChild(toggleButton);

// Funkcje obsługi ustawień spawnerów (ignorowanie mobów)
function restoreSpawnerSettings() {
  const selectedSpawners = JSON.parse(localStorage.getItem("selectedSpawners")) || [];
  let index = 0;
  const interval = setInterval(() => {
    if (index >= selectedSpawners.length) {
      clearInterval(interval);
      return;
    }
    const spawnerElement = document.getElementById(selectedSpawners[index]);
    if (spawnerElement) {
      spawnerElement.click();
    }
    index++;
  }, 800);
}

function saveSpawnerSettings() {
  const activeSpawners = [];
  const checkboxes = document.querySelectorAll("[id^=\"kws_spawner_ignore_\"]");
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      activeSpawners.push(checkbox.id);
    }
  });
  localStorage.setItem("selectedSpawners", JSON.stringify(activeSpawners));
}

// Inicjalizacja po załadowaniu skryptu
checkMainPanel();
const savedClicksData = JSON.parse(localStorage.getItem("savedClicks")) || {};

if (Object.keys(savedClicksData).length > 0) {
  console.log("Znaleziono zapisane kliknięcia. Uruchamianie automatyzacji startowej...");
  setTimeout(function () {
    GAME.page_switch('game_map'); // Przejście na widok mapy w grze
    setTimeout(function () {
      const loadAfoBtn = document.querySelector('.qlink.load_afo');
      if (loadAfoBtn) {
        loadAfoBtn.click(); // Kliknięcie dodatkowego modułu po 3 sekundach
      }
    }, 3000);
    setTimeout(function () {
      // Symulacja wciśnięcia klawisza "-"
      const keyEvent = new KeyboardEvent("keydown", {
        'key': '-',
        'bubbles': true,
        'cancelable': true
      });
      document.dispatchEvent(keyEvent);
    }, 5000);
  }, 4000);
  
  setTimeout(function () {
    replaySavedClicks();
    setTimeout(() => {
      restoreSpawnerSettings();
      // Nasłuchiwanie zmian w ustawieniach spawnerów
      document.querySelectorAll("[id^=\"kws_spawner_ignore_\"]").forEach(cb => {
        cb.addEventListener("change", saveSpawnerSettings);
      });
    }, 3000);
  }, 17000);
} else {
  console.log("Nie znaleziono zapisanych kliknięć w localStorage.");
}
