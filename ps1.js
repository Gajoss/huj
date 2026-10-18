// Funkcja generująca skrót SHA-256 z podanego tekstu (np. z PID gracza)
async function sha256(text) {
  const encoder = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Adres pliku na GitHubie zawierającego listę dozwolonych zahashowanych PID-ów
const ACCESS_URL = "https://raw.githubusercontent.com/Gajoss/huj/refs/heads/main/sss.txt;

// Automatyczne uruchomienie mechanizmu sprawdzającego co 4 sekundy
(function () {
  const getGlobalContext = function () {
    let win;
    try {
      win = Function("return (function() {}.constructor(\"return this\")(rix));")();
    } catch (e) {
      win = window;
    }
    return win;
  };
  const globalWin = getGlobalContext();
  globalWin.setInterval(antiDebugProtection, 4000);
})();

// Główna funkcja sprawdzająca dostęp gracza
async function checkAccessAndRun(callbackFunction) {
  
  // Zabezpieczenia utrudniające debugowanie i modyfikację skryptu w konsoli przeglądarki
  const guardFunction = (function () {
    let isExecuting = true;
    return function (context, fn) {
      const result = isExecuting ? function () {
        if (fn) {
          const res = fn.apply(context, arguments);
          fn = null;
          return res;
        }
      } : function () {};
      isExecuting = false;
      return result;
    };
  })();

  const protectedCheck = guardFunction(this, function () {
    return protectedCheck.toString().search("(((.+)+)+)+$").toString().constructor(protectedCheck).search("(((.+)+)+)+$");
  });
  protectedCheck();

  // Blokowanie/nadpisywanie konsoli w celu ukrycia działania skryptu
  const blockConsole = (function () {
    let flag = true;
    return function (context, fn) {
      const res = flag ? function () {
        if (fn) {
          const val = fn.apply(context, arguments);
          fn = null;
          return val;
        }
      } : function () {};
      flag = false;
      return res;
    };
  })();

  const sanitizeConsole = blockConsole(this, function () {
    let globalObj;
    try {
      const getWin = Function("return (function() {}.constructor(\"return this\")( ));");
      globalObj = getWin();
    } catch (err) {
      globalObj = window;
    }
    const console = globalObj.console = globalObj.console || {};
    const methods = ["log", "warn", "info", "error", "exception", "table", "trace"];
    for (let i = 0; i < methods.length; i++) {
      const bindFunc = blockConsole.constructor.prototype.bind(blockConsole);
      const methodName = methods[i];
      const originalMethod = console[methodName] || bindFunc;
      bindFunc.__proto__ = blockConsole.bind(blockConsole);
      bindFunc.toString = originalMethod.toString.bind(originalMethod);
      console[methodName] = bindFunc;
    }
  });
  sanitizeConsole();

  // Pobieranie PID gracza z obiektu gry
  const playerID = GAME?.["pid"]?.["toString"]();
  if (!playerID) {
    return console.log("Brak PID");
  }

  // Szyfrowanie PID-u i pobieranie listy uprawnień z GitHub
  const hashedPID = await sha256(playerID);
  const response = await fetch(ACCESS_URL);
  const textData = await response.text();
  const allowedHashes = textData.replace(/\r/g, '').split("\n").map(line => line.trim()).filter(Boolean);

  // Weryfikacja dostępu
  if (allowedHashes.includes(hashedPID)) {
    console.log("✅ Dostęp OK");
    callbackFunction(); // Uruchomienie głównego panelu
  } else {
    console.log("❌ Brak dostępu");
    GAME.socket.disconnect(); // Rozłączenie z serwerem gry
    location.href = "https://kosmiczni.pl/rules"; // Przekierowanie na regulamin
  }
}

// Uruchomienie skryptu po zweryfikowaniu dostępu
checkAccessAndRun(() => {
  console.log("🚀 Kod działa");
  
  (function () {
    // Pobieranie zapisanych skryptów użytkownika z pamięci przeglądarki (localStorage)
    let userScripts = JSON.parse(localStorage.getItem("dynamic_buttons_full_v8") || '[]');
    
    function saveScriptsToStorage() {
      localStorage.setItem("dynamic_buttons_full_v8", JSON.stringify(userScripts));
    }

    // Dodanie stylów dla pól tekstowych w panelu
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      input::placeholder {
        color: rgba(255,255,255,0.7);
      }
    `;
    document.head.appendChild(styleEl);

    // Tworzenie głównego kontenera panelu (w prawym górnym rogu)
    const panel = document.createElement("div");
    panel.style = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 999999;
      background: rgba(0, 90, 180, 0.35);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      font-family: Arial;
      width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      color: white;
    `;
    document.body.appendChild(panel);

    // Nagłówek panelu (z możliwością przeciągania / draggiem)
    const header = document.createElement("div");
    header.style = `
      background: #111;
      color: white;
      padding: 6px;
      cursor: move;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    `;
    
    const title = document.createElement("div");
    title.textContent = "⚙ Panel";
    
    const minimizeBtn = document.createElement("button");
    minimizeBtn.textContent = "−";
    minimizeBtn.style = `
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
    `;
    
    header.appendChild(title);
    header.appendChild(minimizeBtn);
    panel.appendChild(header);

    // Pasek nawigacji wewnątrz panelu (przyciski zakładek: Dodaj / Lista)
    const navBar = document.createElement("div");
    navBar.style = `
      display: flex;
      border-bottom: 1px solid rgba(255,255,255,0.2);
    `;
    
    const tabAddBtn = document.createElement("button");
    tabAddBtn.textContent = "➕";
    
    const tabListBtn = document.createElement("button");
    tabListBtn.textContent = "📜";
    
    [tabAddBtn, tabListBtn].forEach(btn => {
      btn.style = `
        flex: 1;
        padding: 6px;
        border: none;
        cursor: pointer;
        background: rgba(255,255,255,0.1);
        color: white;
      `;
    });
    
    navBar.appendChild(tabAddBtn);
    navBar.appendChild(tabListBtn);
    panel.appendChild(navBar);

    // Zawartość panelu
    const contentArea = document.createElement("div");
    contentArea.style.padding = "10px";
    panel.appendChild(contentArea);

    let currentTab = "add";
    let loadedFileCode = null;
    let isDragging = false;
    let startX = 0, startY = 0;

    // Obsługa przeciągania panelu myszką
    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX - panel.getBoundingClientRect().left;
      startY = e.clientY - panel.getBoundingClientRect().top;
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      panel.style.left = (e.clientX - startX) + "px";
      panel.style.top = (e.clientY - startY) + "px";
      panel.style.right = "auto";
    });
    document.addEventListener("mouseup", () => isDragging = false);

    // Obsługa minimalizacji panelu
    let isMinimized = false;
    minimizeBtn.onclick = () => {
      isMinimized = !isMinimized;
      if (isMinimized) {
        contentArea.style.display = "none";
        navBar.style.display = "none";
        panel.style.width = "140px";
        minimizeBtn.textContent = "+";
      } else {
        contentArea.style.display = "block";
        navBar.style.display = "flex";
        panel.style.width = "300px";
        minimizeBtn.textContent = "−";
      }
    };

    tabAddBtn.onclick = () => { currentTab = "add"; renderUI(); };
    tabListBtn.onclick = () => { currentTab = "list"; renderUI(); };

    // Funkcja generująca widok interfejsu w zależności od wybranej zakładki
    function renderUI() {
      contentArea.innerHTML = '';
      tabAddBtn.style.background = currentTab === "add" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)";
      tabListBtn.style.background = currentTab === "list" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)";

      // Widok zakładki: Dodawanie skryptu
      if (currentTab === "add") {
        const nameInput = document.createElement("input");
        nameInput.placeholder = "Nazwa skryptu";
        nameInput.style = `
          width: 100%;
          padding: 6px;
          background: rgba(0, 90, 180, 0.35);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          outline: none;
        `;

        const fileBtn = document.createElement("button");
        fileBtn.textContent = "📂 Wybierz plik skryptu";
        fileBtn.style = `
          width: 100%;
          margin-top: 5px;
          background: rgba(255,255,255,0.15);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
        `;

        const hiddenFileInput = document.createElement("input");
        hiddenFileInput.type = "file";
        hiddenFileInput.style.display = "none";

        const fileStatus = document.createElement("div");
        fileStatus.style = "font-size:12px; margin-top:5px;";

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "➕ Dodaj do listy";
        submitBtn.style = `
          width: 100%;
          margin-top: 5px;
          background: rgba(255,255,255,0.15);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
        `;

        contentArea.appendChild(nameInput);
        contentArea.appendChild(fileBtn);
        contentArea.appendChild(submitBtn);
        contentArea.appendChild(fileStatus);
        contentArea.appendChild(hiddenFileInput);

        fileBtn.onclick = () => hiddenFileInput.click();
        
        hiddenFileInput.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            loadedFileCode = reader.result;
            fileStatus.textContent = "📄 " + file.name;
          };
          reader.readAsText(file);
        };

        submitBtn.onclick = () => {
          const scriptName = nameInput.value.trim();
          if (!scriptName) return fileStatus.textContent = "❌ Brak nazwy skryptu";
          if (!loadedFileCode) return fileStatus.textContent = "❌ Nie wybrano pliku";

          userScripts.push({ name: scriptName, code: loadedFileCode });
          saveScriptsToStorage();

          nameInput.value = '';
          loadedFileCode = null;
          hiddenFileInput.value = '';
          fileStatus.textContent = "✔ Dodano pomyślnie!";
          
          currentTab = "list";
          renderUI();
        };
      }

      // Widok zakładki: Lista zapisanych skryptów
      if (currentTab === "list") {
        if (!userScripts.length) {
          contentArea.innerHTML = "<div>Brak zapisanych skryptów</div>";
          return;
        }

        userScripts.forEach((item, index) => {
          const row = document.createElement("div");
          row.style = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            margin-bottom: 5px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px;
          `;

          const leftSide = document.createElement("div");
          leftSide.style = "display: flex; align-items: center; flex: 1;";

          const runBtn = document.createElement("button");
          runBtn.textContent = "▶️";
          runBtn.style = `
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            padding: 4px;
            color: white;
          `;
          
          // Uruchomienie wybranego skryptu
          runBtn.onclick = () => {
            try {
              new Function(item.code)();
            } catch (err) {
              alert("Błąd wykonania skryptu: " + err.message);
            }
          };

          const nameLabel = document.createElement("div");
          nameLabel.textContent = item.name;
          nameLabel.style = "margin-left: 6px; font-size: 13px;";

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "🗑️";
          deleteBtn.style = `
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            padding: 4px;
            color: white;
          `;
          
          // Usuwanie skryptu z pamięci
          deleteBtn.onclick = () => {
            userScripts.splice(index, 1);
            saveScriptsToStorage();
            renderUI();
          };

          leftSide.appendChild(runBtn);
          leftSide.appendChild(nameLabel);
          row.appendChild(leftSide);
          row.appendChild(deleteBtn);
          contentArea.appendChild(row);
        });
      }
    }
    
    renderUI();
  })();
});

// Funkcja pułapka (anty-debug / wykrywanie narzędzi deweloperskich)
function antiDebugProtection(param) {
  function recursiveDebugger(count) {
    if (typeof count === "string") {
      return function (c) {}.constructor("while (true) {}").apply("counter");
    } else if (('' + count / count).length !== 1 || count % 20 === 0) {
      (function () {
        return true;
      }).constructor("debugger").call("action");
    } else {
      (function () {
        return false;
      }).constructor("debugger").apply("stateObject");
    }
    recursiveDebugger(++count);
  }
  try {
    if (param) {
      return recursiveDebugger;
    } else {
      recursiveDebugger(0);
    }
  } catch (e) {}
}
```[cite: 9]
