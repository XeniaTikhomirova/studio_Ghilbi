const mainPart = document.querySelector("main");
const navlinks = document.querySelectorAll('#mainnav ul li a');
let filmData;
let dataSet ="films";
let url = 'https://ghibliapi.herokuapp.com/films';


async function getData(url){
   const dataPromise = await fetch(url);
   const data = await dataPromise.json();
   if(dataSet=="films"){
      mainPart.innerHTML= "";
      setSort(data);
      addCards(data);
      filmData = data;
      document.getElementById("sortorder").removeAttribute("disabled");
   } else {
      mainPart.innerHTML= "";
      addCards(data);
   }
}
getData(url);

document.getElementById("sortorder").addEventListener("change", function(){
   mainPart.innerHTML = "";
   setSort(filmData);
   addCards(filmData);
})

navlinks.forEach(function(eachLink) {
   eachLink.addEventListener("click", function(evt){
      evt.preventDefault();
      const thisLink = evt.target.getAttribute("href").substring(1);
      url = "https://ghibliapi.herokuapp.com/" + thisLink;
      dataSet = thisLink;
      getData(url);
   });
});

function setSort(array){
   const valueSelection = document.getElementById("sortorder").value;
   switch(valueSelection){
      case "title": array.sort((a, b) => (a.title > b.title) ? 1 : -1); break;
      case "director": array.sort((a, b) => (a.director > b.director) ? 1 : -1); break;
      case "rt_score": array.sort((a, b) => (parseInt(b.rt_score) - parseInt(a.rt_score))); break;
      case "release_date1": array.sort((a, b) => (parseInt(a.release_date) - parseInt(b.release_date))); break;
      case "release_date2": array.sort((a, b) => (parseInt(b.release_date - a.release_date))); break;
   }
}

function addCards(array){
   array.forEach(eachFilm => {
      createCard(eachFilm);
   });
}

async function createCard(data) {
   const card = document.createElement("article");
   switch(dataSet){
      case "people": card.innerHTML = await peopleCardContent(data); break;
      case "films": card.innerHTML = filmCardContent(data); break;
      case "locations": card.innerHTML = await locationCardContent(data); break;
   }
   mainPart.appendChild(card);
}

function filmCardContent(data) {
   let html = `<h2>${data.title}</h2>`;
   html += `<p><strong>Direktor:</strong> ${data.director}</p>`;
   html += `<p><strong>Year of Release:</strong> ${data.release_date}</p>`;
   html += `<p>${data.description}</p>`;
   html += `<p><strong>Rotten Tomatoes:</strong> ${data.rt_score}</p>`;
   return html;
}

async function individItem(url, item){
   let theItem;
   try {
      const itemPromise = await fetch(url);
      const data = await itemPromise.json();
      theItem = data[item];
   }
   catch(err) {
      theItem = "no data available";
   }
   finally {
      return theItem;
   }
}

async function peopleCardContent(data){
   const thefilms = data.films;
   let filmtitles = [];
   for (eachFilm of thefilms) {
      const filmTitle = await individItem(eachFilm, 'title');
      filmtitles.push(filmTitle);
   }

   const species = await individItem(data.species, "name");
   let html = `<h2>${data.name}</h2>`;
   html += `<p><strong>Details:</strong> gender ${data.gender}, age ${data.age}, eye color ${data.eye_color}, hair color ${data.hair_color}</p>`;
   html += `<p><strong>Films:</strong>  ${filmtitles.join(', ')}</p>`;
   html += `<p><strong>Species:</strong> ${species}</p>`;
   return html;
}

async function locationCardContent(data){
   const regex = 'https?:\/\/';
   const theResidents = data.residents;
   let residentNames = [];
   for (eachResident of theResidents) {
      if(eachResident.match(regex)){
      const resName = await indivItem(eachResident, 'name');
      residentNames.push(resName);
      }
      else {
         residentNames[0]='no data available';
      }
   }

   const thefilms = data.films;
   let filmtitles = [];
   for (eachFilm of thefilms) {
      const filmTitle = await individItem(eachFilm, 'title');
      filmtitles.push(filmTitle);
   }
   let html = `<h2>${data.name}</h2>`;
   html += `<p><strong>Details:</strong> climate ${data.climate}, terrain ${data.terrain}, surface water  ${data.surface_water}%</p>`;
   html += `<p><strong>Residents:</strong>  ${residentNames.join(', ')}</p>`;
   html += `<p><strong>Films:</strong>${filmtitles.join(', ')}</p>`;
   return html;
}



