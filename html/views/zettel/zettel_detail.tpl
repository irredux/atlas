% import json
% for zettel in items:
<div class='prev_right_header'>
    <div class='tab_header' name='prev'>
        <div class='tab' name='overview' data-status='active'>Übersicht</div>
        % if "comment" in user["access"]:
        <div class='tab' name='comment'>Notizen</div>
        % end
        % if "z_edit" in user["access"]:
        <div class='tab' name='edit'>Bearbeiten</div>
        % end
    </div>
</div>
<div class='prev_right'>
    <div class='tab_content tab_scroll' name='prev'>
        <div class='tab_container' name='overview'>
            <p>
                <table>
                    <tr>
                        <td>Lemma:</span></td>
                        <td>{{!zettel.get("lemma_display", "")}}</td>
                    </tr>
                    <tr><td><br /></td></tr>
                    <tr>
                        <td><span id='opus_ok'>Stelle:</span></td>
                        <td>{{!zettel.get("opus", "")}}</td>
                    </tr>
                    <tr>
                        <td>Datum:</td>
                        <td>{{!zettel.get("date_display", "")}}</td>
                    </tr>
                    <tr><td><br /></td></tr>
                    <tr>
                        <td>Zetteltyp:</td>
                        <td>{{zettel.get("type_display", "")}}</td>
                    </tr>
                    <tr>
                        <td><label>MLW relevant:</label></td>
                        <td>
                            % if zettel.get("in_use", ""):
                            Ja
                            % else:
                            Nein
                            % end
                        </td>
                    </tr>
                    <tr>
                        <td>Text:</td>
                        <td>{{zettel.get("txt", " ")}}</td>
                    </tr>
                    <tr>
                        <td>Edition:</td>
                        <td id='editionOverview'>
                        % if zettel.get("editions") != None:
                            % editions = json.loads(zettel.get("editions", "[]"))
                            % for edition in editions:
                                <a href='{{edition.get("url", "")}}' target='_blank'>
                                    {{!edition.get("label", "")}}
                                </a><br />
                            % end
                        % end
                        </td>
                    </tr>
                    <tr>
                        <td>Seitenzahl der Edition:</td>
                        <td>{{zettel.get("page_nr")}}</td>
                    </tr>
                </table>
            </p>
        </div>
        % if "comment" in user["access"]:
        <div class='tab_container' name='comment'>
            % if zettel.get("comments") != None:
                % cmnts = json.loads(zettel.get("comments").replace('\n', '<br />').replace('\r', '<br />'))
                % for cmnt in cmnts:
                    <p><form>
                        <b>{{cmnt["user"]}}</b>, am {{str(cmnt["date"]).split()[0]}}:
                        <br />{{!cmnt["comment"]}}
                        % if user["id"] == cmnt["user_id"]:
                            <i class="deleteEntry" style='cursor:pointer;'>(löschen)</i>
                            <input type="hidden" name="res" value="comment" />
                            <input type="hidden" name="resId" value="{{cmnt["id"]}}" />
                        % end
                    </form></p>
                % end
            % end
            <form autocomplete="off">
                <table>
                    <tr>
                        <td>Neue Notiz:</td>
                        <td><textarea name="comment" autocomplete="off"></textarea></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <input type="button" class="noUpload" id="newComment" value="speichern" />
                        </td>
                    </tr>
                </table>
                <input type="hidden" name="res" value ="comment" />
                <input type="hidden" name="zettel_id" value="{{zettel["id"]}}" />
                <input type="hidden" name="user_id" value="{{user["id"]}}" />
                <input type="hidden" name="date" value="{{c_date}}" />
            </form>
        </div>
        % end
        <div class='tab_container' name='edit'>
            <p>
                <form>
                    <table>
                        <tr>
                            <td style='width: 175px;'><label>MLW relevant:</label></td>
                            <td>
                                <select name='in_use' autofocus>
                                    % if zettel.get("zettel_in_use", "") == True:
                                    <option value=1 selected>Ja</option>
                                    <option value=0>Nein</option>
                                    % else:
                                    <option value=1>Ja</option>
                                    <option value=0 selected>Nein</option>
                                    % end
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Zetteltyp:</td>
                            <td>
                                <select name='type'>
                                    <option value=0>...</option>
                                    % if zettel.get("type") == 1:
                                    <option value=1 selected>verzettelt</option>
                                    % else:
                                    <option value=1>verzettelt</option>
                                    % end
                                    % if zettel.get("type") == 2:
                                    <option value=2 selected>Exzerpt</option>
                                    % else:
                                    <option value=2>Exzerpt</option>
                                    % end
                                    % if zettel.get("type") == 3:
                                    <option value=3 selected>Index</option>
                                    % else:
                                    <option value=3>Index</option>
                                    % end
                                    % if zettel.get("type") == 4:
                                    <option value=4 selected>Literatur</option>
                                    % else:
                                    <option value=4>Literatur</option>
                                    % end
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Lemma:</td>
                            <td>
                                <input type="text" class="noUpload" id="lemmaInput" name="lemma" autocomplete="off" value="{{zettel.get('lemma_display', '')}}" />
                                <input type='hidden' id="lemmaInput_hidden" name='lemma_id' class="isNumber" value="{{zettel.get("lemma_id")}}" />
                            </td>
                        </tr>
                        <tr>
                            <td>Zitiertitel:</td>
                            <td>
                                <input type='text' class="noUpload" id="opusInput" name='opus' value='{{zettel.get("example", "")}}' autocomplete='off' />
                                <input type='hidden' name='work_id' class="isNumber" id="opusInput_hidden" value="{{zettel.get("work_id")}}" />
                            </td>
                        </tr>
                        <tr>
                            <td>Stellenangabe:</td>
                            <td>
                                <input type='text' name='stellenangabe' value='{{zettel.get("stellenangabe", "")}}' autocomplete='off' />
                            </td>
                        </tr>
                        <tr>
                            <td>Angabe zur Bibliographie: <i>(nur minora-Werke)</i></td>
                            <td>
                                <input type='text' name='stellenangabe_bib' value='{{zettel.get("stellenangabe_bib", "")}}' autocomplete='off' />
                            </td>
                        </tr>
                        <tr>
                            <td>Seitenzahl der Edition:</td>
                            <td>
                                <input type='text' class="isNumber" name='page_nr' value="{{zettel.get("page_nr")}}" autocomplete='off' />
                            </td>
                        </tr>
                        </table>
                        <p class='z_preview'>
                            <table>
                                <tr>
                                    <td style='width: 175px;'>Datum (<i>opera</i>-Liste):</td>
                                    <td id='date_display'>
                                        {{!zettel.get("date_display", "")}}
                                        % if zettel.get("date_type", 0) == 9:
                                        <span style='color: var(--errorStat);'>Eigenes Datum nötig!</span>
                                        % end
                                    </td>
                                </tr>
                                <tr>
                                    <td>Bsp. Stellenangabe (<i>opera</i>-Liste):</td>
                                    <td id='citation'>{{!zettel.get("stellenangabe_example", "")}}{{!zettel.get("citation", "")}}</td>
                                </tr>
                                <tr>
                                    <td>Edition:</td>
                                    <td id='editionEdit'>
                                        % if zettel.get("editions") != None:
                                            % editions = json.loads(zettel.get("editions", "[]"))
                                            % for edition in editions:
                                                <a id='edition_{{edition["id"]}}'href="{{edition["url"]}}">
                                                    {{edition.get("label", "")}}
                                                </a><br />
                                            % end
                                        % end
                                    </td>
                                </tr>
                            </table>

                        </p>
                        <table>
                        <tr>
                            <td>
                                Eigenes
                                <div class='popOver' style='display:inline-box;'>
                                    <span style="z-index: 1">Sortierdatum<a>(?)</a>:</span>
                                    <div class='popOverContent' style='text-align: left;'>
                                        % include("help/help_opera_sort")
                                    </div>
                                </div>
                            </td>
                            <td>
                                <input type='text' name='date_own'
                                value='{{zettel.get("date_own", "")}}'
                                class="isNumber"
                                autocomplete='off' />
                            </td>
                        </tr>
                        <tr><td></td><td></td></tr>
                        <tr>
                            <td>Eigenes Anzeigedatum:</td>
                            <td>
                                <input type='text'
                                name='date_own_display'
                                value='{{zettel.get("date_own_display", "")}}'
                                autocomplete='off' />
                            </td>
                        </tr>
                        <tr>
                            <td>Text:</td>
                            <td>
                                <textarea style='resize: none' name='txt'>{{zettel.get("txt", "")}}</textarea>
                            </td>
                        </tr>
                        <tr><td></td><td>
                            <input type='button' class="noUpload" id="saveZettelChangesNext" value='speichern und weiter' />
                        </td></tr>
                        <tr><td></td><td>
                            <input type='button' class='noUpload button_next' id="saveZettelChanges" value='speichern' />
                        </td></tr>
                    </table>
                <input type="hidden" name="res" value ="zettel" />
                <input type="hidden" name="resId" value={{zettel["id"]}} />
                <input type="hidden" name="user_id" value="{{user["id"]}}" />
                <input type="hidden" name="c_date" value="{{c_date}}" />
                </form>
                % if zettel.get('img_path'):
                <hr class='hr_tab' />
                <h3>Geschwister</h3>
                <table>
                    <tr>
                        <td>
                            Soll ein neuer Geschwister-Zettel zu diesem Zettel erzeugt werden?
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <form>
                            <input type="hidden" name="res" value ="zettel" />
                            % if zettel.get("sibling_id", 0) > 0:
                            <input type="hidden" name="sibling" value="{{zettel["sibling_id"]}}" />
                            % else:
                            <input type="hidden" name="sibling" value="{{zettel["id"]}}" />
                            % end
                            <input type="hidden" name="img_folder" value="{{zettel.get("img_folder", "")}}" />
                            <input type="hidden" name="work_id" class="isNumber" value="{{zettel.get("work_id")}}" />
                            <input type="hidden" name="lemma_id" class="isNumber" value="{{zettel.get("lemma_id")}}" />
                            <input type="hidden" name="stellenangabe" value="{{zettel.get("stellenangabe", "")}}" />
                            <input type="hidden" name="txt" value="{{zettel.get("txt", "")}}" />
                            <input type="hidden" name="type" value="{{zettel.get("type", 0)}}" />
                            <input type="hidden" name="date_own" value="{{zettel.get("date_own", "")}}" />
                            <input type="hidden" name="in_use" value="{{zettel.get("in_use", "")}}" />
                            <input type="hidden" name="page_nr" class="isNumber" value="{{zettel.get("page_nr")}}" />
                            <input type="hidden" name="letter" value="{{zettel.get('letter', '')}}" />
                            <input type="hidden" name="user_id" class="isNumber" value="{{user['id']}}" />
                            <input type="hidden" name="c_date" value="{{c_date}}" id="cDateSibling" />
                            <input type='button' class="noUpload" id="createSibling" value='erstellen' />
                        </form>
                        </td>
                    </tr>
                </table>
                % end
                % if "admin" in user["access"]:
                    <hr class='hr_tab' />
                    <h3>Zettel löschen</h3>
                    % if zettel.get("siblings") != None and zettel.get("sibling", 0) == 0:
                    <p>Der Zettel kann nicht gelöscht werden, es gibt Geschwisterzettel, welche das Bild verwenden!</p>
                    % else:
                    <p>Hier können Sie den Zettel aus der Datenbank und vom Server löschen. Wenn der Zettel bereits in ein Projekt importiert wurde, muss er zuerst aus dem Projekt gelöscht werden. <b>Dieser Schritt kann nicht mehr rückgängig gemacht werden.</b></p>
                    <form>
                        <input type="button" id="deleteZettel" value="löschen" />
                        <input type="hidden" name="res" value ="zettel" />
                        <input type="hidden" name="resId" value ="{{zettel["id"]}}" />
                    </form>

                    </p>
                    % end
                % end
        </div>
    </div>
