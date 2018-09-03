/* Change these values to alter the puzzle */

var QUESTION1 = "Favourite Band:"
var ROOM1_ANSWER1 = "Motorhead"
var ROOM2_ANSWER1 = "Nirvana"

var QUESTION2 = "Year of Birth:"
var ROOM1_ANSWER2 = "1968"
var ROOM2_ANSWER2 = "1958"

var CLOSE_PASSWORD = "sh3rl0ck"

var INCORRECT_PASSWORD_TIMEOUT = 2000
var VIDEO_LOOP_TIME = 10000

var PASSWORD_LENGTH = 10

var VIDEO_FILE = "video.mkv"

/*******************************************/
/* DO NOT CHANGE ANYTHING BELOW THIS LINE!**/
/*******************************************/

var incorrectPasswordCount = 0;
var expected_answer1;
var expected_answer2;

function showStartup(show) {
  if (show===true) {
    $(".select-room").show();
  } else {
    $(".select-room").hide();
  }
}

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

function handleEnterStartup(lifecycle)
{
  showVideo(false);
  showHeading(false);
  showQuestion(false);
  showPasswordInput(false, false);
  showStartup(true);
  $("#incorrectPasswordAlert").hide();
  showForgotPasswordLink(false);
}

function handleEnterScreen1(lifecycle)
{
  showStartup(false);
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
    { name: 'loaded', from: 'documentLoading', to: 'startup'},

    { name: 'roomSelected', from: 'startup', to: 'screen1'},

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
    onEnterStartup: handleEnterStartup,
    onEnterScreen1: handleEnterScreen1,
    onEnterScreen1Disabled: handleEnterScreen1Disabled,
    onEnterScreen2: handleEnterScreen2,
    onEnterScreen3: handleEnterScreen3,
    onEnterVideo: onEnterVideo,
    onEnterExit: onEnterExit
  }
});

function caseInsensitiveCompare(p1, p2)
{
  return p1.toUpperCase() === p2.toUpperCase();
}

function fireFSMTimeout()
{
  fsm.timeout();
}

function onPasswordKeypress(event) {

  var password = $("#password").val();
  if (password == CLOSE_PASSWORD) {
    fsm.correctPassword();
  }

  if ((password.length >= PASSWORD_LENGTH) || event.keyCode == 13) {
    incorrectPasswordCount++;
    fsm.incorrectPassword();
    setTimeout(fireFSMTimeout, INCORRECT_PASSWORD_TIMEOUT);
  }
}

function handleQuestionAnswer(entered_answer) {
  if (fsm.is("screen2") && caseInsensitiveCompare(entered_answer, expected_answer1)) {
    fsm.correctPassphrase();
  }
  else if (fsm.is("screen3") && caseInsensitiveCompare(entered_answer, expected_answer2)) {
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
  event.preventDefault();
  fsm.forgotPassword();
}

function onRoom1Selected(event) {
  expected_answer1 = ROOM1_ANSWER1;
  expected_answer2 = ROOM1_ANSWER2;
  fsm.roomSelected();
}

function onRoom2Selected(event) {
  expected_answer1 = ROOM2_ANSWER1;
  expected_answer2 = ROOM2_ANSWER2;
  fsm.roomSelected();
}

$(document).ready( function() {
  $("#password").on("keyup", onPasswordKeypress);
  $("#question").on("keyup", onQuestionKeypress);
  $("#forgotPasswordPrompt").on("click", onForgotPasswordClick);

  $("#selectRoom1").prop("value", "Start room 1 (" + ROOM1_ANSWER1+ ", " + ROOM1_ANSWER2 + ")")
  $("#selectRoom2").prop("value", "Start room 2 (" + ROOM2_ANSWER1+ ", " + ROOM2_ANSWER2 + ")")
  $("#selectRoom1").on("click", onRoom1Selected);
  $("#selectRoom2").on("click", onRoom2Selected);

  $("#video").attr('src', VIDEO_FILE);

  fsm.loaded();
});
