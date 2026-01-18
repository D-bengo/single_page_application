// Get references to DOM elements
const form = document.getElementById("searchForm");
const input = document.getElementById("wordInput");

const wordTitle = document.getElementById("wordTitle");
const phonetic = document.getElementById("phonetic");
const audio = document.getElementById("audio");
const definitionsList = document.getElementById("definitions");
const synonymsText = document.getElementById("synonyms");

// Add an event listener to handle form submission
form.addEventListener("submit", async (e) => {
  // Prevent the form from reloading the page
  e.preventDefault();

  // Get the entered word and remove extra spaces
  const word = input.value.trim();

  // If input is empty, stop execution
  if (!word) return;

  // Clear previous search results
  clearResults();

  try {
    // Fetch word data from the Free Dictionary API
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    // If API response fails, throw an error
    if (!response.ok) throw new Error("Word not found");

    // Convert the response into JSON
    const data = await response.json();

    // Display the first result from the API
    displayResults(data[0]);
  } catch (error) {
    // Display error message if word is not found
    wordTitle.textContent = "No results found.";
  }
});

/**
 * //Displays word details on the page
 * @param {Object} data - Word data from API
 */
function displayResults(data) {
  // Display the searched word
  wordTitle.textContent = data.word;

  // Handle pronunciation
  if (data.phonetics && data.phonetics.length > 0) {
    phonetic.textContent = data.phonetics[0].text || "";

    // If pronunciation audio exists, show and play it
    if (data.phonetics[0].audio) {
      audio.src = data.phonetics[0].audio;
      audio.hidden = false;
    }
  }

  // Array to collect synonyms
  let synonyms = [];

  // Loop through meanings
  data.meanings.forEach((meaning) => {
    // Loop through definitions
    meaning.definitions.forEach((def) => {
      // Create a list item for each definition
      const li = document.createElement("li");
      li.textContent = def.definition;

      // Add definition to the list
      definitionsList.appendChild(li);

      // Collect synonyms if they exist
      if (def.synonyms) {
        synonyms.push(...def.synonyms);
      }
    });
  });

  // Display synonyms or fallback message
  synonymsText.textContent =
    synonyms.length > 0
      ? [...new Set(synonyms)].join(", ")
      : "No synonyms available.";
}


 //Clears previous search results
 
function clearResults() {
  wordTitle.textContent = "";
  phonetic.textContent = "";
  audio.hidden = true;
  audio.src = "";
  definitionsList.innerHTML = "";
  synonymsText.textContent = "";
}