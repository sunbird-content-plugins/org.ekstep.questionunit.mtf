var QS_MTFTemplate = {}; 

QS_MTFTemplate.htmlLayout = "<div class='mtf-layout'>\
    <header class='mtf-header'>\
    <% if(question.data.question.text.length<85){ %> \
        <div class='mtf-question-text-collapse'><%= question.data.question.text %>\</div>\
      <%}else{ %> \
        <div class='mtf-question-text-exapand' onclick='QS_MTFTemplate.expandQuestion(event)'><%= question.data.question.text %>\</div>\
       <% } %> \
    </header>\
    <div class='mtf-hori-container'>\
      <% _.each(question.data.option.optionsLHS,function(val,key){ %>\
        <div class='mtf-hori-option <%= QS_MTFTemplate.optionsWidth %>'>\
          <div class='mtf-hori-ques-option'>\
            <div class='mtf-hori-ques-text'>\
              <div class='mtf-hori-ques-text-inner'><%= val.text %></div>\
            </div>\
          </div>\
        </div>\
      <% });%>\
    </div>\
    <div class='mtf-hori-container panel panel-body' id='left'>\
      <% _.each(QS_MTFTemplate.selAns,function(val,key){ %>\
        <div class='mtf-hori-option <%= QS_MTFTemplate.optionsWidth %>'>\
          <div class='mtf-hori-ques-option'>\
            <div class='mtf-hori-ques-text'>\
              <div class='mtf-hori-ques-text-inner cont-dragula' id='left<%= (key+1) %>' leftindex='<%= val.index %>'><% if(val.selText.length > 0){ %> <p><%= val.selText  %> </p> <% }else{ %><%= val.selText %><% } %></div>\
            </div>\
          </div>\
        </div>\
      <% });%>\
    </div>\
    <div class='mtf-hori-container panel panel-body'>\
      <% _.each(question.data.option.optionsRHS,function(val,key){ %>\
        <div class='mtf-hori-option <%= QS_MTFTemplate.optionsWidth %>'>\
          <div class='mtf-hori-ques-option'>\
            <div class='mtf-hori-ques-text'>\
              <div class='mtf-hori-ques-text-inner cont-dragula' id='right<%= (key+1) %>' mapIndex='<%= val.mapIndex %>'><% if(QS_MTFTemplate.selAns[key].selText < 1){ %> <p><%= val.text %></p> <% } %></div>\
            </div>\
          </div>\
        </div>\
      <% });%>\
    </div>\
</div>";

QS_MTFTemplate.expandQuestion = function (event) {
  if ($(event.target.parentElement).hasClass('mtf-question-text-exapand')) {
    $(event.target.parentElement).addClass("mtf-question-text-collapse");
    $(event.target.parentElement).removeClass("mtf-question-text-exapand");
    $(".mtf-header").css('height', '34vh');
  } else {
    $(event.target.parentElement).removeClass("mtf-question-text-collapse");
    $(event.target.parentElement).addClass("mtf-question-text-exapand");
    $(".mtf-header").css('height', '17.7vh');
  }
};

//# sourceURL=QS_MTFTemplate.js