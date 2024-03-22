import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";
const { createNewFlashcard, editFlashcard, sortFlashcards } = require("./functions.js");

// const topContainer = "min-h-screen w-auto grid grid-cols-12"
// const cardArea = "grid col-start-2 col-end-12 grid-cols-[repeat(auto-fill,_minmax(225px,_1fr))] auto-rows-[290px] gap-2 justify-center"
const cardStyle = "bg-[rgb(246,239,165)] flex flex-col overflow-hidden min-h-[400px] grow border-[3px] border-solid border-[black];";
// const questionStyle = "bg-purple-600 flex flex-col col-span-2 items-center";
// const answereStyle = "bg-green-500 flex items-center justify-center col-span-2 row-start-2 row-end-3";

const topContainer = "topcontainer";
const cardArea = "cardArea";
//const cardStyle = "card";
const questionStyle = "question";
const answereStyle = "answere";
const buttonContainer = "button-container";

// allows using html tags as functions in javascript
const { div, button, p, h1 } = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"; // Standard Blue
const badBtnStyle = "bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
const goodBtnStyle = "bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
const perfectBtnStyle = "bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";


// Messages which can be used to update the model
const MSGS = {
  TOGGLE_ANSWER: "TOGGLE_ANSWER",
  UPDATE_SCORE: "UPDATE_SCORE",
  // ... ℹ️ additional messages
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({ className: topContainer }, [
    div({className: "AddButton"}),
    div({className: cardArea},[
    ...model.flashcards.map((flashcard) =>
      div({ className: cardStyle, key: flashcard.Id }, [
        div({ className: questionStyle }, [
          h1({ className: "font-semibold"}, "Question:"),
          p({}, flashcard.Question),
          button(
            { className: btnStyle, onclick: () => dispatch({ type: "TOGGLE_ANSWER", id: flashcard.Id }) },
            flashcard.Status === 0 ? "Show Answer" : "Hide Answer"
          ),
        ]),
        flashcard.Status === 1
          ? div({ className: answereStyle }, [
              h1({ className: "font-semibold"}, "Answere:"),
              p({}, flashcard.Answere),
              div({ className: "button-container" }, [
                button({ onclick: () => dispatch({ type: "UPDATE_SCORE", id: flashcard.Id, score: 1 }), className: badBtnStyle }, "Bad"),
                button({ onclick: () => dispatch({ type: "UPDATE_SCORE", id: flashcard.Id, score: 2 }), className: goodBtnStyle }, "Good"),
                button({ onclick: () => dispatch({ type: "UPDATE_SCORE", id: flashcard.Id, score: 3 }), className: perfectBtnStyle }, "Perfect"),
              ]),
            ])
          : null,
      ])
    ),
  ])
  ]);
}

// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  console.log("Action received:", msg); // Debug log
  switch (msg.type) {
    case "TOGGLE_ANSWER":
      const updatedFlashcards = model.flashcards.map((flashcard) => {
        if (flashcard.Id === msg.id) {
          return { ...flashcard, Status: flashcard.Status === 0 ? 1 : 0 };
        }
        return flashcard;
      });
      return { ...model, flashcards: updatedFlashcards };
    case MSGS.UPDATE_SCORE:
      let flashcardsUpdated = model.flashcards.map((flashcard) => {
        if (flashcard.Id === msg.id) {
          return { ...flashcard, Score: msg.score, Status: 0 }; // Reset Status to hide the answer again
        }
        return flashcard;
      });
      flashcardsUpdated = sortFlashcards(flashcardsUpdated);
      return { ...model, flashcards: flashcardsUpdated };
    default:
      return model;
  }
}

// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}


// The initial model when the app starts
const initModel = {
  flashcards: [],
};



// test method, delete in final
for (let index = 0; index < 3; index++) {
  const card = createNewFlashcard(`Test${index}: Meine Frage die ich hier stelle.`, `Test${index}: meine Antwort zu der gestellten frage die ist sehr lang, darum weiss ich grade nicht wie es danach aussieht lol`, index);
  initModel.flashcards.push(card)
}



// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);
