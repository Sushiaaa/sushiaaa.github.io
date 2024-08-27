const fs = require('fs');

let graph = new Map();

function add_node(site){
    graph.set(site, []);
}

function add_edge(origin, destination){
    graph.get(origin).push(destination);
}
async function main(){
    queue = [];

    for(let n = 0; n < 10; n++){
        let response = await fetch(url);
        url = url.replace(/https:\/\/de.wikipedia.org/, "")
        add_node(url);

        let html = await response.text();
        //filters out irrelevant part of the html element
        html = html.replace(/(id="mw-head"(.*) | id="mw-panel"(.*))/s, "");
        //regex for filtering invalid links
        const regex = /"\/wiki\/(?!Datei:)(?!.*#)\S*"/g;
        const matches = html.match(regex);
        //adds node and edge for every link found in html of url
        for(let i = 0; i< matches.length; i++){
            matches[i] = matches[i].replace(/"/g, "");
            if(graph.has(matches[i]) == false){
                add_node(matches[i]);
                add_edge(url, matches[i])
                //adds new site to start of queue
                queue.unshift(matches[i]);
            } else{
                add_edge(url, matches[i]);
            }

        }
        if(queue.length > 0){
            url = "https://de.wikipedia.org"+queue.pop();
        }
    }
    const arr = Array.from(graph.entries())
    fs.appendFileSync("nodes.json", "[")
    fs.appendFileSync("edges.json", "[")
    for(let i = 0; i<graph.size; i++){
        if(arr[i][1].length > 0){
            for(let j = 0; j<arr[i][1].length; j++){
                fs.appendFileSync("edges.json", '{"from":"'+arr[i][0]+'","to":"'+arr[i][1][j]+'"},')
            }
            
        }
        
        
        
        fs.appendFileSync("nodes.json", '{"id":"'+arr[i][0]+'","label":"'+decodeURIComponent(arr[i][0])+'"},')
        
    }
    fs.appendFileSync("edges.json", "]")
    fs.appendFileSync("nodes.json", "]")
    //const json_text = JSON.stringify(Array.from(graph.entries()));
    //fs.writeFileSync("graphh.json", json_text);
    
    
}

let url = "https://de.wikipedia.org/wiki/Haselünne";

main();
