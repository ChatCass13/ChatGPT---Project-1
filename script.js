//script.js

//Function to send user message to backend server
async function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim(); //Get the user input from the input field by its ID (user-input) and store it in a variable called userInput 
  if (!userInput) 
    return; //Prevent sending empty messages
  
  const url = "http://localhost:3000/api/chatgpt"; //Replace with your server URL

  try {
    const response = await fetch(url, { //Send a POST request to the backend server (the hidden bit)
      method: "POST", //POST method is used to send data to the server so it can be processed
      headers: {
        "Content-Type": "application/json" //Send and receive data in JSON format (already defined in the backend)
      },
      body: JSON.stringify({message: userInput}) //Send the user message to the server in JSON format with a message key
    });

    if (!response.ok) { //If the response is not ok --
      throw new Error("Network response was not ok"); //Then show an error message
    }

    const data = await response.json(); //Get the response data from the server
    const chatGptResponse = data.message;

    //Display ChatGPT response
    appendMessage("chatGPT", chatGptResponse); //Display the response from ChatGPT in the chat container
  } catch (error) { //If there's an error -- 
    console.error("Error:", error); //Then log the error message to the console
    //Handle error scenario (e.g., display error message to user)
  }
}

//Function to display messages in the chat container
function appendMessage(sender, message) { //Function to display messages in the chat container with a sender and message in that order
  const chatContainer = document.getElementById("chat-container"); //Get the chat container element from the HTML file (the visible bit) by its ID (chat-container) and store it in a variable called chatContainer 
  const messageElem = document.createElement("div"); //Create a new div element to store the message in the chat container 
  messageElem.classList.add("message", sender); //Add the classes "message" and the sender (user or chatGPT) to the message element
  messageElem.innerHTML = `<p>${message}</p>`; //Add the message to the message element as a paragraph element with the message content inside it 
  chatContainer.appendChild(messageElem); //Add the message element to the chat container to display the message in the chat container 
}

//Attach event listener to send button
const sendButton = document.getElementById("send-button"); //Get the send button element from the HTML file (the visible bit) by its ID (send-button) and store it in a variable called sendButton 
sendButton.addEventListener("click", sendMessage); //Add an event listener to the send button that listens for a click event and calls the sendMessage function when the button is clicked

//Attach event listener to input field for Enter key
const inputField = document.getElementById("input-field"); //Get the input field element by its ID (input-field) and store it in a variable called "inputField"
inputField.addEventListener("keydown", function(event) {
    if (event.key === "Enter") { //Check if the Enter key was pressed
        sendMessage(); //Call the sendMessage function
    }
});