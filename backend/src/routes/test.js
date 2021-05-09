

const router = require('express').Router();
const e = require('express');
//const { parse } = require('dotenv/types');
const neo4j = require('neo4j-driver');
var parser = require('parse-neo4j');
const { isCompositeComponent } = require('react-dom/test-utils');

const driver = neo4j.driver('bolt://3.231.207.99:7687',
                  neo4j.auth.basic('neo4j', 'rifling-brackets-tries'), 
                  {/* encrypted: 'ENCRYPTION_OFF' */});
                  
// const session = driver.session();

async function get_requirements(){
    //console.log(`MATCH (n:Requirement) RETURN n`)
    const session = driver.session();
    var requirements = []
    var requirement_units = []

    var result =  await session
    .run(`MATCH (n:Requirement) RETURN n`).then(result => {
        result.records.forEach(record => {       
            // console.log(record) 
            record._fields.forEach(function(field,i){
                requirements.push(field.properties['title'])
                if (field.properties.hasOwnProperty('units')){
                    requirement_units.push(field.properties.units.low)
                }else{
                    requirement_units.push(0)

                }
                // console.log(field)
            })
        })
    })
    .catch(function(error) {
        console.log(error);
    })


    return [requirements,requirement_units]
}

async function get_requirement_subcategories(requirement){
    //    console.log(`MATCH (n:Requirement)-[r:REQUIRES]-(m:\`Requirement Subcategory\`) WHERE n.title = "${requirement}" RETURN m`)
        const session = driver.session();
        let requirement_subcategories = []
        let requirement_subcategory_units = []

        var result =  await session
        .run(`MATCH (n:Requirement)-[r:REQUIRES]-(m:\`Requirement Subcategory\`) WHERE n.title = "${requirement}" RETURN m`).then(result => {
            result.records.forEach(record => {       
                record._fields.forEach(function(field,i){
                    requirement_subcategories.push(field.properties['title'])
                    if (field.properties.hasOwnProperty('units')){
                        requirement_subcategory_units.push(field.properties.units.low)
                    }else{
                        requirement_subcategory_units.push(0)

                    }
                })
            })
        })
        .catch(function(error) {
            console.log(error);
        }).then(() => session.close())  
    
        // console.log("Subcategories: " + requirement_subcategories)
        return [requirement_subcategories,requirement_subcategory_units]
    }
 
    async function get_requirement_subcategory_requirements(requirement_subcategory){
        //    console.log(`MATCH (n:\`Requirement Subcategory\`)-[r:REQUIRES]->(m) WHERE n.title = "${requirement_subcategory}" return m`)
            const session = driver.session();
            var subcategory_sections = []
            var subcategory_section_units = []

            var required_courses = []
            var required_course_units = []

            var satisfying_courses = []
            var satisfying_course_units = []

            var result =  await session
            .run(`MATCH (n:\`Requirement Subcategory\`)-[r:REQUIRES]->(m) WHERE n.title = "${requirement_subcategory}" return m`).then(result => {
                result.records.forEach(record => {
                  
                    // console.log(record) 
                    record._fields.forEach(function(field,i){
                        switch (field.labels[0]){
                            case "Subcategory Section":
                                subcategory_sections.push(field.properties['title'])
                                if (field.properties.hasOwnProperty('units')){
                                    subcategory_section_units.push(field.properties.units.low)
                                }else{
                                    subcategory_section_units.push(0)
                                }
                                break;
                            case "Course":
                                // console.log("b")
                                required_courses.push(field.properties['title'])
                                required_course_units.push(field.properties.units.low)
                                break;
                            default:
                                console.log(field.labels[0] + " does not have a defined action in get_subcategory_actions");
                        }       

                    })
                })
            })
            .catch(function(error) {
                console.log(error);
            })
            // console.log(`MATCH (n:\`Requirement Subcategory\`)<-[r:SATISFIES]-(m) WHERE n.title = "${requirement_subcategory}" return m`)

            var result =  await session
            .run(`MATCH (n:\`Requirement Subcategory\`)<-[r:SATISFIES]-(m) WHERE n.title = "${requirement_subcategory}" return m`).then(result => {
                result.records.forEach(record => {
                  
                    // console.log(record) 
                    record._fields.forEach(function(field,i){
                        switch (field.labels[0]){
                            // case "Subcategory Section":
                            //     console.log("a")
                            //     subcategory_sections.push(field.properties['title'])
                            //     break;
                            case "Course":
                                // console.log("b")
                                satisfying_courses.push(field.properties['title'])
                                satisfying_course_units.push(field.properties.units.low)
                                break;
                            default:
                                console.log(field.labels[0] + " does not have a defined action in get_subcategory_actions");
                        }       

                    })
                })
            })
            .catch(function(error) {
                console.log(error);
            }).then(() => session.close()) 
    

            return [[subcategory_sections,subcategory_section_units],[required_courses,required_course_units],[satisfying_courses,satisfying_course_units]]
        }

