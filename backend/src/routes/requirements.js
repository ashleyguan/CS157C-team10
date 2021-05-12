

const router = require('express').Router();
const e = require('express');
//const { parse } = require('dotenv/types');
const neo4j = require('neo4j-driver');
var parser = require('parse-neo4j');
const { isCompositeComponent } = require('react-dom/test-utils');

const driver = neo4j.driver('bolt://localhost:7687',
                  neo4j.auth.basic('neo4j', 'root'), 
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
                requirements.push(field.properties)
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


    return requirements
}

async function get_requirement_subcategories(){
    //    console.log(`MATCH (n)-[r]-(m:`Requirement Subcategory`) WHERE n.title = "CS 160" RETURN n,r,m`)
        const session = driver.session();
        let requirement_subcategories = []
        let requirement_subcategory_units = []

        var result =  await session
        .run(`MATCH (n:\`Requirement Subcategory\`) RETURN n`).then(result => {
            result.records.forEach(record => {       
                record._fields.forEach(function(field,i){
                    requirement_subcategories.push(field.properties)
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
        return requirement_subcategories
    }

    async function get_requirement_subcategories_sections(){
        //    console.log(`MATCH (n)-[r]-(m:`Requirement Subcategory`) WHERE n.title = "CS 160" RETURN n,r,m`)
            const session = driver.session();
            let requirement_subcategories_sections= []

            let requirement_subcategory_units = []
    
            var result =  await session
            .run(`MATCH (n:\`Subcategory Section\`) RETURN n`).then(result => {
                result.records.forEach(record => {
                    var cur_req = {}
                    record._fields.forEach(function(field,i){
                        requirement_subcategories_sections.push(field.properties)
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
            })            
              // .then(() => session.close())  
        
            // console.log("Subcategories: " + requirement_subcategories)
            // console.log(requirement_subcategories_sections)
            return requirement_subcategories_sections
        }
 
        async function fill_requirement_subcategories_sections_requirements(requirement_subcategories_section){
            var filled_reqs = []
       const session = driver.session();
            console.log(`MATCH (n)-[r:REQUIRES]->(m) WHERE n.title = "${requirement_subcategories_section.title}" RETURN m`)
            var result =  await session
            .run(`MATCH (n)-[r:REQUIRES]->(m) WHERE n.title = "${requirement_subcategories_section.title}" RETURN m`).then(result => {
                var cur_req = []

                result.records.forEach(record => {
                    record._fields.forEach(function(field,i){
                        cur_req.push(field.properties.title)
                    })
                    filled_reqs["Requirements"] = cur_req
                })
            })
            .catch(function(error) {
                console.log(error);
                // console.log(requirement_subcategories_sections)
            })
            return filled_reqs
        }

        async function fill_requirement_subcategories_sections_satisfy(requirement_subcategories_section){
            var filled_sats = []
       const session = driver.session();
            // console.log(`MATCH (n)<-[r:SATISFIES]-(m) WHERE n.title = "${requirement_subcategories_section.title}" RETURN m`)
            var result =  await session
            .run(`MATCH (n)<-[r:SATISFIES]-(m) WHERE n.title = "${requirement_subcategories_section.title}" RETURN m`).then(result => {
                // var cur_req = []

                result.records.forEach(record => {
                    record._fields.forEach(function(field,i){
                        filled_sats.push(field.properties.title)
                    })
                    // filled_sats["Satisfies"] = cur_req
                })
            })
            .catch(function(error) {
                console.log(error);
                // console.log(requirement_subcategories_sections)
            })
            return filled_sats
        }
        // requirement_subcategories_sections.forEach(async section => {
        //     console.log("***********")
        //     console.log(requirement_subcategories_sections[section])
        //     // console.log(requirement_subcategories_sections)
        //     // console.log(section)
        //     const session = driver.session();

        //     var result =  await session
        //     .run(`MATCH (n)-[r:REQUIRES]->(m) WHERE n.title = "${requirement_subcategories_sections[section].title}" RETURN m`).then(result => {
        //         var cur_req = []

        //         result.records.forEach(record => {
        //             record._fields.forEach(function(field,i){
        //                 cur_req.push(field.properties.title)
        //             })
        //             requirement_subcategories_sections[section]["Requirements"] = cur_req
        //         })
        //     })
        //     .catch(function(error) {
        //         console.log(error);
        //         // console.log(requirement_subcategories_sections)
        //     })
        //     var result =  await session
        //     .run(`MATCH (n)<-[r:SATISFIES]-(m) WHERE n.title = "${requirement_subcategories_sections[section].title}" RETURN m`).then(result => {
        //         var cur_sat = []

        //         result.records.forEach(record => {
        //             record._fields.forEach(function(field,i){
        //                 cur_sat.push(field.properties.title)
        //             })
        //             // console.log("*********8")
        //             // console.log(cur_sat)
        //             requirement_subcategories_sections[section]["Satisfiers"] = cur_sat
        //         })
        //     })
        //     .catch(function(error) {
        //         console.log(error);
        //     }).then(() => session.close())  
        //     // console.log("------------------------")
        //     // console.log(requirement_subcategories_sections)
        //     // console.log(section)
        //     // console.log("**********")
        // })
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

async function get_completed_classes(course){
//    console.log(`MATCH (n)-[r:REQUIRES *0..]->(m) WHERE n.title = \"${course}\" RETURN m`)
  var completed_courses = []
  var completed_course_units = []
  var unresolved_prereqs = []
  const session = driver.session();
    var result =  await session
    .run(`MATCH (n)-[r:REQUIRES *0..]->(m) WHERE n.title = \"${course}\" RETURN m`).then(result => {
        result.records.forEach(record => {        
            record._fields.forEach(function(field,i){
                switch(field.labels[0]){
                    case "Course":
                        if (!completed_courses.includes(field.properties['title'])){
                            completed_courses.push(field.properties['title'])
                            completed_course_units.push(field.properties.units.low)

                        } 
                        break
                    case "Prerequisite Placeholder":
                        if (!unresolved_prereqs.includes(field.properties['title'])){
                            unresolved_prereqs.push(field.properties['title'])
                        } 
                        break
                    default:
                        console.log("IN GET COMPLETED CLASSES: NO OPTION FOR "+ field.labels[0] + " IN SWITCH")
                }
                console.log(field)

            })
        })
    })
    .catch(function(error) {
        console.log(error);
    })
    .then(() => session.close());

    return [completed_courses, completed_course_units,unresolved_prereqs]
}
async function get_prereq_options(prereq){
  // console.log(`MATCH (n)-[r:REQUIRES *0..]->(m) WHERE n.title = \"${course}\" RETURN m`)
  var prereq_options = []
  const session = driver.session();
    var result =  await session
    .run(`MATCH (n)<-[r:SATISFIES]-(m) WHERE n.title = \"${prereq}\" return m`).then(result => {
        result.records.forEach(record => {        
            record._fields.forEach(function(field,i){
                prereq_options.push(field.properties['title'])
             })
        })
    })
    .catch(function(error) {
        console.log(error);
    })
    console.log("prereq options: "+prereq_options)
    return prereq_options
}
async function handle_prereq_resolution(prereq){
     var options = {}
     options[prereq] = []
     const session = driver.session();
    //  console.log(`MATCH (n)-[r:REQUIRES]->(m) WHERE n.title = \"${prereq}\" return m`)
     var result =  await session
     .run(`MATCH (n)-[r:REQUIRES]->(m) WHERE n.title = \"${prereq}\" return m`).then(result => {
         var cur_option = []
         result.records.forEach(record => {        
             record._fields.forEach(function(field,i){
                //  console.log(field)
                cur_option.push(field.properties['title'])
              })
         })
         options[prereq].push(cur_option)
     })
     .catch(function(error) {
         console.log(error);
     }).then(() => session.close());
     console.log("prereq course options: "+options)

     
     return options
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

async function get_units(title){
    var units = 0
    const session = driver.session();
     var result =  await session
     .run(`MATCH (n) WHERE n.title = \"${title}\" return n`).then(result => {
         var cur_option = []
         result.records.forEach(record => {        
             record._fields.forEach(function(field,i){
                //  console.log(field)
                units = field.properties.units.low
              })
         })
     })
     .catch(function(error) {
         console.log(error);
     }).then(() => session.close());
     
     return units
 }




// router.route('/verify_course_history').post(async (req, res) => {
//     // get completed courses
//     const courses = req.body.studentCH.split('\n')
//     var completed_courses = []
//     var unresolved_prereqs = []
//     for (i = 0;i<courses.length;i++){
//         var completed_courses_combined = await get_completed_classes(courses[i])
//         cur_courses = completed_courses_combined[0]
//         cur_unresolved_prereqs = completed_courses_combined[1]
//         cur_courses.forEach(course => {
//             if (!completed_courses.includes(course)){
//                 completed_courses.push(course)
//             }
//         })
//         cur_unresolved_prereqs.forEach(unresolved_prereq => {
//             if (!unresolved_prereqs.includes(unresolved_prereq)){
//                 unresolved_prereqs.push(unresolved_prereq)
//             }
//         })

//     }
//     console.log("Completed Courses "+completed_courses)
//     console.log("Unresolved Prereqs: " + unresolved_prereqs)
//     res.status(200).send([completed_courses,unresolved_prereqs]);

// })

// router.route('/get_prereq_options').post(async (req, res) => {
//     var all_options = []
//     const sent_prereqs = req.body
//     console.log("sent prereqs " +sent_prereqs)
//     for(i=0;i<sent_prereqs.length;i++){
//         console.log("sending prereq: " + sent_prereqs[i])
//         var cur_prereq = sent_prereqs[i]
//         var opts = await get_prereq_options(cur_prereq)
//         all_options.push(opts)
        
//     }
//     console.log("all options "+all_options)

//     var all_course_options = []
//     for(j=0;j<all_options.length;j++){
//         var cur_option = all_options[j]
//         var course_opts = []
//         for(k=0;k<cur_option.length;k++){
//             var opts = await handle_prereq_resolution(cur_option[k])
//             course_opts.push(opts)
//         }
//         all_course_options.push(course_opts)
//     }
//     console.log(all_course_options)

//     res.status(200).send(all_course_options)
// })


router.route('/result').post(async (req, res) => {
    var requirement_json = {}
    // get completed courses
    const courses = req.body.studentCH.split('\n')
    var completed_courses = []
    var completed_course_units = []
    var unresolved_prereqs = []

    for (i = 0;i<courses.length;i++){
        var completed_courses_combined = await get_completed_classes(courses[i])
        let cur_courses = completed_courses_combined[0]
        let cur_course_units = completed_courses_combined[1]
        let cur_unresolved_prereqs = completed_courses_combined[2]

        console.log(cur_courses,cur_course_units)
        cur_courses.forEach(course=> {
            if (!completed_courses.includes(course)){
                completed_courses.push(course)
                completed_course_units.push(cur_course_units[cur_courses.indexOf(course)])
            }
        })

        
        cur_unresolved_prereqs.forEach(unresolved_prereq => {
            if (!unresolved_prereqs.includes(unresolved_prereq)){
                unresolved_prereqs.push(unresolved_prereq)
            }
        })

    }
    console.log("Completed Courses "+completed_courses)
    console.log("Unresolved Prereqs: " + unresolved_prereqs)


    var completed_requirements = []

    // console.log(await get_requirements())
    // console.log(await get_requirement_subcategories())
    // console.log()
    var secs = await get_requirement_subcategories_sections()
    for (i = 0;i<secs.length;i++){
        console.log(secs[i])
        console.log("0000000000000000000")
        secs[i]["Satisfiers"] = await fill_requirement_subcategories_sections_satisfy(secs[i])
        secs[i]["Required"] = await fill_requirement_subcategories_sections_requirements(secs[i])
        console.log(secs[i])
        console.log("111111111111111")


    }
// console.log("-------------------------------------------------")
// console.log(requirement_json)
// res.status(200).send(requirement_json)
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


    
