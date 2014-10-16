/* Global chrome:true */

chrome.extension.sendMessage({}, function (response) {
  'use strict';

  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', 'http://rawgit.com/linuslundahl/TwentyTwoSpotify/master/TwentyTwoSpotify.min.js');
      head.appendChild(script);
    }
  }, 10);
});
