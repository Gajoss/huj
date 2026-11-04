if (typeof GAME === 'undefined') {} else {
    console.log("AFO: 1.0.38 - z przyciskiem Wypraw")

    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    const playerListCon = $("#player_list_con");
    const enemySelector = ".player button[data-quick=1]:not(.initial_hide_forced)";

    let Pog = setInterval(() => {
            clearInterval(Pog);

            function createPanel() {
                const css = ` #main_Panel { background: rgba(0,0,0,0.9); position: fixed; top: 250px; left: 80%; z-index: 9999; width: 150px; padding: 1px; border-radius: 5px; border-style: solid; border-width: 7px 8px 7px 7px; display:block; user-select: none; color: #333333; } #main_Panel .sekcja { position: absolute; top: -27px; left: -7px; background: rgba(0,0,0,0.9); filter: hue-rotate(196deg); background-size: 100% 100%; width: 150px; cursor: all-scroll; } #main_Panel .gh_button {cursor:pointer;text-align:center; border-bottom:solid gray 1px; color: white;} `;
                const csspvp = ` #pvp_Panel { background: rgba(0,0,0,0.9); position: fixed; top: 450px; left: 80%; z-index: 9999; width: 150px; padding: 1px; border-radius: 5px; border-style: solid; border-width: 7px 8px 7px 7px; display:block; user-select: none; color: #333333; } #pvp_Panel .sekcja { position: absolute; top: -27px; left: -7px; background: rgba(0,0,0,0.9); filter: hue-rotate(196deg); background-size: 100% 100%; width: 150px; cursor: all-scroll; } #pvp_Panel .pvp_button {cursor:pointer;text-align:center; border-bottom:solid gray 1px; color: white;} #pvp_Panel .gamee_input{text-align:center; border-bottom:solid gray 1px; color: white;} #pvp_Panel .gamee_input input::placeholder {color: #4b4b4b;} #pvp_Panel .gameee_input{text-align:center; border-bottom:solid gray 1px; color: white;} #pvp_Panel .gameee_input input::placeholder {color: #4b4b4b;}`;
                const cssresp = ` #resp_Panel { background: rgba(0,0,0,0.9); position: fixed; top: 450px; left: 80%; z-index: 9999; width: 150px; padding: 1px; border-radius: 5px; border-style: solid; border-width: 7px 8px 7px 7px; display:block; user-select: none; color: #333333; } #resp_Panel .sekcja { position: absolute; top: -27px; left: -7px; background: rgba(0,0,0,0.9); filter: hue-rotate(196deg); background-size: 100% 100%; width: 150px; cursor: all-scroll; } #resp_Panel .resp_button {cursor:pointer;text-align:center; border-bottom:solid gray 1px; color: white;} `;
                const csscode = ` #code_Panel { background: rgba(0,0,0,0.9); position: fixed; top: 450px; left: 80%; z-index: 9999; width: 180px; padding: 1px; border-radius: 5px; border-style: solid; border-width: 7px 8px 7px 7px; display:block; user-select: none; color: #333333; } #code_Panel .sekcja { position: absolute; top: -27px; left: -7px; background: rgba(0,0,0,0.9); filter: hue-rotate(196deg); background-size: 100% 100%; width: 180px; cursor: all-scroll; } #code_Panel .code_button {cursor:pointer;text-align:center; border-bottom:solid gray 1px; color: white;} `;
                const cssres = ` #res_Panel { background: rgba(0,0,0,0.9); position: fixed; top: 450px; left: 65%; z-index: 9999; width: 150px; padding: 1px; border-radius: 5px; border-style: solid; border-width: 7px 8px 7px 7px; display:block; user-select: none; color: #333333; } #res_Panel .sekcja { position: absolute; top: -27px; left: -7px; background: rgba(0,0,0,0.9); filter: hue-rotate(196deg); background-size: 100% 100%; width: 150px; cursor: all-scroll; } #res_Panel .res_button {cursor:pointer;text-align:center; border-bottom:solid gray 1px; color: white;} #res_Panel ul {margin-left:-30px; color:white; margin:7px 0px 5px 0px; padding: 0px; text-align: center;} `;
                const csslpvm = ` #lpvm_Panel { background: rgba(0,0,0,0.9); position: fixed; top: 650px; left: 80%; z-index: 9999; width: 150px; padding: 1px; border-radius: 5px; border-style: solid; border-width: 7px 8px 7px 7px; display:block; user-select: none; color: #333333; } #lpvm_Panel .sekcja { position: absolute; top: -27px; left: -7px; background: rgba(0,0,0,0.9); filter: hue-rotate(196deg); background-size: 100% 100%; width: 150px; cursor: all-scroll; } #lpvm_Panel .lpvm_button {cursor:pointer;text-align:center; border-bottom:solid gray 1px; color: white;} #lpvm_Panel .pvm_killed {cursor:pointer;text-align:center; border-LGtom:solid gray 1px;text-align:center; color:white;} #lpvm_Panel .gamee_input{text-align:center; border-bottom:solid gray 1px; color: white;} `;
                
                const html = ` <div id="main_Panel"> <div class="sekcja panel_dragg">ALL FOR ONE</div> <div class='gh_button gh_resp'>PVM<b class='gh_status red'>Off</b></div> <div class='gh_button gh_pvp'>PVP<b class='gh_status red'>Off</b></div> <div class='gh_button gh_lpvm'>Listy<b class='gh_status red'>Off</b></div> <div class='gh_button gh_res'>Zbierajka<b class='gh_status red'>Off</b></div> <div class='gh_button gh_code'>Kody<b class='gh_status red'>Off</b></div> </div> `;
                
                // DODANO PRZYCISK WYPRAW W HTML PANELU PVP:
                const PVP_panel = ` <div id="pvp_Panel"> <div class="sekcja pvp_dragg">PVP</div> <div class='pvp_button pvp_pvp'>PVP<b class='pvp_status red'>Off</b></div> <div class='pvp_button pvp_wyprawy'>Wyprawy<b class='pvp_status green'>On</b></div> <div class='pvp_button pvp_Code'>Kody<b class='pvp_status green'>On</b></div> <div class="pvp_button pvpCODE_konto">Konto<b class="pvp_status red">Off</b></div> <div class='pvp_button pvp_konto'>Obijaj Konto<b class='pvp_status red'>Off</b></div> <div class='pvp_button pvp_rb_avoid'>Unikaj borny<b class='pvp_status red'>Off</b></div> <div class='pvp_button pvp_WI'>Wojny Imp<b class='pvp_status green'>On</b></div> <div class='pvp_button pvp_WK'>Wojny Klanowe<b class='pvp_status green'>On</b></div> <div class='gamee_input'><input style='width:120px; margin-left:-2px; background:grey;text-align:center;font-size:16;' type='text' placeholder="Lista wojen" name='pvp_capt' value='' /></div> <div class='gameee_input'><input style='width:120px; margin-left:-2px; background:grey;text-align:center;font-size:16;' type='text' placeholder="Szybkość 10-100" name='speed_capt' value='95' /></div> </div> `;
                
                const RESP_panel = ` <div id="resp_Panel"> <div class="sekcja resp_dragg">SPAWN MOBKóW</div> <div class="resp_button resp_resp">RESP<b class="resp_status red">Off</b></div> <div class="resp_button resp_code">Kody<b class="resp_status green">On</b></div> <div class="resp_button resp_konto">Konto<b class="resp_status red">Off</b></div> <div class="resp_button resp_sub">Subka<b class="resp_status green">On</b></div> <div class="resp_button resp_ost">Jaka<b class="resp_status green">Ost</b></div> <div class="resp_button resp_multi">Multiwalka<b class="resp_status green">On</b></div> <div class="resp_button resp_ssj">SSJ<b class="resp_status green">On</b></div> <div class="resp_button resp_buff_imp">Bufki IMP<b class="resp_status red">Off</b></div> <div class="resp_button resp_buff_clan">Bufki KLAN<b class="resp_status red">Off</b></div> <div class="resp_button resp_blue">BLUE<b class="resp_status red">Off</b></div> <div class="resp_button resp_green">GREEN<b class="resp_status red">Off</b></div> <div class="resp_button resp_purple">PURPLE<b class="resp_status red">Off</b></div> <div class="resp_button resp_yellow">YELLOW<b class="resp_status red">Off</b></div> <div class="resp_button resp_red">RED<b class="resp_status red">Off</b></div> <div class="resp_button resp_magic">Wyciąg<b class="resp_status red">Off</b></div> <div class="resp_button resp_bless">BŁOGO<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh1">SMOK<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh2">5% EXP<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh3">5% MOC<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh4">150K MAX<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh5">5% MOC<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh6">5% PSK<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh7">200% EXP<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh8">500 LVL<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh9">500% EXP<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh10">25% MOC<b class="resp_status red">Off</b></div> <div class="resp_button resp_on">Włącz All<b class="resp_status green">On</b></div> <div class="resp_button resp_off">Wyłącz All<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh11">100% Limit<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh14">100% Limit<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh12">200% Przyrost<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh13">300% Przyrost<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh15">5% kod<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh16">5 Min cd pvp <b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh17">15% szybsze zbieranie<b class="resp_status red">Off</b></div> <div class="resp_button resp_bh resp_bh18">15% więcej szansy na zebranie<b class="resp_status red">Off</b></div> </div> `;
                const CODE_panel = ` <div id="code_Panel"> <div class="sekcja code_dragg">Kody</div> <div class="code_button code_code">KODY<b class="code_status red">Off</b></div> <div class="code_button code_acc">Konto<b class="code_status red">Off</b></div> <div class="code_button code_zast">Zastępstwa<b class="code_status red">Off</b></div> <div class="code_button code_bh1">Błogo 250% tren<b class="code_status red">Off</b></div> <div class="code_button code_bh2">Błogo 5% kod<b class="code_status red">Off</b></div> <label class='select_input'><select id='bot_what_to_train'><option value='1'>Siła</option><option value='2'>Szybkość</option><option value='3'>Wytrzymałość</option><option value='4'>Siła Woli</option><option value='5'>Energia Ki</option><option value='6'>Wtajemniczenie</option></select></label> <label class='select_input'><select id='bot_what_to_traintime'><option value='1'>1 godz.</option><option value='2'>2 godz.</option><option value='3'>3 godz.</option><option value='4'>4 godz.</option><option value='5'>5 godz.</option><option value='6'>6 godz.</option><option value='7'>7 godz.</option><option value='8'>8 godz.</option><option value='9'>9 godz.</option><option value='10'>10 godz.</option><option value='11'>11 godz.</option><option value='12'>12 godz.</option></label> </div> `;
                const RES_panel = ` <div id="res_Panel"> <div class="sekcja res_dragg">SUROWCE</div> <div class="res_button res_res">ZBIERAJ<b class="res_status red">Off</b></div> <div class="bt_cool" style="text-align:center; color:white;"></div> <ul></ul> </div> `;
                const LPVM_panel = ` <div id="lpvm_Panel"> <div class="sekcja lpvm_dragg">LISTY GOŃCZE</div> <div class='pvm_killed'>Wykonane listy: <b>0</b></div> <div class="lpvm_button lpvm_lpvm">START<b class="lpvm_status red">Off</b></div> <div class="lpvm_button lpvm_g">G-Born<b class="lpvm_status red">Off</b></div> <div class="lpvm_button lpvm_u">U-Born<b class="lpvm_status red">Off</b></div> <div class="lpvm_button lpvm_s">S-Born<b class="lpvm_status red">Off</b></div> <div class="lpvm_button lpvm_h">H-Born<b class="lpvm_status red">Off</b></div> <div class="lpvm_button lpvm_m">M-Born<b class="lpvm_status red">Off</b></div> <div class="lpvm_button lpvm_limit">Limit<b class="lpvm_status red">Off</b></div> <div class='gamee_input'><input style='width:120px; margin-left:-2px; background:grey;text-align:center;font-size:16;' type='text' placeholder="Enter text" name='lpvm_capt' value='64' /></div> </div> `;
                
                $("body").append(`<style>${css}</style>${html}`);
                $("body").append(`<style>${csspvp}</style>${PVP_panel}`);
                $("body").append(`<style>${cssresp}</style>${RESP_panel}`);
                $("body").append(`<style>${csscode}</style>${CODE_panel}`);
                $("body").append(`<style>${cssres}</style>${RES_panel}`);
                $("body").append(`<style>${csslpvm}</style>${LPVM_panel}`);
                
                $("#pvp_Panel").hide();
                $("#resp_Panel").hide();
                $("#code_Panel").hide();
                $("#res_Panel").hide();
                $("#lpvm_Panel").hide();

                $("#main_Panel").draggable({ handle: ".panel_dragg" });
                $("#pvp_Panel").draggable({ handle: ".pvp_dragg" });
                $("#resp_Panel").draggable({ handle: ".resp_dragg" });
                $("#res_Panel").draggable({ handle: ".res_dragg" });
                $("#lpvm_Panel").draggable({ handle: ".lpvm_dragg" });
                $("#code_Panel").draggable({ handle: ".code_dragg" });

                // OBSŁUGA KLIKNIĘCIA PRZYCISKU WYPRAW:
                $('#pvp_Panel .pvp_wyprawy').click(() => {
                    if (PVP.wyprawy) {
                        $(".pvp_wyprawy .pvp_status").removeClass("green").addClass("red").html("Off");
                        PVP.wyprawy = false;
                    } else {
                        $(".pvp_wyprawy .pvp_status").removeClass("red").addClass("green").html("On");
                        PVP.wyprawy = true;
                    }
                });

                $('#main_Panel .gh_pvp').click(() => {
                    if ($(".gh_pvp .gh_status").hasClass("red")) {
                        $(".gh_pvp .gh_status").removeClass("red").addClass("green").html("On");
                        $("#pvp_Panel").show();
                    } else {
                        $(".gh_pvp .gh_status").removeClass("green").addClass("red").html("Off");
                        $("#pvp_Panel").hide();
                        $(".pvp_pvp .pvp_status").removeClass("green").addClass("red").html("Off");
                        PVP.stop = true;
                    }
                });
                $('#main_Panel .gh_resp').click(() => {
                    if ($(".gh_resp .gh_status").hasClass("red")) {
                        $(".gh_resp .gh_status").removeClass("red").addClass("green").html("On");
                        $("#resp_Panel").show();
                    } else {
                        $(".gh_resp .gh_status").removeClass("green").addClass("red").html("Off");
                        $("#resp_Panel").hide();
                        RESP.stop = true;
                        $(".resp_resp .resp_status").removeClass("green").addClass("red").html("Off");
                    }
                });
                $('#main_Panel .gh_res').click(() => {
                    if ($(".gh_res .gh_status").hasClass("red")) {
                        $(".gh_res .gh_status").removeClass("red").addClass("green").html("On");
                        $("#res_Panel").show();
                    } else {
                        $(".gh_res .gh_status").removeClass("green").addClass("red").html("Off");
                        $("#res_Panel").hide();
                        RES.stop = true;
                        $(".res_res .res_status").removeClass("green").addClass("red").html("Off");
                    }
                });
                $('#main_Panel .gh_lpvm').click(() => {
                    if ($(".gh_lpvm .gh_status").hasClass("red")) {
                        $(".gh_lpvm .gh_status").removeClass("red").addClass("green").html("On");
                        $("#lpvm_Panel").show();
                    } else {
                        $(".gh_lpvm .gh_status").removeClass("green").addClass("red").html("Off");
                        $("#lpvm_Panel").hide();
                        LPVM.Stop = true;
                        $(".lpvm_lpvm .lpvm_status").removeClass("green").addClass("red").html("Off");
                    }
                });
                $('#main_Panel .gh_code').click(() => {
                    if ($(".gh_code .gh_status").hasClass("red")) {
                        $(".gh_code .gh_status").removeClass("red").addClass("green").html("On");
                        $("#code_Panel").show();
                    } else {
                        $(".gh_code .gh_status").removeClass("green").addClass("red").html("Off");
                        $("#code_Panel").hide();
                        CODE.stop = true;
                        $(".code_code .code_status").removeClass("green").addClass("red").html("Off");
                    }
                });

                $('#pvp_Panel .pvp_pvp').click(() => {
                    if (PVP.stop) {
                        $(".pvp_pvp .pvp_status").removeClass("red").addClass("green").html("On");
                        PVP.stop = false;
                        PVP.run();
                        RESP.stop = true;
                        RES.stop = true;
                        LPVM.Stop = true;
                        CODE.stop = true;
                        $(".code_code .code_status").removeClass("green").addClass("red").html("Off");
                        $(".lpvm_lpvm .lpvm_status").removeClass("green").addClass("red").html("Off");
                        $(".res_res .res_status").removeClass("green").addClass("red").html("Off");
                        $(".resp_resp .resp_status").removeClass("green").addClass("red").html("Off");
                    } else {
                        $(".pvp_pvp .pvp_status").removeClass("green").addClass("red").html("Off");
                        PVP.stop = true;
                    }
                });
                $('#pvp_Panel .pvp_rb_avoid').click(() => {
                    if (PVP.higherRebornAvoid) {
                        $(".pvp_rb_avoid .pvp_status").removeClass("green").addClass("red").html("Off");
                        PVP.higherRebornAvoid = false;
                    } else {
                        $(".pvp_rb_avoid .pvp_status").removeClass("red").addClass("green").html("On");
                        PVP.higherRebornAvoid = true;
                    }
                });
                $('#pvp_Panel .pvp_konto').click(() => {
                    if (PVP.fightAccount) {
                        $(".pvp_konto .pvp_status").removeClass("green").addClass("red").html("Off");
                        PVP.fightAccount = false;
                    } else {
                        $(".pvp_konto .pvp_status").removeClass("green").addClass("red").html("On");
                        PVP.fightAccount = true;
                    }
                });
                $('#pvp_Panel .pvp_Code').click(() => {
                    if (PVP.code) {
                        $(".pvp_Code .pvp_status").removeClass("green").addClass("red").html("Off");
                        PVP.code = false;
                        $("#pvp_Panel .pvpCODE_konto").hide();
                    } else {
                        $(".pvp_Code .pvp_status").removeClass("red").addClass("green").html("On");
                        PVP.code = true;
                        $("#pvp_Panel .pvpCODE_konto").show();
                    }
                });
                $('#pvp_Panel .pvpCODE_konto').click(() => {
                    if (PVP.kontoTP) {
                        $(".pvpCODE_konto .pvp_status").removeClass("green").addClass("red").html("Off");
                        PVP.kontoTP = false;
                        PVP.codeTP = false;
                    } else {
                        $(".pvpCODE_konto .pvp_status").removeClass("green").addClass("red").html("On");
                        PVP.kontoTP = true;
                        PVP.codeTP = true;
                    }
                });
                $('#pvp_Panel .pvp_WI').click(() => {
                    if (PVP.wi) {
                        $(".pvp_WI .pvp_status").removeClass("green").addClass("red").html("Off");
                        PVP.wi = false;
                    } else {
                        $(".pvp_WI .pvp_status").removeClass("green").addClass("red").html("On");
                        PVP.wi = true;
                    }
                });
                $('#pvp_Panel .pvp_WK').click(() => {
                    if (PVP.wk) {
                        $(".pvp_WK .pvp_status").removeClass("green").addClass("red").html("Off");
                        PVP.wk = false;
                    } else {
                        $(".pvp_WK .pvp_status").removeClass("green").addClass("red").html("On");
                        PVP.wk = true;
                    }
                });
                $("#pvp_Panel input[name=pvp_capt]").val(PVP.clan_war_list);
                $("#pvp_Panel input[name=speed_capt]").val(PVP.WSP);
            }(function() {
                let a;
                function f() {
                    if (!a) a = Object.keys(GAME).find(z => GAME[z] && GAME[z]['1_1']);
                    return a;
                }
                Object.defineProperty(GAME, 'mapcell', {
                    get: function() {
                        return GAME[f()];
                    }
                });
            })();

            GAME.emit = function(order, data, force) {
                if (!this.is_loading || force) {
                    this.load_start();
                    this.socket.emit(order, data);
                } else if (this.debug) console.log('failed order', order, data);
            };
            GAME.emitOrder = function(data, force = false) {
                this.emit('ga', data, force);
            };
            GAME.initiate = function() {
                $('#player_login').text(this.login);
                $('#game_win').show();
                if (this.char_id == 0 && this.pid > 0) {
                    this.emitOrder({ a: 1 });
                }
                var len = this.servers.length, con = '';
                for (var i = 0; i < len; i++) {
                    con += '<option value="' + this.servers[i] + '">' + LNG['server' + this.servers[i]] + '</option>';
                }
                $('#available_servers').html(con);
                $('#available_servers option[value=' + this.server + ']').prop('selected', true);
            };

            /* PVP & WYPRAWY */
            var PVP = {
                stop: true,
                wyprawy: true,
                wi: true,
                code: true,
                wk: true,
                higherRebornAvoid: false,
                fightAccount: false,
                wait: 20,
                waitAtack: 60,
                waitMove: 60,
                WSP: localStorage.getItem('pvp_speed') || 95,
                route: [1,2,3,4],
                routeIndex: 0,
                routeStart: true,
                startTime: false,
                tele: false,
                clan_war_list: localStorage.getItem('clan_war_list') || '',
                kontoTP: false,
                codeTP: false,
                loc: 0
            };

            PVP.specialTiles = {
                "14,14,1": "nextLocation",
                "14,14,2": "nextLocation",
                "14,14,3": "nextLocation",
                "14,14,4": "nextLocation",
                "4,8,1": "go_down",
                "4,10,1": "go_down",
                "8,4,4": "go_down",
                "8,6,4": "go_down",
                "12,7,1": "go_down",
                "12,9,1": "go_down",
                "7,13,3": "go_down",
                "8,5,2": "go_down",
                "8,7,2": "go_down",
                "3,9,5": "go_down",
                "8,5,4": "go_left",
                "8,7,4": "go_left",
                "5,11,1": "go_up",
                "5,10,1": "go_up",
                "5,9,1": "go_up",
                "5,8,1": "go_up",
                "8,6,2": "go_right",
                "8,8,2": "go_right",
                "2,11,3": "cofanie"
            };

            PVP.run = async () => {
                while (!PVP.stop) {
                    if (GAME.char_data.empire == 0) {
                        if (PVP.fightAccount) {
                          await PVP.change_char_to_next();
                          continue;
                        }
                        $(".pvp_pvp .pvp_status").removeClass("green").addClass("red").html("Off");
                        PVP.stop = true;
                    }

                    await PVP.check_all();
                    await PVP.kill_players();

                    // Ruch / Wyprawy włączone/wyłączone przyciskiem
                    if (PVP.wyprawy) {
                        await PVP.move();
                    } else {
                        await delay(500);
                    }
                }
            };

            PVP.change_char_to_next = async () => {
                PVP.routeStart = false;
                const char_list = [...document.querySelectorAll('#char_list_con li')].map(li => Number(li.dataset.char_id));
                const char_index = char_list.indexOf(GAME.char_data.id)

                let next_char_id = (char_index == char_list.length - 1) ? char_list[0] : char_list[char_index + 1];

                GAME.emitOrder({a:5});
                await delay(500);
                GAME.emitOrder({a:2,char_id:next_char_id})
                await delay(500);
                GAME.page_switch('game_map');
                await delay(500);
                GAME.emitOrder({a:39,type:0});
                await delay(500);
            };

            PVP.check_all = async () => {
                while($("#ewar_list").text().includes("--:--:--")) {
                    await delay(300);
                }
                await PVP.check_code();
                await PVP.check_emp_wars();
                await PVP.check_clan_wars();
            };

            PVP.kill_players = async () => {
                let prev_enemy_count = 0;
                let repeat_counter = 0;
                while (true) {
                    if (PVP.stop) return;
                    if (this.is_loading) {
                        await delay(20);
                        continue;
                    }
                    const loadMoreBtn = playerListCon.find("button[data-option='load_more_players']");
                    const enemies = playerListCon.find(enemySelector);
                    if (loadMoreBtn.length) {
                        loadMoreBtn.click();
                        await delay(150);
                        continue;
                    }
                    const enemies_count = enemies.length; 
                    if (enemies_count === 0) return; 

                    enemies.eq(0).click();

                    if (repeat_counter > 5) return; 
                    if (enemies_count == prev_enemy_count) {
                        repeat_counter++;
                    } else {
                        repeat_counter = 0;
                    }
                    prev_enemy_count = enemies_count;

                    GAME.socket.emit('ga', {a: 4, dir: -1});
                    await delay(PVP.waitAtack);
                }
            };

            PVP.move = async () => {
                if (PVP.stop) return;

                const {x, y} = GAME.char_data;
                PVP.check_location();

                if (PVP.loc === 7) {
                    if (GAME.char_data.last_map) await PVP.zejdz();
                    PVP.tele = true;
                    return PVP.teleport();
                }

                const action = PVP.specialTiles[`${x},${y},${PVP.loc}`];
                if (action) return PVP[action]();

                const maxX = 14;
                const minX = 2;

                if (y % 2 === 0) {
                    if (x < maxX) await PVP.go_right();
                    else await PVP.go_down();
                } else {
                    if (x > minX) await PVP.go_left();
                    else await PVP.go_down();
                }
            };

            PVP.nextLocation = () => {
                PVP.routeIndex++;
                if (PVP.routeIndex >= PVP.route.length) {
                    PVP.routeIndex = 0;
                    PVP.routeStart = true;
                }
                return PVP.zejdz();
            };

            PVP.zejdz = async () => {
                GAME.socket.emit('ga', { a: 16 });
                await delay(500); 
                while (!GAME.maploaded || this.is_loading) {
                    GAME.page_switch('game_map');
                    await delay(500); 
                }
            };

            PVP.teleport = async () => {
                if (PVP.tele) {
                    GAME.socket.emit('ga', {
                        a: 50,
                        type: 5,
                        e: PVP.route[PVP.routeIndex]
                    });
                    await delay(500); 
                    while (!GAME.maploaded || this.is_loading) {
                        GAME.page_switch('game_map');
                        await delay(500); 
                    }
                    PVP.tele = false;
                } 
            };

            PVP.check_location = () => {
                if (GAME.char_data.loc == 351) { PVP.loc = 4; return; }
                if (GAME.char_data.loc == 350) { PVP.loc = 3; return; }
                if (GAME.char_data.loc == 349) { PVP.loc = 2; return; }
                if (GAME.char_data.loc == 348) { PVP.loc = 1; return; }
                PVP.loc = 7;
            };

            PVP.cofanie = async () => {
                while (GAME.char_data.x < 7) {
                    GAME.emitOrder({ a: 4, dir: 7, vo: GAME.map_options.vo });
                    await delay(PVP.waitMove / PVP.WSPP());
                }
                await PVP.go_down();
            };

            PVP.go = async (dir) => {
                GAME.emitOrder({ a: 4, dir: dir, vo: GAME.map_options.vo });
                await delay(PVP.waitMove / PVP.WSPP());
            };

            PVP.go_down  = () => PVP.go(1);
            PVP.go_up    = () => PVP.go(2);
            PVP.go_right = () => PVP.go(7);
            PVP.go_left  = () => PVP.go(8);

            PVP.check_code = async () => {
                if (!PVP.code) return;
                if ($("#train_uptime").find('.timer').length == 0) {
                    if ($('#ssj_status').text() == "--:--:--") {
                        GAME.socket.emit('ga', { a: 18, type: 6 });
                        await delay(1000);
                    }
                    if (GAME.quick_opts.ssj && !GAME.ssj) {
                        GAME.socket.emit('ga', { a: 18, type: 5, tech_id: GAME.quick_opts.ssj[0] });
                        await delay(1000);
                    } 
                    if (!GAME.is_training) {
                        GAME.socket.emit('ga', { a: 8, type: 2, stat: 1, duration: 1 });
                        await delay(1600);
                    }
                    GAME.socket.emit('ga', { a: 8, type: 5, apud: 'vzaaa' });
                    await delay(500);
                    GAME.socket.emit('ga', { a: 8, type: 3 });
                }
            };

            PVP.check_clan_wars = async () => {
                if (!PVP.wk) return;
                if (GAME.char_data.klan_id == 0) return;
                if (!GAME.hasClanLaw('warlord')) return;
                const count = PVP.clan_war_list.split(";").length;
                const maxClanWars = GAME.klan_data.s4 + GAME.klan_data.s4u + 1;
                if (count > 0 && GAME.char_data.klan_rent == 0 && GAME.clan_wars.length < maxClanWars && GAME.clan_wars.length < count) {
                    GAME.socket.emit('ga', { a: 39, type: 24, shorts: PVP.clan_war_list });
                    await delay(500); 
                }
            };

            PVP.check_imp = () => {
                var tab = [];
                for (var i = 0; i < 3; i++) {
                    tab[i] = parseInt($("#empire_heroes .activity").eq(i).find("[data-option=show_player]").attr("data-char_id"));
                }
                return tab;
            };

            PVP.check_imp2 = () => {
                var tab = [];
                for (var i = 0; i < 3; i++) {
                    tab[i] = parseInt($("#empire_efrags .activity").eq(i).find("[data-option=show_player]").attr("data-char_id"));
                }
                return tab;
            };

            PVP.check_emp_wars = async () => {
                if (!PVP.wi) return;
                if (!PVP.adimp) {
                    GAME.socket.emit('ga', { a: 50, type: 0, empire: GAME.char_data.empire });
                    PVP.adimp = true;
                    await delay(500);
                }
                const aimp = $("#e_admiral_player").find("[data-option=show_player]").attr("data-char_id");
                const imp = $("#leader_player").find("[data-option=show_player]").attr("data-char_id");
                const isAuthorized = PVP.check_imp().includes(GAME.char_id) || PVP.check_imp2().includes(GAME.char_id) || imp == GAME.char_id || aimp == GAME.char_id;
                if (!isAuthorized) return;
                const myEmpire = GAME.char_data.empire;
                for (let targetEmpire = 1; targetEmpire <= 4; targetEmpire++) {
                    const alreadyAtWar = GAME.emp_enemies.includes(targetEmpire);
                    const isMyEmpire = myEmpire === targetEmpire;
                    if (!alreadyAtWar && !isMyEmpire) {
                        GAME.socket.emit('ga', { a: 50, type: 7, target: targetEmpire });
                        await delay(500); 
                    }
                }
            };

            PVP.WSPP = () => {
                var speed = PVP.WSP;
                if (speed < 10) speed = 10;
                if (speed > 1000) speed = 1000;
                if ($("#pvp_Panel input[name=speed_capt]").val() == '') speed = 100;
                return speed / 50;
            };

            createPanel();
    }, 50);
}
