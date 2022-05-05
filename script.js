"use strict";

const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");
//Nasa Api
const count = 10;
const apiKey = "SPaRu3tCyibh4Wscig8TdL8tq7rLpCeGVmn4YXwZ";

const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};
function showContent(page) {
  loader.classList.add("hidden");
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
}

function createDOMNotes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    // card container
    const card = document.createElement("div");
    card.classList.add("card");
    // link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    //image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "Nasa Picture of the Day";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    //card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    //title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    //Save text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add to Favorites";
      saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = "Remove Favorite";
      saveText.setAttribute("onclick", `removeFavorite('${result.url}')`);
    }
    //explanation
    const text = document.createElement("p");
    text.classList.add("card-text");
    text.textContent = result.explanation;
    //Footer container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    //date
    const date = document.createElement("strong");
    date.textContent = result.date;
    //ccopuright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;
    //Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, text, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

//updating dom

function updateDOM(page) {
  // Get Favorites from local storage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  imagesContainer.textContent = "";
  createDOMNotes(page);
  showContent(page);
}

//Get 10 images from Nasa api

async function getNasaPictures() {
  loader.classList.remove("hidden");

  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();

    updateDOM("results");
  } catch (err) {
    console.log(err);
  }
}

//Add result to favorites
function saveFavorite(itemUrl) {
  // loop through results array

  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      //show save foncirmation
      saveConfirmed.classList.remove("hidden");
      setTimeout(() => {
        saveConfirmed.classList.add("hidden");
      }, 2000);
      //set favorites in local storage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

function removeFavorite(itemurl) {
  if (favorites[itemurl]) {
    delete favorites[itemurl];
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}
getNasaPictures();
