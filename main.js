   // 1
   window.onload = (e) => {
    onStart();   

    document.querySelector("#search").onclick = searchButtonClicked;
    document.querySelectorAll(".result").onhover = (e) =>{
        document.querySelector("backgroundImage") = e.querySelector("img");
    }
   let resultSection = document.querySelector("#results");
};

//    document.querySelector(".result img").onmouseover =  function(e){
//        document.querySelector("body").style.backgroundImage = e.querySelector();
//    }
	
   // 2
   let displayTerm = "";
   
   // 3
   function searchButtonClicked(){
       console.log("searchButtonClicked() called");
       
       let url
       // 1 
       let selectionType = document.querySelector("#searchSelect").value;
       if (selectionType == "character"){
        url = "https://api.jikan.moe/v4/characters?q=";
       }
       else if (selectionType == "episode"){
        url = "https://api.jikan.moe/v4/episodes?q=";
       }
       else{
        url = "https://api.jikan.moe/v4/anime?q=";
       }


       // 4
       let term = document.querySelector("#searchTerm").value;
       displayTerm = term;

       // 5
       term = term.trim();

       // 6 - encode spaces and special characters
       term = encodeURIComponent(term);

       // 7
       if (term.length < 1) return;

       // 8 - append the search term to url
       url += "?q=" + term + "&sfw";

       //10 - update the UI;
       document.querySelector("#status").innerHTML= "<b>Searching for: '" + displayTerm +"'</b>";

       // 11
       console.log (url);

       getData(url);
   }

   // 4

   function getData(url){
        let xhr = new XMLHttpRequest();

        // get hte onload handler
        xhr.onload = dataLoaded;
        xhr.onerror = dataError;
        
        xhr.open("GET", url);
        xhr.send();
   }

   function dataLoaded(e){
       // event.target is the xhr object
        let xhr = e.target;
       // get the JSON file we have downloaded
        console.log(xhr.responseText);
        
        console.log();

        let obj = JSON.parse(xhr.responseText);                 // is giving errors? It's literally only xhr.responseText, I don't see how it could be doing that
        if (!obj.data || obj.data.length == 0){
            document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
            return;
        }

        let results = obj.data;
        console.log("results.length = " +results.length);
        let bigString ="<p><i id = 'resultsParagraph'>Here are " + results.length + " results for '" + displayTerm +"'</i></p>";

        // 10 
        for ( i = 0; i < results.length; i++){
            let result = results[i];

            let smallURL = result.images.jpg.image_url;
            if (!smallURL) smallURL = "images/no-image-found.png";

            let url = result.url;

            let line = `<button class = 'result'><img src = '${smallURL}' title= '${result.id}>'`;
            line += `<p>Title: ${result.title}<br>Rating: ${result.rating}<br>Reviews: ${result.score}</p>`;
            line += `<span><a target = '_blank' href = '${url}'> View on My Anime</a></span></button>`;

            bigString += line;
        }

        document.querySelector("#content").innerHTML = bigString;
        document.querySelector("#status").innerHTML = "<b>Success!</b>";
   }

   function dataError(e){
       console.log("An error has occured");
   }


   // is ran at the start of the application
   // gets the top 2 results from the "recommended" section
   function onStart(){
    let recommendedUrl = "https://api.jikan.moe/v4/anime"

    document.querySelector("#results").innerHTML += "<h3>Recommended:</h3>";

    getData(recommendedUrl);
   }

