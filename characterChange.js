// characterchange.js

document.getElementById("return").addEventListener("click", function() {
    window.location.href = "index.html";
});

const characters = [
    'Untitled__1_-removebg-preview (1).png', // Path to Character 1 image
    'cutecat.png', // Path to Character 2 image
    'Dibujos_animados_de_un_lindo_gato_naranja_sentado___Vector_Premium-removebg-preview (1).png'  // Path to Character 3 image
];

function switchCharacter(index) {
    const characterImg = document.getElementById('character-img');
    characterImg.src = characters[index]; // Update the src directly from the characters array
    const characterBtns = document.querySelectorAll(".character-btn")
    characterBtns.forEach(button => button.classList.remove('active'));
    characterBtns[index].classList.add('active');
    
    // Save the selected character index to localStorage
    localStorage.setItem('selectedCharacterIndex', index);
}

// Function to load the saved character
function loadSavedCharacter() {
    const savedIndex = localStorage.getItem('selectedCharacterIndex');
    if (savedIndex !== null) {
        switchCharacter(parseInt(savedIndex));
    } else {
        // Load the default character (first character)
        switchCharacter(0);
    }
}

// Load the saved character on page load
window.onload = loadSavedCharacter;

const buttons = document.querySelectorAll('.character-btn');
buttons.forEach((button, index) => {
    button.addEventListener('click', () => switchCharacter(index));
});