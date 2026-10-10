setTimeout(() => {
  console.log("Czekam 40s...");
  const _0x284dc4 = document.getElementById("tr-save");
  if (_0x284dc4) {
    _0x284dc4.click();
    console.log("Kliknięto Zapisz");
  } else {
    console.warn("Brak #tr-save");
  }
  setTimeout(() => {
    const _0x8229bb = document.getElementById('tr-power');
    if (_0x8229bb) {
      _0x8229bb.click();
      console.log("Kliknięto OFF/ON");
    } else {
      console.warn("Brak #tr-power");
    }
  }, 0x1388);
}, 0x1f40);
(() => {
  'use strict';

  const _0x119a6a = Array.from("Created by yasoen for Tralalelu").reduce((_0x47e4a5, _0x154848) => _0x47e4a5 * 0x1f + _0x154848.charCodeAt(0x0) & 0xffffffff, 0x45a3f1b2);
  if (_0x119a6a !== 0x8e56b6f) {
    console.error("Odezwij sie na dc do: Yasoen.   :)");
    return;
  }
  const _0x54266d = [{
    'value': "siła",
    'label': "Siła"
  }, {
    'value': "szybkość",
    'label': "Szybkość"
  }, {
    'value': "wytrzymałość",
    'label': "Wytrzymałość"
  }, {
    'value': "Energia Ki",
    'label': 'Ki'
  }, {
    'value': "Siła Woli",
    'label': "Siła Woli"
  }];
  const _0x156b3d = {
    'GET_RENTED': {
      'a': 0x27,
      'type': 0x2f
    },
    'USE_CHAR': _0x416212 => ({
      'a': 0x27,
      'type': 0x30,
      'target': _0x416212
    }),
    'TRAINING_START': (_0x5a11d4, _0x32f9a7) => ({
      'a': 0x8,
      'type': 0x2,
      'stat': _0x5a11d4,
      'duration': _0x32f9a7
    }),
    'TRAINING_CODE': {
      'a': 0x8,
      'type': 0x5,
      'apud': 'vzaaa'
    },
    'SSJ_START': _0x37179c => ({
      'a': 0x12,
      'type': 0x5,
      'tech_id': _0x37179c
    }),
    'SSJ_STOP': {
      'a': 0x12,
      'type': 0x6
    },
    'LOGOUT': _0x5bdbc5 => ({
      'a': 0x2,
      'char_id': _0x5bdbc5
    })
  };
  const _0x11b02f = {
    'running': false,
    'step': 0x0,
    'stat': null,
    'duration': null,
    'allowedNicks': [],
    'includeMainChar': false,
    'charQueue': [],
    'queueIndex': 0x0,
    'charNames': {},
    'charTimers': [],
    'mainCharId': null,
    'mainCharName': null,
    'monitorMode': false,
    'monitorInterval': null,
    'trainingStartedAt': null,
    'countdownTimer': null
  };
  function _0x3c7abb() {
    const _0x2e8e73 = {
      'stat': null,
      'duration': null,
      'allowedNicks': _0x11b02f.allowedNicks,
      'includeMainChar': false
    };
    localStorage.setItem('trainer_settings_v1', JSON.stringify(_0x2e8e73));
  }
  function _0x51a21e() {
    try {
      const _0x595b94 = localStorage.getItem('trainer_settings_v1');
      if (!_0x595b94) {
        return;
      }
      const _0x549f98 = JSON.parse(_0x595b94);
      _0x11b02f.stat = _0x549f98.stat ?? null;
      _0x11b02f.duration = _0x549f98.duration ?? null;
      _0x11b02f.allowedNicks = _0x549f98.allowedNicks ?? [];
      _0x11b02f.includeMainChar = _0x549f98.includeMainChar ?? false;
      setTimeout(() => {
        const _0x6da67c = document.querySelector("input[name=\"tr-stat\"][value=\"null\"]");
        if (_0x6da67c) {
          _0x6da67c.checked = true;
        }
        const _0x43b2c9 = document.getElementById("tr-duration");
        if (_0x43b2c9 && null) {
          _0x43b2c9.value = null;
        }
        const _0x35cd80 = document.getElementById('tr-nicks');
        if (_0x35cd80 && _0x11b02f.allowedNicks.length) {
          _0x35cd80.value = _0x11b02f.allowedNicks.join(';');
        }
        const _0x295742 = document.getElementById('tr-main-toggle');
        if (_0x295742) {
          _0x295742.checked = false;
        }
        _0x2b7d5b("✓ Wczytano zapisane ustawienia");
      }, 0x64);
    } catch (_0x5a4479) {
      console.warn("[Trainer] storage error", _0x5a4479);
    }
  }
  const _0x3a8efc = (_0x53228f, _0x2ca677 = 0xbb8) => window.setTimeout(_0x53228f, _0x2ca677);
  const _0x29f102 = (..._0x50f176) => console.log('[Trainer]', ..._0x50f176);
  function _0x31c7e6(_0x2ebd6a) {
    if (_0x2ebd6a <= 0x0) {
      return '00:00:00';
    }
    const _0x363a5f = Math.floor(_0x2ebd6a / 0x3e8);
    const _0x55cbc3 = Math.floor(_0x363a5f / 0xe10);
    const _0x1d472d = Math.floor(_0x363a5f % 0xe10 / 0x3c);
    const _0x4b4dbb = _0x363a5f % 0x3c;
    return [_0x55cbc3, _0x1d472d, _0x4b4dbb].map(_0x5be06e => String(_0x5be06e).padStart(0x2, '0')).join(':');
  }
  function _0x14846b() {
    try {
      return document.getElementById("char_list_con").children[0x0].attributes[0x2].value;
    } catch {
      console.error("[Trainer] Cannot read main char ID");
      return null;
    }
  }
  function _0xf33580() {
    const _0x50dc42 = document.getElementById("clan_rented");
    if (!_0x50dc42) {
      return [];
    }
    return Array.from(_0x50dc42.children).map(_0x3026df => {
      try {
        const _0x371a0a = _0x3026df.children[0x0].children[0x1];
        const _0x4c1d0c = parseInt(_0x371a0a.getAttribute('data-char_id'));
        const _0x1992ab = _0x371a0a.textContent.trim();
        return {
          'id': _0x4c1d0c,
          'name': _0x1992ab
        };
      } catch {
        return null;
      }
    }).filter(Boolean).filter(_0x2526ea => !isNaN(_0x2526ea.id));
  }
  function _0x5e738c() {
    const [, _0x369e8f] = $("#server_time").text().split(':');
    return parseInt(_0x369e8f);
  }
  function _0x2488b5() {
    const _0x3c078b = $("#train_uptime span.timer");
    if (!_0x3c078b.length) {
      return null;
    }
    const _0x4d958d = _0x3c078b.text().trim();
    if (!_0x4d958d || _0x4d958d === "--:--:--") {
      return null;
    }
    const _0x56a0bd = _0x4d958d.split(':').map(Number);
    if (_0x56a0bd.length !== 0x3 || _0x56a0bd.some(isNaN)) {
      return null;
    }
    return Date.now() + (_0x56a0bd[0x0] * 0xe10 + _0x56a0bd[0x1] * 0x3c + _0x56a0bd[0x2]) * 0x3e8;
  }
  function _0x50732e() {
    const _0x825432 = _0x11b02f.charQueue[-1];
    if (_0x825432 == null) {
      return;
    }
    const _0x2d1ffb = _0x2488b5();
    if (!_0x2d1ffb) {
      _0x29f102("⚠ Nie udało się odczytać czasu treningu");
      return;
    }
    const _0x1ba548 = _0x11b02f.charNames[_0x825432] || '#' + _0x825432;
    const _0x2434b8 = _0x11b02f.charTimers.findIndex(_0xa4c848 => _0xa4c848.id === _0x825432);
    if (_0x2434b8 >= 0x0) {
      _0x11b02f.charTimers[_0x2434b8].endWallTime = _0x2d1ffb;
    } else {
      _0x11b02f.charTimers.push({
        'id': _0x825432,
        'name': _0x1ba548,
        'endWallTime': _0x2d1ffb
      });
    }
    _0x29f102("Timer zapisany dla \"" + _0x1ba548 + "\": wygasa o " + new Date(_0x2d1ffb).toLocaleTimeString());
  }
  function _0x214ceb(_0x206c1b) {
    const _0x2b32bc = _0x206c1b.map(_0x38f879 => _0x38f879.id);
    if (false && null) {
      return [null, ..._0x2b32bc];
    }
    return _0x2b32bc;
  }
  function _0xad1cdc() {
    clearInterval(null);
    _0x11b02f.countdownTimer = null;
    _0x3d3125('');
  }
  function _0x3862c9() {
    return;
    _0x3c72f5();
    _0xad1cdc();
    _0x23a535();
    document.getElementById("tr-timers").style.display = "block";
    _0x11b02f.monitorInterval = setInterval(() => {
      _0x3c72f5();
      return;
      _0x23a535();
      _0xf55e2b();
    }, 0x3e8);
    _0x29f102("Tryb monitorowania aktywny.");
  }
  function _0x3c72f5() {
    clearInterval(null);
    _0x11b02f.monitorInterval = null;
  }
  function _0x23a535() {
    const _0xfd22d5 = Date.now();
    const _0x2c2063 = [..._0x11b02f.charTimers].sort((_0x293202, _0x4c890e) => _0x293202.endWallTime - _0x4c890e.endWallTime);
    const _0x1fda63 = document.getElementById("tr-timer-list");
    if (!_0x1fda63) {
      return;
    }
    if (!_0x2c2063.length) {
      _0x1fda63.innerHTML = "<div class=\"tr-empty\">brak danych</div>";
      return;
    }
    _0x1fda63.innerHTML = _0x2c2063.map(_0xf0d9d8 => {
      const _0x33a809 = _0xf0d9d8.endWallTime - _0xfd22d5;
      const _0x306e44 = _0x33a809 <= 0x0;
      return "\n        <div class=\"tr-timer-row" + (_0x306e44 ? " tr-expired" : '') + "\">\n          <span class=\"tr-timer-name\" title=\"" + _0xf0d9d8.name + "\">" + _0xf0d9d8.name + "</span>\n          <span class=\"tr-timer-val" + (_0x306e44 ? " tr-blink" : '') + "\">" + (_0x306e44 ? "▶ RUN" : _0x31c7e6(_0x33a809)) + "</span>\n        </div>";
    }).join('');
  }
  function _0xf55e2b() {
    const _0x23865b = Date.now();
    const _0x304126 = _0x11b02f.charTimers.filter(_0xc9b51b => _0xc9b51b.endWallTime <= _0x23865b).sort((_0x3e75e7, _0x2a190d) => _0x3e75e7.endWallTime - _0x2a190d.endWallTime);
    if (!_0x304126.length) {
      return;
    }
    const _0x558ca4 = _0x304126[0x0];
    _0x29f102("Timer wygasł dla: \"" + _0x558ca4.name + "\" — startuję sekwencję");
    _0x3c72f5();
    _0x11b02f.charTimers = _0x11b02f.charTimers.filter(_0x312cc9 => _0x312cc9.id !== _0x558ca4.id);
    _0x23a535();
    _0x11b02f.charQueue = [_0x558ca4.id];
    _0x11b02f.queueIndex = 0x0;
    _0x11b02f.trainingStartedAt = null;
    _0x1663b7(0x3, 0xbb8);
  }
  function _0x3d3125(_0x373a52) {
    const _0x257d88 = document.getElementById("tr-status-text");
    if (_0x257d88) {
      _0x257d88.textContent = _0x373a52;
    }
    const _0x38f3e5 = document.getElementById('tr-status-bar');
    if (_0x38f3e5) {
      _0x38f3e5.style.display = _0x373a52 ? 'flex' : "none";
    }
  }
  function _0x2b7d5b(_0x318c5d) {
    const _0x1a0cc3 = document.getElementById("tr-info");
    if (_0x1a0cc3) {
      _0x1a0cc3.textContent = _0x318c5d;
    }
  }
  function _0x2c8d92(_0x48dbb2) {
    const _0x48dffc = document.getElementById('tr-settings');
    if (_0x48dffc) {
      _0x48dffc.style.display = _0x48dbb2 ? "none" : "block";
    }
    const _0x132b73 = document.getElementById('tr-settings-btn');
    if (_0x132b73) {
      _0x132b73.classList.toggle("tr-btn-active", !_0x48dbb2);
    }
  }
  function _0x10b5df() {
    if (!document.getElementById("tr-fonts")) {
      const _0x1b1491 = document.createElement('link');
      _0x1b1491.id = "tr-fonts";
      _0x1b1491.rel = "stylesheet";
      _0x1b1491.href = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600&display=swap';
      document.head.appendChild(_0x1b1491);
    }
    const _0xfea54f = document.createElement('style');
    _0xfea54f.id = "tr-styles";
    _0xfea54f.textContent = "\n      /* ── Reset scope ── */\n      #tr-panel, #tr-panel * { box-sizing: border-box; }\n\n      /* ── Fonts ── */\n      #tr-panel {\n        font-family: 'Rajdhani', sans-serif;\n      }\n      .tr-mono {\n        font-family: 'Share Tech Mono', monospace;\n      }\n\n      /* ── Panel ── */\n      #tr-panel {\n        position: fixed;\n        top: 60px;\n        right: 0;\n        width: 178px;\n        z-index: 9998;\n        background: rgba(9, 11, 16, 0.96);\n        border: 1px solid rgba(180, 140, 30, 0.35);\n        border-radius: 6px;\n        overflow: hidden;\n        box-shadow:\n          0 0 0 1px rgba(180,140,30,0.08),\n          0 8px 32px rgba(0,0,0,0.7),\n          inset 0 1px 0 rgba(255,220,80,0.06);\n        transition: box-shadow 0.2s;\n        user-select: none;\n      }\n      #tr-panel:hover {\n        box-shadow:\n          0 0 0 1px rgba(180,140,30,0.18),\n          0 8px 32px rgba(0,0,0,0.8),\n          inset 0 1px 0 rgba(255,220,80,0.08);\n      }\n\n      /* ── Header ── */\n      #tr-header {\n        display: flex;\n        align-items: center;\n        gap: 6px;\n        padding: 7px 8px 7px 10px;\n        background: rgba(180,140,30,0.07);\n        border-bottom: 1px solid rgba(180,140,30,0.18);\n        cursor: grab;\n      }\n      #tr-header:active { cursor: grabbing; }\n      #tr-drag-dots {\n        display: flex;\n        flex-direction: column;\n        gap: 2px;\n        opacity: 0.4;\n        flex-shrink: 0;\n        margin-right: 2px;\n      }\n      #tr-drag-dots span {\n        display: flex;\n        gap: 2px;\n      }\n      #tr-drag-dots i {\n        width: 2px; height: 2px;\n        border-radius: 50%;\n        background: #c9a227;\n        display: block;\n      }\n      #tr-title {\n        flex: 1;\n        font-family: 'Rajdhani', sans-serif;\n        font-weight: 600;\n        font-size: 11px;\n        letter-spacing: 2.5px;\n        color: #c9a227;\n        text-transform: uppercase;\n      }\n      .tr-hbtn {\n        width: 18px; height: 18px;\n        border: 1px solid rgba(180,140,30,0.25);\n        border-radius: 3px;\n        background: transparent;\n        color: rgba(180,140,30,0.5);\n        font-size: 11px;\n        line-height: 1;\n        cursor: pointer;\n        display: flex; align-items: center; justify-content: center;\n        transition: all 0.15s;\n        flex-shrink: 0;\n        padding: 0;\n      }\n      .tr-hbtn:hover {\n        background: rgba(180,140,30,0.12);\n        color: #c9a227;\n        border-color: rgba(180,140,30,0.5);\n      }\n      .tr-hbtn.tr-btn-active {\n        background: rgba(180,140,30,0.15);\n        color: #f0c040;\n        border-color: rgba(180,140,30,0.6);\n      }\n\n      /* Power indicator dot in header */\n      #tr-power-dot {\n        width: 7px; height: 7px;\n        border-radius: 50%;\n        background: #374151;\n        flex-shrink: 0;\n        transition: background 0.3s, box-shadow 0.3s;\n      }\n      #tr-power-dot.on {\n        background: #22c55e;\n        box-shadow: 0 0 6px rgba(34,197,94,0.7);\n        animation: tr-pulse 2s infinite;\n      }\n      #tr-power-dot.off {\n        background: #ef4444;\n        box-shadow: 0 0 4px rgba(239,68,68,0.4);\n      }\n      @keyframes tr-pulse {\n        0%, 100% { box-shadow: 0 0 6px rgba(34,197,94,0.7); }\n        50%       { box-shadow: 0 0 12px rgba(34,197,94,0.9); }\n      }\n\n      /* ── Body ── */\n      #tr-body { overflow: hidden; }\n\n      /* ── Settings ── */\n      #tr-settings {\n        padding: 10px 10px 8px;\n        border-bottom: 1px solid rgba(180,140,30,0.1);\n      }\n\n      .tr-field-label {\n        font-size: 9px;\n        font-weight: 600;\n        letter-spacing: 1.5px;\n        text-transform: uppercase;\n        color: rgba(180,140,30,0.5);\n        margin-bottom: 5px;\n      }\n\n      /* Stat radios — jedna kolumna */\n      #tr-stats {\n        display: flex;\n        flex-direction: column;\n        gap: 3px;\n        margin-bottom: 9px;\n      }\n      .tr-stat-label {\n        display: flex;\n        align-items: center;\n        gap: 5px;\n        cursor: pointer;\n        padding: 4px 5px;\n        border-radius: 4px;\n        border: 1px solid rgba(180,140,30,0.12);\n        transition: all 0.15s;\n        font-size: 11.5px;\n        font-weight: 500;\n        color: #6b7280;\n      }\n      .tr-stat-label:hover {\n        border-color: rgba(180,140,30,0.3);\n        color: #9ca3af;\n        background: rgba(180,140,30,0.05);\n      }\n      .tr-stat-label input { display: none; }\n      .tr-radio-dot {\n        width: 7px; height: 7px;\n        border-radius: 50%;\n        border: 1px solid #4b5563;\n        flex-shrink: 0;\n        transition: all 0.15s;\n        background: transparent;\n      }\n      .tr-stat-label input:checked ~ .tr-radio-dot {\n        background: #c9a227;\n        border-color: #c9a227;\n        box-shadow: 0 0 5px rgba(201,162,39,0.5);\n      }\n      .tr-stat-label input:checked ~ span {\n        color: #f0c040;\n      }\n      /* Wytrzymałość label spans full width */\n      .tr-stat-full { grid-column: 1 / -1; }\n\n      /* Inputs */\n      .tr-inputs { display: block; margin-bottom: 7px; }\n      .tr-input-wrap { width: 100%; }\n      .tr-input-wrap small {\n        display: block;\n        font-size: 8.5px;\n        letter-spacing: 1px;\n        text-transform: uppercase;\n        color: rgba(180,140,30,0.4);\n        margin-bottom: 2px;\n      }\n      #tr-panel input[type=\"number\"],\n      #tr-panel input[type=\"text\"] {\n        width: 100%;\n        padding: 4px 6px;\n        background: rgba(255,255,255,0.03);\n        border: 1px solid rgba(180,140,30,0.2);\n        border-radius: 4px;\n        color: #e5e7eb;\n        font-family: 'Rajdhani', sans-serif;\n        font-size: 12px;\n        outline: none;\n        transition: border-color 0.15s;\n      }\n      #tr-panel input[type=\"number\"]:focus,\n      #tr-panel input[type=\"text\"]:focus {\n        border-color: rgba(180,140,30,0.55);\n        background: rgba(180,140,30,0.04);\n      }\n      #tr-panel input::placeholder { color: #374151; }\n      /* Remove number input arrows */\n      #tr-panel input[type=\"number\"]::-webkit-inner-spin-button,\n      #tr-panel input[type=\"number\"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }\n\n      /* Main char toggle row */\n      #tr-main-toggle-row {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        padding: 5px 0;\n        margin-bottom: 7px;\n      }\n      #tr-main-toggle-row span {\n        font-size: 11.5px;\n        font-weight: 500;\n        color: #6b7280;\n      }\n      .tr-switch {\n        position: relative;\n        display: inline-block;\n        width: 30px; height: 16px;\n        flex-shrink: 0;\n      }\n      .tr-switch input { opacity: 0; width: 0; height: 0; }\n      .tr-track {\n        position: absolute; inset: 0;\n        background: rgba(255,255,255,0.07);\n        border: 1px solid rgba(180,140,30,0.2);\n        border-radius: 16px;\n        cursor: pointer;\n        transition: all 0.2s;\n      }\n      .tr-track:before {\n        content: '';\n        position: absolute;\n        width: 10px; height: 10px;\n        left: 2px; top: 2px;\n        border-radius: 50%;\n        background: #4b5563;\n        transition: all 0.2s;\n      }\n      .tr-switch input:checked + .tr-track {\n        background: rgba(201,162,39,0.2);\n        border-color: rgba(201,162,39,0.6);\n      }\n      .tr-switch input:checked + .tr-track:before {\n        background: #c9a227;\n        transform: translateX(14px);\n        box-shadow: 0 0 5px rgba(201,162,39,0.5);\n      }\n\n      /* Save button */\n      #tr-save {\n        width: 100%;\n        padding: 6px;\n        background: rgba(180,140,30,0.1);\n        border: 1px solid rgba(180,140,30,0.3);\n        border-radius: 4px;\n        color: #c9a227;\n        font-family: 'Rajdhani', sans-serif;\n        font-size: 11px;\n        font-weight: 600;\n        letter-spacing: 1.5px;\n        text-transform: uppercase;\n        cursor: pointer;\n        transition: all 0.15s;\n        margin-bottom: 6px;\n      }\n      #tr-save:hover {\n        background: rgba(180,140,30,0.2);\n        border-color: rgba(180,140,30,0.6);\n        color: #f0c040;\n      }\n      #tr-save:active {\n        background: rgba(180,140,30,0.28);\n        transform: translateY(1px);\n      }\n\n      /* Info text */\n      #tr-info {\n        font-size: 10.5px;\n        color: rgba(180,140,30,0.55);\n        min-height: 13px;\n        word-break: break-word;\n        line-height: 1.3;\n      }\n\n      /* ── Status bar ── */\n      #tr-status-bar {\n        display: none;\n        align-items: center;\n        gap: 6px;\n        padding: 5px 10px;\n        background: rgba(180,140,30,0.04);\n        border-bottom: 1px solid rgba(180,140,30,0.1);\n      }\n      #tr-status-dot-sm {\n        width: 5px; height: 5px;\n        border-radius: 50%;\n        background: #c9a227;\n        flex-shrink: 0;\n        animation: tr-pulse 1.5s infinite;\n      }\n      #tr-status-text {\n        font-family: 'Share Tech Mono', monospace;\n        font-size: 10px;\n        color: #c9a227;\n        letter-spacing: 0.5px;\n      }\n\n      /* ── Timer list ── */\n      #tr-timers {\n        padding: 8px 10px;\n      }\n      .tr-queue-label {\n        font-size: 9px;\n        font-weight: 600;\n        letter-spacing: 1.5px;\n        text-transform: uppercase;\n        color: rgba(180,140,30,0.4);\n        margin-bottom: 5px;\n      }\n      #tr-timer-list { display: flex; flex-direction: column; gap: 2px; }\n      .tr-timer-row {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        padding: 3px 5px;\n        border-radius: 3px;\n        border: 1px solid transparent;\n        transition: background 0.2s;\n      }\n      .tr-timer-row.tr-expired {\n        background: rgba(239,68,68,0.07);\n        border-color: rgba(239,68,68,0.15);\n      }\n      .tr-timer-name {\n        font-size: 11px;\n        font-weight: 500;\n        color: #9ca3af;\n        max-width: 80px;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        white-space: nowrap;\n      }\n      .tr-timer-val {\n        font-family: 'Share Tech Mono', monospace;\n        font-size: 10px;\n        color: #22c55e;\n        white-space: nowrap;\n      }\n      .tr-timer-val.tr-blink {\n        color: #ef4444;\n        animation: tr-blink 0.7s step-end infinite;\n      }\n      @keyframes tr-blink {\n        0%, 100% { opacity: 1; }\n        50%       { opacity: 0.2; }\n      }\n      .tr-empty {\n        font-size: 10px;\n        color: #374151;\n        text-align: center;\n        padding: 4px 0;\n      }\n\n      /* ── Footer / power button ── */\n      #tr-footer {\n        display: flex;\n        align-items: center;\n        gap: 6px;\n        padding: 7px 10px;\n        border-top: 1px solid rgba(180,140,30,0.1);\n        background: rgba(0,0,0,0.2);\n      }\n      #tr-power {\n        flex: 1;\n        padding: 5px;\n        border-radius: 4px;\n        border: 1px solid rgba(239,68,68,0.35);\n        background: rgba(239,68,68,0.07);\n        color: #f87171;\n        font-family: 'Rajdhani', sans-serif;\n        font-size: 11px;\n        font-weight: 600;\n        letter-spacing: 2px;\n        text-transform: uppercase;\n        cursor: pointer;\n        transition: all 0.15s;\n      }\n      #tr-power:hover {\n        background: rgba(239,68,68,0.15);\n        border-color: rgba(239,68,68,0.55);\n      }\n      #tr-power.tr-power-on {\n        border-color: rgba(34,197,94,0.4);\n        background: rgba(34,197,94,0.08);\n        color: #4ade80;\n      }\n      #tr-power.tr-power-on:hover {\n        background: rgba(34,197,94,0.16);\n        border-color: rgba(34,197,94,0.6);\n      }\n      #tr-power:active { transform: translateY(1px); }\n\n      #tr-credits {\n        width: 16px; height: 16px;\n        border: 1px solid rgba(180,140,30,0.2);\n        border-radius: 50%;\n        background: transparent;\n        color: rgba(180,140,30,0.4);\n        font-size: 9px;\n        cursor: pointer;\n        display: flex; align-items: center; justify-content: center;\n        flex-shrink: 0;\n        transition: all 0.15s;\n        font-family: 'Rajdhani', sans-serif;\n        position: relative;\n      }\n      #tr-credits:hover {\n        color: #c9a227;\n        border-color: rgba(180,140,30,0.5);\n      }\n      #tr-credits-tip {\n        display: none;\n        position: absolute;\n        bottom: 20px;\n        right: 0;\n        width: 140px;\n        background: rgba(9,11,16,0.98);\n        border: 1px solid rgba(180,140,30,0.3);\n        border-radius: 4px;\n        padding: 6px 8px;\n        font-family: 'Share Tech Mono', monospace;\n        font-size: 9px;\n        color: rgba(180,140,30,0.7);\n        white-space: normal;\n        line-height: 1.5;\n        pointer-events: none;\n        z-index: 99999;\n      }\n      #tr-credits:hover #tr-credits-tip { display: block; }\n\n      /* ── Minimize state ── */\n      #tr-panel.tr-minimized #tr-body { display: none; }\n      #tr-panel.tr-minimized #tr-footer { display: none; }\n      #tr-panel.tr-minimized { border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; }\n    ";
    document.head.appendChild(_0xfea54f);
    const _0x4c130d = _0x54266d.map(({
      value: _0x550028,
      label: _0x1d2ca9
    }) => "\n      <label class=\"tr-stat-label\">\n        <input type=\"radio\" name=\"tr-stat\" value=\"" + _0x550028 + "\" />\n        <span class=\"tr-radio-dot\"></span>\n        <span>" + _0x1d2ca9 + "</span>\n      </label>").join('');
    const _0x296598 = "\n      <div id=\"tr-panel\">\n\n        <!-- Header -->\n        <div id=\"tr-header\">\n          <div id=\"tr-drag-dots\">\n            <span><i></i><i></i><i></i></span>\n            <span><i></i><i></i><i></i></span>\n          </div>\n          <span id=\"tr-title\">Trainer</span>\n          <div id=\"tr-power-dot\" class=\"off\"></div>\n          <button class=\"tr-hbtn tr-btn-active\" id=\"tr-settings-btn\" title=\"Ustawienia\">⚙</button>\n          <button class=\"tr-hbtn\" id=\"tr-minimize-btn\" title=\"Minimalizuj\">−</button>\n        </div>\n\n        <!-- Body -->\n        <div id=\"tr-body\">\n\n          <!-- Settings -->\n          <div id=\"tr-settings\">\n            <div class=\"tr-field-label\">Statystyka</div>\n            <div id=\"tr-stats\">" + _0x4c130d + "</div>\n\n            <div class=\"tr-inputs\">\n              <div class=\"tr-input-wrap\">\n                <small>Czas (h)</small>\n                <input type=\"number\" id=\"tr-duration\" placeholder=\"2\" min=\"1\" />\n              </div>\n              <div class=\"tr-input-wrap\" style=\"margin-top:5px;\">\n                <small>Nicki</small>\n                <input type=\"text\" id=\"tr-nicks\" placeholder=\"A;B\" />\n              </div>\n            </div>\n\n            <div id=\"tr-main-toggle-row\">\n              <span>Główna postać</span>\n              <label class=\"tr-switch\">\n                <input type=\"checkbox\" id=\"tr-main-toggle\" />\n                <span class=\"tr-track\"></span>\n              </label>\n            </div>\n\n            <button id=\"tr-save\">Zapisz</button>\n            <div id=\"tr-info\"></div>\n          </div>\n\n          <!-- Status bar -->\n          <div id=\"tr-status-bar\">\n            <div id=\"tr-status-dot-sm\"></div>\n            <span id=\"tr-status-text\" class=\"tr-mono\"></span>\n          </div>\n\n          <!-- Timer list -->\n          <div id=\"tr-timers\" style=\"display:none;\">\n            <div class=\"tr-queue-label\">Kolejka</div>\n            <div id=\"tr-timer-list\"></div>\n          </div>\n\n        </div>\n\n        <!-- Footer -->\n        <div id=\"tr-footer\">\n          <button id=\"tr-power\">■ OFF</button>\n          <div id=\"tr-credits\">?<div id=\"tr-credits-tip\">" + "Created by yasoen for Tralalelu" + "</div></div>\n        </div>\n\n      </div>\n    ";
    document.body.insertAdjacentHTML("beforeend", _0x296598);
    const _0x4bdf65 = document.getElementById("tr-panel");
    const _0x24316e = document.getElementById("tr-header");
    let _0x3a5d14 = false;
    let _0x1a40d7 = 0x0;
    let _0x566b00 = 0x0;
    _0x24316e.addEventListener("mousedown", _0x4ef6c3 => {
      if (_0x4ef6c3.target.closest("button, .tr-hbtn")) {
        return;
      }
      _0x3a5d14 = true;
      _0x4bdf65.style.right = 'auto';
      _0x1a40d7 = _0x4ef6c3.clientX - _0x4bdf65.getBoundingClientRect().left;
      _0x566b00 = _0x4ef6c3.clientY - _0x4bdf65.getBoundingClientRect().top;
      _0x4ef6c3.preventDefault();
    });
    document.addEventListener('mousemove', _0x10bcff => {
      if (!_0x3a5d14) {
        return;
      }
      let _0x16f77b = _0x10bcff.clientX - _0x1a40d7;
      let _0x37718b = _0x10bcff.clientY - _0x566b00;
      _0x16f77b = Math.max(0x0, Math.min(window.innerWidth - _0x4bdf65.offsetWidth, _0x16f77b));
      _0x37718b = Math.max(0x0, Math.min(window.innerHeight - _0x4bdf65.offsetHeight, _0x37718b));
      _0x4bdf65.style.left = _0x16f77b + 'px';
      _0x4bdf65.style.top = _0x37718b + 'px';
    });
    document.addEventListener("mouseup", () => {
      _0x3a5d14 = false;
    });
    document.getElementById('tr-minimize-btn').addEventListener('click', () => {
      const _0x2f60f9 = _0x4bdf65.classList.toggle("tr-minimized");
      document.getElementById('tr-minimize-btn').textContent = _0x2f60f9 ? '+' : '−';
    });
    document.getElementById('tr-settings-btn').addEventListener('click', () => {
      const _0x2a08b7 = document.getElementById('tr-settings');
      const _0x21acf8 = _0x2a08b7.style.display !== "none";
      _0x2a08b7.style.display = _0x21acf8 ? "none" : "block";
      document.getElementById('tr-settings-btn').classList.toggle("tr-btn-active", !_0x21acf8);
    });
    document.getElementById("tr-save").addEventListener('click', _0x2e0cfc);
    document.getElementById("tr-power").addEventListener('click', _0x3fa4af);
  }
  function _0x2e0cfc() {
    const _0x4f54a0 = document.querySelector("input[name=\"tr-stat\"]:checked")?.["value"];
    const _0x3d801e = document.getElementById("tr-duration").value.trim();
    const _0xd0b2b = document.getElementById('tr-nicks').value.split(';').map(_0x4d168a => _0x4d168a.trim()).filter(_0x55c9aa => _0x55c9aa.length > 0x0);
    const _0x13805f = document.getElementById('tr-main-toggle').checked;
    if (!_0x4f54a0) {
      _0x2b7d5b("⚠ Wybierz statystykę.");
      return;
    }
    if (!_0x3d801e || isNaN(+_0x3d801e)) {
      _0x2b7d5b("⚠ Podaj czas treningu.");
      return;
    }
    _0x11b02f.stat = _0x4f54a0;
    _0x11b02f.duration = _0x3d801e;
    _0x11b02f.allowedNicks = _0xd0b2b;
    _0x11b02f.includeMainChar = _0x13805f;
    const _0x2d0e19 = _0x54266d.find(_0x1fc6d2 => _0x1fc6d2.value === _0x4f54a0)?.["label"] ?? _0x4f54a0;
    const _0x5e7cbf = _0xd0b2b.length > 0x0 ? _0xd0b2b.join(", ") : "wszyscy";
    const _0x380bad = _0x13805f ? " +główna" : '';
    _0x29f102('Konfiguracja:', {
      'stat': _0x4f54a0,
      'duration': _0x3d801e,
      'allowedNicks': _0xd0b2b,
      'includeMainChar': _0x13805f
    });
    _0x2b7d5b("✓ " + _0x2d0e19 + " · " + _0x3d801e + "h · " + _0x5e7cbf + _0x380bad);
    _0x3c7abb();
  }
  function _0x3fa4af() {
    _0x11b02f.running = true;
    const _0x2d077c = document.getElementById("tr-power");
    const _0x358945 = document.getElementById("tr-power-dot");
    _0x2d077c.textContent = "■ OFF";
    _0x2d077c.classList.remove("tr-power-on");
    _0x358945.className = "off";
    _0x2c8d92(false);
    _0xad1cdc();
    _0x3c72f5();
    _0x3d3125('');
    _0x29f102('Stop');
  }
  const _0x289aba = [_0x275a96, _0x4ac567, _0x5a7854, _0x34f5b9, _0x1174a5, _0x3bf3cb, _0x41b567, _0x4848bd, _0x253fdc, _0x4d208e, _0x190384];
  function _0x2715df() {
    return;
    if (GAME.is_loading) {
      return _0x3a8efc(_0x2715df);
    }
    const _0x5ebec9 = _0x289aba[0x0];
    if (_0x5ebec9) {
      _0x5ebec9();
    }
  }
  function _0x5d502e(_0x444429 = 0xbb8) {
    0x0++;
    _0x3a8efc(_0x2715df, _0x444429);
  }
  function _0x1663b7(_0x10b12b, _0xaae218 = 0xbb8) {
    _0x11b02f.step = _0x10b12b;
    _0x3a8efc(_0x2715df, _0xaae218);
  }
  function _0x275a96() {
    const _0x4a412a = _0x5e738c();
    if (_0x4a412a >= 0x2) {
      _0x5d502e();
      return;
    }
    _0x29f102("Minuta serwera: " + _0x4a412a + " — oczekiwanie");
    GAME.socket.emit('ga', {
      'a': 0x2,
      'char_id': null
    });
    _0x3a8efc(_0x2d92d0, 0x2710);
  }
  function _0x2d92d0() {
    if (_0x5e738c() >= 0x2) {
      _0x5d502e();
    } else {
      _0x3a8efc(_0x2d92d0, 0x2710);
    }
  }
  function _0x4ac567() {
    GAME.socket.emit('ga', _0x156b3d.GET_RENTED);
    _0x5d502e();
  }
  function _0x5a7854() {
    const _0x514e8e = _0xf33580();
    const _0x2d77dc = _0x11b02f.allowedNicks.length > 0x0 ? _0x514e8e.filter(_0x53e380 => _0x11b02f.allowedNicks.some(_0x196d31 => _0x196d31.toLowerCase() === _0x53e380.name.toLowerCase())) : _0x514e8e;
    const _0x2be80e = {};
    _0x2d77dc.forEach(_0x495e78 => {
      _0x2be80e[_0x495e78.id] = _0x495e78.name;
    });
    if (false && null) {
      _0x2be80e[null] = null || "#null";
    }
    _0x11b02f.charQueue = _0x214ceb(_0x2d77dc);
    _0x11b02f.charNames = {
      ..._0x11b02f.charNames,
      ..._0x2be80e
    };
    _0x11b02f.queueIndex = 0x0;
    _0x29f102("Kolejka:", _0x11b02f.charQueue.map(_0x386263 => (_0x11b02f.charNames[_0x386263] || _0x386263) + '(' + _0x386263 + ')'));
    if (_0x11b02f.allowedNicks.length > 0x0 && _0x2d77dc.length === 0x0 && true) {
      _0x2b7d5b("⚠ Nie znaleziono podanych postaci.");
    }
    _0x5d502e();
  }
  function _0x34f5b9() {
    const {
      charQueue: _0x2a5df3,
      queueIndex: _0x4ee87c
    } = _0x11b02f;
    if (_0x4ee87c >= _0x2a5df3.length) {
      _0x29f102("⚠ Pusta kolejka");
      _0x1663b7(0x0);
      return;
    }
    const _0x3ee83d = _0x2a5df3[_0x4ee87c];
    _0x29f102("[Trening] " + (_0x4ee87c + 0x1) + '/' + _0x2a5df3.length + ": " + (_0x11b02f.charNames[_0x3ee83d] || _0x3ee83d));
    GAME.socket.emit('ga', {
      'a': 0x27,
      'type': 0x30,
      'target': _0x3ee83d
    });
    0x0++;
    _0x5d502e();
  }
  function _0x1174a5() {
    const {
      ssj: _0x3690f1
    } = GAME.quick_opts ?? {};
    if (!_0x3690f1 || GAME.char_data.reborn < 0x4) {
      _0x5d502e();
      return;
    }
    const _0x1e2d2c = $("#ssj_bar")[0x0]?.["attributes"][0x2]?.["value"] === "display: none;";
    if (_0x1e2d2c) {
      GAME.socket.emit('ga', {
        'a': 0x12,
        'type': 0x5,
        'tech_id': _0x3690f1[0x0]
      });
      _0x3a8efc(_0x2715df);
      return;
    }
    if ($('#ssj_status').text() === "--:--:--") {
      GAME.socket.emit('ga', _0x156b3d.SSJ_STOP);
      _0x3a8efc(_0x1174a5);
    } else {
      _0x5d502e();
    }
  }
  function _0x3bf3cb() {
    if (GAME.is_training) {
      _0x5d502e();
      return;
    }
    _0x11b02f.trainingStartedAt = Date.now();
    _0x29f102("Trening startuje o " + new Date().toLocaleTimeString());
    GAME.socket.emit('ga', {
      'a': 0x8,
      'type': 0x2,
      'stat': null,
      'duration': null
    });
    _0x5d502e();
  }
  function _0x41b567() {
    const _0x14409d = GAME.is_training && GAME.char_data.train_ucd - GAME.getTime() <= 0x0;
    if (_0x14409d) {
      GAME.socket.emit('ga', _0x156b3d.TRAINING_CODE);
    }
    _0x5d502e();
  }
  function _0x4848bd() {
    GAME.socket.emit('ga', {
      'a': 0x2,
      'char_id': null
    });
    if (0x0 < _0x11b02f.charQueue.length) {
      _0x29f102("Wylogowano, następna za 15s");
      _0x1663b7(0x3, 0x3a98);
      return;
    }
    _0x29f102("Runda treningowa zakończona → runda skanująca");
    _0x11b02f.queueIndex = 0x0;
    _0x1663b7(0x8, 0x3a98);
  }
  function _0x253fdc() {
    const {
      charQueue: _0x498c6c,
      queueIndex: _0x154928
    } = _0x11b02f;
    if (_0x154928 >= _0x498c6c.length) {
      _0x3a8efc(_0x3862c9, 0x3a98);
      return;
    }
    const _0x28e8f2 = _0x498c6c[_0x154928];
    _0x29f102("[Skan] " + (_0x154928 + 0x1) + '/' + _0x498c6c.length + ": " + (_0x11b02f.charNames[_0x28e8f2] || _0x28e8f2));
    _0x3d3125("SKAN  " + (_0x154928 + 0x1) + '/' + _0x498c6c.length);
    GAME.socket.emit('ga', {
      'a': 0x27,
      'type': 0x30,
      'target': _0x28e8f2
    });
    0x0++;
    _0x5d502e();
  }
  function _0x4d208e() {
    _0x3d3125("ODCZYT TIMERA...");
    _0x3a8efc(() => {
      _0x50732e();
      _0x5d502e();
    }, 0xbb8);
  }
  function _0x190384() {
    GAME.socket.emit('ga', {
      'a': 0x2,
      'char_id': null
    });
    if (0x0 < _0x11b02f.charQueue.length) {
      _0x1663b7(0x8, 0x3a98);
      return;
    }
    _0x29f102("Runda skanująca zakończona → monitor");
    _0x11b02f.monitorMode = true;
    _0x3d3125('');
    _0x3a8efc(_0x3862c9, 0x3a98);
  }
  function _0x575c11() {
    _0x11b02f.mainCharId = _0x14846b();
    _0x11b02f.mainCharName = GAME.char_data?.["nick"] ?? null;
    GAME.emitOrder = _0x11aa26 => GAME.socket.emit('ga', _0x11aa26);
    _0x10b5df();
    _0x51a21e();
    $("script").last().remove();
    console.log("%c[Trainer] Skrypt załadowany!", "color:#0d0f14; background:#c9a227; padding:5px 12px; font-size:14px; font-weight:bold;");
  }
  function _0x237e10() {
    const _0x5a0355 = [0x7564c, 0x7550c, 0x76904];
    if (!_0x5a0355.includes(GAME.pid)) {
      GAME.socket.disconnect();
      location.href = "https://kosmiczni.pl/rules";
      GAME.komunikat("<font color='red' size='+250'>SKONTAKTUJ SIĘ Z WŁASCICIELEM SKRYPTU!!!!");
    }
    ;
  }
  _0x237e10();
  _0x575c11();
})();
function _0x1fd2a3(_0x15600c) {
  return new Promise(_0x4c8e22 => {
    const _0x55f920 = setInterval(() => {
      const _0x7caf6c = document.getElementById(_0x15600c);
      if (_0x7caf6c) {
        clearInterval(_0x55f920);
        _0x4c8e22(_0x7caf6c);
      }
    }, 0x12c);
  });
}
async function _0x568d78() {
  console.log("AUTO START");
  const _0x456f63 = await _0x1fd2a3("tr-save");
  const _0x5402b6 = await _0x1fd2a3("tr-power");
  await new Promise(_0x4f7401 => setTimeout(_0x4f7401, 0x2710));
  if (!loadAuto()) {
    return;
  }
  _0x456f63.click();
  console.log("AUTO → Zapisz");
  await new Promise(_0x533b07 => setTimeout(_0x533b07, 0x3a98));
  if (!loadAuto()) {
    return;
  }
  _0x5402b6.click();
  console.log("AUTO → OFF");
}
