const baseUrl = "https://api.tvmaze.com";
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const resultsCont = document.querySelector(".results-container");

searchBtn.onclick = () => {
    // debug log to see what value search input has when button is clicked
    console.log(searchInput.value)

    let searchUrl = `${baseUrl}/search/shows?q=${searchInput.value}`;
    console.log(searchUrl);

    fetch(searchUrl)                        // sends the request
        .then(res => res.json())            // reads the json
        .then(data => {
            console.log(data);
            data.forEach(element => {
                console.log(element.show.name);
                displayShow(element);
            });
        })    // array of search results
        .catch(err => console.log(err));

}

function displayShow(element){
    // article element to contain the shows
    let showCard = document.createElement("article");
    showCard.className = "show-card";

    // grab the show title
    let cardTitle = document.createElement("h2");

    // grab the show genres
    let cardGenre = document.createElement("p");
    cardGenre.textContent = element.show.genres;

    if(element.show.image){
        // if show has an image, then just display the background image, no title or genre
        showCard.style.backgroundImage = `url(${element.show.image.original})`;
        // showCard.append(cardTitle, cardGenre);
    }else{
        // else we add the show title and genre
        cardTitle.textContent = element.show.name;  
        showCard.append(cardTitle, cardGenre);
    }
    

    resultsCont.append(showCard);
}
