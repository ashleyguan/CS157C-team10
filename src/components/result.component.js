import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import { isCompositeComponent } from 'react-dom/test-utils';

export default class Result extends Component {
    constructor(props) {
        super(props);
    }

    get_data(){
        var table = []
        const result = JSON.parse(sessionStorage.getItem("data"));
        console.log(result)

        for (var requirement in result){
            let requirement_title = requirement
            var subcategories = []
            var subcategory_table = []
            for (var subcategory in result[requirement]){
                var subcategory_title = subcategory
                var subcategory_sections = []
                var subcategory_section_table = []
                console.log("subcategory :" + subcategory)
                if (subcategory == "Required Units"){
                    if (result[requirement][subcategory] > 0){
                        requirement_title = requirement_title + " " + result[requirement][subcategory]
                    }
                }else{
                    for ( var subcategory_section in result[requirement][subcategory]){
                        var sec_req_table = []
                        const non_secs = ["Completed Courses","Required Courses","Remaining Required","Satisfiers"]
                        if (subcategory_section == "Required Units"){
                            var required_units = subcategory[subcategory_section]
                            
                        }else if (subcategory_section == "Remaining Units"){
                            var remaining_units = subcategory[subcategory_section]



                        }else if (subcategory_section == "Completed"){
                            console.log('zz')
                        }else{
                            for (var sec_req in result[requirement][subcategory][subcategory_section]){

                                if (result[requirement][subcategory][subcategory_section][sec_req].length != 0){
                                    sec_req_table.push(<Collapsible trigger={result[requirement][subcategory][subcategory_section][sec_req]}></Collapsible>)
                                }

                            }
                            subcategory_section_table.push(<Collapsible trigger={subcategory_section}>{sec_req_table}</Collapsible>)

                        }
                        if (result[requirement][subcategory][subcategory_section] > 0){
                            subcategory_title = subcategory_title + " " + required_units-remaining_units + "/" + required_units
                        }
                    }
                    console.log("subcategory sections")
                    console.log(subcategory_sections)
                    // subcategory_sections.forEach( sub_sec => {
                    //     console.log("sub sec")
                    //     console.log(sub_sec)
                    // })
                    subcategories.push(subcategory)


                }


            }
            console.log("subcategories")
            console.log(subcategories)
            console.log("subcategoy sec")
            console.log(subcategory_section_table)
            subcategories.forEach( sub => {
                console.log("sub")
                console.log(sub)
                subcategory_table.push(<Collapsible trigger={sub}>{subcategory_section_table}</Collapsible>)
            
            })
            table.push(<Collapsible trigger={requirement_title}>{subcategory_table}</Collapsible>)

        }
            // console.log(requirement)
            // console.log(result[requirement])
            // var required_units = ""
            // console.log("REQUIRED UNITS: " + result[requirement]["Required Units"])

            // if (result[requirement]["Required Units"] > 0){
                // required_units = result[requirement]["Required Units"]
            // }
            // const requirement_trigger = requirement + " " + required_units
            // console.log(requirement_trigger)

            // for (var subcategory in result[requirement]){
            //     if (subcategory != "Required Units"){
            //         console.log("subcategory: "+ subcategory)
            //         subcategoryren.push(<Collapsible trigger={requirement_trigger}>{subcategory}</Collapsible>)
            //     }

            // }
            // console.log(requirement)
            // table.push(subcategoryren)
            

        // }
        // console.log(table)
        return table
    }
    

    render() {     
      
	 return (<div>
         {this.get_data()}
         </div>
         
         )
         .header{
            cursor: pointer;
            border: solid 1px #f2f2f2;
            padding: 15px;
            background-color: #0089CC;
            color: #FFF;
            font-family: verdana;
            }
            
            .content{
            cursor: pointer;
            border-left: solid 1px #f2f2f2;
            border-right: solid 1px #f2f2f2;
            border-bottom: solid 1px #f2f2f2;
            border-radius: 0 0 5px 5px;
            padding: 15px;
            font-family: verdana;
            font-size: 14px;
            }
	}
}
