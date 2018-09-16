/* global $, localStorage */
"use strict";

if (localStorage.getItem('COMP251_cookies') === 'enabled') {
  $("#consentBanner").hide();
}

$("#consentBanner").animate({ bottom: 0 }, 1000);

function acceptCookies() {
  $("#consentBanner").animate({ bottom: -$("#consentBanner").height() * 2 }, 500, function() {
    $("#consentBanner").hide();
  });
  localStorage.setItem('COMP251_cookies', 'enabled');
}
