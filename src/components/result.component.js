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
        console.log("brrr")
        console.log((sessionStorage.getItem("data")))

        const result = JSON.parse(sessionStorage.getItem("data"));
        console.log(result)
        var reqs = result.requirements
        var subs = result.subcategories
        var secs = result.sections

        var completed = result.completed
        console.log(completed)

        console.log("hrayr")
        var req_table = []
        console.log(JSON.stringify(result.requirements))
        for (var i=0;i<reqs.length;i++){
            var sub_table = []
            for (var j=0;j<subs.length;j++){
                var sec_table = []
                var gen_rec = []

                var required_sec = []
                var satis_sec = []
                var unit_sec = []
                for (var sub_key in subs[j]){
                    // console.log("*&*******")
                    // console.log(sub_key)
                    // console.log(subs[j][sub_key])



                    var sec_subcat = []

                    switch (sub_key){
                        case "Required":
                            var course_list = []
                            for (var course in subs[j][sub_key]){
                                course_list.push(<Collapsible trigger={subs[j][sub_key][course]}></Collapsible>)
                            }
                            if (course_list.length > 0){
                                required_sec.push(<Collapsible trigger="Required Courses">{course_list}</Collapsible>)
                            }
                            break
                        case "Completed Required":
                            var course_list = []

                            for (var course in subs[j][sub_key]){
                                course_list.push(<Collapsible trigger={subs[j][sub_key][course]}></Collapsible>)
                            }
                            if (course_list.length > 0){
                                required_sec.push(<Collapsible trigger="Completed Required Courses">{course_list}</Collapsible>)
                            }
                            break
                        case "Remaining Required":
                            var course_list = []

                            for (var course in subs[j][sub_key]){
                                course_list.push(<Collapsible trigger={subs[j][sub_key][course]}></Collapsible>)
                            }
                            if (course_list.length > 0){
                                required_sec.push(<Collapsible trigger="Remaining Required Courses">{course_list}</Collapsible>)
                            }
                            break
                        case "Completed Satisfiers":
                            var course_list = []

                            for (var course in subs[j][sub_key]){
                                course_list.push(<Collapsible trigger={subs[j][sub_key][course]}></Collapsible>)
                            }
                            if (course_list.length > 0){
                                required_sec.push(<Collapsible trigger="Completed Satisfying Courses">{course_list}</Collapsible>)
                            }
                            break
                        case "Remaining Satisfiers":
                            var course_list = []

                            for (var course in subs[j][sub_key]){
                                course_list.push(<Collapsible trigger={subs[j][sub_key][course]}></Collapsible>)
                            }
                            if (course_list.length > 0){
                                required_sec.push(<Collapsible trigger="Available Satisfying Courses">{course_list}</Collapsible>)
                            }
                            break
                        case "Completed Units":
                            required_sec.push(<Collapsible trigger="Completed Units">{subs[j][sub_key]}</Collapsible>)

                            break
                        case "Completed":
                            if (subs[j][sub_key] === true){
                                required_sec.push(<Collapsible trigger="Completed">You have completed this requirement! Good job!</Collapsible>)

                            }else{
                                required_sec.push(<Collapsible trigger="Not Completed">You have not completed this requirement.</Collapsible>)
                            }

                            break
                        case "notes":
                            required_sec.push(<Collapsible trigger="Notes">{subs[j][sub_key]}</Collapsible>)
                            break
                        case "units":
                            required_sec.push(<Collapsible trigger="Required Units">{subs[j][sub_key].low}</Collapsible>)
                            break   
                        
                    }


                }
                if (required_sec.length > 0){
                    gen_rec.push(<Collapsible trigger="Required Course Section">{required_sec}</Collapsible>)

                }else if (satis_sec.length > 0){
                    gen_rec.push(<Collapsible trigger="Satisfying Course Section">{satis_sec}</Collapsible>)

                }else if (unit_sec.length > 0){
                    gen_rec.push(<Collapsible trigger="Unit Section">{unit_sec}</Collapsible>)

                }
                
                if(gen_rec.length > 0){
                    sec_subcat.push(<Collapsible trigger="Subcategory Requirements">{gen_rec}</Collapsible>)

                }
                if(reqs[i]["Subcategories"].includes(subs[j].title)){
                    // console.log("----------------")
                    // console.log(subs[j])
                    for(var k=0;k<secs.length;k++){
                        if(subs[j]["Subcategory Sections"].includes(secs[k].title)){
                            console.log("KILL ME")
                            console.log(secs[k])
                            var required_sec = []

                            for (var sub_key in secs[k]){
                                // console.log("*&*******")
                                // console.log(sub_key)
                                // console.log(secs[k][sub_key])
            
            
            
                                var sec_subcat = []
            
                                switch (sub_key){
                                    case "Required":
                                        var course_list = []
                                        for (var course in secs[k][sub_key]){
                                            course_list.push(<Collapsible trigger={secs[k][sub_key][course]}></Collapsible>)
                                        }
                                        if (course_list.length > 0){
                                            required_sec.push(<Collapsible trigger="Required Courses">{course_list}</Collapsible>)
                                        }
                                        break
                                    case "Completed Required":
                                        var course_list = []
            
                                        for (var course in secs[k][sub_key]){
                                            course_list.push(<Collapsible trigger={secs[k][sub_key][course]}></Collapsible>)
                                        }
                                        if (course_list.length > 0){
                                            required_sec.push(<Collapsible trigger="Completed Required Courses">{course_list}</Collapsible>)
                                        }
                                        break
                                    case "Remaining Required":
                                        var course_list = []
            
                                        for (var course in secs[k][sub_key]){
                                            course_list.push(<Collapsible trigger={secs[k][sub_key][course]}></Collapsible>)
                                        }
                                        if (course_list.length > 0){
                                            required_sec.push(<Collapsible trigger="Remaining Required Courses">{course_list}</Collapsible>)
                                        }
                                        break
                                    case "Completed Satisfiers":
                                        var course_list = []
            
                                        for (var course in secs[k][sub_key]){
                                            course_list.push(<Collapsible trigger={secs[k][sub_key][course]}></Collapsible>)
                                        }
                                        if (course_list.length > 0){
                                            required_sec.push(<Collapsible trigger="Completed Satisfying Courses">{course_list}</Collapsible>)
                                        }
                                        break
                                    case "Remaining Satisfiers":
                                        var course_list = []
            
                                        for (var course in secs[k][sub_key]){
                                            course_list.push(<Collapsible trigger={secs[k][sub_key][course]}></Collapsible>)
                                        }
                                        if (course_list.length > 0){
                                            required_sec.push(<Collapsible trigger="Available Satisfying Courses">{course_list}</Collapsible>)
                                        }
                                        break
                                    case "Completed Units":
                                        required_sec.push(<Collapsible trigger="Completed Units">{secs[k][sub_key]}</Collapsible>)
            
                                        break
                                    case "Completed":
                                        if (secs[k][sub_key] === true){
                                            required_sec.push(<Collapsible trigger="Completed">You have completed this requirement! Good job!</Collapsible>)
            
                                        }else{
                                            required_sec.push(<Collapsible trigger="Not Completed">You have not completed this requirement.</Collapsible>)
                                        }
            
                                        break
                                    case "notes":
                                        required_sec.push(<Collapsible trigger="Notes">{secs[k][sub_key]}</Collapsible>)
                                        break
                                    case "units":
                                        required_sec.push(<Collapsible trigger="Required Units">{secs[k][sub_key].low}</Collapsible>)
                                        break   
                                    
                                }
            
            
                            }
                        sec_table.push(<Collapsible trigger={secs[k].title}>{required_sec}</Collapsible>)
                            
                        }
                    }
                    if (sec_table.length > 0){
                        sec_subcat.push(<Collapsible trigger="Subcategory Sections">{sec_table}</Collapsible>)
                    }

                    sub_table.push(<Collapsible trigger={subs[j].title}>{sec_subcat}</Collapsible>)

                }
                
            // console.log(subs[j])
            }
            if(reqs[i].completed){
                sub_table.push("Completed")
            }
            req_table.push(<Collapsible trigger={reqs[i].title}>{sub_table}</Collapsible>)
        }
        return [completed,req_table]
    }
    
    render() {     
        var data = this.get_data()
        var completed = JSON.stringify(data[0])
        var table = data[1]
	 return (<div>
         <p>Completed courses: {completed}</p>
         {table}
         </div>
         
         )
         
	}
}
