/**
 *
 * Question Unit plugin to render a MTF question
 * @class org.ekstep.questionunit.mtf
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
org.ekstep.questionunitmtf = {};
org.ekstep.questionunitmtf.RendererPlugin = org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.mtf',
  _isContainer: true,
  _render: true,
  _selectedAnswers: [],
  _constant: {
    horizontal: "Horizontal",
    vertial : "Vertical"
  },
  setQuestionTemplate: function () {
    MTFController.initTemplate(this);// eslint-disable-line no-undef
  },
  preQuestionShow: function (event) {
    this._super(event);
    var templateTypeContent;
    if (this._question.config.layout == this._constant.vertial) { // eslint-disable-line no-undef
      templateTypeContent = MTFController.getVerticalLayout;      
    }else{
      templateTypeContent = MTFController.getHorizontalLayout;  //default is horizontal
    }

    this._question.template = "<div class='mtf-layout' id='mtf-container'>" + MTFController.getQuestionContent() + templateTypeContent() + "</div>";
    

    var instance = this;
    MTFController.optionsWidth = undefined;
    MTFController.optionsHeight = undefined;
    MTFController.selAns = [];
    this._selectedAnswers = [];
    //RHS options data shuffle
    this._question.data.option.optionsRHS = _.shuffle(this._question.data.option.optionsRHS);

    var lhsOptions = this._question.data.option.optionsLHS;
    for (var lhs = 0; lhs < lhsOptions.length; lhs++) {
      var emptyBox = {
        "index": lhsOptions[lhs].index,
        "selText": ""
      };
      MTFController.selAns.push(emptyBox);
    }
    if (this._question.state && this._question.state.val) {
      this._selectedAnswers = this._question.state.val.lhs;
      MTFController.selAns = this._question.state.val.lhs;
      this._question.data.option.optionsRHS = this._question.state.val.rhs;
    }
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS); // eslint-disable-line no-undef

    //here have to change based on the type of the question whether horizontal or vertial length (currently horizontal)
    if (lhsOptions.length == 3) {
      MTFController.optionsWidth = 'width33';
    } else if (lhsOptions.length == 4) {
      MTFController.optionsWidth = 'width25';
    } else if (lhsOptions.length == 5) {
      MTFController.optionsWidth = 'width20';
    }

    //this height[NUMBER]option is a class to apply for vertical mtf template based on number of option
    if (lhsOptions.length == 3) {
      MTFController.optionsHeight = 'height3option';
    } else if (lhsOptions.length == 4) {
      MTFController.optionsHeight = 'height4option';
    } else if (lhsOptions.length == 5) {
      MTFController.optionsHeight = 'height5option';
    }
  },
  postQuestionShow: function (event) {
    var instance = this;
    var drake = dragula([mtfoptionscontainerdrag]);
    drake.on('drop', function (elem, target, source, sibling) {
      instance.onDropElement(elem, target, source, sibling, instance._question);
    });
  },
  evaluateQuestion: function (event) {
    var instance = this;
    var callback = event.target;
    var correctAnswer = true;
    var telemetryValues = [];
    var tempCount = 0;
    var qLhsData = this._question.data.option.optionsLHS;
    if (!_.isUndefined(instance._selectedAnswers)) {
      _.each(qLhsData, function (val, key) {
        var telObj = {};
        if (!_.isUndefined(instance._selectedAnswers[key])) {
          telObj[qLhsData[key].text] = instance._selectedAnswers[key].selText;
          telemetryValues.push(telObj);
          var t = instance._selectedAnswers[key].mapIndex;
          if (qLhsData[key].index != Number(t)) {
            correctAnswer = false;
          } else {
            tempCount++;
          }
        } else {
          correctAnswer = false;
        }
      });
    }
    var partialScore = (tempCount / qLhsData.length) * this._question.config.max_score;
    var result = {
      eval: correctAnswer,
      state: {
        val: {
          "lhs": instance._selectedAnswers,
          "rhs": this._question.data.option.optionsRHS
        }
      },
      score: partialScore,
      values: telemetryValues,
      noOfCorrectAns: tempCount,
      totalAns: qLhsData.length
    };
    if (_.isFunction(callback)) {
      callback(result);
    }
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', result.state);
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESSEND, result);
  },
  onDropElement: function (elem, target, source, sibling, question) {
    var instance = this;
    $('#mtfoptionscontainerdrag .cont-dragula').each(function(index){
      instance._selectedAnswers[index] = {'mapIndex' : $(this).data('map-index'), 'selText' : $(this).data('map-value')}
    })
  },
  logTelemetryItemResponse: function (data) {
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, {"type": "INPUT", "values": data});
  }
});
//# sourceURL=questionunitMTFPlugin.js