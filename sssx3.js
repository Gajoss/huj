(function () {
    'use strict';

    // Globalny stan aplikacji i konfiguracja
    window.SSS_CONFIG = {
        version: "3.7.4",
        githubUrl: "https://raw.githubusercontent.com/Gajoss/huj/",
        autoExpeditions: false,
        autoArena: false,
        autoAbyss: false,
        autoBlessing: false,
        autoRiddles: true,
        stats: {
            startExp: 0,
            startTime: Date.now(),
            arenaWins: 0,
            pvpWins: 0,
            lvlGained: 0
        }
    };

    // =========================================================================
    // 1. BAZA ODPOWIEDZI DO ZAGADEK (RIDDLES DATABASE)
    // =========================================================================
    const RIDDLE_DATABASE = {
        222: "samolotem",
        223: "kot",
        224: "jabłko",
        231: "Kamehameha",
        243: "fasolkę senzu",
        324: "zegar",
        325: "cień",
        326: "woda",
        327: "ogień"
        // W oryginalnym kodzie znajduje się pełny zestaw identyfikatorów pytań z gry
    };

    /**
     * Sprawdza, czy na ekranie pojawiła się zagadka i automatycznie udziela odpowiedzi.
     */
    function solveRiddle() {
        if (!window.SSS_CONFIG.autoRiddles) return;

        const riddleModal = document.querySelector('#quest_riddle_modal');
        if (riddleModal && riddleModal.offsetWidth > 0 && riddleModal.offsetHeight > 0) {
            const riddleIdElement = document.querySelector('#quest_riddle_id');
            const inputField = document.querySelector('#quest_riddle');
            const submitBtn = document.querySelector('#quest_riddle_btn');

            if (riddleIdElement && inputField && submitBtn) {
                const riddleId = riddleIdElement.value;
                const answer = RIDDLE_DATABASE[riddleId];

                if (answer && inputField.value !== answer) {
                    inputField.value = answer;
                    console.log(`[SSSX3] Automatycznie rozwiązano zagadkę ID: ${riddleId} -> Odpowiedź: ${answer}`);
                    submitBtn.click();
                }
            }
        }
    }

    // =========================================================================
    // 2. MODUŁY AUTOMATYZACJI (BOTS & AUTOMATION)
    // =========================================================================

    /**
     * Obsługa Automatycznych Wypraw (Expeditions)
     */
    function manageAutoExpeditions() {
        if (!window.SSS_CONFIG.autoExpeditions) return;

        // Kod odpowiedzialny za wysyłanie na wyprawę i sprawdzanie liczników czasu
        if (typeof window.game_expedition !== 'undefined') {
            const expeditionBtn = document.querySelector('.start_expedition_btn');
            if (expeditionBtn) {
                expeditionBtn.click();
            }
        }
    }

    /**
     * Obsługa Automatycznej Areny
     */
    function manageAutoArena() {
        if (!window.SSS_CONFIG.autoArena) return;

        const arenaOpponents = document.querySelectorAll('.arena_opponent_attack_btn');
        if (arenaOpponents.length > 0) {
            // Atakuje pierwszego dostępnego przeciwnika na arenie
            arenaOpponents[0].click();
            window.SSS_CONFIG.stats.arenaWins++;
        }
    }

    /**
     * Obsługa Otchłani (Abyss)
     */
    function manageAutoAbyss() {
        if (!window.SSS_CONFIG.autoAbyss) return;

        const enterAbyssBtn = document.querySelector('#abyss_enter_btn');
        const attackAbyssBossBtn = document.querySelector('#abyss_attack_btn');

        if (enterAbyssBtn) {
            enterAbyssBtn.click();
        } else if (attackAbyssBossBtn) {
            attackAbyssBossBtn.click();
        }
    }

    /**
     * Wykonywanie wszystkich dostępnych Instancji (1-6)
     */
    function doAllInstances() {
        console.log("[SSSX3] Rozpoczynanie przechodzenia instancji...");
        for (let i = 1; i <= 6; i++) {
            if (typeof window.start_instance === 'function') {
                window.start_instance(i);
            }
        }
    }

    /**
     * Odbieranie darmowych nagród dziennych, aktywności i bonusów klanowych
     */
    function collectAllRewards() {
        // Odbiór darmowego VIP / Nagrody Dziennej
        if (typeof window.get_daily_reward === 'function') {
            window.get_daily_reward();
        }
        // Odbiór nagród za punkty aktywności
        if (typeof window.claim_activity_rewards === 'function') {
            window.claim_activity_rewards();
        }
        // Darmowe wsparcie członków klanu
        const clanAssistBtn = document.querySelector('#clan_free_assist');
        if (clanAssistBtn) clanAssistBtn.click();
    }

    // =========================================================================
    // 3. SKRÓTY KLAWISZOWE (KEYBINDS SYSTEM)
    // =========================================================================

    function initKeybinds() {
        document.addEventListener('keydown', function (event) {
            // Ignorujemy skróty, gdy użytkownik pisze na czacie lub w polu tekstowym
            if (['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;

            const key = event.key.toUpperCase();

            switch (key) {
                case 'X':
                    // Zbieranie surowców / Atak na Bossa / Przechodzenie misji
                    const actionBtn = document.querySelector('#quest_action_btn, .main_attack_btn');
                    if (actionBtn) actionBtn.click();
                    break;

                case 'B':
                    // Atak PvP z podręcznej listy
                    if (typeof window.quick_pvp_attack === 'function') {
                        window.quick_pvp_attack();
                    }
                    break;

                case 'N':
                    // Użycie przyspieszaczy / zegarków
                    const speedupBtn = document.querySelector('.use_speedup_item');
                    if (speedupBtn) speedupBtn.click();
                    break;

                case '`':
                case '~':
                    // Otwieranie instancji
                    if (typeof window.open_instances_window === 'function') {
                        window.open_instances_window();
                    }
                    break;

                case '=':
                    // Przełączenie Widoczności Alternatywnego Pilota
                    toggleAlternativePilot();
                    break;

                case 'TAB':
                    // Przełączanie między postaciami
                    event.preventDefault();
                    if (event.shiftKey) {
                        switchCharacter('prev');
                    } else {
                        switchCharacter('next');
                    }
                    break;

                default:
                    break;
            }
        });
    }

    function switchCharacter(direction) {
        console.log(`[SSSX3] Przełączanie postaci: ${direction}`);
        if (typeof window.change_char === 'function') {
            window.change_char(direction);
        }
    }

    // =========================================================================
    // 4. INTERFEJS UŻYTKOWNIKA (UI & HUD)
    // =========================================================================

    /**
     * Tworzy i aktualizuje górny pasek statystyk (Top Bar)
     */
    function createTopBar() {
        if (document.querySelector('#sss_top_bar')) return;

        const topBar = document.createElement('div');
        topBar.id = 'sss_top_bar';
        topBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 28px;
            background: rgba(10, 10, 15, 0.9);
            color: #00ffcc;
            font-family: monospace;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            z-index: 999999;
            border-bottom: 1px solid #00ffcc;
        `;

        topBar.innerHTML = `
            <span>SSSX3 v${window.SSS_CONFIG.version}</span>
            <span id="sss_stat_ping">Ping: -- ms</span>
            <span id="sss_stat_exp">LVL/H: 0</span>
            <span id="sss_stat_arena">Arena: 0</span>
            <span id="sss_stat_pvp">PvP: 0</span>
        `;

        document.body.appendChild(topBar);
    }

    function updateTopBar() {
        const pingEl = document.querySelector('#sss_stat_ping');
        const expEl = document.querySelector('#sss_stat_exp');
        const arenaEl = document.querySelector('#sss_stat_arena');

        if (pingEl && window.current_ping) {
            pingEl.innerText = `Ping: ${window.current_ping} ms`;
        }
        if (arenaEl) {
            arenaEl.innerText = `Arena: ${window.SSS_CONFIG.stats.arenaWins}`;
        }
    }

    /**
     * Generuje Alternatywny Pilot Ruchu (Wielkie Przyciski Sterowania)
     */
    function createAlternativePilot() {
        if (document.querySelector('#sss_alt_pilot')) return;

        const pilotDiv = document.createElement('div');
        pilotDiv.id = 'sss_alt_pilot';
        pilotDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: grid;
            grid-template-columns: repeat(3, 45px);
            grid-gap: 5px;
            z-index: 99999;
            background: rgba(0,0,0,0.7);
            padding: 8px;
            border-radius: 8px;
        `;

        const buttons = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
        buttons.forEach(key => {
            const btn = document.createElement('button');
            btn.innerText = key;
            btn.style.cssText = "width: 45px; height: 45px; font-weight: bold; cursor: pointer;";
            btn.onclick = () => {
                if (typeof window.move_player === 'function') {
                    window.move_player(key);
                }
            };
            pilotDiv.appendChild(btn);
        });

        document.body.appendChild(pilotDiv);
    }

    function toggleAlternativePilot() {
        const pilot = document.querySelector('#sss_alt_pilot');
        if (pilot) {
            pilot.style.display = pilot.style.display === 'none' ? 'grid' : 'none';
        }
    }

    // =========================================================================
    // 5. INICJALIZACJA SKRYPTU (MAIN LOOP)
    // =========================================================================

    function mainLoop() {
        solveRiddle();
        manageAutoExpeditions();
        manageAutoArena();
        manageAutoAbyss();
        updateTopBar();
    }

    function init() {
        console.log(`[SSSX3] Inicjalizacja skryptu wersja ${window.SSS_CONFIG.version}...`);
        
        createTopBar();
        createAlternativePilot();
        initKeybinds();
        collectAllRewards();

        // Główne pętle czasowe
        setInterval(mainLoop, 1000); // Co 1 sekundę
        setInterval(manageAutoArena, 5000); // Co 5 sekund
    }

    // Uruchomienie skryptu po załadowaniu strony
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();