async function get_subcategory_section_requirements(subcategory_section){
            const session = driver.session();

                var subcategory_section_requirements = []
                var subcategory_section_requirement_units = []

                var subcategory_section_satisfiers= []
                var subcategory_section_satisfier_units= []


            var result =  await session
                .run(`MATCH (n:\`Subcategory Section\`)-[r:REQUIRES]->(m) WHERE n.title = "${subcategory_section}" RETURN m`).then(result => {
                    result.records.forEach(record => {   
                        // console.log(record) 
                        record._fields.forEach(function(field,i){
                            subcategory_section_requirements.push(field.properties['title'])
                            subcategory_section_requirement_units.push(field.properties.units.low)
                        })
                    })
                })
                .catch(function(error) {
                    console.log(error);
                })
                // console.log(`MATCH (n:\`Subcategory Section\`)<-[r:SATISFIES]-(m) WHERE n.title = "${subcategory_section}" return m`)
            var result =  await session
                .run(`MATCH (n:\`Subcategory Section\`)<-[r:SATISFIES]-(m) WHERE n.title = "${subcategory_section}" return m`).then(result => {
                    result.records.forEach(record => {   
                        // console.log(record) 
                        record._fields.forEach(function(field,i){
                            subcategory_section_satisfiers.push(field.properties['title'])
                            subcategory_section_satisfier_units.push(field.properties.units.low)
                            
                        })
                    })
                })
                .catch(function(error) {
                    console.log(error);
                }).then(() => session.close()) 

            return [[subcategory_section_requirements,subcategory_section_requirement_units],[subcategory_section_satisfiers,subcategory_section_satisfier_units]]
}

//TODO: handle prereq nodes
async function get_completed_classes(course){
  //  console.log(`MATCH (n)-[r:REQUIRES *0..]->(m) WHERE n.title = \"${course}\" RETURN m`)
  var completed_courses = []
  const session = driver.session();
    var result =  await session
    .run(`MATCH (n)-[r:REQUIRES *0..]->(m) WHERE n.title = \"${course}\" RETURN m`).then(result => {
        result.records.forEach(record => {        
            record._fields.forEach(function(field,i){
                console.log(field)
                if (!completed_courses.includes(field.properties['title'])){
                    completed_courses.push([field.properties['title'],field.properties.units.low])
                } 
            })
        })
    })
    .catch(function(error) {
        console.log(error);
    })
    .then(() => session.close());

    return completed_courses
}

function intersection(setA, setB) {
    setA = new Set(setA)
    setB = new Set(setB)
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return Array.from(_intersection)
}

