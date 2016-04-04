function needsAsJSONSession() {
  //console.log('needsAsJSONSession');
  var id = FlowRouter.getParam('conceptId');
  var requirements = Requirements.find({
    node: id
  }).fetch();
  var json = [];
  for (var i = 0; i < requirements.length; i++) {
    var requirement = requirements[i];
    var requirementId = requirement._id;
    var info = Personal.findOne({
      node: requirementId
    });
    var state = info ? info.state : 0;
    var contains = [];
    var subconcepts = requirement.weights;
    for (var subconceptId in subconcepts) {
      var subObj = {};
      var subconcept = Nodes.findOne(subconceptId);
      subObj["_id"] = subconceptId;
      subObj["name"] = subconcept.name;
      subObj["description"] = subconcept.description;
      var subinfo = Personal.findOne({
        node: subconceptId,
        user: Meteor.userId()
      });
      var substate = subinfo ? subinfo.state : 0;
      contains.push(subObj);
    }
    var obj = {};
    obj["_id"] = requirementId;
    obj["state"] = state;
    obj["contains"] = contains;
    json.push(obj);
  }
  Session.set("needsObject", json);
}

function applySelectizeCode() {
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
    subConcepts = nSet.contains;
    _.forEach(subConcepts, function(nSubConcept) {
      subConceptId = nSubConcept['_id'];
      $('#' + setId).selectize()[0].selectize.addItem(subConceptId);
    });
    /*        // UNDER CONSTRUCTION. PROBABLY NOT NECESSARY
            //Add concepts to needsObject session, everytime a new concept is added
            $('#' + setId).selectize()[0].selectize.on('change', function() {
                var needsObject = Session.get('needsObject');
                console.log(setId + ' : ' + $('#' + setId).selectize()[0].selectize.getValue());
                //needsObject[setId].contains = $('#' + setId).selectize()[0].selectize.getValue();
                Session.set('needsObject', needsObject);
                console.log(needsObject);
            });*/
  });
}

Template.conceptEdit.onCreated(function() {
  //console.log('conceptEdit >onCreated');
  var self = this;
  self.autorun(function() {
    var conceptId = FlowRouter.getParam('conceptId');
    self.subscribe('singleConcept', conceptId);
    self.subscribe("nodes");
    self.subscribe("sets");
    self.subscribe("edges");
    self.subscribe("personal");

  });

});
Template.conceptEdit.rendered = function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      //console.log('conceptEdit rendered > subs ready');
      needsAsJSONSession();
      var deletedNeedsSets = [];
      Session.set('deletedNeedsSets', deletedNeedsSets);

    }
  });
};


Template.conceptEditSelectBox.rendered = function() {
  this.autorun(() => {
    if (Template.instance().parent(1).subscriptionsReady()) {
      //console.log('conceptEditSelectBox rendered > subs ready');
      applySelectizeCode();
      /*$(document).ready(function() {
          $('.tooltipped').tooltip({
              delay: 20
          });
      });*/



      //$('#select-links').selectize()[0].selectize.setValue(["MPhF2KaYg2wsA5ScG"]);
    }
  });

};


Template.conceptEdit.events({
  'click #deleteConcept': function(event) {
    event.preventDefault();
    var nodeId = FlowRouter.getParam('conceptId');
    Meteor.call('removeNode', nodeId);
    FlowRouter.go('dashboard');

  },
  'click .add-set': function(event) {
    event.preventDefault();
    var needsObject = Session.get('needsObject');
    needsObject.push({
      '_id': 'newSet-' + Math.random().toString(36).substr(2, 9),
      'contains': {}
    });
    //console.log(uniqueId());
    Session.set('needsObject', needsObject);

    //tempContent.splice(section, 1);
  },
  'click .remove-set': function(event) {
    event.preventDefault();
    var setId = event.target.id;
    setId = setId.replace('remove-', '');
    //console.log(setId);

    var needsObject = Session.get('needsObject');
    needsObject = _.reject(needsObject, {
      '_id': setId
    });
    Session.set('needsObject', needsObject);

    var deletedNeedsSets = Session.get('deletedNeedsSets');
    deletedNeedsSets.push(setId);
    Session.set('deletedNeedsSets', deletedNeedsSets);


    //tempContent.splice(section, 1);
  },


});

AutoForm.hooks({
  conceptEdit: {
    onSubmit: function(doc) {
      var parameters = doc;

      var nodeId = FlowRouter.getParam('conceptId');

      Meteor.call('editNode', nodeId, parameters);
      // var needsObject = Session.get('needsObject');
      // var deletedNeedsSets = Session.get('deletedNeedsSets');
      // //console.log(needsObject);
      // _.forEach(needsObject, function(n) {
      //   var setId = n['_id'];
      //   var needsAsArrayOfId = $('#' + setId).selectize()[0].selectize.getValue();
      //   //console.log(needsAsArrayOfId);
      //   var needsMappedAsArrayofObjects = {};
      //   for (var i = 0; i < needsAsArrayOfId.length; i += 1) {
      //     needsMappedAsArrayofObjects[needsAsArrayOfId[i]] = true;
      //   }
      //   //console.log(needsMappedAsArrayofObjects);
      //   if (_(setId).startsWith('newSet')) {
      //     //console.log(needsMappedAsArrayofObjects);
      //     Meteor.call('addNeed', nodeId, needsMappedAsArrayofObjects);
      //     /*console.log('addNeed for ' + nodeId + ' with' + needsMappedAsArrayofObjects);
      //     console.log(needsMappedAsArrayofObjects);*/
      //   } else {
      //     Meteor.call('editNeed', setId, needsMappedAsArrayofObjects);
      //   }
      // });
      // console.log(deletedNeedsSets);
      // _.forEach(deletedNeedsSets, function(setId) {
      //   Meteor.call('removeNeed', setId);
      // });
      FlowRouter.go('/concept/' + nodeId);
      this.done();
      return false;
    }
  }
});