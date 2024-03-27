import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";
const { createNewFlashcard, editFlashcard, sortFlashcards, deleteFlashcard } = require("./functions.js");


//Styles//
const cardStyle = "bg-[rgb(246,239,165)] flex flex-col overflow-hidden min-h-[400px] grow border-[3px] border-solid border-[black];";
const questionStyle = "p-5";
const answereStyle = "pt-0 p-5";
const qnaStyle = "p-2.5"
const inputStyle = "w-[375px] border rounded p-2.5 border-solid border-[#ccc]";

//Containers//
const buttonContainer = "flex justify-around gap-2.5 mt-auto";
const cardArea = "col-[2_/_12] grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] auto-rows-min gap-1 justify-center items-start mt-2"
const topContainer = "min-h-[80vh] grid grid-cols-12";
const addCardContainer = "flex justify-center gap-2.5";

//Button Styles//
const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
const badBtnStyle = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
const goodBtnStyle = "bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded";
const perfectBtnStyle = "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded";

// used html tags
const { div, button, p, h1, input } = hh(h);

// Flow messages
const MSGS = {
  TOGGLE_ANSWER: "TOGGLE_ANSWER",
  UPDATE_SCORE: "UPDATE_SCORE",
  ADD_CARD: "ADD_CARD",
  DELETE_CARD: "DELETE_CARD",
  TOGGLE_EDIT: "TOGGLE_EDIT",
  EDIT_CARD: "EDIT_CARD",
  CANCEL: "CANCEL"
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({}, [ // This div wraps the entire view including the add-card-section and the topContainer
    div({ className: addCardContainer }, [ // This div is for adding new cards
      input({ className: inputStyle, placeholder: 'Enter question', id: "newQuestion"}),
      input({ className: inputStyle, placeholder: 'Enter answer',  id: "newAnswere"}),
      button(
        { className: btnStyle, onclick: () => dispatch({ type: "ADD_CARD", newQuestion: document.getElementById("newQuestion").value, newAnswer: document.getElementById("newAnswere").value}) },
        "Add New Card"
      ),
    ]),
    div({ className: topContainer }, [ // This div is the existing topContainer
      div({className: cardArea},[
        ...model.flashcards.map((flashcard) =>
          div({ className: cardStyle, key: flashcard.Id }, [
            div({ className: questionStyle }, [
              h1({ className: "font-semibold"}, "Question:"),
              p({ className: qnaStyle }, flashcard.Question),
              button(
                { className: btnStyle, onclick: () => dispatch({ type: "TOGGLE_ANSWER", id: flashcard.Id }) },
                flashcard.Status === 0 ? "Show Answer" : "Hide Answer"
              ),
              button(
                { className: goodBtnStyle + " ml-12", onclick: () => dispatch({ type: "TOGGLE_EDIT", id: flashcard.Id }) },
                "Edit Card"
              ),
              button({className: badBtnStyle + " ml-2", onclick: () => dispatch({ type: "DELETE_CARD", flashcard: flashcard }) }, "Delete")
            ]),
            flashcard.Status === 1
              ? div({ className: answereStyle }, [
                  h1({ className: "font-semibold"}, "Answere:"),
                  p({ className: qnaStyle}, flashcard.Answere),
                  div({ className: buttonContainer }, [
                    button({ onclick: () => dispatch({ type: "UPDATE_SCORE", id: flashcard.Id, score: 1 }), className: badBtnStyle }, "Bad"),
                    button({ onclick: () => dispatch({ type: "UPDATE_SCORE", id: flashcard.Id, score: 2 }), className: goodBtnStyle }, "Good"),
                    button({ onclick: () => dispatch({ type: "UPDATE_SCORE", id: flashcard.Id, score: 3 }), className: perfectBtnStyle }, "Perfect"),
                  ]),
                ])
              : null,
              flashcard.Status === 2
              ? div({ className: answereStyle }, [
                  h1({ className: "font-semibold"}, "Edit:"),
                  input({ className: inputStyle + " mb-1", placeholder: 'Enter question', id: "editQuestion"}),
                  input({ className: inputStyle + " mb-2", placeholder: 'Enter answer',  id: "editAnswere"}),
                  div({ className: buttonContainer }, [
                    button({ onclick: () => dispatch({ type: "EDIT_CARD", flashcard: flashcard, editQuestion: document.getElementById("editQuestion").value, editAnswere: document.getElementById("editAnswere").value }), className: perfectBtnStyle }, "Update"),
                    button({ onclick: () => dispatch({ type: "CANCEL", id: flashcard.Id }), className: goodBtnStyle }, "Cancel"),
                  ]),
                ])
              : null,
          ])
        ),
      ]),
    ]),
  ]);
}



// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  console.log("Action received:", msg); // Debug log
  switch (msg.type) {
    case  MSGS.TOGGLE_ANSWER:
      const updatedFlashcards = model.flashcards.map((flashcard) => {
        if (flashcard.Id === msg.id) {
          return { ...flashcard, Status: flashcard.Status === 0 ? 1 : 0 };
        }
        return flashcard;
      });
      return { ...model, flashcards: updatedFlashcards };
    
    case  MSGS.TOGGLE_EDIT:
        const toggledFlashcards = model.flashcards.map((flashcard) => {
          if (flashcard.Id === msg.id) {
            return { ...flashcard, Status: flashcard.Status === 0 ? 2 : 0 };
          }
          return flashcard;
        });
        return { ...model, flashcards: toggledFlashcards };

    case MSGS.UPDATE_SCORE:
      let flashcardsUpdated = model.flashcards.map((flashcard) => {
        if (flashcard.Id === msg.id) {
          return { ...flashcard, Score: flashcard.Score + msg.score, Status: 0 }; // Reset Status to hide the answer again
        }
        return flashcard;
      });
      flashcardsUpdated = sortFlashcards(flashcardsUpdated);
      return { ...model, flashcards: flashcardsUpdated };

    case MSGS.CANCEL:
      let flashcardsCancel = model.flashcards.map((flashcard) => {
        if (flashcard.Id === msg.id) {
          return { ...flashcard, Status: 0 }; // Reset Status to hide the answer again
        }
        return flashcard;
      });
      flashcardsCancel = sortFlashcards(flashcardsCancel);
      return { ...model, flashcards: flashcardsCancel };

    case MSGS.ADD_CARD:
      console.log("now in add card")
      if (msg.newQuestion === "" || msg.newAnswer === "")
      {
        alert("Please provide a qustion and an answere")
        return {...model};
      }
      const newCard = createNewFlashcard(msg.newQuestion, msg.newAnswer, model.flashcards.length + 1);
      // Add the new card to your array of flashcards
      return { ...model, flashcards: model.flashcards.concat(newCard), newQuestion: '', newAnswer: '' };

      case MSGS.EDIT_CARD:
        console.log("now in edit card")
        const editCard = editFlashcard(model.flashcards, msg.flashcard, msg.editQuestion, msg.editAnswere)
        console.log(editCard)
        if (msg.editQuestion === "" || msg.editAnswere === "")
      {
        alert("Please provide a qustion and an answere")
        return {...model};
      }
        // Add the new card to your array of flashcards
        return { ...model, flashcards: editCard };

    case MSGS.DELETE_CARD:
      console.log("In delete card")
      console.log(msg.flashcard)
      let newFlashcardArray = deleteFlashcard(model.flashcards ,msg.flashcard)
      return { ...model, flashcards: newFlashcardArray};


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
