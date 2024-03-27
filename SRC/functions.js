module.exports = { createNewFlashcard, editFlashcard, sortFlashcards, replaceFlashcard, deleteFlashcard, findFlashcardInArray, getFlashcardIndexById, setFlashcardStatus, resetAllFlashcardStatus, reloadFlashcardArray };

class flashcard{
    Question;
    Answere;
    Score; 
    Id; 
    Displaytext;
    Status;
}


/**
 * Used to create new flashcards
 * @param {string} question sets the question of the flashcard
 * @param {string} answere sets answere of the flashcard
 * @param {int} id sets the id of the flashcard
 * @returns A new flashcard
 */
function createNewFlashcard(question, answere, id) {
   return newFlashcard = { Question: question, Answere: answere, Score: 0, Id: id, Displaytext: question, Status: 0}
}

/**
 * Used to edit Flashcards
 * @param {array} flashcardArray Used to get the Array of the flashcards
 * @param {flashcard} flashcard flashcard to be modified 
 * @param {string} newQuestion modifies Answere of the Flashcard
 * @param {string} newAnswere modifies Answere of the Flashcard
 * @returns Array with editted flashcard inside
 */
function editFlashcard(flashcardArray, flashcard, newQuestion, newAnswere){
    let tempFlashcard = {...flashcard};
    if(newQuestion !== ""){
        tempFlashcard.Question = newQuestion;
    }
    if(newAnswere !== ""){
        tempFlashcard.Answere = newAnswere;
    }
    tempFlashcard.Displaytext = tempFlashcard.Question;
    newFlashcard = setFlashcardStatus(tempFlashcard);

    return replaceFlashcard(flashcardArray, newFlashcard);
}

/**
 * Helpfunction to replaces a flashcard in an Array
 * @param {Array} flashcardArray Array where flashcards are stored
 * @param {flashcard} flashcard  Flashcard to be replaced
 * @returns New flashcard array with replaced card
 */
function replaceFlashcard(flashcardArray, flashcard){
    let newArray = [...flashcardArray]
    let index = getFlashcardIndexById(flashcardArray ,flashcard) 
    newArray[index] = flashcard;
    return newArray;
}

/**
 * Deletes a flashcard in a flashcard array
 * @param {array} flashcardArray 
 * @param {flashcard} flashcard 
 * @returns New flashcard array without deleted card
 */
function deleteFlashcard(flashcardArray, flashcard){
    let tempArray = [...flashcardArray];
    let index = getFlashcardIndexById(flashcardArray, flashcard)
    tempArray.splice(index, 1)
    let newArray = sortFlashcards(tempArray)
    return newArray;
}

/**
 * Used to sort a flashcard array
 * @param {array} flashcardArray Array to be sorted
 * @returns Sorted flashcard array
 */
function sortFlashcards(flashcardArray){
    let newArray = [...flashcardArray]
    newArray.sort((a, b) => a.Score - b.Score)
    return newArray
}

/**
 * Changes the display text of the card
 * @param {array} flashcardArray Array which holds flashcards
 * @param {flashcard} flashcard Flashcard where the text has to be set
 * @returns Flashcard array with flipped card.
 */
function changeDisplayText(flashcardArray ,flashcard){
    let turnedFlashCard = {...flashcard}
    let newArray = [...flashcardArray]
    let index = getFlashcardIndexById(flashcardArray ,flashcard)
    if(turnedFlashCard.Displaytext === turnedFlashCard.Question)
    {
        turnedFlashCard.Displaytext = turnedFlashCard.Answere;
        newArray[index] = turnedFlashCard
        return newArray;
    }
    else
    {
        turnedFlashCard.Displaytext = turnedFlashCard.Question;
        newArray[index] = turnedFlashCard
        return newArray;
    }
}

/**
 * Helpfunction to get a flashcard by id
 * @param {array} flashcardArray Array where the flashcard is stored
 * @param {int} id Id of the flashcard that has to be found
 * @returns Flashcard with given id
 */
function findFlashcardInArray(flashcardArray, id){
    return flashcardArray.find(flashcard => flashcard.Id === id)
}

/**
 * Helfunction to find the index of a flashcard in the given array
 * @param {array} flashcardArray Array where the flashcard is stored
 * @param {flashcard} flashcard Flashcard of which the index has to be found
 * @returns Index of the given flashcard
 */
function getFlashcardIndexById(flashcardArray, flashcard){
    let index = flashcardArray.findIndex(x => x.Id === flashcard.Id)
    return index;
}

/**
 * Used to set the status of a flashcards
 * @param {flashcard} flashcard Flashcard where the status has to be changed
 * @returns Flashcard with changed status
 */
function setFlashcardStatus(flashcard){
    let newFlashcard = {...flashcard}
    if(newFlashcard.Status === 0){
        newFlashcard.Status = 1
    }
    else{
        newFlashcard.Status = 0
    }
    return newFlashcard;
}

/**
 * Helpfunction to reset the stored flashcards status to 0
 * @param {array} flashcardArray Array that holds the flashcards
 * @returns Flashcard array with reset status of the flashcards
 */
function resetAllFlashcardStatus(flashcardArray){ 
    let newArray = [...flashcardArray];
    newArray.forEach(x => x.Status = 0);
    return newArray;
}

/**
 * Helpfunction to reload and sort a flashcard array
 * @param {array} flashcardArray 
 * @returns Sorted flashcard array
 */
function reloadFlashcardArray(flashcardArray){
    let tempFlashcardArray = [...flashcardArray];
    let sortedFlashcardArray = sortFlashcards(tempFlashcardArray);
    return sortedFlashcardArray;
}