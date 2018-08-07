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
  _dragulaContainers: [],
  _constant: {
    horizontal: "Horizontal",
    vertial : "Vertical"
  },
  setQuestionTemplate: function () {
    MTFController.initTemplate(this);// eslint-disable-line no-undef
  },

  preQuestionShow: function (event) {
    this._super(event);
    var inst = this;

    // If the any of the lhs or rhs had a image then the layout is vertical
    _.each(this._question.data.option.optionsLHS, function(lhs){
      if(lhs.image) {
        inst._question.config.layout = "Vertical";
      }
    })
    _.each(this._question.data.option.optionsRHS, function(rhs){
      if(rhs.image) {
        inst._question.config.layout = "Vertical";
      }
    })
    this._question.template = MTFController.getQuestionTemplate(this._question.config.layout, this._constant);

    //shuffle rhs answers
    this._question.data.option.optionsRHS = _.shuffle(this._question.data.option.optionsRHS);
  },
  postQuestionShow: function (event) {
    var instance = this;
  },
  evaluateQuestion: function(event){
    var instance = this;
    var callback = event.target;
    var correctAnswer = true;
    var correctAnswersCount = 0;
    var telemetryValues = [];
    var totalLHS = instance._question.data.option.optionsLHS.length;
    instance._selectedRHS = [];
    $('.rhs-block').each(function(expectedOptionMapIndex, elem){
      var telObj = {
        'LHS':[],
        'RHS':[]
      };
      var selectedOptionMapIndex = parseInt($(elem).data('mapindex')) - 1;
      telObj['LHS'][expectedOptionMapIndex] = instance._question.data.option.optionsLHS[expectedOptionMapIndex];
      telObj['RHS'][selectedOptionMapIndex] = instance._question.data.option.optionsRHS[selectedOptionMapIndex];
      telemetryValues.push(telObj);
      instance._selectedRHS.push(instance._question.data.option.optionsRHS[selectedOptionMapIndex]);
      if(selectedOptionMapIndex == expectedOptionMapIndex){
        correctAnswersCount++;
      } else {
        correctAnswer = false;
      }
    })
    var partialScore = (correctAnswersCount / totalLHS) * this._question.config.max_score;
    var result = {
      eval: correctAnswer,
      state: {
        val: {
          "lhs": this._question.data.option.optionsRHS,
          "rhs": instance._selectedRHS
        }
      },
      score: partialScore,
      values: telemetryValues,
      noOfCorrectAns: correctAnswersCount,
      totalAns: totalLHS
    };
    if (_.isFunction(callback)) {
      callback(result);
    }
  },
  evaluateQuestion_old: function (event) {
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
  logTelemetryItemResponse: function (data) {
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, {"type": "INPUT", "values": data});
  }
});
//# sourceURL=questionunitMTFPlugin.js