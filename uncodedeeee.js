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
                const PVP_panel = ` <div id="pvp_Panel"> <div class="sekcja pvp_dragg">PVP</div> <div class='pvp_button pvp_pvp'>PVP<b class='pvp_status red'>Off</b></div> <div class='pvp_button pvp_wyprawy'>Wyprawy<b class='pvp_status green'>On</b></div> <div class='pvp_button pvp_Code'>Kody<b class='pvp_status green'>On</b></div> <div class="pvp_button pvpCODE_konto">Konto<b class="pvp_status red">Off</b></div> <div class='pvp_button pvp_konto'>Obijaj Konto<b class='pvp_status red'>Off</b></div> <div class='pvp_button pvp_rb_avoid'>Unikaj borny<b class='pvp_status red'>Off</b></div> <div class='pvp_button pvp_WI'>Wojny Imp<b class='pvp_status green'>On</b></div> <div class='pvp_button pvp_WK'>Wojny Klanowe<b class='pvp_status green'>On</b></div> <div class='gamee_input'><input style='width:120px; margin-left:-2px; background:grey;text-align:center;font-size:16;' type='text' placeholder="Lista wojen" name='pvp_capt' value='' /></div> <div class='gameee_input'><input style='width:120px; margin-left:-2px; background:grey;text-align:center;font-size:16;' type='text' placeholder="Szybkość 10-100" name='speed_capt' value='95' /></div> </div> `;
                
                $("body").append(`<style>${css}</style>${html}`);
                $("body").append(`<style>${csspvp}</style>${PVP_panel}`);
                $("body").append(`<style>${cssresp}</style>${RESP_panel}`);
                $("body").append(`<style>${csscode}</style>${CODE_panel}`);
                $("body").append(`<style>${cssres}</style>${RES_panel}`);
                $("body").append(`<style>${csslpvm}</style>${LPVM_panel}`);

                // Listener dla nowego przycisku Wyprawy
                $('#pvp_Panel .pvp_wyprawy').click(() => {
                    if (PVP.wyprawy) {
                        $(".pvp_wyprawy .pvp_status").removeClass("green").addClass("red").html("Off");
                        PVP.wyprawy = false;
                    } else {
                        $(".pvp_wyprawy .pvp_status").removeClass("red").addClass("green").html("On");
                        PVP.wyprawy = true;
                    }
                });

                // Pozostałe listenery panelu...
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
                $('#pvp_Panel .pvp_pvp').click(() => {
                    if (PVP.stop) {
                        $(".pvp_pvp .pvp_status").removeClass("red").addClass("green").html("On");
                        PVP.stop = false;
                        PVP.run();
                    } else {
                        $(".pvp_pvp .pvp_status").removeClass("green").addClass("red").html("Off");
                        PVP.stop = true;
                    }
                });
            }

            // Rozszerzony obiekt PVP z obsługą flagi 'wyprawy'
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
                tele: false,
                clan_war_list: localStorage.getItem('clan_war_list') || '',
                kontoTP: false,
                codeTP: false
            };

            PVP.run = async () => {
                while (!PVP.stop) {
                    await PVP.check_all();
                    await PVP.kill_players();
                    
                    if (PVP.wyprawy) {
                        await PVP.move();
                    } else {
                        await delay(500);
                    }
                }
            };
            
            createPanel();
    }, 50);
}
