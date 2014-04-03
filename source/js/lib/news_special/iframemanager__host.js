(function () {

    var IframeWatcher = function (href, token, staticHeight) {

        var hostId = this.getWindowLocationOrigin();
        if (this.hostIsNewsApp(token)) {
            hostId = token;
        }

        this.elm = document.createElement('iframe');
        this.elm.className = 'responsive-iframe';
        this.elm.style.width = '100%';
        this.elm.scrolling = 'no';
        this.elm.allowfullscreen = true;
        this.elm.frameBorder = '0';
        this.updateFrequency = 32;

        if (window.postMessage) { // if window.postMessage is supported, then support for JSON is assumed
            var uidForPostMessage = this.getPath(href);
            this.setupPostMessage(uidForPostMessage);
        }
        else if (href.search(window.location.protocol + '//' + window.location.hostname) > -1) {
            this.setupIframeBridge();
        }
        else {
            this.data.height = staticHeight;
            this.elm.scrolling = 'yes';
        }

        var urlParams = window.location.hash || '';
        this.elm.src = href + '?hostid=' + hostId.split('//')[1] + '&onbbcdomain=' + (window.location.host.search('bbc.co.uk') > -1) + urlParams;

        this.lastRecordedHeight = this.elm.height;
        this.iframeInstructionsRan = false;
        var iframeWatcher = this;
        function startIframing() {
            iframeWatcher.getAnyInstructionsFromIframe();
            iframeWatcher.setDimensions();
        }
        // IMPORTANT: Had to make this an onload because of the 
        // polyfilling and jquery on one page lols
        if (this.elm.onload) {
            this.elm.onload = startIframing;
        }
        // BLOODY IE7!!!
        // Bug in IE7 means onload doesn't fire when an iframe 
        // loads, but the event will fire if you attach it correctly
        else if ('attachEvent' in this.elm) {
            this.elm.attachEvent('onload', startIframing);
        }
    };

    IframeWatcher.prototype = {
        data: {},
        setupPostMessage: function (uid) {
            var iframeWatcher = this;
            window.addEventListener('message', function (e) {
                if ((e.data) && (e.data.split('::')[0] === uid)) {
                    iframeWatcher.data = JSON.parse(e.data.split('::')[1]);
                    iframeWatcher.setDimensions();
                }
            }, false);
        },
        setupIframeBridge: function () {
            var iframeWatcher = this;
            window.setInterval(function () {
                if (iframeWatcher.elm.contentWindow.iframeBridge) {
                    iframeWatcher.data = iframeWatcher.elm.contentWindow.iframeBridge;
                    iframeWatcher.setDimensions();
                }
            }, iframeWatcher.updateFrequency);
        },
        hostIsNewsApp: function (token) {
            return (token.indexOf('bbc_news_app') > -1);
        },
        getIframeContentHeight: function () {
            if (this.data.height) {
                this.lastRecordedHeight = this.data.height;
            }
            return this.lastRecordedHeight;
        },
        setDimensions: function () {
            this.elm.width  = this.elm.parentNode.clientWidth;
            this.elm.height = this.getIframeContentHeight();
        },
        getAnyInstructionsFromIframe: function () {
            if (
                this.data.setup &&
                (!this.iframeInstructionsRan)
            ) {
                /* jshint evil:true */
                eval('var func = ' + this.data.setup);
                func();
                this.iframeInstructionsRan = true;
            }
        },
        getPath: function (url) {
            var urlMinusProtocol = url.replace('http://', '');
            return urlMinusProtocol.substring(urlMinusProtocol.indexOf('/')).split('?')[0];
        },
        getWindowLocationOrigin: function () {
            if (window.location.origin) {
                return window.location.origin;
            }
            else {
                return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
            }
        }
    };

    /**
     * Creates the iframeWatcher instance, manages comms between window and iframeWatcher
     */
    var iframeManager = {
        iframe: null,
        init: function () {
            this.renderIframe();
            this.startWatching();
        },
        renderIframe: function () {
            var link   = document.getElementById('<%= iframeUid %>'),
                iframe = new IframeWatcher(link.href, link.parentNode.className, link.getAttribute('data-static-iframe-height'));
            link.parentNode.appendChild(iframe.elm);
            link.parentNode.removeChild(link);
            iframeManager.iframe = iframe;
            iframe.setDimensions();
        },
        startWatching: function () {
            window.addEventListener('resize', function () {
                iframeManager.iframe.setDimensions();
            }, false);
        }
    };

    iframeManager.init();

})();