Template.unitPage.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var contentId = FlowRouter.getParam('contentId');
        //self.subscribe('singleContent', contentId);
        var args = {};
        args["nodeId"] = contentId;
        args["userId"] = Meteor.userId();
        //self.subscribe("singleNode",args);
    });
});

Template.unitPage.rendered = function() {
    $('.tooltipped').tooltip({
        delay: 20
    });
    console.log("rendered unitPage");
    $('unit-content').ready(function() {
        console.log("test")
    });
    $('ul.tabs').tabs();
};

Template.unitContent.onRendered(function() {
    console.log("rendered unitContent");
    $('ul.tabs').tabs();
});

Template.contentByType.onRendered(function() {
    console.log("rendered contentByType");
    $('ul.tabs').tabs();
});

Template.unitPage.events({
    'click #understood': function(event) {
        event.preventDefault();
        if (Meteor.userId()) {
            /*Session.set('callStatus', 'learning');
            if (Session.get("temp") == "ready") {
                Meteor.call("succeed", Blaze.getData()["rid"], function(error, result) {
                    console.log(result.statusCode);
                    if (result.statusCode >= 200 && result.statusCode < 300) {
                        Session.set('callStatus', 'learned');
                    }
                    var newStuff = result.data.result[0]['value'];
                    Session.set('newConcepts', newStuff[1]);
                    Session.set('newUnits', newStuff[0]);
                });
            } else if (Session.get("temp") == "precomputing") {
                console.log("nothing");
            }*/
            Meteor.call("succeed",FlowRouter.getParam('contentId'),Meteor.userId());
        }
    },

    'click #notUnderstood': function(event) {
        event.preventDefault();
        if (Meteor.userId()) {
            /*Session.set('callStatus', 'unlearning');
            if (Session.get("temp") == "ready") {
                Meteor.call("fail", Blaze.getData()["rid"], function(error, result) {
                    console.log(result.statusCode);
                    if (result.statusCode >= 200 && result.statusCode < 300) {
                        Session.set('callStatus', 'unlearned');
                    }
                    var newStuff = result.data.result[0]['value'];
                    Session.set('lostConcepts', newStuff[3]);
                    Session.set('lostUnits', newStuff[2]);
                });
            } else if (Session.get("temp") == "precomputing") {
                console.log("nothing");
            }
            Meteor.call("incrementViews", Blaze.getData()["rid"]);*/
            Meteor.call("fail",FlowRouter.getParam('contentId'),Meteor.userId());
        }
    },

    'submit #exerciseStringForm': function(event) {
        event.preventDefault();
        var answerIsCorrect = null;
        if (this.answers.indexOf(event.target.exerciseString.value) > -1) {
            answerIsCorrect = true
        } else answerIsCorrect = false;
        if (answerIsCorrect) {
            $("#exerciseButton").removeClass("orange red").addClass("green");
            $("#exerciseInputText").removeClass("red-text").addClass("green-text");
            if (Meteor.userId()) {
                /*Session.set("unit_rid", Blaze.getData()["rid"]);
                setTimeout(function() {
                    Session.set('callStatus', 'learning');
                    if (Session.get("temp") == "ready") {
                        var unit_rid = Session.get("unit_rid");
                        Meteor.call("succeed", unit_rid, function(error, result) {
                            if (result.statusCode >= 200 && result.statusCode < 300) {
                                Session.set('callStatus', 'learned');
                            }
                            var newStuff = result.data.result[0]['value'];
                            Session.set('newConcepts', newStuff[1]);
                            Session.set('newUnits', newStuff[0]);
                        });
                    } else if (Session.get("temp") == "precomputing") {
                        console.log("nothing");
                    }
                    Meteor.call("incrementViews", unit_rid);
                }, 2000);*/
                Meteor.call("succeed",FlowRouter.getParam('contentId'),Meteor.userId());
            }
        } else if (!answerIsCorrect) {
            $("#exerciseButton").removeClass("orange");
            $("#exerciseButton").removeClass("green");
            $("#exerciseButton").addClass("red");

            $("#exerciseInputText").removeClass("green-text");
            $("#exerciseInputText").addClass("red-text");

            if (Meteor.userId()) {
                /*Session.set("unit_rid", Blaze.getData()["rid"]);
                setTimeout(function() {
                    Session.set('callStatus', 'unlearning');
                    if (Session.get("temp") == "ready") {
                        var unit_rid = Session.get("unit_rid");
                        Meteor.call("fail", unit_rid, function(error, result) {
                            console.log(result.statusCode);
                            if (result.statusCode >= 200 && result.statusCode < 300) {
                                Session.set('callStatus', 'unlearned');
                            }
                            var newStuff = result.data.result[0]['value'];
                            Session.set('lostConcepts', newStuff[3]);
                            Session.set('lostUnits', newStuff[2]);
                        });
                    } else if (Session.get("temp") == "precomputing") {
                        console.log("nothing");
                    }
                    Meteor.call("incrementViews", unit_rid);
                }, 2000);*/
                Meteor.call("fail",FlowRouter.getParam('contentId'),Meteor.userId());
            }
        }
    },
    'change .trueRadioButton': function(event) {
        $(".trueRadioButton").prop('disabled', 'disabled');
        $(".falseRadioButton").prop('disabled', 'disabled');
        $(".trueRadioButtonLabel").addClass("green-text");
        $(".falseRadioButtonLabel").addClass("red-text");
        if (Meteor.userId()) {
            /*Session.set("unit_rid", Blaze.getData()["rid"]);
            setTimeout(function() {
                Session.set('callStatus', 'learning');
                if (Session.get("temp") == "ready") {
                    var unit_rid = Session.get("unit_rid");
                    Meteor.call("succeed", unit_rid, function(error, result) {
                        console.log("martins");
                        console.log(result.statusCode);
                        if (result.statusCode >= 200 && result.statusCode < 300) {
                            Session.set('callStatus', 'learned');
                        }
                        var newStuff = result.data.result[0]['value'];
                        Session.set('newConcepts', newStuff[1]);
                        Session.set('newUnits', newStuff[0]);
                    });
                } else if (Session.get("temp") == "precomputing") {
                    console.log("nothing");
                }
                Meteor.call("incrementViews", unit_rid);
            }, 2000);*/
            Meteor.call("succeed",FlowRouter.getParam('contentId'),Meteor.userId());
        }
    },

    'change .falseRadioButton': function(event) {
        $(".trueRadioButton").prop('disabled', 'disabled');
        $(".falseRadioButton").prop('disabled', 'disabled');
        $(".trueRadioButtonLabel").addClass("green-text");
        $(".falseRadioButtonLabel").addClass("red-text");
        if (Meteor.userId()) {
            /*Session.set("unit_rid", Blaze.getData()["rid"]);
            setTimeout(function() {
                Session.set('callStatus', 'unlearning');
                if (Session.get("temp") == "ready") {
                    var unit_rid = Session.get("unit_rid");
                    Meteor.call("fail", unit_rid, function(error, result) {
                        console.log(result.statusCode);
                        if (result.statusCode >= 200 && result.statusCode < 300) {
                            Session.set('callStatus', 'unlearned');
                        }
                        var newStuff = result.data.result[0]['value'];
                        Session.set('lostConcepts', newStuff[3]);
                        Session.set('lostUnits', newStuff[2]);
                    });
                } else if (Session.get("temp") == "precomputing") {
                    console.log("nothing");
                }
                Meteor.call("incrementViews", unit_rid);
            }, 2000);*/
            Meteor.call("fail",FlowRouter.getParam('contentId'),Meteor.userId());
        }
    },
    'click #backToUnit': function(event) {
        event.preventDefault();
        Session.set('callStatus', 'doingExercise');
        console.log(Session.get('callStatus'));
    }

});