chrome.app.runtime.onLaunched.addListener(function() {
 var options = {
   state: 'fullscreen',
   frame: 'none'
 };
 chrome.app.window.create('application.html', (options));
});