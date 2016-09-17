Meteor.globalFunctions = {
  needsAsJSONSession: function() {
    var nodeId = FlowRouter.getParam('nodeId');
    Meteor.call("getNeeds", nodeId, function(e, r) {
      Session.set("neededConceptsInConceptEdit", r)
    });
    var neededConceptsInConceptEdit = Session.get("neededConceptsInConceptEdit");
    if (typeof neededConceptsInConceptEdit !== 'undefined') {
      var needsCrazyObject = neededConceptsInConceptEdit.sets;
      //console.log(needsCrazyObject);
      var needsJSONArray = [];
      for (var setId in needsCrazyObject) {
        var obj = {};
        obj["_id"] = setId;
        obj.contains = [];
        for (var conceptId in needsCrazyObject[setId]) {
          var conceptInfo = Nodes.findOne(conceptId, {
            fields: {
              name: 1,
              description: 1
            }
          });
          obj.contains.push(conceptInfo)
        }
        needsJSONArray.push(obj);
      };
      //console.log(needsJSONArray);
      Session.set('needsObject', needsJSONArray);
    }
  },

  applySelectizeCode: function() {
    //console.log('applySelectizeCode');
    var conceptsMappedForSelectize = Nodes.find({
      type: 'concept'
    }, {
      fields: {
        _id: 1,
        name: 1,
        description: 1
      }
    }).fetch();
    //console.log(conceptsMappedForSelectize);

    var needsObject = Session.get("needsObject");
    //console.log(needsObject);

    // For each set of concepts, apply selectize js to the respective selectize html
    _.forEach(needsObject, function(nSet) {
      var setId = nSet['_id'];
      //console.log('#' + setId);
      var $select = $('#' + setId).selectize({
        theme: 'links',
        maxItems: null,
        valueField: '_id',
        searchField: ['name', 'description'],
        options: conceptsMappedForSelectize,

        render: {
          option: function(data, escape) {
            return '<div class="option">' +
              '<h5><span class="title"><strong>' + escape(data.name) + '</strong></span><h5>' +
              '<span class="url">' + escape(data.description) + '</span>' +
              '</div>';
          },
          item: function(data, escape) {
            return '<div class="item">' + escape(data.name) + '</div>';
          }
        }
      });

      // For each set of concepts, set the default values
      if (typeof nSet.contains !== 'undefined' && nSet.contains !== null) {
        var subConcepts = nSet.contains;
        //console.log(subConcepts);
        _.forEach(subConcepts, function(nSubConcept) {
          if (typeof nSubConcept['_id'] !== 'undefined' && nSubConcept['_id'] !== null) {
            subConceptId = nSubConcept['_id'];
            $('#' + setId).selectize()[0].selectize.addItem(subConceptId);
          }
        })
      };
    });
  },

  getExamContent: function() {
    var examId = FlowRouter.getParam('nodeId');
    var exam = Nodes.findOne({
      _id: examId
    }) || {};
    var examContents = [];
    if (typeof exam.contains != "undefined") {
      var examContentsIDs = exam.contains;
      for(const unitId of examContentsIDs) {
        examContents.push(Nodes.findOne(unitId));
      }
    };
    return examContents;
  }
}