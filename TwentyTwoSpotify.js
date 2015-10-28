/**
 * TwentyTwoSpotify
 */
;(function () {
  'use strict';

  var TwentyTwoSpotify = function () {
    this.init();
  };

  TwentyTwoSpotify.prototype = {
    init : function () {
      this.bodyEl = document.body;
      this.sites = [
        {'url' : '22tracks.com', 'callback' : 'twentyTwoTracks'},
        {'url' : 'last.fm', 'callback' : 'lastFm'}
      ];

      if (this.bodyEl.hasAttribute('data-spotify-links-added')) {
        return;
      }

      this.bodyEl.setAttribute('data-spotify-links-added', true);

      this.checkUrl();

      return this;
    },

    /**
     * Match URL to specific site.
     */
    checkUrl : function () {
      for (var i = 0, l = this.sites.length; i < l; i++) {
        if (window.location.href.indexOf(this.sites[i].url) > -1) {
          this[this.sites[i].callback]();
        }
      }

      return this;
    },

    /**
     * Adds links to 22tracks.com
     */
    twentyTwoTracks : function () {
      var _ = this,
          hasRun = false,
          addLinks;

      addLinks = function () {
        var items = document.querySelectorAll('.playlist__track'),
            div, url;

        for (var i = 0, l = items.length; i < l;  i++) {
          url = [];

          // Wrapper
          div = document.createElement('div');
          div.style.position           ='absolute';
          div.style.left               ='20.5px';
          div.style.top                ='0';
          div.style['font-size']       = '10px';
          div.style['text-transform']  = 'uppercase';

          // Artist
          url.push({artist : '"' + items[i].querySelector('.playlist__artist').textContent + '"'});
          div.appendChild(_.createLink(url, ' Artist'));

          // Track
          url.push({track : items[i].querySelector('.playlist__title').textContent});
          div.appendChild(_.createLink(url, ' Track'));

          // Add to the DOM
          items[i].appendChild(div);

          hasRun = false;
        }
      };

      addLinks();

      // Listen for updates to the DOM
      document.addEventListener('DOMNodeInserted', function (ev) {
        if (ev.relatedNode.classList.contains('playlist') && !hasRun) {
          hasRun = true;
          setTimeout(addLinks, 2000);
        }
      }, true);

      return this;
    },

    /**
     * Adds links to last.fm
     */
    lastFm : function () {
      var _ = this,
          url = [],
          hasRun = false,
          addLinks;

      addLinks = function () {
        var re = /^http:\/\/(.*\.|)(last\.fm|lastfm\.[^\/]+)\/music\/([^\?#]*)$/i,
            elems, elem, match, a;

        elems = _.bodyEl.getElementsByClassName('link-block-target');
        for (var i = 0, l = elems.length; i < l; i++) {
          elem = elems[i];

          // Check if the link matches
          match = re.exec(elem.href);
          if (match) {
            // Create the spotify url
            url = [];
            url.push({artist : match[3]});

            a = _.createLink(url, '', '#fff');

            // Insert the link after the found link
            // Check if it already have a spotify url
            if (!elem.nextSibling || !elem.nextSibling.hasAttribute || !elem.nextSibling.hasAttribute('spotifyLink')) {
              elem.parentNode.insertBefore(a, elem);
            }
          }
        }
      };

      addLinks();

      document.addEventListener('DOMNodeInserted', function (ev) {
        if (ev.relatedNode.classList.contains('main-content') && !hasRun) {
          hasRun = true;
          setTimeout(addLinks, 2000);
        }
      }, true);
    },

    /**
     * Remove whitespace in the beginning and end
     */
    trim : function (str) {
      return str.replace(/^\s+/, '').replace(/\s+$/, '');
    },

    /**
     * Creates a cleaned up spotify search URL
     */
    createUrl : function (url) {
      var ret = [];
      for (var i = 0, l = url.length; i < l; i++) {
        for (var key in url[i]) {
          ret.push(key + ':' + this.trim(url[i][key]) + '');
        }
      }
      return 'spotify:search:' + encodeURIComponent(ret.join(' ')).replace(/%20/g,'+').replace(/%25([0-9]{2})/, '%$1');
    },

    /**
     * Creates the actual link to append to the page
     */
    createLink : function (url, text, color) {
      var a, img;

      text = text || '';
      color = color || '#222';

      img = document.createElement('img');
      img.setAttribute('src', 'data:image/svg+xml;utf8,<svg viewBox="0 0 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M5,8.8817842e-16 C2.25,8.8817842e-16 0,2.25 0,5 C0,7.75 2.25,10 5,10 C7.75,10 10,7.75 10,5 C10,2.25 7.75,8.8817842e-16 5,8.8817842e-16 L5,8.8817842e-16 Z M7.275,7.225 C7.175,7.375 7,7.425 6.85,7.325 C5.675,6.6 4.2,6.45 2.45,6.85 C2.275,6.9 2.125,6.775 2.075,6.625 C2.025,6.45 2.15,6.3 2.3,6.25 C4.2,5.825 5.85,6 7.15,6.8 C7.325,6.875 7.375,7.075 7.275,7.225 L7.275,7.225 Z M7.9,5.85 C7.775,6.025 7.55,6.1 7.375,5.975 C6.025,5.15 3.975,4.9 2.4,5.4 C2.2,5.45 1.975,5.35 1.925,5.15 C1.875,4.95 1.975,4.725 2.175,4.675 C4,4.125 6.25,4.4 7.8,5.35 C7.95,5.425 8,5.675 7.9,5.85 L7.9,5.85 Z M7.95,4.45 C6.35,3.5 3.675,3.4 2.15,3.875 C1.9,3.95 1.65,3.8 1.575,3.575 C1.5,3.325 1.65,3.075 1.875,3 C3.65,2.475 6.575,2.575 8.425,3.675 C8.65,3.8 8.725,4.1 8.6,4.325 C8.45,4.5 8.175,4.575 7.95,4.45 L7.95,4.45 Z" fill="' + color + '"></path></svg>');
      img.setAttribute('alt', 'Open In Spotify');
      img.setAttribute('height', '10');
      img.setAttribute('width', '10');
      img.style.margin            = '0';
      img.style['vertical-align'] = 'middle';

      a = document.createElement('a');
      a.setAttribute('href', this.createUrl(url));
      a.style.color              = color;
      a.style['text-decoration'] = 'none';
      a.style.margin             = '0 5px';

      a.appendChild(img);
      a.appendChild(document.createTextNode(text));

      return a;
    }
  };

  window.TwentyTwoSpotify = new TwentyTwoSpotify() || {};
})();
