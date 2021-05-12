import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import "./result.scss";
const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://localhost:7687',
                  neo4j.auth.basic('neo4j', 'root'), 
                  {/* encrypted: 'ENCRYPTION_OFF' */});

export default class Result extends Component {
    constructor(props) {
        super(props);
    }

    get_data(){
        var table = []
        const result = JSON.parse(sessionStorage.getItem("data"));
        console.log(result)

        for (var requirement in result){
            console.log("requirement: "+requirement)
            let requirement_title = requirement
            var subcategories = []
            var subcategory_table = []
            for (var subcategory in result[requirement]){
                var subcategory_title = subcategory
                var subcategory_sections = []
                var subcategory_identifiers = []
                var subcategory_section_table = []
                var subcat_sec= []
                if (subcategory === "Required Units"){
                    if (result[requirement][subcategory] > 0){
                        requirement_title = requirement_title + " " + result[requirement][subcategory]
                    }
                }else{
                    console.log("\tsubcategory :" + subcategory)

                    for ( var subcategory_identifier in result[requirement][subcategory]){


                        if (subcategory_identifier === "Subcategory Sections"){
                            console.log("")
                            // for (var subcategory_section in result[requirement][subcategory][subcategory_identifier]){
                            //     var sec_req = []
                            //     console.log("\t\tsubcategory section req: " + subcategory_section)
                                
                            //     for (var item in result[requirement][subcategory][subcategory_identifier][subcategory_section]){
                            //         var sec_req_courses = []
                            //         if (item === "Completed"){
                            //             console.log("\t\t\t\t\tcompleted?: " + result[requirement][subcategory][subcategory_identifier][subcategory_section][item])
                            //         }else{

                            //             if (item === "Required Units"){
                            //                 console.log("")
                            //             }else if (item === "Remaining Units" ){
                            //                 console.log("")
                            //             }else{
                            //                 // console.log("HRAYR: " + result[requirement][subcategory][subcategory_identifier][subcategory_section][item])
                            //                 if (Array.isArray(result[requirement][subcategory][subcategory_identifier][subcategory_section][item]) && result[requirement][subcategory][subcategory_identifier][subcategory_section][item].length > 0){
                            //                     result[requirement][subcategory][subcategory_identifier][subcategory_section][item].forEach( async course => {
                            //                         // console.log("hello" + course)   

                            //                             const session = driver.session();
                            //                             var res =  await session
                            //                             .run(`MATCH (n) WHERE n.title = \"${course}\" return n`).then(r => {
                            //                                 r.records.forEach(record => {
                            //                                     var adjusted_course_name = course
                            //                                     var course_info = ""        
                            //                                     record._fields.forEach(function(field,i){
                            //                                         // console.log(`adding ${field} to ${course}`)
                            //                                         Object.keys(field.properties).forEach(key =>{
                            //                                             // console.log("prop:  " + field.properties[key])
                            //                                             adjusted_course_name = course + ": " + field.properties["subject"] + " (units: "+field.properties["units"] + ")"
                            //                                             course_info = field.properties["summary"]

                            //                                         })

                            //                                     })
                            //                                     // console.log(`pushing ${adjusted_course_name}: ${course_info} to seq_req_courses`)

                            //                                     sec_req_courses.push(<Collapsible trigger={adjusted_course_name}>{course_info}</Collapsible>)

                            //                                  })
                            //                             // }).catch(function(error) {
                            //                             //     console.log(error);
                            //                             }).then(() => session.close())  
    
                            //                         })
                                                
                            //                 }
                            //                 console.log(`pushing ${item}: ${sec_req_courses} to seq_req`)
                            //                 sec_req.push(<Collapsible trigger={item}>{sec_req_courses}</Collapsible>)
                            //             }

                            //         }


                            //     }
                            //     subcategory_section_table.push(<Collapsible  trigger={subcategory_section}>{sec_req}</Collapsible>)


                            // }

                        }
                        console.log("subcategory identifier: " + subcategory_identifier)
                        if (subcategory_identifier === "Required Units"){
                            console.log("boo")
                        }else
                         if (subcategory_identifier === "Subcategory Sections"){
                            var subcat_sections = []
                            for (var subcategory_section in result[requirement][subcategory][subcategory_identifier]){
                                var subcat_secs= []
                                for (var subcat_sec_item in result[requirement][subcategory][subcategory_identifier][subcategory_section]){
                                    var subcat_sec_item_array = []
                                    for (var it in result[requirement][subcategory][subcategory_identifier][subcategory_section][subcat_sec_item]){
                                        subcat_sec_item_array.push(<Collapsible trigger={result[requirement][subcategory][subcategory_identifier][subcategory_section][subcat_sec_item][it]}></Collapsible>)
                                    }
                                    if (subcat_sec_item_array.length >0){
                                    subcat_secs.push(<Collapsible trigger={subcat_sec_item}>{subcat_sec_item_array}</Collapsible>)
                                    }
                                }
                                subcat_sections.push(<Collapsible trigger={subcategory_section}>{subcat_secs}</Collapsible>)
                            }
                            if (subcat_sections.length > 0){
                                subcat_sec.push(<Collapsible trigger={subcategory_identifier}>{subcat_sections}</Collapsible>)
                            }

                        }else if (subcategory_identifier === "Subcategory Information"){
                            console.log(`\t\t\t\t\pushing ${subcategory_identifier} to subcat_sec`)
                            var subcategory_identifier_props = []
                            for (var item in result[requirement][subcategory][subcategory_identifier]){
                                var adjusted_title = item
                                console.log(`pushing: ${item} : ${result[requirement][subcategory][subcategory_identifier][item]}`)
                                if (item === "Remaining Units"){

                                }else if (item === "Required Units"){

                                }else if (item === "Completed"){
                                    // adjusted_title = `${adjusted_title}     COMPLETED!!!`
                                }else if (Array.isArray(result[requirement][subcategory][subcategory_identifier][item]) && result[requirement][subcategory][subcategory_identifier][item].length > 0){
                                    var sec_array = []
                                    for (var array_item in result[requirement][subcategory][subcategory_identifier][item]){
                                        sec_array.push(<Collapsible trigger={result[requirement][subcategory][subcategory_identifier][item][array_item]}></Collapsible>)
                                    }

                                        subcategory_identifier_props.push(<Collapsible trigger={item}>{sec_array}</Collapsible>)
                                }
                
                            }
                            console.log(`YEEZY:`)
                            console.log(subcategory_identifier_props)
                            if (subcategory_identifier_props.length > 0){
                                subcat_sec.push(<Collapsible trigger={subcategory_identifier}>{subcategory_identifier_props}</Collapsible>)

                            }else{
                                subcat_sec.push(<Collapsible trigger={subcategory_identifier}>Completed!</Collapsible>)

                            }
                            

                        }
                        // console.log(`subcat_sec.length: ${subcat_sec.length}`)
                        // console.log(subcat_sec)

                        // if (subcat_sec.length > 0){
                        //     subcategory_table.push(<Collapsible trigger={subcategory}>{subcat_sec}</Collapsible>)

                        // // console.log(`subcat_info.length: ${subcat_info.length}`)
                        // // console.log(subcat_info)
                        // }else if (subcat_info.length > 0){
                        //     subcategory_table.push(<Collapsible trigger={subcategory}>{subcat_info}</Collapsible>)

                        //     // subcategory_identifiers.push(subcat_info)


                        // }
                    }
                    // subcategory_table.push(<Collapsible trigger={subcategory}>{subcategory_section_table}</Collapsible>)
                    // subcategory_table.push(<Collapsible trigger={subcategory}>{subcategory_section_table}</Collapsible>)

                }
                if (subcat_sec.length > 0){
                    subcategory_table.push(<Collapsible trigger={subcategory}>{subcat_sec}</Collapsible>)
                }else{
                    subcategory_table.push(<Collapsible trigger={subcategory}>Completed!!</Collapsible>)

                }

            }
            if (subcategory_table.length > 0){
                table.push(<Collapsible trigger={requirement}>{subcategory_table}</Collapsible>)
            } else{
                table.push(<Collapsible trigger={requirement}>Completed!</Collapsible>)

            }

        }
        return table
    }
    

    render() {     
      
	 return (<div>
         {this.get_data()}
         </div>
         
         )
         
	}
}
