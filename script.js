const mainPart = document.querySelector("main");

async function getFilms(){
   const fetchPromise = await fetch("https://ghibliapi.dev/films");
   const films = await fetchPromise.json();
   sortFilms(films);
   films.forEach(eachFilm => {
      createCard(eachFilm);
   });
}
getFilms();

document.getElementById("select_form").addEventListener("change", function(){
   mainPart.innerHTML = "";
   getFilms();
})

function createCard(data){ 
   const card = document.createElement("article");
   const movieTitle = document.createElement("h2");
   movieTitle.classList.add("card-title");
   const movieTitleTxt = document.createTextNode(data.title);
   movieTitle.appendChild(movieTitleTxt);

   const director = document.createElement("p");
   const directorName = document.createTextNode(`Director: ${data.director}`);
   director.appendChild(directorName);

   const year = document.createElement("p");
   const yearTxt = document.createTextNode(`Release Date: ${data.release_date}`);
   year.appendChild(yearTxt);

   const description = document.createElement("p");
   const descriptionTxt = document.createTextNode(data.description);
   description.classList.add("descriptionTxt");
   description.appendChild(descriptionTxt);

   //More terms to display description in a preview mode:
   const anchor = document.createElement("a");
   description.appendChild(anchor);
   anchor.classList.add("moreInfo");
   anchor.innerHTML = "More";
   anchor.setAttribute("href", "#");
   
   anchor.addEventListener("click", function(event) {
   event.preventDefault();
   if (description.classList.contains("expanded")) {
      // Text is expanded, so collapse it
      description.classList.remove("expanded");
      anchor.textContent = "More";
   } else {
      // Text is collapsed, so expand it
      description.classList.add("expanded");
      anchor.textContent = "Less";
   }
   });

   const score = document.createElement("p");
   const scoreTxt = document.createTextNode(`Rating is: ${data.rt_score}`);
   score.appendChild(scoreTxt);

   card.appendChild(movieTitle);
   card.appendChild(director);
   card.appendChild(year);
   card.appendChild(description);
   card.appendChild(score);

   mainPart.appendChild(card);
};

function sortFilms(array){
   const valueSelection = document.getElementById("select_form").value;
   switch(valueSelection){
      case "title": array.sort((a, b) => (a.title > b.title) ? 1 : -1); break;
      case "director": array.sort((a, b) => (a.director > b.director) ? 1 : -1); break;
      case "rt_score": array.sort((a, b) => (parseInt(b.rt_score) - parseInt(a.rt_score))); break;
      case "release_date1": array.sort((a, b) => (parseInt(a.release_date) - parseInt(b.release_date))); break;
      case "release_date2": array.sort((a, b) => (parseInt(b.release_date - a.release_date))); break;
   }
}
