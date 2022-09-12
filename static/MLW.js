/* MLW.js - javascript code for the HTML-preview of the MLW
            (medival latin dictionary)

Author: Eckhart Arnold <arnold@badw.de>

Copyright 2017 Bavarian Academy of Sciences and Humanities

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


function on_target() {
    "use strict";
    // highlight target area when an internal link has been clicked
    let href = window.location.hash;
    if (href) {
        let target = document.getElementById(href.slice(1));
        target.classList.remove('animation');
        void target.offsetWidth;
        target.classList.add('animation');
    }
}


function from_target(href) {
    "use strict";
    // highlight target area even if link target has just been shown before.
    let hash = window.location.hash;
    if (href == hash) {
        let target = document.getElementById(href.slice(1));
        target.classList.remove('animation');
        void target.offsetWidth;
        target.classList.add('animation');
    }
}


var initialized = false;

function init() {
    "use strict";
    if (!initialized && document.readyState === 'complete') {
        initialized = true;
        on_target();
        let links = document.getElementsByTagName('a');
        for (let link of links) {
            let href = link.getAttribute('href');
            if (href && href.slice(0, 1) == "#") {
                link.addEventListener('click', function () { from_target(href); }, true);
            }
        }
    }
}

// make sure init-function is only called after loading of html-page
// is complete
if (document.readyState === 'complete') {
    init();
} else {
    if (document.addEventListener) {
        document.addEventListener('readystatechange' , init, false);
        document.addEventListener('DOMContentLoaded', init, false);
        window.addEventListener('load', init, false);
        window.addEventListener('hashchange', on_target);
    } else {
        document.attachEvent('readystatechange', init, false);
        window.attachEvent('onload', init, false);
    }
}