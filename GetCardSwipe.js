/*
 * Basic implementation of methods needed to receive swiped credit card data with javascript.
 * 
 * NOTE: PCI compliance specifies that card data must never be stored in an unencrypted manner, and
 * only certain pieces of card data can be stored persistently.  Ensure that output logging is NOT
 * stored persistently when using this file, as it contains console.log messages that are intended
 * to educate the user, and these messages contain data that may compromise your PCI compliance posture.
 *
 * If you choose to use any of this code with real credit card data, it is your responsibility 
 * to remove all log statements, output, or other code that may serve to persist offending information.
 *
 * Author: Matt Rothstein (http://github.com/marothstein)
 * Contributors: David Wang (https://github.com/davidawang)
 */

// Guts ripped out and replaced with parser for Amex gift card magstripe by
// https://github.com/simmonmt

// String buffer to store characters from the swipe
var swipe_buffer = "";
// Global keypress timeout to differentiate between typing and swiping
var swipe_timeout = null;
// This governs the maximum number of milliseconds allowed between keypresses for the input to be tested as part of a swipe
var SWIPE_TIMEOUT_MS = 100;

// POPULATE THESE FIELDS WITH YOUR FORM FIELD NAMES
var cc_number_field_id = "cc_num";
var cc_exp_month_field_id = "cc_exp_month";
var cc_exp_year_field_id = "cc_exp_year";

var ccnumClicked = function(evt) {
	evt.target.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {
      alert('Oops, unable to copy');
    }
}

var addListeners = function() {
  $('body').keypress(function(evt) {
    keyPressed(evt);
  });
  
  $('#' + cc_number_field_id).click(ccnumClicked);
};

var deleteListeners = function() {
  ('body').unbind("keypress");
};

var addKeyToSwipeBuffer = function(keyCode, keyChar) {
  if (swipe_buffer == null) {
    swipe_buffer = "";
  }
  swipe_buffer += keyChar;
};

var clearSwipeBuffer = function() {
  // clear the memory
  delete swipe_buffer;

  swipe_buffer = null;
};

var keyPressed = function(event) {
  addKeyToSwipeBuffer(event.keyCode, String.fromCharCode(event.keyCode));

  // anonymous function that should be called to extract card data!
  temp_function = function() {
    parseAndDistributeSwipeBuffer();
  };

  // This will ensure that keypresses are only appended to the swipe data buffer
  // if they are coming in fast enough. The theory is, humans probably won't type as fast
  // as the swiper will.
  if (swipe_timeout == null) {
    swipe_timeout = setTimeout("temp_function()", SWIPE_TIMEOUT_MS);
  } else {
    clearTimeout(swipe_timeout);
    swipe_timeout = setTimeout("temp_function()", SWIPE_TIMEOUT_MS);
  }
};

var parseAndDistributeSwipeBuffer = function() {
  var full_cc_regex = /^%X([0-9]{15})\^[^\^]+\^([0-9]{2})([0-9]{2})/;
  
  if (swipe_buffer.length < 102) {
	  console.log("too short: " + swipe_buffer);
	  return;
  }
  
  if (!swipe_buffer.match(full_cc_regex)) {
	  console.log("doesn't match: " + swipe_buffer);
	  return;
  }
  
  var match = full_cc_regex.exec(swipe_buffer);
  var cc_number = match[1];
  var exp_year = match[2];
  var exp_month = match[3];
  
  // Populate the cc number, exp month, and exp year fields (field ids taken from top of this file)
  $('#'+cc_number_field_id).val(cc_number);
  $('#'+cc_exp_month_field_id).html(exp_month);
  $('#'+cc_exp_year_field_id).html(exp_year);
	
  clearSwipeBuffer();
};
