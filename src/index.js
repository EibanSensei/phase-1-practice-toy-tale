let addToy = false;

const apiUrl = "http://localhost:3000/toys";

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display toys
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const cardContainer = document.getElementById('toy-collection');
      data.forEach(toy => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
        `;
        cardContainer.appendChild(card);

        // Add event listener for like button
        const likeBtn = card.querySelector('.like-btn');
        likeBtn.addEventListener('click', () => {
          const toyId = likeBtn.getAttribute('data-id');
          const likesP = card.querySelector('p');
          const currentLikes = parseInt(likesP.textContent.split(' ')[0]);
          const newLikes = currentLikes + 1;

          // Send PATCH request to update likes
          fetch(`${apiUrl}/${toyId}`, {
            method: 'PATCH',
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({ likes: newLikes })
          })
          .then(response => response.json())
          .then(updatedToy => {
            // Update the DOM with new number of likes
            likesP.textContent = `${updatedToy.likes} Likes`;
          })
          .catch(error => console.error('Error updating likes:', error));
        });
      });
    })
    .catch(error => console.error('Error fetching cards:', error));
});

// Add a new toy
const toyForm = document.querySelector('.add-toy-form');
toyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const toyName = document.querySelector('input[name="name"]').value;
  const toyImage = document.querySelector('input[name="image"]').value;

  const newToy = {
    name: toyName,
    image: toyImage,
    likes: 0
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newToy)
  })
  .then(response => response.json())
  .then(toy => {
    const cardContainer = document.getElementById('toy-collection');
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;
    cardContainer.appendChild(card);

    // Add event listener for the new card's like button
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      const toyId = likeBtn.getAttribute('data-id');
      const likesP = card.querySelector('p');
      const currentLikes = parseInt(likesP.textContent.split(' ')[0]);
      const newLikes = currentLikes + 1;

      // Send PATCH request to update likes
      fetch(`${apiUrl}/${toyId}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ likes: newLikes })
      })
      .then(response => response.json())
      .then(updatedToy => {
        // Update the DOM with new number of likes
        likesP.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error('Error updating likes:', error));
    });

    // Reset the form
    toyForm.reset();
  })
  .catch(error => console.error('Error adding new toy:', error));
});
