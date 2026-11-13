import { animate, createAnimatable, stagger, utils } from 'https://cdn.jsdelivr.net/npm/animejs@4.0.2/+esm';

const baseUrl = "https://api.tvmaze.com";
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const resultsCont = document.querySelector(".results-container");
// both pupil elements (a NodeList: [leftPupil, rightPupil])
const pupils = document.querySelectorAll(".pupil");
// createAnimatable makes one animatable per pupil, so this is an array in the same
// order as pupils: pupilAnimatables[0] moves the left pupil, [1] the right pupil
const pupilAnimatables = [...pupils].map((pupil) => createAnimatable(pupil, {
    x: 300,   // per-property duration in ms
    y: 300,
}));

searchBtn.onclick = () => {
    // debug log to see what value search input has when button is clicked
    console.log(searchInput.value)

    let searchUrl = `${baseUrl}/search/shows?q=${searchInput.value}`;
    console.log(searchUrl);

    // clear current search results
    clearResults();

    // fetch search
    fetch(searchUrl)                        // sends the request
        .then(res => res.json())            // reads the json
        .then(data => {
            console.log(data);
            data.forEach(element => {
                console.log(element.show.name);
                displayShow(element);
            });

            // animate all cards in, one after another
            animate('.show-card', {
                opacity: [0, 1],
                translateY: [30, 0],
                delay: stagger(80),
                duration: 600,
                ease: 'outQuad',
            });
        })    // array of search results
        .catch(err => console.log(err));

}

// animating eye balls using animatable
document.addEventListener("mousemove", (event) => {
    // runs once per pupil; index is 0 for the left pupil, 1 for the right
    pupils.forEach((pupil, index) => {
        const eye = pupil.parentElement;
        const eyeBounds = eye.getBoundingClientRect();
        const { width, height, left, top } = eyeBounds;
        // how far the pupil can move before leaving the eye
        const maxX = (width - pupil.offsetWidth) / 2;
        const maxY = (height - pupil.offsetHeight) / 2;
        // cursor offset from the eye's center, clamped so the pupil stays inside the eye
        const x = utils.clamp(event.clientX - left - width / 2, -maxX, maxX);
        const y = utils.clamp(event.clientY - top - height / 2, -maxY, maxY);

        // pupilAnimatables[index] is the animatable for THIS pupil (same index as in
        // pupils.forEach). In the docs there is only one square, so they call
        // animatableSquare.x(x) directly. Here we pick our pupil's animatable first.
        pupilAnimatables[index].x(x); // move this pupil to x over 500ms
        pupilAnimatables[index].y(y); // move this pupil to y over 500ms
    });
});

function displayShow(element){
    // article element to contain the shows
    let showCard = document.createElement("article");
    showCard.className = "show-card";

    // grab the show title
    let cardTitle = document.createElement("h2");
    cardTitle.textContent = element.show.name;

    // grab the show genres
    let cardGenre = document.createElement("p");
    cardGenre.textContent = element.show.genres.join(", ");

    // grab show summary
    let showSumm = document.createElement("p");
    showSumm.innerHTML = element.show.summary;

    const front = document.createElement("div");
    front.className = "card-front";

    const back = document.createElement("div");
    back.className = "card-back";

    if(element.show.image){
        // if show has an image, then just display the background image, no title or genre
        front.style.backgroundImage = `url(${element.show.image.original})`;
        // showCard.append(cardTitle, cardGenre);
    }else{
        // else we add the show title
        front.append(cardTitle);
    }
    
    back.append(cardGenre, showSumm);
    showCard.append(front, back);

    // flip the card with anime.js
    // back starts 180deg ahead of the front
    utils.set(back, { rotateY: 180 });
    const flip = (deg) => animate([front, back], {
        rotateY: (el, i) => deg + i * 180,   // front: deg, back: deg + 180
        duration: 600,
        ease: 'inOutQuad',
    });
    showCard.addEventListener('mouseenter', () => flip(180));
    showCard.addEventListener('mouseleave', () => flip(0));
    resultsCont.append(showCard);
}

function clearResults(){
    resultsCont.textContent = ""
}

// animating eyes using animatable
