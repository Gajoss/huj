let _0xcaa28d;
let _0x479886 = JSON.parse(localStorage.getItem("recordingEnabled")) || false;
let _0x3a72ee = false;
function _0x1aa3de() {
  console.log("Attempting to replay saved clicks...");
  const _0x4b8dcf = JSON.parse(localStorage.getItem("savedClicks")) || {};
  const _0x3a4f18 = Object.keys(_0x4b8dcf);
  if (_0x3a4f18.length > 0x0 && !_0x3a72ee) {
    console.log("Found saved clicks:", _0x3a4f18);
    _0x3a4f18.forEach(function (_0x48c8a8, _0x2ca25e) {
      setTimeout(function () {
        if (!_0x3a72ee) {
          const _0x45fe52 = document.querySelectorAll('.' + _0x48c8a8);
          _0x45fe52.forEach(function (_0xccb07d) {
            console.log("Clicking button:", _0x48c8a8);
            _0xccb07d.click();
            console.log("Click executed.");
            _0x4b8dcf[_0x48c8a8] = {
              'clicked': true
            };
            localStorage.setItem("savedClicks", JSON.stringify(_0x4b8dcf));
          });
        }
      }, _0x2ca25e * 0x320);
    });
  } else {
    console.log("No saved clicks found in local storage or stopped replaying.");
  }
}
function _0x549347() {
  _0x554993();
  _0xcaa28d = setInterval(_0x5356ab, 0x3e8);
  console.log("Started recording clicks.");
  _0x479886 = true;
  localStorage.setItem("recordingEnabled", true);
  setInterval(_0x95116a, 0x7d0);
}
function _0xab3f() {
  clearInterval(_0xcaa28d);
  localStorage.removeItem("savedClicks");
  localStorage.removeItem("selectedSpawners");
  console.log("Stopped recording clicks and cleared data.");
  _0x479886 = false;
  localStorage.setItem("recordingEnabled", false);
  _0x3a72ee = true;
}
function _0x5356ab() {
  const _0x5b3fd3 = document.getElementById("main_Panel");
  if (_0x5b3fd3) {
    _0x554993();
    clearInterval(_0xcaa28d);
    _0x1aa3de();
  }
  const _0x2ea8a3 = document.getElementById("resp_Panel");
  if (_0x2ea8a3) {
    _0xcda6b0(".resp_button");
  }
}
function _0x7653f5(_0x7ebc2a) {
  const _0x1c5ce9 = _0x7ebc2a.target.className.replace(/\s+/g, '.');
  let _0xebb031 = JSON.parse(localStorage.getItem('savedClicks')) || {};
  if (!_0xebb031[_0x1c5ce9]) {
    _0xebb031[_0x1c5ce9] = {
      'clicked': false
    };
    localStorage.setItem('savedClicks', JSON.stringify(_0xebb031));
    console.log("Click saved:", _0x1c5ce9);
  }
}
function _0xcda6b0(_0xd7f19a) {
  const _0x35f802 = document.querySelectorAll(_0xd7f19a);
  _0x35f802.forEach(function (_0x1ec65a) {
    _0x1ec65a.addEventListener("click", _0x7653f5);
  });
}
function _0x554993() {
  const _0x582434 = [".gh_button", ".pvp_button", ".lpvm_button", ".res_button", ".code_button", ".resp_button", ".qlink.manage_auto_abyss", ".qlink.manage_auto_arena", ".qlink.manage_autoExpeditions"];
  _0x582434.forEach(function (_0x528871) {
    const _0x3447c3 = document.querySelectorAll(_0x528871);
    _0x3447c3.forEach(function (_0x4c5c33) {
      _0x4c5c33.addEventListener("click", _0x7653f5);
    });
  });
}
const _0x117be0 = document.createElement('button');
_0x117be0.textContent = _0x479886 ? "Off" : 'On';
_0x117be0.id = "startStopButton";
_0x117be0.style.position = "fixed";
_0x117be0.style.top = "28px";
_0x117be0.style.background = "#333";
_0x117be0.style.borderRadius = '5px';
_0x117be0.style.borderWidth = "5px 6px 5px 6px";
_0x117be0.style.display = "block";
_0x117be0.style.color = "gold";
_0x117be0.style.borderColor = "rgba(0,0,0,0.9)";
_0x117be0.style.right = "5px";
_0x117be0.style.zIndex = '9999';
_0x117be0.addEventListener('click', function () {
  if (_0x479886) {
    _0xab3f();
  } else {
    _0x549347();
  }
  _0x117be0.textContent = _0x479886 ? 'Off' : 'On';
});
document.body.appendChild(_0x117be0);
function _0x6c6eae() {
  const _0x305396 = JSON.parse(localStorage.getItem("selectedSpawners")) || [];
  let _0x429dab = 0x0;
  const _0x15851c = setInterval(() => {
    if (_0x429dab >= _0x305396.length) {
      clearInterval(_0x15851c);
      return;
    }
    const _0x53b62b = _0x305396[_0x429dab];
    const _0x3b15e0 = document.getElementById(_0x53b62b);
    if (_0x3b15e0) {
      _0x3b15e0.click();
    }
    _0x429dab++;
  }, 0x320);
}
function _0x95116a() {
  const _0x5a8dd4 = [];
  const _0x5458f4 = document.querySelectorAll("[id^=\"kws_spawner_ignore_\"]");
  _0x5458f4.forEach(_0x4f90d6 => {
    if (_0x4f90d6.checked) {
      _0x5a8dd4.push(_0x4f90d6.id);
    }
  });
  localStorage.setItem("selectedSpawners", JSON.stringify(_0x5a8dd4));
}
function _0x457f0c() {
  _0x6c6eae();
  const _0x24f0a3 = document.querySelectorAll("[id^=\"kws_spawner_ignore_\"]");
  _0x24f0a3.forEach(_0x5d33fc => {
    _0x5d33fc.addEventListener("change", _0x95116a);
  });
}
_0x5356ab();
const _0x187eb5 = JSON.parse(localStorage.getItem("savedClicks")) || {};
if (Object.keys(_0x187eb5).length > 0x0) {
  console.log("Znaleziono zapisane kliknięcia.");
  setTimeout(function () {
    console.log("Wywoływanie GAME.page_switch('game_map')");
    GAME.page_switch('game_map');
    setTimeout(function () {
      const _0xcfe21a = document.querySelector('.qlink.load_afo');
      if (_0xcfe21a) {
        console.log("Klikanie .qlink.load_afo po 13 sekundach");
        _0xcfe21a.click();
      }
    }, 0xbb8);
    setTimeout(function () {
      const _0xef2f27 = new KeyboardEvent("keydown", {
        'key': '-',
        'keyCode': 0xc7,
        'bubbles': true,
        'cancelable': true
      });
      document.dispatchEvent(_0xef2f27);
    }, 0x1388);
  }, 0x2710);
  setTimeout(function () {
    _0x1aa3de();
    setTimeout(_0x457f0c, 0xbb8);
  }, 0x4268);
} else {
  console.log("Nie znaleziono zapisanych kliknięć w localStorage.");
}
let _0x42af21;
let _0x2872bc = JSON.parse(localStorage.getItem('recordingEnabled')) || false;
let _0x3e5012 = false;
function _0x4cd41d() {
  console.log("Attempting to replay saved clicks...");
  const _0x5c7a94 = JSON.parse(localStorage.getItem("savedClicks")) || {};
  const _0x339eba = Object.keys(_0x5c7a94);
  if (_0x339eba.length > 0x0 && !_0x3e5012) {
    console.log("Found saved clicks:", _0x339eba);
    _0x339eba.forEach(function (_0x820b72, _0x5acfcc) {
      setTimeout(function () {
        if (!_0x3e5012) {
          const _0x41a1c3 = document.querySelectorAll('.' + _0x820b72);
          _0x41a1c3.forEach(function (_0x12322b) {
            console.log("Clicking button:", _0x820b72);
            _0x12322b.click();
            console.log("Click executed.");
            _0x5c7a94[_0x820b72] = {
              'clicked': true
            };
            localStorage.setItem("savedClicks", JSON.stringify(_0x5c7a94));
          });
        }
      }, _0x5acfcc * 0x320);
    });
  } else {
    console.log("No saved clicks found in local storage or stopped replaying.");
  }
}
function _0x5c5805() {
  _0x446dbe();
  _0x42af21 = setInterval(_0x5adef3, 0x3e8);
  console.log("Started recording clicks.");
  _0x2872bc = true;
  localStorage.setItem("recordingEnabled", true);
  setInterval(_0x2dcaff, 0x7d0);
}
function _0x2a7f47() {
  clearInterval(_0x42af21);
  localStorage.removeItem("savedClicks");
  localStorage.removeItem("selectedSpawners");
  console.log("Stopped recording clicks and cleared data.");
  _0x2872bc = false;
  localStorage.setItem("recordingEnabled", false);
  _0x3e5012 = true;
}
function _0x5adef3() {
  const _0x2f8c73 = document.getElementById("main_Panel");
  if (_0x2f8c73) {
    _0x446dbe();
    clearInterval(_0x42af21);
    _0x4cd41d();
  }
  const _0x381df7 = document.getElementById('resp_Panel');
  if (_0x381df7) {
    _0x49306f(".resp_button");
  }
}
function _0x5dd309(_0x59c7a8) {
  const _0x1084f9 = _0x59c7a8.target.className.replace(/\s+/g, '.');
  let _0x68c9fc = JSON.parse(localStorage.getItem("savedClicks")) || {};
  if (!_0x68c9fc[_0x1084f9]) {
    _0x68c9fc[_0x1084f9] = {
      'clicked': false
    };
    localStorage.setItem("savedClicks", JSON.stringify(_0x68c9fc));
    console.log("Click saved:", _0x1084f9);
  }
}
function _0x49306f(_0x412dbc) {
  const _0x1b9905 = document.querySelectorAll(_0x412dbc);
  _0x1b9905.forEach(function (_0x273012) {
    _0x273012.addEventListener("click", _0x5dd309);
  });
}
function _0x446dbe() {
  const _0x22fb3c = [".gh_button", ".pvp_button", '.lpvm_button', ".res_button", ".code_button", ".resp_button", ".qlink.manage_auto_abyss", '.qlink.manage_auto_arena', ".qlink.manage_autoExpeditions"];
  _0x22fb3c.forEach(function (_0x45df03) {
    const _0x4fa800 = document.querySelectorAll(_0x45df03);
    _0x4fa800.forEach(function (_0x8c73c3) {
      _0x8c73c3.addEventListener("click", _0x5dd309);
    });
  });
}
const _0x2eee4e = document.createElement("button");
_0x2eee4e.textContent = _0x2872bc ? "Off" : 'On';
_0x2eee4e.id = "startStopButton";
_0x2eee4e.style.position = 'fixed';
_0x2eee4e.style.top = "28px";
_0x2eee4e.style.background = "#333";
_0x2eee4e.style.borderRadius = "5px";
_0x2eee4e.style.borderWidth = "5px 6px 5px 6px";
_0x2eee4e.style.display = "block";
_0x2eee4e.style.color = "gold";
_0x2eee4e.style.borderColor = "rgba(0,0,0,0.9)";
_0x2eee4e.style.right = "5px";
_0x2eee4e.style.zIndex = "9999";
_0x2eee4e.addEventListener("click", function () {
  if (_0x2872bc) {
    _0x2a7f47();
  } else {
    _0x5c5805();
  }
  _0x2eee4e.textContent = _0x2872bc ? "Off" : 'On';
});
document.body.appendChild(_0x2eee4e);
function _0x245e2d() {
  const _0x203056 = JSON.parse(localStorage.getItem("selectedSpawners")) || [];
  let _0x211c10 = 0x0;
  const _0x456d77 = setInterval(() => {
    if (_0x211c10 >= _0x203056.length) {
      clearInterval(_0x456d77);
      return;
    }
    const _0x583540 = _0x203056[_0x211c10];
    const _0x2f879b = document.getElementById(_0x583540);
    if (_0x2f879b) {
      _0x2f879b.click();
    }
    _0x211c10++;
  }, 0x320);
}
function _0x2dcaff() {
  const _0x4f896e = [];
  const _0x5ccea3 = document.querySelectorAll("[id^=\"kws_spawner_ignore_\"]");
  _0x5ccea3.forEach(_0x1140a5 => {
    if (_0x1140a5.checked) {
      _0x4f896e.push(_0x1140a5.id);
    }
  });
  localStorage.setItem("selectedSpawners", JSON.stringify(_0x4f896e));
}
function _0x3850ae() {
  _0x245e2d();
  const _0x10d30b = document.querySelectorAll("[id^=\"kws_spawner_ignore_\"]");
  _0x10d30b.forEach(_0x949c5 => {
    _0x949c5.addEventListener("change", _0x2dcaff);
  });
}
_0x5adef3();
const _0xc5f347 = JSON.parse(localStorage.getItem("savedClicks")) || {};
if (Object.keys(_0xc5f347).length > 0x0) {
  console.log("Znaleziono zapisane kliknięcia.");
  setTimeout(function () {
    console.log("Wywoływanie GAME.page_switch('game_map')");
    GAME.page_switch("game_map");
    setTimeout(function () {
      const _0x3452a4 = document.querySelector(".qlink.load_afo");
      if (_0x3452a4) {
        console.log("Klikanie .qlink.load_afo po 13 sekundach");
        _0x3452a4.click();
      }
    }, 0xbb8);
    setTimeout(function () {
      const _0x26ba17 = new KeyboardEvent("keydown", {
        'key': '-',
        'keyCode': 0xc7,
        'bubbles': true,
        'cancelable': true
      });
      document.dispatchEvent(_0x26ba17);
    }, 0x1388);
  }, 0x2710);
  setTimeout(function () {
    _0x4cd41d();
    setTimeout(_0x3850ae, 0xbb8);
  }, 0x4268);
} else {
  console.log("Nie znaleziono zapisanych kliknięć w localStorage.");
}
