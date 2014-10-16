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
          url.push('artist:"' + items[i].querySelector('.playlist__artist').textContent + '"');
          div.appendChild(_.createLink(url, ' Artist'));

          // Track
          url.push('track:"' + items[i].querySelector('.playlist__title').textContent + '"');
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
          append = true,
          a, h1, addLinks,
          div = document.querySelectorAll('.page-head')[0];

      addLinks = function () {
        var re = /^http:\/\/(.*\.|)(last\.fm|lastfm\.[^\/]+)\/music\/([^\?#]*)$/i,
            elems, elem, match, found, parts, p, url, a;

        elems = _.bodyEl.getElementsByTagName('a');
        for (var i = 0, l = elems.length; i < l; i++) {
          elem = elems[i];

          // Ignore image links
          if (!elem.href || _.trim(elem.textContent) === '' || elem.className.match(/\blfmButton\b/)) {
            continue;
          }

          // Check if the link matches
          match = re.exec(elem.href);
          if (match) {
            found = false;

            // Go though parts and check if it is an url that we want to change
            parts = match[3].split('/');
            if (parts[0].length !== 0) {
              for (var j = 0, k = parts.length; j < k; j++) {
                if (parts[j][0] === '+') {
                  found = true;
                  break;
                }
              }
            }

            if (found) {
              continue;
            }

            // Ignore links in the left menu and some other places
            p = elem;
            while (p !== null) {
              if (p.id && p.id.match(/^(secondaryNavigation|featuredArtists)$/) || p.className && p.className.match(/\b(pagehead|image|artistsMegaWithFeatured|artistsSquare)\b/)) {
                found = true;
                break;
              }
              p = p.parentNode;
            }

            if (found) {
              continue;
            }

            // Create the spotify url
            url = [];
            url.push({artist : parts[0]});
            if (parts[1] && parts[1] !== '_') {
              url.push({album : parts[1]});
            }
            if (parts[2]) {
              url.push({track : parts[2]});
            }

            a = _.createLink(url);

            // Insert the link after the found link
            // Check if it already have a spotify url
            if (!elem.nextSibling || !elem.nextSibling.hasAttribute || !elem.nextSibling.hasAttribute('spotifyLink')) {
              elem.parentNode.insertBefore(a, elem.nextSibling);
            }
          }
        }
      };

      if (_.bodyEl.className && div) {
        h1 = div.getElementsByTagName('h1')[0];

        // artist page
        if (_.bodyEl.className.match(/\br\-artist\b/)) {
          url.push({artist : h1.textContent});
          append = false;
        // album page
        } else if (_.bodyEl.className.match(/\br\-album\b/)) {
          url.push({artist : h1.firstChild.textContent});
          url.push({album : h1.lastChild.textContent});
        // track page
        } else if (_.bodyEl.className.match(/\br\-track\b/)) {
          url.push({artist : h1.firstChild.textContent});
          url.push({track : h1.lastChild.textContent.substring(3)});
        }

        a = _.createLink(url);
        h1.appendChild(a);
        if (append) {
          div.previousSibling.previousSibling.getElementsByTagName('h1')[0].appendChild(a.cloneNode(true));
        }
      }

      addLinks();

      document.addEventListener('DOMNodeInserted', function (ev) {
        if (ev.originalTarget !== undefined) {
          addLinks();
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
          ret.push(key + ':"' + this.trim(url[i][key]) + '"');
        }
      }
      return 'spotify:search:' + encodeURIComponent(ret.join(' ')).replace(/%20/g,'+').replace(/%25([0-9]{2})/, '%$1');
    },

    /**
     * Creates the actual link to append to the page
     */
    createLink : function (url, text) {
      var a, img;

      text = text || '';

      img = document.createElement('img');
      img.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAXtJREFUOBHl1EsrRVEUwPHjmUeUibyjFBOPEBNJKT4CZW6gTK58ADE2MTIwMvMFjBiYkUg3SaKkmFEekUf8/9i6LnXvjZlVP+fse/Ze9j6tdaLobyKXNHWmyvpFvnLWdqMHHShEzMzphnNbYBI1wLjAHrpQkiphHpMG4S464S6esY9FbOIQzTBhlCrhAHMm4S7WsYEt3ODHSJUwPJ9g9fmPGZJ+zE4a/3r4DxOGl57Ju7MZLOR65OMUV3iLTBPaXjOofV/++fch3GWacJaFRfC6jSdY1GNoxJfCLmXch2rYDccoQIhibmqwhLXwI1cL3Q6axl3YoR0R+3jwyNVyysELQtxys4thuG4HznWHI7Cb4r7gMizDBp/HEUzYDtuuEqOwUzyF/7gXiTUcZzyHE0St8Aj9SA7fzSpKkh64iTb4QahIfObW/XKcYQpNOIDHtTSG4AfhGolxyUDfwiMbfizHkXgUS2EFC7hHWhEShsmWRBUsB3f9WV/cpxWvOsg/bGzl/3YAAAAASUVORK5CYII=');
      img.setAttribute('alt', 'Open In Spotify');
      img.setAttribute('height', '10');
      img.setAttribute('width', '10');
      img.style.margin            = '0';
      img.style['vertical-align'] = 'middle';

      a = document.createElement('a');
      a.setAttribute('href', this.createUrl(url));
      a.style.color              ='#222';
      a.style['text-decoration'] = 'none';
      a.style['margin']          = '0 5px';

      a.appendChild(img);
      a.appendChild(document.createTextNode(text));

      return a;
    }
  };

  window.TwentyTwoSpotify = new TwentyTwoSpotify() || {};
})();
