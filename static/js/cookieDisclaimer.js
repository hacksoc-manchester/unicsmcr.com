/* global $, localStorage */
"use strict";

if (localStorage.getItem('COMP251_cookies') === 'enabled') {
  $("#consentBanner").hide();
}

function acceptCookies() {
  $("#consentBanner").hide();
  localStorage.setItem('COMP251_cookies', 'enabled');
}
