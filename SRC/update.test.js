const { createNewFlashcard } = require("./functions.js");
const { update, MSGS } = require("./update.js");


// Test cards
const flashcard1 = createNewFlashcard("q1", "a1", 1)
const flashcard2 = createNewFlashcard("q2", "a2", 2)
const flashcard3 = createNewFlashcard("q3", "a3", 3)
const flashcard4 = createNewFlashcard("q4", "a4", 4)

// Test model
const model = {
    flashcards: [flashcard1, flashcard2, flashcard3, flashcard4],
};

test('Toggle edit on flashcard', () => {
    let newModel = update({type: MSGS.TOGGLE_EDIT, id: 1}, model)
    let newModel2 = update({ type: MSGS.TOGGLE_EDIT, id: 1 }, newModel);

    expect(newModel.flashcards[0].Status).toBe(2)
    expect(newModel2.flashcards[0].Status).toBe(0)
})

test('Toggle answer on flashcard', () => {
    let newModel = update({ type: MSGS.TOGGLE_ANSWER, id: 1 }, model)
    let newModel2 = update({ type: MSGS.TOGGLE_ANSWER, id: 1 }, newModel);
    
    expect(newModel.flashcards[0].Status).toBe(1);
    expect(newModel2.flashcards[0].Status).toBe(0)
})

test('Scoring a flashcard', () => {
    let newModel = update({ type: "UPDATE_SCORE", id: 1, score: 3 }, model)

    expect(newModel.flashcards[1].Score).toBe(0)
    expect(newModel.flashcards[2].Score).toBe(0)
    expect(newModel.flashcards[3].Score).toBe(3)
})

test('Cancel edit', () => {
    let newModel = update({type: "CANCEL", id: 1}, model)

    expect(newModel.flashcards[0].Status).toBe(0)
})

test('Add a card', () => {
    let newModel = update({ type: "ADD_CARD", newQuestion: "newQuestion", newAnswer: "newAnswer" }, model)

    expect(newModel.flashcards[4].Status).toBe(0)
    expect(newModel.flashcards[4].Id).toBe(5)
    expect(newModel.flashcards[4].Question).toBe("newQuestion")
    expect(newModel.flashcards[4].Answere).toBe("newAnswer")
    
})

test('Add a card with empty answere', () => {
    alert = jest.fn(); // lässt sonst test durch alert failen...

    let newModel = update({ type: "ADD_CARD", newQuestion: "newQuestion", newAnswer: "" }, model);

    expect(newModel.flashcards.length).toBe(4);
});

test('Add a card with empty question', () => {
    alert = jest.fn(); // lässt sonst test durch alert failen...

    let newModel = update({ type: "ADD_CARD", newQuestion: "", newAnswer: "newAnswer" }, model);

    expect(newModel.flashcards.length).toBe(4);
});

test('Edit a card', () => {
    let newModel = update({ type: "EDIT_CARD",flashcard: model.flashcards[0], editQuestion: "editQuestion", editAnswere: "editAnswere" }, model);

    expect(newModel.flashcards[0].Id).toBe(1);
    expect(newModel.flashcards[0].Question).toBe("editQuestion");
    expect(newModel.flashcards[0].Answere).toBe("editAnswere");
});

test('Edit a card with empty question', () => {
    alert = jest.fn();

    let newModel = update({ type: "EDIT_CARD",flashcard: model.flashcards[0], editQuestion: "", editAnswere: "editAnswere" }, model);

    expect(newModel.flashcards[0].Id).toBe(1);
    expect(newModel.flashcards[0].Question).toBe("q1");
    expect(newModel.flashcards[0].Answere).toBe("editAnswere");
});

test('Edit a card with empty answere', () => {
    alert = jest.fn();

    let newModel = update({ type: "EDIT_CARD", flashcard: model.flashcards[0], editQuestion: "editQuestion", editAnswere: "" }, model);

    expect(newModel.flashcards[0].Id).toBe(1);
    expect(newModel.flashcards[0].Question).toBe("editQuestion");
    expect(newModel.flashcards[0].Answere).toBe("a1");
});

test('Edit a card with empty question and answere', () => {
    alert = jest.fn();

    let newModel = update({ type: "EDIT_CARD", flashcard: model.flashcards[0], editQuestion: "", editAnswere: "" }, model);

    expect(newModel.flashcards[0].Id).toBe(1);
    expect(newModel.flashcards[0].Question).toBe("q1");
    expect(newModel.flashcards[0].Answere).toBe("a1");
});

test('Delete a card with false confirm', () => {
    confirm = jest.fn(false);

    let newModel = update({ type: MSGS.DELETE_CARD, flashcard: model.flashcards[0]}, model);

    expect(newModel.flashcards.length).toBe(4);
});

test('Delete a card with true confirm', () => {
    confirm  =  jest.fn(() => true);

    let newModel = update({ type: MSGS.DELETE_CARD, flashcard: model.flashcards[0]}, model);

    expect(newModel.flashcards.length).toBe(3);
});

test('Wrong message', () => {
    let newModel = update({ type: "just some message"}, model);

    expect(newModel.flashcards.length).toBe(4);
});