</div>

<div class='prev_left_header'>
    <div class='tab_header' name='prev_img'>
        % if zettel.get("img_path", "") != "":
        <div class='tab' name='recto'>Vorderseite</div>
        % end
        % if doublesided and zettel.get("img_path", "") != "":
        <div class='tab' name='verso'>Rückseite</div>
        % end
        <div class='tab' name='digital'>digital</div>
        % if zettel.get("siblings") != None:
        <div class='tab' name='sibling'>Geschwister</div>
        % end
    </div>
</div>
<div class='prev_left'>
    <div class='tab_content tab_scroll' name='prev_img' style='padding:0;'>
        % if zettel.get("img_path", "") != "":
        <div class='tab_container' name='recto'>
            <div class='' style='position: fixed; bottom:30px; right: 530px; z-index:999;'>
                <input type='range' min='100' max='200' value='100' class='zoom' />
            </div>
            <div class='imgBox' style='background-image:url("{{zettel.get("img_path", "") + ".jpg"}}")'></div>
        </div>
        % end
        % if doublesided and zettel.get("img_path", "") != "":
        <div class='tab_container' name='verso'>
            <div class='imgBox' style='background-image:url("{{zettel.get("img_path", "") + "v.jpg"}}")'>
            </div>
        </div>
        % end
        <div class='tab_container' name='digital'>
            <div style='position: absolute; top: 20px; right: 20px; bottom: 20px; left:20px;'>
                % include('zettel/zettel_card_digital')
            </div>
        </div>
        <div class='tab_container' name='sibling'>
            % if zettel.get("siblings") != None:
                % siblings = json.loads(zettel["siblings"])
                Es gibt {{len(siblings)}} Geschwister-Zettel:
                <table>
                    % for sibling in siblings:
                        <tr>
                            <td title='{{sibling["id"]}}'>
                                <a id="{{sibling["id"]}}" class="siblingLink">{{!sibling["opus"]}}</a>
                            </td>
                        </tr>
                    % end
                </table>
            % end
        </div>
    </div>
</div>


<div class='prev_footer_left'>
    <span class='minorTxt'>
        ID: {{zettel["id"]}}. Zuletzt geändert am {{str(zettel.get("c_date")).split()[0]}} von {{zettel.get("editor")}}.
    </span>
</div>
<div class='prev_footer_right'>
    <table class='minorTxt'>
        <tr style='text-align:center;'>
            <td width='33%'>
                <a class="resultBrowser" data-target='first' title='erster Treffer'>|&lt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="-100" title='-100'>&lt;&lt;&lt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="-10" title='-10'>&lt;&lt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="-1" title='-1'>&lt;</a>
            </td>
            <td width='33%'>
                <span id='resultBrowserCurrent'></span> von <span id='resultBrowserTotal'></span>
            </td>
            <td width='34%'>
                <a class="resultBrowser" data-target="1" title='+1'>&gt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="10" title='+10'>&gt;&gt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="100" title='+100'>&gt;&gt;&gt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target='last' title='letzter Treffer'>&gt;|</a>
            </td>
        </tr>
    </table>
</div>
<div class='closeLabel'>X</div>
% end
