import { magazines } from "../data/magazines.js"

let accordianFeed = (title, id) => {
    return `
    <div class="accordion-item" id="card${id}">
        <h2 class="accordion-header" id="flush-heading${id}">
           <button class="accordion-button fw-bolder" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${id}" aria-expanded="false" aria-controls="flush-collapse${id}">
                ${title}
            </button>
        </h2>
        <div id="flush-collapse${id}" class="accordion-collapse collapse" aria-labelledby="flush-heading${id}" data-bs-parent="#accordionFlushID">
            <div class="accordion-body id="accordion-item-${id}">     
            </div>
        </div>
    </div>`;
}


let carouselFeeds = (id, innerId) => {
    return `
    <div id="carousel${id}" class="carousel slide">
        <div class="carousel-inner" id="${innerId}"></div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carousel${id}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carousel${id}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
    </div>`;
}  

// creating innner content of carousel 
let carouselInnerContent = (id, active) => {
    return `
    <div class="carousel-item ${active ? "active" : ""}" id="${id}">
    </div>`;
};

// creating card
let cardElement = (item) => {
    return `
    <div class="card d-block">
    <img class="card-img-top img-fluid  carousel-img" src=${item["enclosure"]["link"]} alt="Card Image Feed">
    <div class="card-body">
        <h5 class="card-title">${item["title"]}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${item["author"]}</h6>
        <p class="card-subtitle text-secondary">${new Date(item["pubDate"]).toLocaleDateString()}</p>
        <p class="card-text">${item["description"]}</p>
        <a class="stretched-link" href="${item["link"]}" target="_blank" > </a>
    </div>
    </div>
    `;
}


let addContentToDOM = async () => {
    //loop through eah newsFeed
    for(let i = 0; i < magazines.length; i++) {
        let URL = magazines[i];
        let response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURI(URL)}`);
        
        let data = await response.json();
        console.log(data)
    
        // creating accordion
        let accordionID = `accordion-${i}`; 
        let accordion = accordianFeed(data["feed"]["title"], accordionID);
        
        let accordionContainer = document.querySelector("#accordionFlushID");
        accordionContainer.innerHTML += accordion;

        if(i == 0){
            document.querySelector(`#flush-collapse${accordionID}`).className = "show";
        }

        // creating carousel    
        let carouselID = i;
        let carouselInnerID = i;
        let carousel = carouselFeeds(carouselID, carouselInnerID); 
        document.getElementById(`flush-collapse${accordionID}`).innerHTML += carousel;


        // Adding card to carousel
        // Adding card to carousel
        let items = data["items"];
        for (let index in items) {
            let item = items[index];
            let card = cardElement(item);
            let innerCarouselCardID = `carouselInner-${i}-${index}`;
            let innerCarouselCard = carouselInnerContent(innerCarouselCardID, index == 0);

            document.getElementById(`${carouselInnerID}`).innerHTML += innerCarouselCard;
            document.getElementById(`${innerCarouselCardID}`).innerHTML = card;
        }

        

    }
};

addContentToDOM();