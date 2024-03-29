'use strict';

angular.module('testAngularFileUploadFullstackApp')
  .controller('UserProfileCtrl', function ($scope, $upload, User, Auth) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.onFileSelect = function ($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: '/api/users/avatar', //upload.php script, node.js route, or servlet url
                method: 'PUT', // can be POST too
                // headers: {'headerKey': 'headerValue'},
                // withCredentials: true,
                data: { myObj: $scope.myModelObj },
                file: file,
                // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
                /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                console.log(data);
                $scope.avatar_url = data.avatar;
            });
            //.error(...)
            //.then(success, error, progress); 
        }
        // $scope.upload = $upload.upload({...}) alternative way of uploading, sends the the file content directly with the same content-type of the file. Could be used to upload files to CouchDB, imgur, etc... for HTML5 FileReader browsers. 
    };

    $scope.avatar_url = "";
    User.get(function (userInfo) {
        $scope.avatar_url = userInfo.avatar;
    });

  });
