const hh = require("hyperscript-helpers");
const { h } = require("virtual-dom");
const { div, button, p, h1, input } = hh(h);

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

function view(dispatch, model) {
    return div({}, [
      div({ className: addCardContainer }, [
        input({ className: inputStyle, placeholder: 'Enter question', id: "newQuestion"}),
        input({ className: inputStyle, placeholder: 'Enter answer',  id: "newAnswere"}),
        button(
          { className: btnStyle, onclick: () => dispatch({ type: "ADD_CARD", newQuestion: document.getElementById("newQuestion").value, newAnswer: document.getElementById("newAnswere").value}) },
          "Add New Card"
        ),
      ]),
      div({ className: topContainer }, [
        div({className: cardArea},[
          ...model.flashcards.map((flashcard) =>
            div({ className: cardStyle, key: flashcard.Id }, [
                div({ className: questionStyle }, [
                    h1({ className: "font-semibold"}, "Question:"),
                    p({ className: qnaStyle }, flashcard.Question),
                    div({ className: buttonContainer }, [
                        div({ className: 'w-1/2' }, [
                            button(
                                { className: btnStyle, onclick: () => dispatch({ type: "TOGGLE_ANSWER", id: flashcard.Id }) },
                                flashcard.Status === 1 ? "Hide Answer" : "Show Answer"
                            ),
                        ]),
                        div({ className: 'w-1/2 flex flex-col items-end' }, [
                            button(
                                { className: goodBtnStyle, onclick: () => dispatch({ type: "TOGGLE_EDIT", id: flashcard.Id }) },
                                "Edit Card"
                            ),
                            button(
                                { className: badBtnStyle + " mt-2", onclick: () => dispatch({ type: "DELETE_CARD", flashcard: flashcard }) },
                                "Delete"
                            ),
                        ]),
                    ]),
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
                    input({ className: inputStyle + " mb-1", placeholder: 'Enter question', id: `editQuestion${flashcard.id}`}),
                    input({ className: inputStyle + " mb-2", placeholder: 'Enter answer',  id: `editAnswere${flashcard.id}`}),
                    div({ className: buttonContainer }, [
                      button({ onclick: () => dispatch({ type: "EDIT_CARD", flashcard: flashcard, editQuestion: document.getElementById(`editQuestion${flashcard.id}`).value, editAnswere: document.getElementById(`editAnswere${flashcard.id}`).value }), className: perfectBtnStyle }, "Update"),
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

  module.exports = {view}