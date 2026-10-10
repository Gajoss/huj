let _0x514e3d = false;
$("body").on("click", ".qlink.load_afo", () => {
  if (_0x514e3d) {
    GAME.komunikat("Skrypt został już załadowany.");
    return;
  }
  _0x514e3d = true;
  setTimeout(() => {
    const _0x3d11f0 = document.querySelectorAll(".gh_button.gh_resp, .gh_button.gh_code, .gh_button.gh_res, .gh_button.gh_lpvm, .gh_button.gh_pvp");
    const _0x37fae0 = document.getElementById("top_bar");
    const _0x24661e = document.getElementById('main_Panel');
    if (_0x37fae0) {
      _0x3d11f0.forEach(_0x2f9a94 => {
        _0x2f9a94.style.cursor = "pointer";
        const _0x4d0c89 = _0x2f9a94.querySelector("b.gh_status.red");
        if (_0x4d0c89) {
          _0x4d0c89.remove();
        }
        _0x37fae0.appendChild(_0x2f9a94);
      });
    }
    if (_0x24661e) {
      _0x24661e.style.display = "none";
    }
  }, 0x7d0);
  const _0x29617e = (_0x4d6cd5, _0x4ec929) => {
    const _0x419550 = document.getElementById(_0x4ec929);
    if (!_0x419550) {
      return;
    }
    _0x419550.style.display = "none";
    document.querySelectorAll(_0x4d6cd5).forEach(_0x389bb7 => {
      _0x389bb7.addEventListener('mouseenter', () => {
        _0x419550.style.display = 'block';
        const _0x2b0917 = _0x389bb7.getBoundingClientRect();
        _0x419550.style.position = "absolute";
        _0x419550.style.left = _0x2b0917.left + 'px';
        _0x419550.style.top = _0x2b0917.bottom + window.scrollY + 0xf + 'px';
        _0x419550.style.zIndex = 0x3e7;
      });
      _0x389bb7.addEventListener("mouseleave", () => {
        setTimeout(() => {
          if (!_0x419550.matches(":hover")) {
            _0x419550.style.display = "none";
          }
        }, 0x64);
      });
    });
    _0x419550.addEventListener("mouseleave", () => {
      _0x419550.style.display = "none";
    });
  };
  setTimeout(() => {
    _0x29617e(".gh_button.gh_code", "code_Panel");
    _0x29617e(".gh_button.gh_resp", "resp_Panel");
    _0x29617e(".gh_button.gh_res", "res_Panel");
    _0x29617e(".gh_button.gh_lpvm", "lpvm_Panel");
    _0x29617e('.gh_button.gh_pvp', "pvp_Panel");
  }, 0x1770);
  (function _0x2e8b84() {
    let _0x4e549c = [];
    let _0x14e707 = null;
    let _0x53738f = [];
    let _0x4e5f61 = false;
    let _0x24bce6 = null;
    let _0x50630b = null;
    let _0x3a978e = false;
    const _0x408e21 = {
      '1,0': 0x7,
      '-1,0': 0x8,
      '0,1': 0x1,
      '0,-1': 0x2,
      '1,1': 0x3,
      '-1,-1': 0x6,
      '1,-1': 0x5,
      '-1,1': 0x4
    };
    function _0x1f6ffb(_0x558aed) {
      if (window.EasyStar) {
        return _0x558aed();
      }
      const _0x1326ad = document.createElement("script");
      _0x1326ad.src = "https://cdn.jsdelivr.net/npm/easystarjs@0.4.3/bin/easystar-0.4.3.min.js";
      _0x1326ad.onload = _0x558aed;
      document.head.appendChild(_0x1326ad);
    }
    function _0x4a04db() {
      const _0x1835b5 = Object.keys(GAME).find(_0x4b0718 => GAME[_0x4b0718]?.["1_1"]);
      if (!_0x1835b5) {
        return;
      }
      const _0x298dc2 = GAME[_0x1835b5];
      _0x53738f = [];
      for (let _0x31fa31 = 0x1; _0x31fa31 <= GAME.map.max_y; _0x31fa31++) {
        const _0x5cc941 = [];
        for (let _0x565a62 = 0x1; _0x565a62 <= GAME.map.max_x; _0x565a62++) {
          const _0x496dc6 = _0x298dc2[_0x565a62 + '_' + _0x31fa31];
          _0x5cc941.push(_0x496dc6 && _0x496dc6.m === 0x1 ? 0x1 : 0x0);
        }
        _0x53738f.push(_0x5cc941);
      }
    }
    function _0x483f7b() {
      _0x14e707 = new EasyStar.js();
      _0x14e707.setGrid(_0x53738f);
      _0x14e707.setAcceptableTiles([0x1]);
      _0x14e707.enableDiagonals();
    }
    function _0x429915(_0x3d4980) {
      const _0x3a8cb5 = setInterval(() => {
        if (GAME.map && GAME.map.max_x > 0x0 && GAME.map.max_y > 0x0 && Object.keys(GAME).some(_0x58f1eb => GAME[_0x58f1eb]?.['1_1'])) {
          clearInterval(_0x3a8cb5);
          _0x4a04db();
          _0x483f7b();
          _0x3a978e = true;
          if (_0x3d4980) {
            _0x3d4980();
          }
        }
      }, 0x64);
    }
    function _0x5dd577() {
      setInterval(() => {
        const _0x557c36 = GAME.char_data?.["loc"];
        if (_0x557c36 && _0x557c36 !== _0x50630b) {
          _0x50630b = _0x557c36;
          _0x3a978e = false;
          _0x4e5f61 = false;
          _0x4e549c = [];
          _0x429915(() => _0x4b6a8f());
        }
      }, 0xc8);
    }
    function _0x321fa6(_0x2309d5, _0x395dc2, _0xda00c6, _0x28426e, _0x5cb63a) {
      if (!_0x3a978e || !_0x14e707) {
        return;
      }
      _0x14e707.setGrid(_0x53738f);
      _0x14e707.findPath(_0x2309d5 - 0x1, _0x395dc2 - 0x1, _0xda00c6 - 0x1, _0x28426e - 0x1, _0x31d311 => {
        if (!_0x31d311) {
          return;
        }
        if (_0x31d311.length && _0x31d311[0x0].x === _0x2309d5 - 0x1 && _0x31d311[0x0].y === _0x395dc2 - 0x1) {
          _0x31d311.shift();
        }
        _0x5cb63a(_0x31d311);
      });
      _0x14e707.calculate();
    }
    function _0x472017() {
      if (!_0x4e5f61 || !_0x4e549c.length) {
        return _0x4e5f61 = false;
      }
      const _0x2bf9e9 = _0x4e549c.shift();
      const _0x22af54 = GAME.char_data.x - 0x1;
      const _0x7e1557 = GAME.char_data.y - 0x1;
      const _0x2fd390 = _0x2bf9e9.x - _0x22af54;
      const _0x4a1201 = _0x2bf9e9.y - _0x7e1557;
      const _0x38f762 = _0x408e21[_0x2fd390 + ',' + _0x4a1201];
      if (_0x38f762) {
        GAME.socket.emit('ga', {
          'a': 0x4,
          'dir': _0x38f762,
          'vo': [0x1, 0x1, 0x0, 0x1, 0x1, 0x1]
        });
      }
      setTimeout(() => {
        const {
          x: _0x15c9e7,
          y: _0x8018c5
        } = GAME.char_data;
        if (!_0x4e549c.length) {
          return _0x4e5f61 = false;
        }
        _0x321fa6(_0x15c9e7, _0x8018c5, _0x24bce6.x, _0x24bce6.y, _0x1bfbcc => {
          _0x4e549c = _0x1bfbcc || [];
          _0x472017();
        });
      }, 0x64);
    }
    function _0x230d06(_0x4ad7f9, _0xd90c1d) {
      if (!_0x3a978e) {
        return;
      }
      _0x4a04db();
      _0x483f7b();
      _0x4e549c = [];
      _0x4e5f61 = true;
      _0x24bce6 = {
        'x': _0x4ad7f9,
        'y': _0xd90c1d
      };
      const {
        x: _0x293c0a,
        y: _0x35f6b5
      } = GAME.char_data;
      _0x321fa6(_0x293c0a, _0x35f6b5, _0x4ad7f9, _0xd90c1d, _0x30df29 => {
        _0x4e549c = _0x30df29 || [];
        _0x472017();
      });
    }
    window.walkTo = _0x230d06;
    function _0x93d51c(_0x19e29c) {
      const _0x4845c2 = document.querySelector("#track_quest_" + _0x19e29c);
      if (!_0x4845c2) {
        return null;
      }
      const _0x21b6ae = _0x4845c2.querySelector("span");
      if (!_0x21b6ae) {
        return null;
      }
      const _0x14f885 = _0x21b6ae.textContent.match(/([\d\s]+)\s*\/\s*([\d\s]+)/);
      if (!_0x14f885) {
        return null;
      }
      const _0x668b3c = Number(_0x14f885[0x1].replace(/\s/g, ''));
      const _0x20edcb = Number(_0x14f885[0x2].replace(/\s/g, ''));
      if (!_0x668b3c || !_0x20edcb) {
        return 0x0;
      }
      return Math.min(Math.round(_0x668b3c / _0x20edcb * 0x64), 0x64);
    }
    function _0x166759() {
      const _0x13358f = [];
      const _0x2b43ca = GAME.map_quests;
      if (!_0x2b43ca) {
        return _0x13358f;
      }
      for (const [_0x8475f6, _0x291fcf] of Object.entries(_0x2b43ca)) {
        for (const _0x39ce03 of _0x291fcf) {
          if (!_0x39ce03 || !_0x39ce03.name) {
            continue;
          }
          const [_0x40f397, _0x2ccd36] = _0x8475f6.split('_').map(Number);
          const _0x4de03e = _0x93d51c(_0x39ce03.qb_id);
          _0x13358f.push({
            'x': _0x40f397,
            'y': _0x2ccd36,
            'name': _0x39ce03.name,
            'id': _0x39ce03.qb_id,
            'percent': _0x4de03e
          });
        }
      }
      return _0x13358f;
    }
    function _0x532c74() {
      if (document.getElementById('kwa_quest_ui')) {
        return;
      }
      const _0x210b98 = document.createElement("div");
      _0x210b98.id = 'kwa_quest_ui';
      _0x210b98.style = "\n                position: fixed;\n                bottom: 20px;\n                right: 10px;\n                width: 360px;\n                max-height: 300px;\n                overflow-y: auto;\n                background: rgba(0,0,0,0.85);\n                border: 1px solid #00bfff;\n                border-radius: 6px;\n                padding: 10px;\n                z-index: 9999;\n                font-size: 12px;\n                color: white;\n            ";
      _0x210b98.innerHTML = "<b style=\"color:#00bfff;\">QUESTY LOKACJI</b><div id=\"kwa_quest_list\"></div>";
      document.body.appendChild(_0x210b98);
    }
    function _0x4b6a8f() {
      const _0x553978 = document.getElementById("kwa_quest_list");
      if (!_0x553978) {
        return;
      }
      const _0x139aba = _0x166759();
      _0x553978.innerHTML = '';
      _0x139aba.forEach(_0x180df7 => {
        const _0x1093d2 = document.createElement("div");
        _0x1093d2.style = "\n                    padding: 6px;\n                    margin-top: 6px;\n                    background: rgba(0,191,255,0.15);\n                    cursor: pointer;\n                    border-radius: 6px;\n                ";
        _0x1093d2.innerHTML = '[' + _0x180df7.x + ", " + _0x180df7.y + "] " + _0x180df7.name;
        if (_0x180df7.percent != null) {
          const _0x489c4e = document.createElement("div");
          _0x489c4e.style = "\n                        width: 100%;\n                        height: 8px;\n                        background: rgba(255,255,255,0.1);\n                        border-radius: 4px;\n                        margin-top: 4px;\n                        overflow: hidden;\n                    ";
          const _0x197983 = document.createElement("div");
          _0x197983.style = "\n                        height: 100%;\n                        width: " + _0x180df7.percent + "%;\n                        background: linear-gradient(90deg, #00ff00, #00bfff);\n                        transition: width 0.3s;\n                    ";
          const _0x467e3b = document.createElement("div");
          _0x467e3b.style = "font-size:10px;margin-top:2px;color:#00ff00;";
          _0x467e3b.textContent = "Postęp: " + _0x180df7.percent + '%';
          _0x489c4e.appendChild(_0x197983);
          _0x1093d2.appendChild(_0x489c4e);
          _0x1093d2.appendChild(_0x467e3b);
        }
        _0x1093d2.onclick = () => _0x230d06(_0x180df7.x, _0x180df7.y);
        _0x553978.appendChild(_0x1093d2);
      });
    }
    function _0x181071() {
      setInterval(_0x4b6a8f, 0x1f4);
    }
    function _0x29757a() {
      if (!window.GAME?.["socket"]) {
        return setTimeout(_0x29757a, 0x1f4);
      }
      _0x1f6ffb(() => {
        _0x429915();
        _0x5dd577();
        _0x532c74();
        _0x4b6a8f();
        _0x181071();
        console.log("[KWA] QUESTY + HP BAR ✔ (poprawione minimalne procenty)");
      });
    }
    _0x29757a();
  })();
  const _0x1886fe = document.createElement("div");
  _0x1886fe.id = "quick_bar";
  _0x1886fe.style.display = "flex";
  _0x1886fe.style.gap = "6px";
  _0x1886fe.style.margin = "10px 0";
  const _0x4cd405 = ["Normal", "Champion", "Elita", "Legendarny", "Epicki", "Mistyczny"];
  _0x4cd405.forEach((_0x1a82fb, _0x5179f7) => {
    const _0x4e963b = document.createElement("div");
    _0x4e963b.style = "\n            width: 30px;\n            height: 30px;\n            border: 1px solid #222;\n            cursor: pointer;\n            background-color: #333;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-size: 14px;\n            color: white;\n            user-select: none;\n            border-radius: 4px;\n        ";
    _0x4e963b.title = _0x1a82fb;
    _0x4e963b.textContent = _0x1a82fb[0x0];
    _0x4e963b.addEventListener('click', () => {
      const _0x52b88c = document.getElementById('kws_spawner_ignore_' + _0x5179f7);
      if (_0x52b88c) {
        _0x52b88c.click();
        _0x4e963b.style.backgroundColor = _0x52b88c.checked ? "#4caf50" : '#333';
      }
    });
    _0x1886fe.appendChild(_0x4e963b);
  });
  const _0x21b4fb = document.getElementById("changeLocationWrapper");
  if (_0x21b4fb) {
    _0x21b4fb.insertAdjacentElement('afterend', _0x1886fe);
  }
  const _0x1301ef = document.getElementById("kws_spawn");
  if (_0x1301ef) {
    _0x1301ef.style.display = "none";
  }
});
