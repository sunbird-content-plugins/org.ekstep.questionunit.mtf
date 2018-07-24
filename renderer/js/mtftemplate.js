var MTFController = MTFController || {};

MTFController.constant = {
  qsMTFElement: "#mtf-container",
};

/**
 * enables accessing plugin instance inside MTFController
 * @memberof org.ekstep.questionunit.mtf.mtftemplate
 */
MTFController.initTemplate = function (pluginInstance) {
  MTFController.pluginInstance = pluginInstance;
};

/**
 * returns question layout for mtf
 * @memberof org.ekstep.questionunit.mtf.mtftemplate
 */
MTFController.getQuestionContent = function () {
  return "<header class='mtf-header'>\
    <div class='question-image'>\
    <% if(question.data.question.image){ %> \
      <img class='mtf-question-image' onclick='MTFController.showImageModel(event, \"<%= question.data.question.image %>\")' src='<%= question.data.question.image %>' \> \
    <%}else{ %> \
    <% } %> \
    </div>\
    <% if(question.data.question.text.length<85){ %> \
      <span class='collapse-ques-text'><%= question.data.question.text %></span> \
    <%}else{ %> \
      <div id='question-text-mtf' class='collapse-ques-text' onclick='MTFController.expandQuestion(event)'><%= question.data.question.text %></div> \
    <% } %> \
    <% if(question.data.question.audio){ %> \
      <div class='mtf-question-audio'>\
        <img class='qc-question-audio-image' src='<%=MTFController.pluginInstance.getAudioIcon('renderer/assets/audio.png') %>'  onclick=MTFController.pluginInstance.playAudio({src:'<%= question.data.question.audio %>'}) > \
      </div>\
    <% } %> \
  </header>";
}

/**
 * returns horizontal LHS RHS layout for mtf
 * @memberof org.ekstep.questionunit.mtf.mtftemplate
 */
MTFController.getHorizontalLayout = function () {
  return "<div class='mtf-hori-container'>\
    <% _.each(question.data.option.optionsLHS,function(val,key){ %>\
      <div class='mtf-hori-option <%= MTFController.optionsWidth %>'>\
        <div class='mtf-hori-ques-option' >\
          <div class='mtf-hori-ques-text'>\
            <div  class='mtf-hori-ques-text-inner'>\
            <p onclick='MTFController.showImageModel(event, \"<%= val.image %>\")' style=\"background-size:100% 100%; background-image:url(<%= val.image %>);\">\
              \<%= val.text %>\
              <% if(val.audio){ %> \
                <span class='mtf-hori-opt-audio-image' >\
                  <img src='<%=MTFController.pluginInstance.getAudioIcon('renderer/assets/audio.png') %>' onclick=MTFController.pluginInstance.playAudio({src:'<%= val.audio %>'}) \>\
                </span>\
                <% } %>\
            </p>\
            </div>\
          </div>\
        </div>\
      </div>\
    <% });%>\
  </div>\
  <div id='mtfoptionscontainerdrag' class='mtf-hori-container panel panel-body'>\
    <% _.each(question.data.option.optionsRHS,function(val,key){ %>\
      <div data-map-value='<%= val.text %>' data-map-index='<%= val.mapIndex %>' class='mtf-hori-option cont-dragula <%= MTFController.optionsWidth %>'>\
        <div class='mtf-hori-ques-option'>\
          <div class='mtf-hori-ques-text'>\
            <div class='mtf-hori-ques-text-inner' ><% if(MTFController.selAns[key].selText < 1){ %>\
              <p onclick='MTFController.showImageModel(event, \"<%= val.image %>\")' style=\"background-size:100% 100%; background-image:url('<%= val.image %>');\">\
              <%= val.text %>\
              <% if(val.audio){ %> \
                <span class='mtf-hori-opt-audio-image' >\
                  <img  src='<%=MTFController.pluginInstance.getAudioIcon('renderer/assets/audio.png') %>' onclick=MTFController.pluginInstance.playAudio({src:'<%= val.audio %>'}) \>\
                </span>\
                <% } %>\
              </p> \
              <% } %>\
            </div>\
          </div>\
        </div>\
      </div>\
    <% });%>\
  </div>";
}

