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
      var _ = this,
          div;

      _.bodyEl = document.body;

      if (_.bodyEl.hasAttribute('data-spotify-links-added')) {
        return;
      }

      _.items = document.querySelectorAll('.playlist__track');
      for (var i = 0; i < _.items.length; i++) {
        // WRAPPER
        div = document.createElement('div');
        div.style.position           ='absolute';
        div.style.left               ='25.5px';
        div.style.top                ='0';
        div.style['font-size']       = '10px';
        div.style['text-transform']  = 'uppercase';

        // ARTIST
        div.appendChild(_.createLink('Artist', _.items[i].querySelector('.playlist__artist').textContent));

        // TRACK
        div.appendChild(_.createLink('Track', _.items[i].querySelector('.playlist__artist').textContent + ' ' + _.items[i].querySelector('.playlist__title').textContent));

        // INSERT TO DOCUMENT
        _.items[i].appendChild(div);
      }

      _.bodyEl.setAttribute('data-spotify-links-added', true);

      return this;
    },

    /**
     * [createLink description]
     * @param  {[type]} text [description]
     * @param  {[type]} link [description]
     * @return {[type]}      [description]
     */
    createLink : function (text, link) {
      var a, img;

      img = document.createElement('img');
      img.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAXtJREFUOBHl1EsrRVEUwPHjmUeUibyjFBOPEBNJKT4CZW6gTK58ADE2MTIwMvMFjBiYkUg3SaKkmFEekUf8/9i6LnXvjZlVP+fse/Ze9j6tdaLobyKXNHWmyvpFvnLWdqMHHShEzMzphnNbYBI1wLjAHrpQkiphHpMG4S464S6esY9FbOIQzTBhlCrhAHMm4S7WsYEt3ODHSJUwPJ9g9fmPGZJ+zE4a/3r4DxOGl57Ju7MZLOR65OMUV3iLTBPaXjOofV/++fch3GWacJaFRfC6jSdY1GNoxJfCLmXch2rYDccoQIhibmqwhLXwI1cL3Q6axl3YoR0R+3jwyNVyysELQtxys4thuG4HznWHI7Cb4r7gMizDBp/HEUzYDtuuEqOwUzyF/7gXiTUcZzyHE0St8Aj9SA7fzSpKkh64iTb4QahIfObW/XKcYQpNOIDHtTSG4AfhGolxyUDfwiMbfizHkXgUS2EFC7hHWhEShsmWRBUsB3f9WV/cpxWvOsg/bGzl/3YAAAAASUVORK5CYII=');
      img.setAttribute('alt', 'Open In Spotify');
      img.setAttribute('height', '10');
      img.setAttribute('width', '10');
      img.style['vertical-align'] = 'middle';

      a = document.createElement('a');
      a.setAttribute('href', 'spotify:search:' + link);
      a.style.color              ='#222';
      a.style['text-decoration'] = 'none';
      a.style['margin-right']    = '5px';

      a.appendChild(img);
      a.appendChild(document.createTextNode(' ' + text));

      return a;
    }
  };

  window.TwentyTwoSpotify = new TwentyTwoSpotify() || {};
})();
