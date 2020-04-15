window.addEventListener("load",function () {
    let search_bar = document.getElementById("search_bar");
    let btn_search = document.getElementById("btn_search");
    let div_hashtag = document.getElementById("div_hashtag");
    let style_div = document.getElementById("style_div");
    let inQuery = false;

    btn_search.addEventListener("click",async function (ev) {
        inQuery = true;
        btn_search.disabled = "disabled";
        let div_tweets = document.getElementById("div_tweets");
        let resTweets = await Tweets.search(search_bar.value);
        let tts = JSON.parse(resTweets);
        let nb_tweets=0;
        let div_content="";
        let map_places=new Map();
        let map_hashtags=new Map();
        for(var p in tts){
            nb_tweets++;
            date=tts[p].date.replace("T"," ");
            date=date.substr(0,19);
            div_content+= "<div><p><b>"+tts[p].user_name+" | "+date+"</b></p><p>"+tts[p].text+"</p></div><hr/>";
            hashtags=[tts[p].hashtag_0,tts[p].hashtag_1,tts[p].hashtag_2];
            for(let i=0;i<3;i++){
                h=hashtags[i];
                if(h!==null){
                    if(map_hashtags.has(h)){
                        map_hashtags.set(h,map_hashtags.get(h)+1);
                    }
                    else{
                        map_hashtags.set(h,1);
                    }
                }
            }
            place_name=tts[p].place_name.split(", ")[1];
            if(map_places.has(place_name)){
                map_places.set(place_name,map_places.get(place_name)+1);
            }
            else{
                map_places.set(place_name,1);
            }
        }
        create_pie_chart_hashtags(map_hashtags);
        let table_places=create_histogram_country(map_places);
        let text_nb_tweets="<h2 style='color:white'>Nombre de tweets contenant la chaine '"+search_bar.value+"' : "+nb_tweets+"</h2>";
        let text_hashtags="<h3>Proportion des hashtags</h3>";
        let text_places="<h3>Répartition par pays :</h3>";
        div_tweets.innerHTML=text_nb_tweets+text_hashtags+text_places+table_places+div_content;
        inQuery=false;
        btn_search.disabled = "";
    });
})

function create_histogram_country(map_places){
    let nb_places=0;
    let table_places="";
    while(nb_places<map_places.size){
        let i=nb_places;
        let j=nb_places;
        let x=0;
        table_places+="<table><tr>";
        for(let [key,value] of map_places){
            if(x<nb_places){
                x++;
                continue;
            }
            if(i==nb_places+20){
                break;
            }
            else{
                table_places+="<td style='vertical-align:bottom;width:5%'><div style='background-color:white'>"+
                "<br/>".repeat(value)+"<center>"+value+"</center></div></td>";
                i++;
            }
        }
        x=0;
        table_places+="</tr><tr>";
        for(let [key,value] of map_places){
            if(x<nb_places){
                x++;
                continue;
            }
            if(j==nb_places+20){
                break;
            }
            else{
                table_places+="<td style='text-align:center'><b>"+key+"</b></td>";
                j++;
            }
        }
        nb_places+=20;
        if(nb_places>=map_places.size){
            let cells=map_places.size%20;
            if(cells!=0){
                table_places+="<td style='vertical-align:bottom;width:5%'><div style='background-color:skyblue'></div></td>".repeat(20-cells);
            }
        }
        table_places+="</tr></table>";
    }
    return table_places;
}

function create_pie_chart_hashtags(map_hashtags){
    let nb_type_hashtags=map_hashtags.size;
    let nb_total_hashtags=0;
    for(let [k,v] of map_hashtags){
        nb_total_hashtags+=v;
    }
    console.log(map_hashtags);
    console.log("X "+nb_total_hashtags);
    let pie_chart="<div class='pieContainer'>";
    for(let i=0;i<nb_type_hashtags;i++){
        pie_chart+="<div id='pieSlice"+(i+1)+"' class='hold'><div class='pie'></div></div>";
    }
    pie_chart+="</div>";
    let style="<style type='text/css'>"+
    ".pieContainer{"+
    "height: 300px;"+
    "position: relative;"+
    "}"+   
    ".pie{"+
        "transition: all 1s;"+
        "position: absolute;"+
        "width: 300px;"+
        "height: 300px;"+
        "border-radius: 100%;"+
        "clip: rect(0px, 150px, 300px, 0px);"+
    "}"+
    ".hold{"+
        "position: absolute;"+
        "width: 300px;"+
        "height: 300px;"+
        "border-radius: 100%;"+
        "clip: rect(0px, 300px, 300px, 150px);"+
    "}";
    let i=1;
    let old1=0;
    let color="";
    for(let [k,v] of map_hashtags){
        color=getRandomRgb();
        if(i==1){
            old1=v/nb_total_hashtags*360;
            style+="\n #pieSlice1 .pie{"+
                "background-color: "+color+";"+
                "transform:rotate("+old1+"deg);"+
            "}";
        }
        else{
            style+="\n #pieSlice"+i+"{"+
                "transform: rotate("+old1+"deg);"+
            "}\n"+
            "#pieSlice"+i+" .pie {"+
                "background-color: "+color+";"+
                "transform: rotate("+v/nb_total_hashtags*360+"deg);"+
            "}\n";
            old1+=v/nb_total_hashtags*360;
        }
        i++;
    }
    style+="</style>";
    style_div.innerHTML=style;
    let text_current_slice="<h3 id='current_slice'></h3>";
    div_hashtag.innerHTML=pie_chart+text_current_slice;
    let current_slice=0;
    let y=1;
    text_current_slice=document.getElementById("current_slice");
    for(let [k,v] of map_hashtags){
        console.log("hash "+k);
        current_slice=document.getElementById("pieSlice"+y);
        current_slice.onmouseover=function(){
            text_current_slice.innerHTML=k+" ("+(v/nb_total_hashtags).toFixed(2)*100+"%)";
        };
        y++;
    }
}

function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}