/**
 * returns vertical LHS RHS layout for mtf
 * @memberof org.ekstep.questionunit.mtf.mtftemplate
 */
MTFController.getVerticalLayout = function () {
  return "<div class='mtf-vert-container' >\
    <% _.each(question.data.option.optionsLHS,function(val,key){ %>\
      <div class='mtf-vert-option <%= MTFController.optionsHeight %>'>\
        <div class='mtf-vert-ques-option'>\
          <div class='mtf-vert-ques-text'>\
            <div class='mtf-vert-ques-text-inner' >\
              <p onclick='MTFController.showImageModel(event, \"<%= val.image %>\")' style=\"background-size:100% 100%; background-image:url(<%= val.image %>);\">\
                \<%= val.text %>\
                <% if(val.audio){ %> \
                  <span class='mtf-vert-opt-audio-image' >\
                    <img src='<%=MTFController.pluginInstance.getAudioIcon('renderer/assets/audio.png') %>' onclick=MTFController.pluginInstance.playAudio({src:'<%= val.audio %>'}) \>\
                  </span>\
                <% } %>\
              </p>\
            </div>\
          </div>\
        </div>\
      </div>\
    <% });%>\
  </div>\
  <div id='mtfoptionscontainerdrag' class='mtf-vert-container panel panel-body'>\
    <% _.each(question.data.option.optionsRHS,function(val,key){ %>\
      <div class='mtf-vert-option <%= MTFController.optionsHeight %>'>\
        <div class='mtf-vert-ques-option'>\
          <div class='mtf-vert-ques-text'>\
            <div class='mtf-vert-ques-text-inner' ><% if(MTFController.selAns[key].selText < 1){ %>\
              <p onclick='MTFController.showImageModel(event, \"<%= val.image %>\")' style=\"background-size:100% 100%; background-image:url('<%= val.image %>');\">\
                <% if(val.audio){ %> \
                  <span class='mtf-vert-opt-audio-image' >\
                    <img  src='<%=MTFController.pluginInstance.getAudioIcon('renderer/assets/audio.png') %>' onclick=MTFController.pluginInstance.playAudio({src:'<%= val.audio %>'}) \>\
                  </span>\
                <% } %>\
                <%= val.text %>\
              </p> \
              <% } %>\
            </div>\
          </div>\
        </div>\
      </div>\
    <% });%>\
  </div>";
}

/**
 * image will be shown in popup
 * @memberof org.ekstep.questionunit.mtf.mtftemplate
 */
MTFController.showImageModel = function (event, imageSrc) {
  var modelTemplate = "<div class='popup' id='image-model-popup' onclick='MTFController.hideImageModel()'><div class='popup-overlay' onclick='MTFController.hideImageModel()'></div> \
  <div class='popup-full-body'> \
  <div class='font-lato assess-popup assess-goodjob-popup'> \
    <img class='qc-question-fullimage' src=<%= src %> /> \
    <div onclick='MTFController.hideImageModel()' class='qc-popup-close-button'>&times;</div> \
  </div></div>";
  var template = _.template(modelTemplate);
  var templateData = template({
    src: imageSrc
  })
  $(MTFController.constant.qsMTFElement).append(templateData);
},

  /**
   * onclick overlay or X button the popup will be hide
   * @memberof org.ekstep.questionunit.mtf.mtftemplate
   */
  MTFController.hideImageModel = function () {
    $("#image-model-popup").remove();
  },

  /**
   * question text if long then handle using ellipse
   * @memberof org.ekstep.questionunit.mtf.mtftemplate
   * @param {Object} event from question set.
   */
  MTFController.expandQuestion = function (event) {
    if ($(event.target.parentElement).hasClass('collapse-ques-text')) {
      $(event.target.parentElement).removeClass("collapse-ques-text");
      $(event.target.parentElement).addClass("qc-expand-ques-text");
      $("#mtf-header").css('height', '65vh');
    } else {
      $(event.target.parentElement).addClass("collapse-ques-text");
      $(event.target.parentElement).removeClass("qc-expand-ques-text");
      $("#mtf-header").css('height', '17.7vh');
    }
  };

//# sourceURL=MTFController.js