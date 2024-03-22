/*
Creates new Flashcards
Params:
Question --> Sets the Question of the Flashcard
Answere --> Sets the Answere of the Flashcard
id --> Sets the id of the flashcard, should be handled by System
*/
function createNewFlashcard(question, answere, id) {
   return newFlashcard = { Question: question, Answere: answere, Score: 0, Id: id, Displaytext: question, Status: 0}
}

/*
Used to edit Flashcards
Params:
flashcardArray --> Used to get the Array of the flashcards
flashcard --> flashcard to be modified
newQuestion --> modifies Qustion of the Flashcard
newAnswere --> modifies Answere of the Flashcard
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

/*
Used to replace a Flashcard in a flashcard Array
Params:
flashcardArray --> Used to get the Array of the flashcards
flashcard --> flashcard to be replaced
*/
function replaceFlashcard(flashcardArray, flashcard){
    let newArray = [...flashcardArray]
    let index = getFlashcardIndexById(flashcardArray ,flashcard)
    newArray[index] = flashcard;
    return newArray;
}

/*
Used to delete a Flashcard in a flashcard Array
Params:
flashcardArray --> Used to get the Array of the flashcards
flashcard --> flashcard to be deleted
*/
function deleteFlashcard(flashcardArray ,flashcard){
    let tempArray = [...flashcardArray];
    let index = getFlashcardIndexById(flashcardArray ,flashcard)
    tempArray.splice(index, 1)
    let newArray = sortFlashcards(tempArray)
    return newArray;
}

/*
Used to sort a flashcard Array from lowest to highest score
Params:
flashcardArray --> Used to get the Array of the flashcards
*/
function sortFlashcards(flashcardArray){
    let newArray = [...flashcardArray]
    newArray.sort((a, b) => a.Score - b.Score)
    return newArray
}

/*
Used to set Displaytext of Flashcard to Question or Answere
Params:
flashcardArray --> Used to get the Array of the flashcards
flashcard --> flashcard to be modified
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

/*
Used to find a Flashcard by id in a Flashcard Array
Params:
flashcardArray --> Used to get the Array of the flashcards
id --> id of the Flashcard to be found
*/
function findFlashcardInArray(flashcardArray, id){
    return flashcardArray.find(flashcard => flashcard.Id === id)
}

/*
Used to find the index of a Flashcard in a Flashcard Array
Params:
flashcardArray --> Used to get the Array of the flashcards
flashcard --> flashcard of which the index is to be found
*/
function getFlashcardIndexById(flashcardArray, flashcard){
    let index = flashcardArray.findIndex(x => x.Id === flashcard.Id)
    return index;
}

/*
Used to Set the status of a flashcard. 0 = Question side / 1 = Answere side 
Params:
flashcard --> flashcard of which the status is to be set
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

/*
Used to Set the status of all flashcards to 0 (question side). 0 = Question side / 1 = Answere side 
Params:
flashcardArray --> flashcard Array where the flashcard statuses have to be set
*/
function resetAllFlashcardStatus(flashcardArray){ 
    let newArray = [...flashcardArray];
    newArray.forEach(x => x.Status = 0);
    return newArray;
}