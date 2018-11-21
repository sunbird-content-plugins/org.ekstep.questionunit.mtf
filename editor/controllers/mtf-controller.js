/*
 * Plugin to create MTF question
 * @class org.ekstep.questionunitmcq:mtfQuestionFormController
 * Sachin<sachin.kumar@goodworklabs.com>
 */
angular.module('mtfApp', ['org.ekstep.question']).controller('mtfQuestionFormController', ['$scope', '$rootScope', 'questionServices', function ($scope, $rootScope, questionServices) {
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
      'audioName': '',
      'hint': ''
    },
    'option': {
      'optionsLHS': [{
        'text': '',
        'image': '',
        'audio': '',
        'audioName': '',
        'hint': '',
        'index': 1
      }, {
        'text': '',
        'image': '',
        'audio': '',
        'audioName': '',
        'hint': '',
        'index': 2
      }, {
        'text': '',
        'image': '',
        'audio': '',
        'audioName': '',
        'hint': '',
        'index': 3
      }],
      'optionsRHS': [{
        'text': '',
        'image': '',
        'audio': '',
        'audioName': '',
        'hint': '',
        'mapIndex': 1
      }, {
        'text': '',
        'image': '',
        'audio': '',
        'audioName': '',
        'hint': '',
        'mapIndex': 2
      }, {
        'text': '',
        'image': '',
        'audio': '',
        'audioName': '',
        'hint': '',
        'mapIndex': 3
      }],
      'questionCount': 0
    }
  };
  $scope.questionMedia = {};
  $scope.mtfFormData.media = [];
  $scope.optionMedia = {
    'optionsLHSMedia': {
      'image': [],
      'audio': []
    },
    'optionsRHSMedia': {
      'image': [],
      'audio': []
    }
  };
  var questionInput = CKEDITOR.replace('mtfQuestion', {// eslint-disable-line no-undef
    customConfig: ecEditor.resolvePluginResource('org.ekstep.questionunit', '1.0', "editor/ckeditor-config.js"),
    skin: 'moono-lisa,' + CKEDITOR.basePath + "skins/moono-lisa/",// eslint-disable-line no-undef
    contentsCss: CKEDITOR.basePath + "contents.css"// eslint-disable-line no-undef
  });
  questionInput.on('change', function () {
    $scope.mtfFormData.question.text = this.getData();
  });
  questionInput.on('focus', function () {
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
  angular.element('.innerScroll').on('scroll', function () {
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
  var questionUnitInstance = ecEditor.instantiatePlugin('org.ekstep.questionunit');
  $scope.init = function () {
    /**
     * editor:questionunit.mtf:call form validation.
     * @event org.ekstep.questionunit.mtf:validateform
     * @memberof org.ekstep.questionunit.mtf.horizontal_controller
     */
    $scope.mtfPluginInstance = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.questionunit.mtf");
    EventBus.listeners['org.ekstep.questionunit.mtf:validateform'] = [];
    ecEditor.addEventListener('org.ekstep.questionunit.mtf:validateform', function (event, callback) {
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
  $scope.editMtfQuestion = function (event, data) {
    var qdata = data.data;
    $scope.mtfFormData.question = qdata.question;
    $scope.mtfFormData.option = qdata.option;
    _.each(qdata.media, function (obj) {
      questionUnitInstance.setMedia(obj);
    })
    $scope.mtfFormData.media = questionUnitInstance.getAllMedia();
    !_.isEmpty($scope.mtfFormData.question['image']) ? $scope.questionMedia['image'] = questionUnitInstance.getMedia('src', $scope.mtfFormData.question['image']) : $scope.questionMedia['image'] = {};
    !_.isEmpty($scope.mtfFormData.question['audio']) ? $scope.questionMedia['audio'] = questionUnitInstance.getMedia('src', $scope.mtfFormData.question['audio']) : $scope.questionMedia['audio'] = {};
    _.each($scope.optionMedia, function(op, key){
      $scope.optionMedia[key]['image'] = [];
      $scope.optionMedia[key]['audio'] = [];
    });

    _.each($scope.mtfFormData.option.optionsLHS, function(k, v){
      var optionImage, optionAudio;
      !_.isEmpty(k['image']) ? optionImage = questionUnitInstance.getMedia('src', k['image']) : optionImage = undefined;
      $scope.optionMedia.optionsLHSMedia['image'].push(optionImage)
      !_.isEmpty(k['audio']) ? optionAudio = questionUnitInstance.getMedia('src', k['audio']) : optionAudio = undefined;
      $scope.optionMedia.optionsLHSMedia['audio'].push(optionAudio);
    });
    _.each($scope.mtfFormData.option.optionsRHS, function(k, v){
      var optionImage, optionAudio;
      !_.isEmpty(k['image']) ? optionImage = questionUnitInstance.getMedia('src', k['image']) : optionImage = undefined;
      $scope.optionMedia.optionsRHSMedia['image'].push(optionImage)
      !_.isEmpty(k['audio']) ? optionAudio = questionUnitInstance.getMedia('src', k['audio']) : optionAudio = undefined;
      $scope.optionMedia.optionsRHSMedia['audio'].push(optionAudio);
    });
  }
  /**
   * add the pair in mtf
   * @memberof org.ekstep.questionunit.mtf.horizontal_controller
   */
  $scope.addPair = function () {
    var optionLHS = {
      'text': '',
      'image': '',
      'audio': '',
      'audioName': '',
      'hint': '',
      'index': $scope.mtfFormData.option.optionsLHS.length + 1
    };
    var optionRHS = {
      'text': '',
      'image': '',
      'audio': '',
      'audioName': '',
      'hint': '',
      'mapIndex': $scope.mtfFormData.option.optionsRHS.length + 1
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
  $scope.formValidation = function () {
    var formConfig = {}, formValid;
    //check form valid and lhs should be more than 3
    formValid = $scope.mtfForm.$valid && $scope.mtfFormData.option.optionsLHS.length > 2;
    $scope.mtfFormData.question.text=_.isUndefined($scope.mtfFormData.question.text)?"":$scope.mtfFormData.question.text;
     if(!($scope.mtfFormData.question.text.length || $scope.mtfFormData.question.image.length || $scope.mtfFormData.question.audio.length)){
        $('.questionTextBox').addClass("ck-error");
      }else{
        $('.questionTextBox').removeClass("ck-error");
      }
    $scope.submitted = true;
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
  $scope.deletePair = function (id) {
    $scope.mtfFormData.option.optionsLHS.splice(id, 1);
    $scope.mtfFormData.option.optionsRHS.splice(id, 1);
    $scope.updatedMapIndex()
  }

  $scope.updatedMapIndex = function(){
    _.each($scope.mtfFormData.option.optionsLHS, function(lhs, id){
      lhs.index = id+1;
    })
    _.each($scope.mtfFormData.option.optionsRHS, function(rhs, id){
      rhs.mapIndex = id+1;
    })
  }

  /**
   * invokes the asset browser to pick an image to add to either the question or the options
   * @param {string} type if `q` for Question, `LHS` for LHS option, `RHS` for RHS option 
   * @param {string} index if `type` is not `q`, then it denotes the index of either 'LHS' or 'RHS' option
   * @param {string} mediaType `image` or `audio`
   */
  $scope.addMedia = function (type, index, mediaType) {
    var mediaObject = {
      type: mediaType,
      search_filter: {} // All composite keys except mediaType
    }
    //Defining the callback function of mediaObject before invoking asset browser
    mediaObject.callback = function (data) {
      var telemetryObject = { type: 'TOUCH', id: 'button', target: { id: '', ver: '', type: 'button' } };
      var newMedia = {
        "type" : type,
        "value" : data
      }, oldMedia = {};

      if (type == 'q') {
        telemetryObject.target.id = 'questionunit-mtf-add-' + data.assetMedia.type;
        !_.isEmpty($scope.mtfFormData.question[mediaType]) ? oldMedia = $scope.questionMedia[mediaType] : oldMedia = undefined;
        questionUnitInstance.setMedia(newMedia, oldMedia);
        $scope.mtfFormData.question[mediaType] = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
        data.assetMedia.type == 'audio' ? $scope.mtfFormData.question.audioName = data.assetMedia.name : '';
        $scope.questionMedia[mediaType] = data.assetMedia;
      } else if (type == 'LHS') {
        telemetryObject.target.id = 'questionunit-mtf-lhs-add-' + data.assetMedia.type;
        !_.isEmpty($scope.mtfFormData.option.optionsLHS[index][mediaType]) ? oldMedia = $scope.optionMedia.optionsLHSMedia[mediaType][index] : oldMedia = undefined;
        questionUnitInstance.setMedia(newMedia, oldMedia);
        $scope.mtfFormData.option.optionsLHS[index][mediaType] = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
        data.assetMedia.type == 'audio' ? $scope.mtfFormData.option.optionsLHS[index].audioName = data.assetMedia.name : '';
        $scope.optionMedia.optionsLHSMedia[mediaType][index] = data.assetMedia;
      } else if (type == 'RHS') {
        telemetryObject.target.id = 'questionunit-mtf-rhs-add-' + data.assetMedia.type;      
        !_.isEmpty($scope.mtfFormData.option.optionsRHS[index][mediaType]) ? oldMedia = $scope.optionMedia.optionsRHSMedia[mediaType][index] : oldMedia = undefined;
        questionUnitInstance.setMedia(newMedia, oldMedia);
        $scope.mtfFormData.option.optionsRHS[index][mediaType] = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
        data.assetMedia.type == 'audio' ? $scope.mtfFormData.option.optionsRHS[index].audioName = data.assetMedia.name : '';
        $scope.optionMedia.optionsRHSMedia[mediaType][index] = data.assetMedia;
      }
      $scope.mtfFormData.media = questionUnitInstance.getAllMedia();

      if(!$scope.$$phase) {
        $scope.$digest()
      }
      $scope.generateTelemetry(telemetryObject)
    }
    questionServices.invokeAssetBrowser(mediaObject);
  }

  /**
   * Deletes the selected media from the question element (question, LHS or RHS options)
   * @param {string} type 
   * @param {Integer} index 
   * @param {string} mediaType 
   */
  $scope.deleteMedia = function (type, index, mediaType) {
    var telemetryObject = { type: 'TOUCH', id: 'button', target: { id: '', ver: '', type: 'button' } };
    if (type == 'q') {
      telemetryObject.target.id = 'questionunit-mtf-delete' + mediaType;
      questionUnitInstance.removeMedia('id', $scope.questionMedia[mediaType].id);
      $scope.mtfFormData.media = questionUnitInstance.getAllMedia();
      $scope.mtfFormData.question[mediaType] = '';
      delete $scope.questionMedia[mediaType];
    } else if (type == 'LHS') {
      telemetryObject.target.id = 'questionunit-mtf-lhs-delete-' + mediaType;
      questionUnitInstance.removeMedia('id', $scope.optionMedia.optionsLHSMedia[mediaType][index].id);
      $scope.mtfFormData.media = questionUnitInstance.getAllMedia();
      $scope.mtfFormData.option.optionsLHS[mediaType][index] = '';
      delete $scope.optionMedia.optionsLHSMedia[mediaType];
    } else if (type == 'RHS') {
      telemetryObject.target.id = 'questionunit-mtf-rhs-delete-' + mediaType;
      questionUnitInstance.removeMedia('id', $scope.optionMedia.optionsRHSMedia[mediaType][index].id);
      $scope.mtfFormData.media = questionUnitInstance.getAllMedia();
      $scope.mtfFormData.option.optionsRHS[mediaType][index] = '';
      delete $scope.optionMedia.optionsRHSMedia[mediaType];
    }
    $scope.generateTelemetry(telemetryObject)
  }

  /**
   * Callbacks object to be passed to the directive to manage selected media
   */
  $scope.callbacks = {
    deleteMedia: $scope.deleteMedia,
    addMedia: $scope.addMedia,
    qtype: 'mtf'
  }

  /**
   * Helper function to generate telemetry event
   * @param {Object} data telemetry data
   */
  $scope.generateTelemetry = function (data) {
    if (data) {
      data.plugin = data.plugin || {
        "id": $scope.mtfPluginInstance.id,
        "ver": $scope.mtfPluginInstance.ver
      }
      data.form = data.form || 'question-creation-mtf-form';
      questionServices.generateTelemetry(data);
    }
  }
}]);
//# sourceURL=mtf-controller.js