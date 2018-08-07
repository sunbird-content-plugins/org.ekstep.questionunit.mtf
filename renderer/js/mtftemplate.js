var MTFController = MTFController || {};

MTFController.constant = {
  
};

/**
 * enables accessing plugin instance inside MTFController
 * @memberof org.ekstep.questionun  it.mtf.mtftemplate
 */
MTFController.initTemplate = function (pluginInstance) {
  MTFController.pluginInstance = pluginInstance;
};


MTFController.getQuestionTemplate = function(selectedLayout, availableLayout){

  var wrapperStart = '<div onload="MTFController.onDomReady()" class="mtf-container">\
                        <div class="mtf-content-container">';
  var wrapperEnd =        '</div>\
                        </div>\
                      </div><script>MTFController.onDomReady()</script>';
  var getLayout;
  if(availableLayout.horizontal == selectedLayout) {
    getLayout = MTFController.getHorizontalLayout;
  } else {
    getLayout = MTFController.getVerticalLayout;
  }

  return wrapperStart + MTFController.getQuestionStemTemplate() + getLayout() + wrapperEnd;
}

MTFController.getQuestionStemTemplate = function(){ 
  return '\
  <div class="mtf-header" >\
      <div class="mtf-question-container">\
          <div class="mtf-question-text">\
          <%= question.data.question.text %>\
          </div>\
          <div class="expand-button" onclick="MTFController.toggleQuestionText()">\
              <img src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/down_arrow.png") %>" />\
          </div>\
      </div>\
  </div>\
  <div class="mtf-options-container-margin" ></div>\
  <div class="mtf-options-container">\
  ';
}
MTFController.getHorizontalLayout = function(){
  return '\
  <div class="mtf-options-horizontal-container">\
    <div class="lhs-rhs-container lhs-container">\
        <% _.each(question.data.option.optionsLHS,function(val,key){ %>\
            <div class="lhs-block lhs-rhs-block">\
              <img class="background-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/shape3.png") %>" />\
              <% if(val.audio){ %> \
                <img onclick=MTFController.pluginInstance.playAudio({src:"<%= val.audio %>"}) class="audio-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/audio2.png") %>" />\
              <% } %>\
              <span class="option-text"><%= val.text %></span>\
            </div>\
        <% });%>\
    </div>\
    <div class="lhs-rhs-container rhs-container">\
        <% _.each(question.data.option.optionsRHS,function(val,key){ %>\
            <div class="rhs-block lhs-rhs-block">\
                <img class="background-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/shape4.png") %>" />\
                <% if(val.audio){ %> \
                  <img onclick=MTFController.pluginInstance.playAudio({src:"<%= val.audio %>"}) class="audio-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/audio2.png") %>" />\
                <% } %>\
                <span class="option-text"><%= val.text %></span>\
            </div>\
        <% });%>\
    </div>\
</div>';
}


MTFController.getVerticalLayout = function(){
  return '\
  <div class="mtf-options-vertical-container options-<%= question.data.option.optionsLHS.length %>">\
    <div class="lhs-rhs-container lhs-container">\
      <% _.each(question.data.option.optionsLHS,function(val,key){ %>\
        <div class="lhs-rhs-block lhs-block">\
            <img class="background-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/shape1.png") %>" />\
            <span><%= val.text %></span>\
            <img class="option-image" src="<%= val.image %>" />\
            <% if(val.audio){ %> \
              <img onclick=MTFController.pluginInstance.playAudio({src:"<%= val.audio %>"}) class="audio-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/audio3.png") %>" />\
            <% } %>\
        </div>\
      <% }); %>\
    </div>\
    <div class="lhs-rhs-container rhs-container">\
      <% _.each(question.data.option.optionsRHS,function(val,key){ %>\
        <div class="lhs-rhs-block rhs-block">\
        <img class="background-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/shape2.png") %>" />\
        <span><%= val.text %></span>\
        <img class="option-image" src="<%= val.image %>" />\
        <% if(val.audio){ %> \
          <img onclick=MTFController.pluginInstance.playAudio({src:"<%= val.audio %>"}) class="audio-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/audio3.png") %>" />\
        <% } %>\
        </div>\
      <% }); %>\
      </div>\
  </div>'
}
            

MTFController.isQuestionTextOverflow = function() {
    $('.mtf-question-text').css('display', 'block');
    if($('.mtf-header').height() < $('.mtf-question-container').height()){
        $('.expand-button').css('display','block');
    } else {
      $('.expand-button').css('display','none');
    }
    $('.mtf-question-text').css('display', '-webkit-box');
}

MTFController.toggleQuestionText = function(){
    if($('.mtf-header').css('overflow') == 'visible'){
        $('.mtf-header').css('overflow', 'hidden');
        $('.mtf-question-text').css('overflow', 'hidden');
        $('.mtf-question-text').css('display', '-webkit-box');
        $('.mtf-question-text').css('height', '12.345%');
        $(".expand-button").css('bottom','unset');
        $(".expand-button").css('top','0%');
        $(".expand-button").toggleClass('flip');
    } else {
        $('.mtf-header').css('overflow', 'visible');
        $('.mtf-question-text').css('overflow', 'unset');
        $('.mtf-question-text').css('display', 'block');
        $('.mtf-question-text').css('height', 'auto');
        $(".expand-button").toggleClass('flip');
        $(".expand-button").css('bottom','5%');
        $(".expand-button").css('top','unset');
    }
}

MTFController.onDomReady = function(){
    MTFController.isQuestionTextOverflow();
    $(document).ready(function(){
        $(".rhs-container").sortable();
        $(".rhs-container").disableSelection();
    }) 
}

//# sourceURL=MTFController.js
