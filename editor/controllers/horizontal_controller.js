/*
 * Plugin to create MTF question
 * @class org.ekstep.questionunitmtf:mtfQuestionFormController
 * Sachin<sachin.kumar@goodworklabs.com>
 */
angular.module('mtfApp', ['org.ekstep.question'])
  .controller('mtfQuestionFormController', ['$scope', '$rootScope', 'questionServices', function($scope, $rootScope, $questionServices) {
    $scope.mtfConfiguartion = {
      'questionConfig': {
        'isText': true,
        'isImage': true,
        'isAudio': true,
        'isHint': false
      },
      'optionsConfig': [{
        'isText': true,
        'isImage': true,
        'isAudio': true,
        'isHint': false
      }, {
        'isText': true,
        'isImage': true,
        'isAudio': true,
        'isHint': false
      }]
    };
    $scope.mtfFormData = {
      'question': {
        'text': '',
        'image': '',
        'audio': '',
        'hint': ''
      },
      'option': {
        'optionsLHS': [{
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'index': 1
        }, {
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'index': 2
        }, {
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'index': 3
        }],
        'optionsRHS': [{
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'mapIndex': 1
        }, {
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'mapIndex': 2
        }, {
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'mapIndex': 3
        }],
        'questionCount': 0
      }
    };
  $scope.indexPair = 4;
    $scope.questionMedia = {};
    $scope.optionsMedia = {
      'image': [],
      'audio': []
    };
    $scope.mtfFormData.media = [];
    $scope.editMedia = [];
  var questionInput = CKEDITOR.replace('mtfQuestion', {// eslint-disable-line no-undef
    customConfig: CKEDITOR.basePath + "config.js",// eslint-disable-line no-undef
    skin: 'moono-lisa,' + CKEDITOR.basePath + "skins/moono-lisa/",// eslint-disable-line no-undef
    contentsCss: CKEDITOR.basePath + "contents.css"// eslint-disable-line no-undef
    });
    questionInput.on('change', function() {
      $scope.mtfFormData.question.text = this.getData();
    });
    questionInput.on('focus', function() {
    $scope.generateTelemetry({
      type: 'TOUCH',
      id: 'input',
      target: {
        id: 'questionunit-mtf-question',
        ver: '',
        type: 'input'
      }
    })
  });
  angular.element('.innerScroll').on('scroll', function() {
    $scope.generateTelemetry({
     type: 'SCROLL',
      id: 'form',
      target: {
        id: 'questionunit-mtf-form',
        ver: '',
        type: 'form'
      }
    })
  });
  $scope.init = function() {
    /**
     * editor:questionunit.mtf:call form validation.
     * @event org.ekstep.questionunit.mtf:validateform
     * @memberof org.ekstep.questionunit.mtf.horizontal_controller
     */
    $scope.mtfPluginInstance = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.questionunit.mtf");
    EventBus.listeners['org.ekstep.questionunit.mtf:validateform'] = [];
    ecEditor.addEventListener('org.ekstep.questionunit.mtf:validateform', function(event, callback) {
      var validationRes = $scope.formValidation();
      callback(validationRes.isValid, validationRes.formData);
    }, $scope);
    /**
     * editor:questionunit.ftb:call form edit the question.
     * @event org.ekstep.questionunit.ftb:editquestion
     * @memberof org.ekstep.questionunit.ftb.horizontal_controller
     */
    EventBus.listeners['org.ekstep.questionunit.mtf:editquestion'] = [];
    ecEditor.addEventListener('org.ekstep.questionunit.mtf:editquestion', $scope.editMtfQuestion, $scope);
    ecEditor.dispatchEvent("org.ekstep.questionunit:ready");
  }
  /**
   * for edit flow
   * @memberof org.ekstep.questionunit.mtf.horizontal_controller
   * @param {event} event data.
   * @param {question} data data.
   */
  $scope.editMtfQuestion = function(event, data) {
    var qdata = data.data;
    $scope.mtfFormData.question = qdata.question;
    $scope.mtfFormData.option = qdata.option;
    $scope.editMedia = qdata.media;
  }
  /**
   * add the pair in mtf
   * @memberof org.ekstep.questionunit.mtf.horizontal_controller
   */
    $scope.addPair = function() {
      var optionLHS = {
        'text': '',
        'image': '',
        'audio': '',
        'hint': '',
      'index': $scope.indexPair
      };
      var optionRHS = {
        'text': '',
        'image': '',
        'audio': '',
        'hint': '',
      'mapIndex': $scope.indexPair++
      };
      if ($scope.mtfFormData.option.optionsLHS.length < 5) {
        $scope.mtfFormData.option.optionsLHS.push(optionLHS);
        $scope.mtfFormData.option.optionsRHS.push(optionRHS);
      }
    }
      /**
   * check form validation
   * @memberof org.ekstep.questionunit.mtf.horizontal_controller
   * @returns {Object} question data.
   */
  $scope.formValidation = function() {
    var formConfig = {},
      temp, tempArray = [],
      formValid;
    //check form valid and lhs should be more than 3
    formValid = $scope.mtfForm.$valid && $scope.mtfFormData.option.optionsLHS.length > 2;
    $scope.submitted = true;
    _.isEmpty($scope.questionMedia.image) ? 0 : tempArray.push($scope.questionMedia.image);
    _.isEmpty($scope.questionMedia.audio) ? 0 : tempArray.push($scope.questionMedia.audio);
    _.each($scope.optionsMedia.image, function(key) {
      tempArray.push(key);
    });
    _.each($scope.optionsMedia.audio, function(key) {
      tempArray.push(key);
    });
    temp = tempArray.filter(function(element) {
      return element !== undefined;
    });
    $scope.editMedia = _.union($scope.editMedia, temp);
    $scope.mtfFormData.media = $scope.editMedia;
    formConfig.formData = $scope.mtfFormData;
    if (formValid) {
      $scope.selLbl = 'success';
      formConfig.isValid = true;
    } else {
      $scope.selLbl = 'error';
      formConfig.isValid = false;
    }
    return formConfig;
  }
  /**
   * delete the pair in mtf
   * @memberof org.ekstep.questionunit.mtf.horizontal_controller
   * @param {Integer} id data.
   */
    $scope.deletePair = function(id) {
      $scope.mtfFormData.option.optionsLHS.splice(id, 1);
      $scope.mtfFormData.option.optionsRHS.splice(id, 1);
      //}
    }
    $scope.addImage = function(id, type) {      
      var telemetryObject = {type: 'TOUCH', id: 'button', target: {id: '', ver: '', type: 'button'}};
      var mediaObject =  {
        type: 'image',
        search_filter: {} // All composite keys except mediaType
      }
      //Defining the callback function of mediaObject before invoking asset browser
      mediaObject.callback = function(data) {
        var tempImage = {
          "id": Math.floor(Math.random() * 1000000000), // Unique identifier
          "src": org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src), // Media URL
          "assetId": data.assetMedia.id, // Asset identifier
          "type": "image", // Type of asset (image, audio, etc)
          "preload": false // true or false
        };
  
        if (id == 'q') {
          telemetryObject.target.id = 'questionunit-mtf-add-image';
          $scope.mtfFormData.question.image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          $scope.questionMedia.image = tempImage;
        } else if (type == 'LHS') {
          telemetryObject.target.id = 'questionunit-mtf-lhs-add-image';
          $scope.mtfFormData.option.optionsLHS[id].image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          $scope.optionsMedia.image[id] = tempImage;
        } else if (type == 'RHS') {
          telemetryObject.target.id = 'questionunit-mtf-rhs-add-image';
          $scope.mtfFormData.option.optionsRHS[id].image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          $scope.optionsMedia.image[id] = tempImage;
        }
      }
      $questionServices.invokeAssetBrowser(mediaObject);
      $scope.generateTelemetry(telemetryObject)
    }
    $scope.addAudio = function(id, type) {
      var telemetryObject = {type: 'TOUCH', id: 'button', target: {id: '', ver: '', type: 'button'}};
      var mediaObject =  {
        type: 'audio',
        search_filter: {} // All composite keys except mediaType
      }
      //Defining the callback function of mediaObject before invoking asset browser
      mediaObject.callback = function(data) {
        var tempAudio = {
          "id": Math.floor(Math.random() * 1000000000), // Unique identifier
          "src": org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src), // Media URL
          "assetId": data.assetMedia.id, // Asset identifier
          "type": "audio", // Type of asset (image, audio, etc)
          "preload": false // true or false
        };
        if (id == 'q') {
          telemetryObject.target.id = 'questionunit-mtf-add-audio';
          $scope.mtfFormData.question.audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          $scope.questionMedia.audio = tempAudio;
        } else if (type == 'LHS') {
          telemetryObject.target.id = 'questionunit-mtf-lhs-add-audio';
          $scope.mtfFormData.option.optionsLHS[id].audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          $scope.optionsMedia.audio[id] = tempAudio;
        } else if (type == 'RHS') {
          telemetryObject.target.id = 'questionunit-mtf-rhs-add-audio';
          $scope.mtfFormData.option.optionsRHS[id].audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          $scope.optionsMedia.audio[id] = tempAudio;
        }
      }
      $questionServices.invokeAssetBrowser(mediaObject);
      $scope.generateTelemetry(telemetryObject)
    }
    $scope.deleteImage = function(id, type) {
      var telemetryObject = {type: 'TOUCH', id: 'button', target: {id: '', ver: '', type: 'button'}};
      if (id == 'q') {
        telemetryObject.target.id = 'questionunit-mtf-delete-image';
        $scope.mtfFormData.question.image = '';
        delete $scope.questionMedia.image;
      } else if (type == 'LHS') {
        telemetryObject.target.id = 'questionunit-mtf-lhs-delete-image';
        $scope.mtfFormData.option.optionsLHS[id].image = '';
        delete $scope.optionsMedia.image[id];
      } else if (type == 'RHS') {
        telemetryObject.target.id = 'questionunit-mtf-rhs-delete-imgae';
        $scope.mtfFormData.option.optionsRHS[id].image = '';
        delete $scope.optionsMedia.image[id];
      }
      $scope.generateTelemetry(telemetryObject)
    }
    $scope.deleteAudio = function(id, type) {
      var telemetryObject = {type: 'TOUCH', id: 'button', target: {id: '', ver: '', type: 'button'}};
      if (id == 'q') {
        telemetryObject.target.id = 'questionunit-mtf-delete-audio';
        $scope.isPlayingQ = false;
        $scope.mtfFormData.question.audio = '';
        delete $scope.questionMedia.audio;
      } else if (type == 'LHS') {
        telemetryObject.target.id = 'questionunit-mtf-lhs-delete-audio';
        $scope.mtfFormData.option.optionsLHS[id].audio = '';
        delete $scope.optionsMedia.audio[id];
      } else if (type == 'RHS') {
        telemetryObject.target.id = 'questionunit-mtf-rhs-delete-audio';
        $scope.mtfFormData.option.optionsRHS[id].audio = '';
        delete $scope.optionsMedia.audio[id];
      }
      $scope.generateTelemetry(telemetryObject)
    }
    $scope.generateTelemetry = function(data) {
      var plugin = {
        "id": "org.ekstep.questionunit.mtf",
        "ver": "1.0"
      }
      data.form = 'question-creation-mtf-form';
      $questionServices.generateTelemetry(data);
    }
  }]);
//# sourceURL=horizontalMtf.js
