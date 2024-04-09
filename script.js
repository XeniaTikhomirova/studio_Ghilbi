const mainPart = document.querySelector("main");
const navlinks = document.querySelectorAll('#mainnav ul li a');
let filmData;

// initial end points:
let dataSet ="films";
let url = 'https://ghibliapi.dev/films';

async function getData(url){
   const dataPromise = await fetch(url);
   const data = await dataPromise.json();
   if(dataSet === "films"){
      mainPart.innerHTML= "";
      setSort(data);
      addCards(data);
      filmData = data;
      document.getElementById("sortorder").removeAttribute("disabled");
      document.querySelector("nav form").style.visibility = "visible";
   } else {
      mainPart.innerHTML= "";
      addCards(data);
      document.querySelector("nav form").style.visibility = "hidden";
   }
}
getData(url);

document.getElementById("sortorder").addEventListener("change", function(){
   mainPart.innerHTML = "";
   setSort(filmData);
   addCards(filmData);
})

navlinks.forEach(function(eachLink) {
   eachLink.addEventListener("click", function(event){
      event.preventDefault();
      const thisLink = event.target.getAttribute('href').substring(1);
      url = `https://ghibliapi.dev/${thisLink}`;
      dataSet = thisLink;
      getData(url);
   });
});

function setSort(array){
   const valueSelection = document.getElementById("sortorder").value;
   if(Array.isArray(array)){
      switch(valueSelection){
         case "title": array.sort((a, b) => (a.title > b.title) ? 1 : -1); break;
         case "director": array.sort((a, b) => (a.director > b.director) ? 1 : -1); break;
         case "rt_score": array.sort((a, b) => (parseInt(b.rt_score) - parseInt(a.rt_score))); break;
         case "release_date2": array.sort((a, b) => (parseInt(b.release_date) - parseInt(a.release_date))); break;
         case "release_date1": array.sort((a, b) => (parseInt(a.release_date) - parseInt(b.release_date))); break;
      }
   }
}

function addCards(array){
   array.forEach(eachItem => createCard(eachItem));
}

async function createCard(data) {
   const card = document.createElement("article");
      switch (dataSet){
            case "people": card.innerHTML = await peopleCardContent(data); break;
            case "films": card.innerHTML = filmCardContent(data); break;
            case "locations": card.innerHTML = await locationCardContent(data); break;
            case "species": card.innerHTML = await speciesCardContent(data); break;
            case "vehicles": card.innerHTML = await vehiclesCardContent(data); break;
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

async function peopleCardContent(data){
   const thefilms = data.films;
   let filmtitles = [];
   for (eachFilm of thefilms) {
      const filmTitle = await individItem(eachFilm, 'title');
      filmtitles.push(filmTitle);
   }

   const species = await individItem(data.species, "name");
   //console.log(`${data.species}`);
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
         const resName = await individItem(eachResident, 'name');
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
   html += `<p><strong>Details:</strong> climate ${data.climate}, terrain ${data.terrain}, surface water ${data.surface_water}%</p>`;
   html += `<p><strong>Residents:</strong>  ${residentNames.join(', ')}</p>`;
   html += `<p><strong>Films:</strong>${filmtitles.join(', ')}</p>`;
   return html;
}

async function speciesCardContent(data) {
   const people = data.people;
   let peopleNames = [];
   for (eachPerson of people) {
      const personName = await individItem(eachPerson, 'name');
      peopleNames.push(personName);
   }
   const thefilms = data.films;
   let filmtitles = [];
   for (eachFilm of thefilms) {
      const filmTitle = await individItem(eachFilm, 'title');
      filmtitles.push(filmTitle);
   }
   let html = `<h2>${data.name}</h2>`;
   html += `<p><strong>Classification:</strong> ${data.classification}</p>`;
   html += `<p><strong>Eye Colors:</strong> ${data.eye_colors}</p>`;
   html += `<p><strong>Hair Colors:</strong> ${data.hair_colors}</p>`;
   html += `<p><strong>People:</strong> ${peopleNames.join(', ')}</p>`;
   html += `<p><strong>Films:</strong> ${filmtitles.join(', ')}</p>`;
   return html;
}

async function vehiclesCardContent(data) {
   let html = `<h2>${data.name}</h2>`;
   html += `<p><strong>Description:</strong> ${data.description}</p>`;
   html += `<p><strong>Vehicle class:</strong> ${data.vehicle_class}</p>`;
   html += `<p><strong>Length: </strong> ${data.length}</p>`;
   html += `<p><strong>Pilot: </strong>  ${await individItem(data.pilot, 'name')}</p>`;
   html += `<p><strong>Film:</strong>  ${await individItem(data.films, 'title')}</p>`;
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
