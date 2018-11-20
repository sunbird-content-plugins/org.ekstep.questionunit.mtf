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
  _drake: undefined,
  _constant: {
    horizontal: "Horizontal",
    vertial: "Vertical"
  },
  setQuestionTemplate: function () {
    MTFController.initTemplate(this);// eslint-disable-line no-undef
  },

  preQuestionShow: function (event) {
    this._super(event);
    var inst = this;

    // If the any of the lhs or rhs had a image then the layout is vertical
    _.each(this._question.data.option.optionsLHS, function (lhs) {
      if (lhs.image) {
        inst._question.config.layout = "Vertical";
      }
    })
    _.each(this._question.data.option.optionsRHS, function (rhs) {
      if (rhs.image) {
        inst._question.config.layout = "Vertical";
      }
    })
    this._question.template = MTFController.getQuestionTemplate(this._question.config.layout, this._constant);
    //The state will created once an is selected, Only once a quesiton will be shuffled
    if (!this._question.state) {
      this._question.data.option.optionsRHS = this.shuffleOptions(this._question.data.option.optionsRHS);
    } else {
      //BASED on the rearranged order update in seqeuence
      var renderedOptions = this._question.state.val.rhs_rendered;
      var reorderedOptionsIndexes = this._question.state.val.rhs_rearranged;
      var newOrderedOptions = [];
      var optionsLength = renderedOptions.length;
      for (var i = 0; i < optionsLength; i++) {
        var rhsObjIndex = _.findIndex(renderedOptions, function (rhsOpt) {
          return rhsOpt.mapIndex == reorderedOptionsIndexes[i];
        })
        newOrderedOptions[i] = renderedOptions[rhsObjIndex];
      }
      this._question.data.option.optionsRHS = newOrderedOptions;
    }

  },
  postQuestionShow: function (event) {
    var instance = this;
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS); // eslint-disable-line no-undef
  },
  evaluateQuestion: function (event) {
    var instance = this;
    var callback = event.target;
    var correctAnswer = true;
    var correctAnswersCount = 0;
    var telemetryValues = [];
    var rhs_rearranged = [];
    var totalLHS = instance._question.data.option.optionsLHS.length;

    $('.rhs-block').each(function (elemIndex, elem) {
      var telObj = {
        'LHS': [],
        'RHS': []
      };
      var elemMappedIndex = parseInt($(elem).data('mapindex')) - 1;
      rhs_rearranged[elemIndex] = elemMappedIndex + 1;
      telObj['LHS'][elemIndex] = instance._question.data.option.optionsLHS[elemIndex];
      telObj['RHS'][elemMappedIndex] = instance._question.data.option.optionsRHS[elemMappedIndex];
      telemetryValues.push(telObj);
      if (elemMappedIndex == elemIndex) {
        correctAnswersCount++;
      } else {
        correctAnswer = false;
      }
    })
    var questionScore;
    if (this._question.config.partial_scoring) {
      questionScore = (correctAnswersCount / totalLHS) * this._question.config.max_score;
    } else {
      if ((correctAnswersCount / totalLHS) == 1) {
        questionScore = this._question.config.max_score;
      } else {
        questionScore = 0
      }
    }

    var result = {
      eval: correctAnswer,
      state: {
        val: {
          "rhs_rendered": instance._question.data.option.optionsRHS,
          "rhs_rearranged": rhs_rearranged
        }
      },
      score: questionScore,
      max_score: this._question.config.max_score,
      values: telemetryValues,
      noOfCorrectAns: correctAnswersCount,
      totalAns: totalLHS
    };
    if (_.isFunction(callback)) {
      callback(result);
    }
  },
  logTelemetryItemResponse: function (data) {
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, { "type": "INPUT", "values": data });
  },
  shuffleOptions: function (options) {
    // shuffle the RHS options such that there is nothing matches by default with the LHS.
    // The permuations are generated when options count is 3, 4 or 5. For others, we just return the shuffled options
    var validOrders = {
      3: [[1, 2, 0], [2, 0, 1]],
      4: [[1, 0, 3, 2], [1, 2, 3, 0], [1, 3, 0, 2], [2, 0, 3, 1], [2, 3, 0, 1], [2, 3, 1, 0], [3, 0, 1, 2], [3, 2, 0, 1], [3, 2, 1, 0]],
      5: [[1, 0, 3, 4, 2], [1, 0, 4, 2, 3], [1, 2, 0, 4, 3], [1, 2, 3, 4, 0], [1, 2, 4, 0, 3], [1, 3, 0, 4, 2], [1, 3, 4, 0, 2], [1, 3, 4, 2, 0], [1, 4, 0, 2, 3], [1, 4, 3, 0, 2], [1, 4, 3, 2, 0], [2, 0, 1, 4, 3], [2, 0, 3, 4, 1], [2, 0, 4, 1, 3], [2, 3, 0, 4, 1], [2, 3, 1, 4, 0], [2, 3, 4, 0, 1], [2, 3, 4, 1, 0], [2, 4, 0, 1, 3], [2, 4, 1, 0, 3], [2, 4, 3, 0, 1], [2, 4, 3, 1, 0], [3, 0, 1, 4, 2], [3, 0, 4, 1, 2], [3, 0, 4, 2, 1], [3, 2, 0, 4, 1], [3, 2, 1, 4, 0], [3, 2, 4, 0, 1], [3, 2, 4, 1, 0], [3, 4, 0, 1, 2], [3, 4, 0, 2, 1], [3, 4, 1, 0, 2], [3, 4, 1, 2, 0], [4, 0, 1, 2, 3], [4, 0, 3, 1, 2], [4, 0, 3, 2, 1], [4, 2, 0, 1, 3], [4, 2, 1, 0, 3], [4, 2, 3, 0, 1], [4, 2, 3, 1, 0], [4, 3, 0, 1, 2], [4, 3, 0, 2, 1], [4, 3, 1, 0, 2], [4, 3, 1, 2, 0]]
    };
    if (validOrders[options.length]) {
      var shuffled = [];
      var selected = validOrders[options.length][_.random(0, validOrders[options.length].length - 1)];
      _.each(selected, function (i) {
        shuffled.push(options[i]);
      });
      return shuffled;
    }
    else
      return _.shuffle(options);
  }
});
//# sourceURL=questionunitMTFPlugin.js