// ==UserScript==
// @name         Glavred Telegram Channel Text
// @namespace    http://tampermonkey.net/
// @version      2026-06-04
// @description  Optimize Text from Glavred telegram channel for MAX
// @author       VVSite
// @match        https://t.me/glavredizakon/*
// @homepageURL  https://github.com/VVSite/gravred-tgm-txtopt
// @source       https://github.com/VVSite/gravred-tgm-txtopt.git
// @supportURL   https://github.com/VVSite/gravred-tgm-txtopt/issues
// @downloadURL  https://raw.githubusercontent.com/VVSite/gravred-tgm-txtopt/refs/heads/main/gravred-tgm-txtopt.js
// @updateURL    https://raw.githubusercontent.com/VVSite/gravred-tgm-txtopt/refs/heads/main/gravred-tgm-txtopt.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t.me
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (!location.href.match(/glavredizakon/)) return;

    var tpl = `
    <style>
      .rb
      {
        padding: 10px 5px;
        position: fixed;
        top: 15px;
        left: 330px;
        z-index: 99999;
      }
    </style>
    <button class="rb">Выделить и скопировать</button>
    `;

    var iframe = document.querySelector('iframe');
    if (iframe !== null)
    {
        var url = iframe.src;
        location.href = url;
    }

    if (location.href.match(/embed\=1/))
    {
        var tgm_div = document.querySelector('.tgme_widget_message_text.js-message_text');
        var tgm_text = tgm_div.innerHTML;

        //
        var el =document.createElement('div');
        el.innerHTML = tpl;
        document.body.insertBefore(el, document.body.childNodes[0]);
        var rbut = document.querySelector('.rb');
        rbut.addEventListener('click', function(e){
            range_copy(this);
        });
        //

        obrab(tgm_text);
    }

    function obrab(tgm_text)
    {
        var reg = /<b><i[^?]*?<\/b><\/i>[^?]*?<\/b>/gs;
        var i = tgm_text.match(reg);
        if (i == null)
        {
            reg = /<i[^?]*?<\/i><b>[^?]*?<\/b>/;
            i = tgm_text.match(reg);
        }
        if (i == null)
        {
            reg = /<b>ДАЙДЖЕСТ[^?]*?\(продолжение\)<\/b>/;
            i = tgm_text.match(reg);
        }
        if (i !== null)
        {
            i = i[0];
            if (i.match(/\(продолжение\)/)) i = '';
        }
        else
        {
            i = "";
        }

        var clean1 = tgm_text.replace(reg, '');
        clean1 = clean1.replace(/<br>·/gs, '');
        clean1 = clean1.replace(/<b>·<\/b>/gs, '<i>·</i>');
        clean1 = clean1.replace(/(<b>\&nbsp\;<\/b>)/gs, '');
        clean1 = clean1.replace(/•[^\<br\>]*?<br>/gs, '');
        clean1 = clean1.replace(/<\/b>[^?]*?(?=•\s\<\a|\<\a|<i>·<\/i>|·)/gs, '</b><br>');
        clean1 = clean1.replace(/ответе на вопрос/gs, 'см. в ответе на вопрос');
        clean1 = i + clean1;

        var tgm_div = document.querySelector('.tgme_widget_message_text.js-message_text');
        tgm_div.innerHTML = clean1;

    }

    function range_copy(b)
    {
        var but = b;
        var tgm_div = document.querySelector('.tgme_widget_message_text.js-message_text');
        const range = document.createRange();
        range.selectNodeContents( tgm_div);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try {
            const success = document.execCommand('copy');
            if (success) {
                console.log('Текст скопирован');
                but.textContent = 'Текст скопирован!';
                setTimeout(function(){
                    but.textContent = 'Выделить и скопировать';
                }, 2000);
            } else {
                console.error('Ошибка копирования');
            }
        } catch (err) {
            console.error('execCommand не поддерживается', err);
        }
    }

})();
