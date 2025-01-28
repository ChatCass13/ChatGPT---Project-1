document.addEventListener("DOMContentLoaded", function() {
  // Clear session storage on page load to start fresh
  sessionStorage.clear();

  const sendButton = document.getElementById("send-button"); // Get the send button element by its ID (send-button) and store it in a variable called sendButton
  const userInput = document.getElementById("user-input"); // Get the user input element by its ID (user-input) and store it in a variable called userInput

  sendButton.addEventListener("click", sendMessage); // Attach click event listener to the send button

  userInput.addEventListener("keypress", function(event) { // Attach keypress event listener to the input field
    if (event.key === "Enter") { // Check if the key pressed is Enter
      sendMessage(); // Call the sendMessage function - get some answers from the backend!
    }
  });
});

async function sendMessage() { // Function to send user message to backend server
  const userInputElement = document.getElementById("user-input");
  const userInput = userInputElement.value.trim(); // Get the user input from the input field by its ID (user-input) and store it in a variable called userInput 

  if (!userInput) return; // Prevent sending empty messages but dont worry as there's usually nothing going on anyway

  // Save the current question to session storage
  sessionStorage.setItem('lastQuestion', userInput);

  // If there's a previous answer, include it in the prompt for context
  const lastAnswer = sessionStorage.getItem('lastAnswer');
  const context = lastAnswer ? `Based on our last interaction: "${lastAnswer}", ` : "";
  const prompt = `${context}start every response with "hello Cassandra" and explain the answer to all my questions like I'm a junior programmer learning to code.`;
  const message = `${prompt} ${userInput}`;
  const url = "http://localhost:3000/api/chatgpt"; // Where I want to send the message to (the hidden bit) using this URL

  try {
    const response = await fetch(url, { // Send a request to the backend server (the hidden bit)
      method: "POST", // POST method is used to send data to the server so it can be processed 
      headers: {
        "Content-Type": "application/json" // Send and receive data in JSON format (already defined in the backend)
      },
      body: JSON.stringify({ message: message }) // Send the user message to the server in JSON format with a message key
    });

    if (!response.ok) { // If the response is not ok --
      throw new Error("Network response was not ok"); // -- Then show an error message
    }

    const data = await response.json(); // Get the response data from the server
    const chatGptResponse = data.message;

    // Display ChatGPT response
    appendMessage("chatGPT", chatGptResponse);

    // Save the current answer to session storage
    sessionStorage.setItem('lastAnswer', chatGptResponse);

    // Clear the input field after sending the message
    userInputElement.value = '';
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to display messages in the chat container
function appendMessage(sender, message) { // Function to display messages in the chat container with a sender and message in that order
  const chatContainer = document.getElementById("chat-container"); // Get the chat container element from the HTML file (the visible bit) by its ID (chat-container) and store it in a variable called chatContainer 
  const messageElem = document.createElement("div"); // Create a new div element to store the message in the chat container 
  messageElem.classList.add("message", sender); // Add the classes "message" and the sender (user or chatGPT) to the message element
  messageElem.innerHTML = `<p>${message}</p>`; // Add the message to the message element as a paragraph element with the message content inside it 
  chatContainer.appendChild(messageElem); // Add the message element to the chat container to display the message in the chat container 
}
