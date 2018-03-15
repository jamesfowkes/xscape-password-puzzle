/* Change these values to alter the puzzle */

var QUESTION1 = "Pet's Name: "
var ANSWER1 = "fido"

var QUESTION2 = "Favourite Holiday Destination:"
var ANSWER2 = "peru"

var CLOSE_PASSWORD = "aaa"

var INCORRECT_PASSWORD_TIMEOUT = 2000
var VIDEO_LOOP_TIME = 10000

var PASSWORD_LENGTH = 10

var VIDEO_FILE = "video.mkv"

/*******************************************/
/* DO NOT CHANGE ANYTHING BELOW THIS LINE!**/
/*******************************************/


var incorrectPasswordCount = 0;

function showHeading(text) {
  if (text === false) {
    $("#heading").hide();
  } else {
  $("#heading").text(text);
    $("#heading").show();
  }
}

function showQuestion(text) {
  if (text===false) {
    $("#questioncontrols").hide();
  } else {
    $("#questioncontrols").show();
    $("#questionlabel").text(text);
  }
}

function showVideo(show) {
  if (show) {
    $("#video").show()
    $("#video").get(0).load();
    $("#video").get(0).play();
  } else {
    try {
      $("#video").get(0).pause();
    } catch (err) { /* This is OK - will fail on first page load */ }
    $("#video").hide()
  }
}

function showPasswordInput(show, disable) {
  if (show) {
    $("#passwordcontrols").show();
    $("#idcontrols").show();
    $("#password").prop('disabled', disable);
    $("#password").val('')
  } else {
    $("#passwordcontrols").hide();
    $("#idcontrols").hide();
  }
}

function showForgotPasswordLink(show) {
  if (show) {
    $("#forgotPasswordPrompt").show();
  } else {
    $("#forgotPasswordPrompt").hide();
  }
}

function handleEnterScreen1(lifecycle)
{
  showVideo(false);
  showHeading("Enter Password")
  showQuestion(false)
  showPasswordInput(true, false)

  $("#incorrectPasswordAlert").hide();
  showForgotPasswordLink(incorrectPasswordCount > 0)
}

function handleEnterScreen1Disabled(lifecycle)
{
  $("#incorrectPasswordAlert").show();
  showPasswordInput(true, true)
}

function handleEnterScreen2(lifecycle)
{
  showHeading("Security Question 1")
  showQuestion(QUESTION1);
  showForgotPasswordLink(false);
  showPasswordInput(false);

  $("#incorrectPasswordAlert").hide();
  $("#questioncontrols").show();
  $("#question").val("")

  incorrectPasswordCount = 0;
}

function handleEnterScreen3(lifecycle)
{
  showHeading("Security Question 2")
  showQuestion(QUESTION2);
  showForgotPasswordLink(false);
  showPasswordInput(false);

  $("#incorrectPasswordAlert").hide();
  $("#passwordcontrols").hide();
  $("#questioncontrols").show();
  $("#question").val("")
}

function onEnterVideo(lifecycle)
{
  showHeading(false)
  showForgotPasswordLink(false);

  $("#incorrectPasswordAlert").hide();
  $("#passwordcontrols").hide();
  $("#questioncontrols").hide();

  showVideo(true);
}

function onEnterExit(lifecycle)
{
  window.close();
}

var fsm = new StateMachine({
  init: 'documentLoading',
  transitions: [
    { name: 'loaded', from: 'documentLoading', to: 'screen1'},

    { name: 'correctPassword', from: 'screen1',  to: 'exit' },
    { name: 'incorrectPassword', from: 'screen1',  to: 'screen1Disabled' },
    { name: 'forgotPassword', from: 'screen1',  to: 'screen2' },

    { name: 'timeout', from: 'screen1Disabled',  to: 'screen1' },

    { name: 'correctPassphrase', from: 'screen2',  to: 'screen3' },
    { name: 'incorrectPassphrase', from: 'screen2',  to: 'screen2' },

    { name: 'correctPassphrase', from: 'screen3',  to: 'video' },
    { name: 'incorrectPassphrase', from: 'screen3',  to: 'screen3' },

    { name: 'correctPassphrase', from: 'screen3',  to: 'video' },
    { name: 'incorrectPassphrase', from: 'screen3',  to: 'screen3' },

    { name: 'timeout', from: 'video',  to: 'screen1' },

  ],
  methods: {
    onEnterScreen1: handleEnterScreen1,
    onEnterScreen1Disabled: handleEnterScreen1Disabled,
    onEnterScreen2: handleEnterScreen2,
    onEnterScreen3: handleEnterScreen3,
    onEnterVideo: onEnterVideo,
    onEnterExit: onEnterExit
  }
});

function fireFSMTimeout()
{
  fsm.timeout();
}

function onPasswordKeypress(event) {

  var password = $("#password").val();
  if (password == CLOSE_PASSWORD) {
    fsm.correctPassword();
  }

  if (password.length >= PASSWORD_LENGTH) {
    incorrectPasswordCount++;
    fsm.incorrectPassword();
    setTimeout(fireFSMTimeout, INCORRECT_PASSWORD_TIMEOUT);
  }
}

function handleQuestionAnswer(answer) {
  if (fsm.is("screen2") && answer == ANSWER1) {
    fsm.correctPassphrase();
  }
  else if (fsm.is("screen3") && answer == ANSWER2) {
    fsm.correctPassphrase();
    setTimeout(fireFSMTimeout, VIDEO_LOOP_TIME);
  }
  else {
    fsm.incorrectPassphrase();
  }
}

function onQuestionKeypress(event) {
  if (event.keyCode == 13) {
    handleQuestionAnswer($("#question").val());
  }
}

function onForgotPasswordClick(event) {
  fsm.forgotPassword();
}

$(document).ready( function() {
  $("#password").on("keyup", onPasswordKeypress);
  $("#question").on("keyup", onQuestionKeypress);
  $("#forgotPasswordPrompt").on("click", onForgotPasswordClick);

  $("#video").attr('src', VIDEO_FILE);
  fsm.loaded();
});
