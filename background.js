chrome.app.runtime.onLaunched.addListener(function() {
 var options = {
   id: 'xscapePasswordPuzzle',
   state: 'fullscreen',
   frame: 'none'
 };
 chrome.app.window.create('application.html', (options));
});