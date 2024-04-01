const { createNewFlashcard, editFlashcard, sortFlashcards, deleteFlashcard } = require("./functions.js");

const MSGS = {
  TOGGLE_ANSWER: "TOGGLE_ANSWER",
  UPDATE_SCORE: "UPDATE_SCORE",
  ADD_CARD: "ADD_CARD",
  DELETE_CARD: "DELETE_CARD",
  TOGGLE_EDIT: "TOGGLE_EDIT",
  EDIT_CARD: "EDIT_CARD",
  CANCEL: "CANCEL",
};

function update(msg, model) {
  switch (msg.type) {
    
    case MSGS.TOGGLE_ANSWER:
      const updatedFlashcards = model.flashcards.map((flashcard) => {
        if (flashcard.Id === msg.id) {
          return { ...flashcard, Status: flashcard.Status === 0 ? 1 : 0 };
        }
        return flashcard;
      });
      return { ...model, flashcards: updatedFlashcards };

    case MSGS.TOGGLE_EDIT:
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
          return { ...flashcard, Score: flashcard.Score + msg.score, Status: 0 };
        }
        return flashcard;
      });
      flashcardsUpdated = sortFlashcards(flashcardsUpdated);
      return { ...model, flashcards: flashcardsUpdated };

    case MSGS.CANCEL:
      let flashcardsCancel = model.flashcards.map((flashcard) => {
        if (flashcard.Id === msg.id) {
          return { ...flashcard, Status: 0 };
        }
        return flashcard;
      });
      flashcardsCancel = sortFlashcards(flashcardsCancel);
      return { ...model, flashcards: flashcardsCancel };

    case MSGS.ADD_CARD:
      if (msg.newQuestion === "" || msg.newAnswer === "") {
        alert("Please provide a qustion and an answere");
        return { ...model };
      }
      const newCard = createNewFlashcard(msg.newQuestion, msg.newAnswer, model.flashcards.length + 1);
      return { ...model, flashcards: model.flashcards.concat(newCard), newQuestion: "", newAnswer: "" };

    case MSGS.EDIT_CARD:
      const editCard = editFlashcard(model.flashcards, msg.flashcard, msg.editQuestion, msg.editAnswere);
      if (msg.editQuestion === "" && msg.editAnswere === "") {
        alert("Please provide a qustion or an answere");
        return { ...model };
      }
      return { ...model, flashcards: editCard };

    case MSGS.DELETE_CARD:
      if (confirm("Do you really want to delete this card?")) {
        let newFlashcardArray = deleteFlashcard(model.flashcards, msg.flashcard);
        return { ...model, flashcards: newFlashcardArray };
      } else {
        let retmod = { ...model };
        return retmod;
      }

    default:
      return model;
  }
}

module.exports = { update, MSGS };
