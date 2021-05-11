import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import "./result.scss";

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
                var subcategory_section_table = []
                if (subcategory === "Required Units"){
                    if (result[requirement][subcategory] > 0){
                        requirement_title = requirement_title + " " + result[requirement][subcategory]
                    }
                }else{
                    console.log("\tsubcategory :" + subcategory)

                    for ( var subcategory_identifier in result[requirement][subcategory]){
                        if (subcategory_identifier === "Subcategory Sections"){
                            for (var subcategory_section in result[requirement][subcategory][subcategory_identifier]){
                                var sec_req = []
                                console.log("\t\tsubcategory section req: " + subcategory_section)

                                for (var item in result[requirement][subcategory][subcategory_identifier][subcategory_section]){
                                    if (item === "Completed"){
                                        console.log("\t\t\t\t\tcompleted?: " + result[requirement][subcategory][subcategory_identifier][subcategory_section][item])
                                    }else{
                                        console.log("\t\t\t\twhats this: " + item)
                                        if ((Array.isArray(result[requirement][subcategory][subcategory_identifier][subcategory_section][item]) && result[requirement][subcategory][subcategory_identifier][subcategory_section][item].length > 0) || Number.isInteger(result[requirement][subcategory][subcategory_identifier][subcategory_section][item])){
                                            sec_req.push(<Collapsible  trigger={item}>{result[requirement][subcategory][subcategory_identifier][subcategory_section][item]}</Collapsible>)
                                        }
                                    }


                                }
                                subcategory_section_table.push(<Collapsible  trigger={subcategory_section}>{sec_req}</Collapsible>)


                            }
                        }else if ( subcategory_identifier === "Subcategory Information"){
                            // subcategory_section_table.push(<Collapsible trigger={result[requirement][subcategory][subcategory_identifier][subcategory_section]}></Collapsible>)
                            console.log("\t\t\t\t\tfuck you")
                        }

                    }
                }
                subcategory_table.push(<Collapsible trigger={subcategory}>{subcategory_section_table}</Collapsible>)

            }
            table.push(<Collapsible trigger={requirement}>{subcategory_table}</Collapsible>)

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
