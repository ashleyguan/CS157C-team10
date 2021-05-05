const router = require('express').Router();
const e = require('express');
//const { parse } = require('dotenv/types');
const neo4j = require('neo4j-driver');
var parser = require('parse-neo4j');

const driver = neo4j.driver('bolt://100.25.246.129:7687', neo4j.auth.basic('neo4j', 'squares-advance-allies'))
const session = driver.session();

    function parse(promise){
        return parsedResult = promise
        .then(parser.parse)
        .then(function(parsed){
          // console.log("yo")
           // console.log(parsed)
            return parsed
        })
    
        .catch(function(parseError) {
            console.log(parseError);
        });
    }

    // iterate through records
        // iterate through fields
        // 	for each field:
        // 		if node:
        // 			identity.low: store for mapping relationships
        // 			labels[0]: store for understanding what to do with the relationships (if its Course offering pattern, use title to decide whether to offer or not)
        // 			properties
        // 				for each property get:
        // 					summary: for display at end
        // 					units.low: for unit calulation
        // 					title: for a bunch of stuff
        // 					subject: for display at the end
        // 		if relationship:
        // 			identity.low: store for mapping to nodes
        // 			start.low: store for mapping to nodes
        // 			end.low: store for mapping to nodes
        // 			type: store for understanding what relationship is

  function get_requirements(course){
    // const records = await session.run('match (n:Requirement) return n')
    
    var result = session
    .run("MATCH (n)-[r]-(m) WHERE n.title = \"CS 160\" RETURN n, r, m",{cur_course:course}).then(result => {
        result.records.forEach(record => {
            console.log("record")
            console.log(record)

            var main_node_identity

            record._fields.forEach(function(field,i){

                console.log("field")
                // console.log(Object.keys(field))
                console.log(i)
                console.log(field)

                // identity of field (exists for borth nodes and relationships )
                console.log("Identity: " + (field.identity).low)

                if (i == 1){ // if relationship (always in 1st index)

                    // get relevant information
                    console.log("Start: " + (field.start).low)
                    console.log("End: " + (field.start).low)
                    console.log("Type: " + field.type)
                }else{ // if node

                    // get type of node (maybe don't need switch for this, have to decide still)
                    switch(field.labels[0]){
                        case "Course":
                            console.log("Course")
                            break;

                        case "Course Offering Pattern":
                            console.log("Course Offering Pattern")
                            break;

                        case "Requirement Subcategory":
                            console.log("Requirement Subcategory")
                            break;

                    }

                    // get node properties
                    console.log("Properties: " + field.properties)
                    for (var key in field.properties){
                        switch (key){
                            case "summary":
                                console.log("Summary: " + field.properties[key])
                                break;

                            case "units":
                                console.log("Units: " + field.properties[key])
                                break;

                            case "title":
                                console.log("Title: " + field.properties[key])
                                break;

                            case "subject":
                                console.log("Subject: " + field.properties[key])
                                break;
                            default:
                                console.log("NEED ENTRY FOR THIS KEY: "+key)
                                throw new UserException("NEED ENTRY FOR THIS KEY: "+key);
                        }
                    }
            }
        })
      })
    })
    .catch(function(error) {
        console.log(error);
    });
    

    return result

}


function get_completed_classes(course,completed_courses){
    console.log(`MATCH (n)-[r:REQUIRES]->(m) WHERE n.title = \"${course}\" RETURN m`)
    if (completed_courses.includes(course)){
        completed_courses.push(course)
    }
    var result = session
    .run(`MATCH (n)-[r:REQUIRES]->(m) WHERE n.title = \"${course}\" RETURN m`).then(result => {
        result.records.forEach(record => {
            console.log("record")
            console.log(record)
                        
            record._fields.forEach(function(field,i){

                // console.log("field")
                // console.log(Object.keys(field))
                // console.log(i)
                console.log(field.properties['title'])
                get_completed_classes(field.properties['title'],completed_courses)
                if (!completed_courses.includes(field.properties['title'])){
                    completed_courses.push(field.properties['title'])
                } 

            })

        })
        console.log(completed_courses)
        return completed_courses

    
    })
}




router.route('/result').post((req, res) => {
    const params = req.body
    const courses = req.body.studentCH.split('\n')
    var completed_courses = []
    for (i = 0;i<courses.length;i++){\
        console.log("AHASHSHADSAHDSAHJDBSAD: " + courses[i])
        var cur_completed_courses = []
      var completed_courses = completed_courses.concat(get_completed_classes(courses[i],cur_completed_courses))
    }
   console.log("yoyoyyo "+completed_courses)

});


module.exports = router;