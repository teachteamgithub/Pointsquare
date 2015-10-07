Template.conceptEdit.rendered = function() {
    $(document).ready(function() {
        $('.tooltipped').tooltip({
            delay: 20
        });
    });
};


AutoForm.hooks({
    conceptEdit: {
        onSubmit: function(doc) {
            console.log("Great Success!");
            console.log("rid", this.formAttributes.conceptRID);
            var conceptRID = this.formAttributes.conceptRID;
            var properties = {};
            properties.name = "'" + doc.name + "'"; // fetch autoform input as necessary by createUnit method(properties, necessary, granted)
            properties.description = "''"; // create empty string with extra quotes for OrientDB parsing
            if (typeof doc.description != "undefined") { // in case description has not been filled, leave blank
                properties.description = "'" + doc.description + "'";
            };

            console.log("Properties", properties);


            var childConcepts = {};
            _.forEach(doc.childConcepts, function(n) {
                childConcepts[n] = 1
            });

            var childConceptsArray = [];
            childConceptsArray.push(childConcepts);

            console.log("childConcepts", childConceptsArray);
            Meteor.call('editConcept', conceptRID, properties, childConceptsArray);



            this.done();
            Router.go('/concept/' + encodeURIComponent(conceptRID));
            return false;
        }
    }
});