function difference(setA, setB) {
    setA = new Set(setA)
    setB = new Set(setB)
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return Array.from(_difference)
}
router.route('/result').post(async (req, res) => {

    // get completed courses
    const courses = req.body.studentCH.split('\n')
    var completed_courses = []
    var completed_course_units = []
    for (i = 0;i<courses.length;i++){
        var completed_courses_combined = await get_completed_classes(courses[i])
        completed_courses_combined.forEach(course => {
            var title = course[0]
            var units = course[1]
            if (!completed_courses.includes(title)){
                completed_courses.push(title)
                completed_course_units.push(units) 
            }

        })

    }
    console.log("Completed Courses "+completed_courses)
    console.log("Completed Course Units: " + completed_course_units)

    var completed_requirements = []

    // get requirements
    var requirements_combined = await get_requirements()
        var requirements = requirements_combined[0]
        var requirement_units = requirements_combined[1]
    // for each requirement
    for (i = 0;i<requirements.length;i++){
        var completed_subcategories = []

        console.log("Requirement: " + requirements[i] + " (units: "+requirement_units[i]+")")
        
        // get requirement subcategories; returns: [[subcategory,subcategory,...],[units,units,...]]
        let requirement_subcategories_combined = await get_requirement_subcategories(requirements[i]) 
            let requirement_subcategories = requirement_subcategories_combined[0]
            let requirement_subcategory_units= requirement_subcategories_combined[1]
        for (j = 0;j<requirement_subcategories.length;j++){ 
            var completed_subcategory_sections = []
            var remaining_subcategory_sections = []


            
            var subcategory_units_remaining = requirement_subcategory_units[j]


            
           // get requirement subcategory requirements; returns [[subcategory_sections,subcategory_section_units],[required_courses,required_course_units],[satisfying_courses,satisfying_course_units]]
            let subcategory_requirements_combined = await get_requirement_subcategory_requirements(requirement_subcategories[j])

            let subcategory_sections = subcategory_requirements_combined[0][0]
            let subcategory_section_units = subcategory_requirements_combined[0][1]

            let subcategory_required_courses = subcategory_requirements_combined[1][0]
            let subcategory_required_course_units = subcategory_requirements_combined[1][1]

            let subcategory_satisfying_courses = subcategory_requirements_combined[2][0]
            let subcategory_satisfying_course_units = subcategory_requirements_combined[2][1]
   
            let all_subcategory_sections_satisfied = true

            for (k = 0;k<subcategory_sections.length;k++){
                var subcategory_section_units_remaining = subcategory_section_units[k]

                // returns: [[subcategory_section_requirements,subcategory_section_requirement_units],[subcategory_section_satisfiers,subcategory_section_satisfier_units]]
                var subcategory_section_requirements_combined = await get_subcategory_section_requirements(subcategory_sections[k])
                    var subcategory_section_requirements = subcategory_section_requirements_combined[0][0]
                    var subcategory_section_requirement_units = subcategory_section_requirements_combined[0][1]

                    var subcategory_section_satisfiers = subcategory_section_requirements_combined[1][0]
                    var subcategory_section_satisfier_units = subcategory_section_requirements_combined[1][1]

                var completed_subcategory_section_required_courses = intersection(completed_courses,subcategory_section_requirements)
                var remaining_subcategory_section_required_courses = difference(subcategory_section_requirements,completed_subcategory_section_required_courses)

                completed_subcategory_section_required_courses.forEach(course => {
                    subcategory_section_units_remaining -= completed_course_units[completed_courses.indexOf(course)]
                })
                


                if (subcategory_section_units_remaining > 0 || remaining_subcategory_section_required_courses.length > 0){
                    console.log("\t\tSubcategory Section: " + subcategory_sections[k]+ " (units: "+subcategory_section_units[k]+")")
                    console.log("\t\t\tUnits remaining: " + subcategory_section_units_remaining)
                    console.log("\t\t\tSubcategory Section Requirements: " + subcategory_section_requirements)
                    console.log("\t\t\t\tCompleted: "+completed_subcategory_section_required_courses)
                    console.log("\t\t\t\tRemaining required: "+remaining_subcategory_section_required_courses)
    
                    console.log("\t\t\tSubcategory Section Satisfiers: " + subcategory_section_satisfiers)

                    all_subcategory_sections_satisfied = false
                }else{
                    console.log("\t\tSubcategory Section: " + subcategory_sections[k]+ " (units: "+subcategory_section_units[k]+") COMPLETED")


                }

            }

            var completed_subcategory_requirements = intersection(completed_courses,subcategory_required_courses)
            var remaining_subcategory_requirements = difference(subcategory_required_courses,completed_subcategory_requirements)

            completed_subcategory_requirements.forEach(course => {
                subcategory_units_remaining -= completed_course_units[completed_courses.indexOf(course)]
            })


            if (subcategory_units_remaining > 0 || remaining_subcategory_requirements.length > 0){
                console.log("\tRequirement Subcategory:"+requirement_subcategories[j]+ " (units: "+requirement_subcategory_units[j]+")")

                console.log("\t\tRequired Courses: " + subcategory_required_courses)
                console.log("\t\t\tUnits remaining: " + subcategory_units_remaining)

                console.log("\t\t\tCompleted: "+completed_subcategory_requirements)
                console.log("\t\t\tRemaining required: "+remaining_subcategory_requirements)

                console.log("\t\tSatisfying Courses: " + subcategory_satisfying_courses)
                console.log("\n")
        }else{
            console.log("\tRequirement Subcategory:"+requirement_subcategories[j]+ " (units: "+requirement_subcategory_units[j]+") COMPLETED")


        }
        console.log("\n\n\n")
    }
}
});


module.exports = router;








// async function get_requirement_status(course){
//   //  console.log(`MATCH (n)-[r]-(m:\`Requirement Subcategory\`) WHERE n.title = "${course}" RETURN m`)
//   const session = driver.session();
//     var requirements = []
//     var result =  await session
//     .run(`MATCH (n)-[r]-(m:\`Requirement Subcategory\`) WHERE n.title = "${course}" RETURN m`).then(result => {
//         result.records.forEach(record => {       
//             // console.log(record) 
//             record._fields.forEach(function(field,i){
//                 console.log(field)
//             })
//             //     if (!completed_courses.includes(field.properties['title'])){
//             //         completed_courses.push(field.properties['title'])
//             //     } 
//             // })
//         })
//     })
//     .catch(function(error) {
//         console.log(error);
//     })
//    // return completed_courses
// }







// async function get_subcategory_sections(requirement_subcategory){
// //    console.log(`MATCH (n:\`Requirement Subcategory\`)-[r]-(m:\`Subcategory Section\`) WHERE n.title = "${requirement_subcategory}" RETURN m`)
//     const session = driver.session();
//     var subcategory_sections = []
//     var result =  await session
//     .run(`MATCH (n:\`Requirement Subcategory\`)-[r]-(m:\`Subcategory Section\`) WHERE n.title = "${requirement_subcategory}" RETURN m`).then(result => {
//         result.records.forEach(record => {       
//             // console.log(record) 
//             record._fields.forEach(function(field,i){
               
//                 subcategory_sections.push(field.properties['title'])
//                 console.log(field)
//             })
//         })
//     })
//     .catch(function(error) {
//         console.log(error);
//     })

//     // console.log("Requirements: " + requirement_subcategories)get_subcategory_requirements
//     return subcategory_sections
// }


    