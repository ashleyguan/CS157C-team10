

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

async function get_requirement_req(requirement){
    //console.log(`MATCH (n:Requirement) RETURN n`)
    const session = driver.session();
    var requirements_req = []
    var requirement_units = []

    var result =  await session
    .run(`MATCH (n:Requirement)-[r:REQUIRES]->(m:\`Requirement Subcategory\`) WHERE n.title = "${requirement.title}" RETURN m`).then(result => {
        result.records.forEach(record => {       
            // console.log(record) 
            record._fields.forEach(function(field,i){
                requirements_req.push(field.properties.title)
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


    return requirements_req
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

        async function get_requirement_subcategories_sections_individual(requirement_subcategory){
            //    console.log(`MATCH (n)-[r]-(m:`Requirement Subcategory`) WHERE n.title = "CS 160" RETURN n,r,m`)
                const session = driver.session();
                let requirement_subcategories_sections= []
    
                let requirement_subcategory_units = []
        
                var result =  await session
                .run(`MATCH (n:\`Requirement Subcategory\`)-[r:REQUIRES]->(m:\`Subcategory Section\`) WHERE n.title = "${requirement_subcategory.title}" RETURN m`).then(result => {
                    result.records.forEach(record => {
                        var cur_req = {}
                        record._fields.forEach(function(field,i){
                            requirement_subcategories_sections.push(field.properties.title)
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
 
        async function fill_requirements(requirement_subcategories_section){
            var filled_reqs = []
       const session = driver.session();
            // console.log(`MATCH (n)-[r:REQUIRES]->(m) WHERE n.title = "${requirement_subcategories_section.title}" RETURN m`)
            var result =  await session
            .run(`MATCH (n)-[r:REQUIRES]->(m) WHERE n.title = "${requirement_subcategories_section.title}" RETURN m`).then(result => {
                var cur_req = []

                result.records.forEach(record => {
                    record._fields.forEach(function(field,i){
                        filled_reqs.push(field.properties.title)
                    })
                    // filled_reqs["Remaining Requirements"] = cur_req
                })
            })
            .catch(function(error) {
                console.log(error);
                // console.log(requirement_subcategories_sections)
            })
            return filled_reqs
        }

        async function fill_satisfiers(requirement_subcategories_section){
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
      
    async function fill_requirement_subcategory_reqs(requirement_subcategory){
        //    console.log(`MATCH (n)-[r:REQUIRED]->(m:Course) WHERE n.title = "${requirement_subcategory.title}" return m`)
            const session = driver.session();
            var subcategory_sections = []
            var subcategory_section_units = []

            var required_courses = []
            var required_course_units = []

            var satisfying_courses = []
            var satisfying_course_units = []

            var result =  await session
            // MATCH (n)-[r]-(m:Course) WHERE n.title = "Upper Division Computer Science Courses" RETURN n,r,m

            .run(`MATCH (n)-[r:REQUIRES]->(m:Course) WHERE n.title = "${requirement_subcategory.title}" return m`).then(result => {
                result.records.forEach(record => {
                  
                    // console.log(record) 
                    record._fields.forEach(function(field,i){
                        required_courses.push(field.properties['title'])
                        required_course_units.push(field.properties.units.low)
                                    

                    })
                })
            })
            .catch(function(error) {
                console.log(error);
            })
         
            return required_courses//[[subcategory_sections,subcategory_section_units],[required_courses,required_course_units],[satisfying_courses,satisfying_course_units]]
        }

        async function fill_requirement_subcategory_satisfiers(requirement_subcategory){
            //    console.log(`MATCH (n)<-[r:SATISFIES]-(m:Course) WHERE n.title = "${requirement_subcategory}" return m`)
                const session = driver.session();
                var subcategory_sections = []
                var subcategory_section_units = []
    
                var required_courses = []
                var required_course_units = []
    
                var satisfying_courses = []
                var satisfying_course_units = []
    
                var result =  await session
                // MATCH (n)-[r]-(m:Course) WHERE n.title = "Upper Division Computer Science Courses" RETURN n,r,m
    
                .run(`MATCH (n)<-[r:SATISFIES]-(m:Course) WHERE n.title = "${requirement_subcategory.title}" return m`).then(result => {
                    result.records.forEach(record => {
                      
                        // console.log(record) 
                        record._fields.forEach(function(field,i){
                            satisfying_courses.push(field.properties['title'])
                            required_course_units.push(field.properties.units.low)
                                        
    
                        })
                    })
                })
                .catch(function(error) {
                    console.log(error);
                })
                return satisfying_courses//[[subcategory_sections,subcategory_section_units],[required_courses,required_course_units],[satisfying_courses,satisfying_course_units]]
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
        // completed_courses = completed_courses_combined
    }
    console.log("Completed Courses "+completed_courses)


    var completed_requirements = []

    // console.log(await get_requirements())
    // console.log(await get_requirement_subcategories())
    // console.log()
    var secs = await get_requirement_subcategories_sections()

    for (i = 0;i<secs.length;i++){
        // console.log(secs[i])
        // console.log("0000000000000000000")
        secs[i]["Remaining Satisfiers"] = await fill_satisfiers(secs[i])
        secs[i]["Remaining Required"] = await fill_requirements(secs[i])
        secs[i]["Satisfiers"] = await fill_satisfiers(secs[i])
        secs[i]["Required"] = await fill_requirements(secs[i])
        // console.log(secs[i])
        // console.log("111111111111111")
        secs[i]['Completed Required'] =  []
        secs[i]['Completed Satisfiers'] =  []
        // if (secs[i].hasOwnProperty("units")){
        //     secs[i]['Remaining Units'] =  secs[i].units.low
        // }else{
            secs[i]['Completed Units'] = 0 
        // }
        secs[i]['Completed'] =  false


    }
    // console.log(secs)
     
    for (i=0;i<completed_courses.length;i++){
        for (j = 0;j<secs.length;j++){
            // console.log(secs[j])
            if (secs[j]['Remaining Required'].includes(completed_courses[i])){
                secs[j]['Remaining Required'].splice(secs[j]['Remaining Required'].indexOf(completed_courses[i]),1)
                secs[j]['Completed Required'].push( completed_courses[i])

                console.log("SSSSSSSSSSSSSSSSSSSSSSSSs")
                console.log(completed_course_units[i])
                secs[j]['Completed Units'] += completed_course_units[i]
            }

            if (secs[j]['Remaining Satisfiers'].includes(completed_courses[i])){
                secs[j]['Remaining Satisfiers'].splice(secs[j]['Remaining Satisfiers'].indexOf(completed_courses[i]),1)
                secs[j]['Completed Satisfiers'].push( completed_courses[i])
                secs[j]['Completed Units'] += completed_course_units[i]

            }

            if (secs[j].hasOwnProperty("units")){
                if (secs[j]['Completed Units'] >= secs[j]["units"].low && secs[j]['Required'].length > 0){
                    if (secs[i]['Required'].equals(secs[j]['Completed Required'])){
                        secs[j]['Completed'] =  true
                    }
                }else if (secs[j]['Completed Units']>= secs[j]["units"].low){
                    secs[j]['Completed'] =  true

                }
            }else{
                if (secs[j]["Completed Satisfiers"].length > 0){
                    secs[j]['Completed'] =  true
                }
            }
        }
    }
    // console.log(secs)


    var requirement_subcategories = await get_requirement_subcategories()
    for (i = 0;i<requirement_subcategories.length;i++){
        // console.log(secs[i])
        // console.log("0000000000000000000")
        requirement_subcategories[i]["Subcategory Sections"] = await get_requirement_subcategories_sections_individual(requirement_subcategories[i])

        requirement_subcategories[i]["Remaining Satisfiers"] = await fill_requirement_subcategory_satisfiers(requirement_subcategories[i])
        requirement_subcategories[i]["Remaining Required"] = await fill_requirement_subcategory_reqs(requirement_subcategories[i])
        requirement_subcategories[i]["Satisfiers"] = await fill_requirement_subcategory_satisfiers(requirement_subcategories[i])
        requirement_subcategories[i]["Required"] = await fill_requirement_subcategory_reqs(requirement_subcategories[i])
        // console.log(secs[i])
        // console.log("111111111111111")
        requirement_subcategories[i]['Completed Required'] =  []
        requirement_subcategories[i]['Completed Satisfiers'] =  []
        // if (secs[i].hasOwnProperty("units")){
        //     secs[i]['Remaining Units'] =  secs[i].units.low
        // }else{
            requirement_subcategories[i]['Completed Units'] = 0 
        // }
        requirement_subcategories[i]['Completed'] =  false


        var secs_completed = true
        var reqs_completed = false
        if (requirement_subcategories[i]["Required"].length == 0){
            requirement_subcategories[i]['reqs_completed'] = true

        }else{
            requirement_subcategories[i]['reqs_completed'] = false
        }
        if (requirement_subcategories[i]["Subcategory Sections"].length == 0){
            requirement_subcategories[i]['secs_completed'] = true

        }else{
            requirement_subcategories[i]['secs_completed'] = false
        }


    }

         
    for (i=0;i<completed_courses.length;i++){
        for (j = 0;j<requirement_subcategories.length;j++){
            // console.log(requirement_subcategories[j])
            if (requirement_subcategories[j] == "Lower Division Computer Science Courses"){
                console.log("WHOOOOOO THERE= ")
                console.log(requirement_subcategories[j]['Remaining Required'])
            }
            if (requirement_subcategories[j]['Remaining Required'].includes(completed_courses[i])){
                requirement_subcategories[j]['Remaining Required'].splice(requirement_subcategories[j]['Remaining Required'].indexOf(completed_courses[i]),1)
                requirement_subcategories[j]['Completed Required'].push( completed_courses[i])

                // console.log("SSSSSSSSSSSSSSSSSSSSSSSSs")
                // console.log(completed_course_units[i])
                requirement_subcategories[j]['Completed Units'] += completed_course_units[i]
            }

            if (requirement_subcategories[j]['Remaining Satisfiers'].includes(completed_courses[i])){
                requirement_subcategories[j]['Remaining Satisfiers'].splice(requirement_subcategories[j]['Remaining Satisfiers'].indexOf(completed_courses[i]),1)
                requirement_subcategories[j]['Completed Satisfiers'].push( completed_courses[i])
                requirement_subcategories[j]['Completed Units'] += completed_course_units[i]

            }
            var sects = await (get_requirement_subcategories_sections_individual(requirement_subcategories[j]))
            // console.log("sdasdasdsadsdvasdasda")
            // console.log(sects)
            // console.log(secs)
            for (se = 0;se<sects.length;se++){
                // console.log(sects[se])
                var all_true = true
                if (sects.length == 0){
                    requirement_subcategories[j]['secs_completed'] =  true

                }else{
                    for (s=0;s<secs.length;s++){
                        // console.log(secs[s].title)
                        if (secs[s].title === sects[se]){
                            all_true = all_true & secs[s].completed
                        }
                        requirement_subcategories[j]['secs_completed'] =  all_true

                    }
                }
            }
            
            if (requirement_subcategories[j].hasOwnProperty("units")){
                if (requirement_subcategories[j]['Completed Units'] >= requirement_subcategories[j]["units"].low && requirement_subcategories[j]['Required'].length > 0){
                    if (requirement_subcategories[i]['Required'].equals(requirement_subcategories[j]['Completed Required'])){
                    requirement_subcategories[j]['reqs_completed'] =  true


                    }
                }else if (requirement_subcategories[j]['Completed Units']>= requirement_subcategories[j]["units"].low){
                    requirement_subcategories[j]['reqs_completed'] =  true


                }
            }else{
                if (requirement_subcategories[j]["Completed Satisfiers"].length > 0){
                    requirement_subcategories[j]['reqs_completed'] =  true

                }

            }
            if (requirement_subcategories[j]['secs_completed'] && requirement_subcategories[j]['reqs_completed']){
                requirement_subcategories[j]['Completed'] =  true
            }
        }
        // console.log(requirement_subcategories)
    }

    var reqs = await get_requirements()
    // console.log(reqs)

    for(i=0;i<reqs.length;i++){
        var subcats = await get_requirement_req(reqs[i])
        // console.log(reqs[i])
        // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")

        // console.log(subcats)
        // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        reqs[i]["Subcategories"] = subcats
        var all_completed = true

        for (j=0;j<subcats.length;j++){
            for(k=0;k<requirement_subcategories.length;k++){
                if (subcats[j] === requirement_subcategories[k].title){
                    all_completed = all_completed & requirement_subcategories[k].completed
                }
                reqs[i]["Completed"] = all_completed


            }
        }
    }
    const req_json = {
        "requirements": reqs,
        "subcategories":requirement_subcategories,
        "sections": secs,
        "completed":completed_courses
    }
    // console.log(reqs)
    // console.log("******************************")

    // console.log(requirement_subcategories)
    // console.log("******************************")
    // // console.log(requirement_subcategories)
    // console.log(secs)
// console.log("-------------------------------------------------")
// console.log(requirement_json)
res.status(200).send(req_json)
});



module.exports = router;



