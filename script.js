const mainPart = document.querySelector("main");

async function getFilms(){
   const fetchPromise = await fetch("https://ghibliapi.dev/films");
   const films = await fetchPromise.json();
   //films.sort((a, b) => a.title > b.title ? 1 : -1);
   films.sort((a, b) => b.rt_score - a.rt_score);
   films.forEach(eachFilm => {
      createCard(eachFilm);
   });
}
getFilms();

document.getElementById("select_form").addEventListener("change", function(){
   console.log(document.getElementById("select_form"));
})

function createCard(data){ 
   const card = document.createElement("article");
   const movieTitle = document.createElement("h2");
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
   description.appendChild(descriptionTxt);

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
