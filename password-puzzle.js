function handleEnterScreen1(lifecycle)
{
  $("#correctPassword").show();
  $("#incorrectPassword").show();
  $("#forgotPassword").show();
  $("#keypress").show();
  $("#correctPassphrase").hide();
  $("#incorrectPassphrase").hide();
}

function handleEnterScreen2(lifecycle)
{
  $("#correctPassword").hide();
  $("#incorrectPassword").hide();
  $("#forgotPassword").hide();
  $("#keypress").hide();
  $("#correctPassphrase").show();
  $("#incorrectPassphrase").show();
}

function handleEnterScreen3(lifecycle)
{
  $("#correctPassword").hide();
  $("#incorrectPassword").hide();
  $("#forgotPassword").hide();
  $("#keypress").hide();
  $("#correctPassphrase").show();
  $("#incorrectPassphrase").show();
}

function onEnterVideo(lifecycle)
{
  $("#correctPassword").hide();
  $("#incorrectPassword").hide();
  $("#forgotPassword").hide();
  $("#keypress").hide();
  $("#correctPassphrase").hide();
  $("#incorrectPassphrase").hide();
}

function onEnterExit(lifecycle)
{
  window.close();
}


var fsm = new StateMachine({
  init: 'screen1',
  transitions: [
    { name: 'correctPassword', from: 'screen1',  to: 'exit' },
    { name: 'incorrectPassword', from: 'screen1',  to: 'screen1' },
    { name: 'forgotPassword', from: 'screen1',  to: 'screen2' },
    { name: 'keypress', from: 'screen1',  to: 'screen1' },

    { name: 'correctPassphrase', from: 'screen2',  to: 'screen3' },
    { name: 'incorrectPassphrase', from: 'screen2',  to: 'screen2' },

    { name: 'correctPassphrase', from: 'screen3',  to: 'video' },
    { name: 'incorrectPassphrase', from: 'screen3',  to: 'screen3' },

    { name: 'correctPassphrase', from: 'screen3',  to: 'video' },
    { name: 'incorrectPassphrase', from: 'screen3',  to: 'screen3' },

  ],
  methods: {
    onEnterScreen1: handleEnterScreen1,
    onEnterScreen2: handleEnterScreen2,
    onEnterScreen3: handleEnterScreen3,
    onEnterVideo: onEnterVideo,
    onEnterExit: onEnterExit
  }
});

function fireEvent(event)
{
  if (event=="incorrectPassword")
  {
    fsm.incorrectPassword();
  }
  else if (event=="forgotPassword")
  {
    fsm.forgotPassword();
  }
  else if (event=="keypress")
  {
    fsm.keypress();
  }
  else if (event=="correctPassphrase")
  {
    fsm.correctPassphrase();
  }
  else if (event=="incorrectPassphrase")
  {
    fsm.incorrectPassphrase();
  }
}

function onPasswordKeypress(event){
  if ($("#password").val() == "aaa") {
    fsm.correctPassword();
  }
}

$(document).ready()
{
  $("#password").on("keyup", onPasswordKeypress);
}