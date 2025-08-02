
let allCars = [];

fetch('cars.json')
    .then(response => response.json())
    .then(carData => {
        console.log("Car data loaded:", carData);

        allCars = carData;
        renderCards(allCars);
    })
    .catch(error => {
        console.error("Error", error);
    });

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", handleSearch);

//handles the search function
function handleSearch() {

    const searchTerm = searchInput.value.toLowerCase();
    const filteredCars = allCars.filter(car => {
        return (
            car.make.toLowerCase().includes(searchTerm) || car.model.toLowerCase().includes(searchTerm)
        );
    });

    renderCards(filteredCars);

}

//renders what cars are on screen based on what list is inputted
function renderCards(carList) {

    const carCards = document.getElementById("carList");

    carCards.innerHTML = "";

    carList.forEach(car => {
        const card = createCard(car);
        carCards.appendChild(card);
    });

}

//creates a card based on the car
function createCard(car) {
    const card = document.createElement("div");
    card.classList.add("carCard");

    //creates seperate divs for styling
    const makeEl = document.createElement("div");
    makeEl.innerText = car.make;

    const modelEl = document.createElement("div");
    modelEl.innerText = car.model;

    const yearEl = document.createElement("div");
    yearEl.innerText = car.year;

    makeEl.classList.add("make");
    modelEl.classList.add("model");
    yearEl.classList.add("year");

    card.appendChild(makeEl);
    card.appendChild(modelEl);
    card.appendChild(yearEl);

    // card.innerText = `${car.make} ${car.model} ${car.year}`

    return card
}