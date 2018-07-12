var App = (function () {
  'use strict'

  App.mailCompose = function (token, url, imgurl) {
    // Summernote
    $('#email-editor').summernote({
      styleWithSpan: false,
      height: 200,
      focus: false,
      callbacks: {
        onImageUpload: function (files) {
          var formData = new FormData()
          formData.append('multipartFile', files[0])
          formData.append('token', token)
          $.ajax({
            url: url,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (data) {
              console.log(data.data)
              var dataUrl = imgurl + data.data
              $('#email-editor').summernote('insertImage', dataUrl, function ($image) {
                $image.attr('src', dataUrl)
              })
            }
          })
        }
      }
    })
  }

  return App
})(App || {})
