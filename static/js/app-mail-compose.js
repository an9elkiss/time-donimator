var App = (function () {
  'use strict'

  App.mailCompose = function () {
    // Summernote
    $('#email-editor').summernote({
      styleWithSpan: false,
      height: 200,
      focus: false
    })
  }

  return App
})(App || {})
