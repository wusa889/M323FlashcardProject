const { createNewFlashcard, editFlashcard, sortFlashcards, deleteFlashcard, getFlashcardIndexById, setFlashcardStatus } = require('./functions.js')

// Test card
const flashcard1 = createNewFlashcard("q1", "a1", 1)
const flashcard2 = createNewFlashcard("q2", "a2", 2)
const flashcard3 = createNewFlashcard("q3", "a3", 3)
const flashcard4 = createNewFlashcard("q4", "a4", 4)

// Test array
let flashcardArray = [flashcard1, flashcard2, flashcard3, flashcard4];


// Creating flashcard test
test('Create a new flashcard', () => {
    expect(flashcard1.Id).toBe(1);
    expect(flashcard1.Answere).toBe("a1")
    expect(flashcard1.Question).toBe("q1")
})

// Delete a flashcard
test('Delete a flashcard', () =>{
    let newArray = deleteFlashcard(flashcardArray, flashcard1)
    expect(newArray.length).toBe(3)
})

// Update a flashcard
test('Edit flashcard', () => {
    let newArray = editFlashcard(flashcardArray, flashcard1, "updateq1", "updatea1");
    let newArray2 = editFlashcard(flashcardArray, flashcard1, "", "updatea1");
    let newArray3 = editFlashcard(flashcardArray, flashcard1, "updateq1", "");
   
    expect(newArray[0].Id).toBe(1);
    expect(newArray[0].Question).toBe("updateq1")
    expect(newArray[0].Answere).toBe("updatea1")

    expect(newArray2[0].Id).toBe(1);
    expect(newArray2[0].Question).toBe("q1")
    expect(newArray2[0].Answere).toBe("updatea1")

    expect(newArray3[0].Id).toBe(1);
    expect(newArray3[0].Question).toBe("updateq1")
    expect(newArray3[0].Answere).toBe("a1")
})

// Sort flashcard Array
test('Sorting the flashcardarray', () =>{
    let testArray = [...flashcardArray];
    testArray[0].Score = 5;
    testArray[1].Score = 1;
    testArray[2].Score = 2;
    testArray[3].Score = 4;
    let sortArray = sortFlashcards(testArray)
    expect(sortArray[0].Id).toBe(2);
    expect(sortArray[1].Id).toBe(3);
    expect(sortArray[2].Id).toBe(4);
    expect(sortArray[3].Id).toBe(1);
})

// Set Flashcard Status
test('Set Flashcard Status', () => {
    let newArray = [...flashcardArray];
    newArray[1].Status = 1
    let testCard1 = setFlashcardStatus(newArray[0])
    let testCard2 = setFlashcardStatus(newArray[1])
    expect(testCard1.Status).toBe(1)
    expect(testCard2.Status).toBe(0)
})

// Get index of flashcard
test('Gets a flashcard index by id', () => {
    let newArray = [...flashcardArray];
    let index1 = getFlashcardIndexById(newArray, flashcard1)
    let index2 = getFlashcardIndexById(newArray, flashcard2)
    expect(index1).toBe(0)
    expect(index2).toBe(1)
})