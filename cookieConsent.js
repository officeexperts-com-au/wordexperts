// load in header.php, or in the body of our base url path.

// additional notes, this only works for wordexperts.com.au, it would be much nicer for it to encompass all the relevant URL's, lets look into that. ( to avoid cookie consent on every URL)

// set to trigger on scroll event

function createCookieConsentBanner() {
    const banner = document.createElement('div');
    banner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #f1f1f1;
      padding: 20px;
      text-align: center;
      z-index: 1000;
    `;

    banner.innerHTML = `
      <p>This website uses cookies to improve your experience and for analytics. 
      Do you consent to the use of cookies?</p>
      <button id="acceptCookies">Accept</button>
      <button id="rejectCookies">Reject</button>
    `;

    document.body.appendChild(banner);

    document.getElementById('acceptCookies').addEventListener('click', () => {
        setCookie('cookieConsent', 'accepted', 365);
        loadGoogleAnalytics();
        banner.style.display = 'none';
    });

    document.getElementById('rejectCookies').addEventListener('click', () => {
        setCookie('cookieConsent', 'rejected', 365);
        banner.style.display = 'none';
    });
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

function loadGoogleAnalytics() {
    (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({
            'gtm.start':
                new Date().getTime(), event: 'gtm.js'
        }); var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-W2ZMP2P3');
}

// Check for existing consent and load the banner if needed
let hasScrolled = false;
window.addEventListener('scroll', () => {
    if (!hasScrolled) {
        hasScrolled = true;
        const consent = getCookie('cookieConsent');
        if (consent === 'accepted') {
            loadGoogleAnalytics();
        } else if (consent === '') {
            createCookieConsentBanner();
        }
    }
}, { once: true });