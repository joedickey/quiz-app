/**
 * 
 * Technical requirements:
 * 
 * Your app should include a render() function, that regenerates the view each time the store is updated. 
 * See your course material and access support for more details.
 *
 * NO additional HTML elements should be added to the index.html file.
 *
 * You may add attributes (classes, ids, etc) to the existing HTML elements, or link stylesheets or additional scripts if necessary
 *
 * SEE BELOW FOR THE CATEGORIES OF THE TYPES OF FUNCTIONS YOU WILL BE CREATING 👇
 * 
 */

/********** TEMPLATE GENERATION FUNCTIONS **********/

// These functions return HTML templates

function generateStartScreenHtml() {
    //generates the html for the start screen
    return '<div class=container><div class=section><form><fieldset><p>This quiz will ask you questions about the history of American dance music.</p><div class="center"><button type="button" id="start">Start Quiz</button></div></fieldset></form></div></div>'
}

function generateQuestionNumberAndScoreHtml() {
    //generates html for question number and score counter
    return '<ul class="question-and-score"><li id="question-number">Question Number: ' + (STORE.currentQuestion + 1) + '/' + (STORE.questions.length) +'</li><li id="score">Score: ' + (STORE.score) + '/' + (STORE.questions.length) + '</li></ul>';
}

function generateAnswersHtml(){
    //generates answer options in question form
    const answersArray = STORE.questions[STORE.currentQuestion].answers;
    let answersHtml = '';
    let i = 0;

    answersArray.forEach(answer => {
        answersHtml += '<div id="option-container-'+ i +'"><input type="radio" name="options" id="option' + (i + 1) +'" value= "' + answer + '" tabindex ="' + (i + 1) + '" required> <label for="option' + (i + 1) + '">' + answer + '</label></div>';
        i++;
    });
    return answersHtml;
}

function generateQuestionHtml() {
    //generates html for the question view
    let currentQuestion = STORE.questions[STORE.currentQuestion];
    return '<div class=container><div class=section><form id="question-form" class="question-form"><fieldset><div class="question"><legend>' + currentQuestion.question + '</legend></div><div class="options"><div class="answers">' + generateAnswersHtml() + '</div></div><div class="center"><button type="submit" id="submit-answer-btn" tabindex="5">Submit</button><button type="button" id="next-question-btn" tabindex="6">Next</button></div></fieldset></form></div></div>'
}

function generateResultsScreen() {
    //generates results view at end of quiz
    return '<div class=container><div class=section><form id="js-restart-quiz"><fieldset><div class="center"><legend class="final-result">Your Score: ' + STORE.score + '/' + STORE.questions.length + '</legend></div><div class="row"><div class="center"><button type="button" id="restart">Restart Quiz</button></div></div></fieldset></form></div></div>'
}

function generateHtmlFeedback (answerStatus) {
    //gives the user feedback on their answer selection, receives 'answerStatus' perimeter string 'correct' or 'incorrect' from handleQuestionFormSubmission()
    let correctAnswer = STORE.questions[STORE.currentQuestion].correctAnswer;
    let html = '';
    if (answerStatus === 'correct'){
        html = '<div class="right-answer">Correct answer!</div>'
    }
    else if (answerStatus === 'incorrect') {
        html = '<div class="wrong-answer">That is incorrect. The correct answer is ' + correctAnswer + '.</div>'
    }
    return html;
}

/********** RENDER FUNCTION(S) **********/

// This function conditionally replaces the contents of the <main> tag based on the state of the store
function render(){
    let html = '';

    if(STORE.quizStarted === false) {
        $('main').html(generateStartScreenHtml());
        return;
    } 
    else if (STORE.currentQuestion >= 0 && STORE.currentQuestion < STORE.questions.length) {
        html = generateQuestionNumberAndScoreHtml();
        html += generateQuestionHtml();
        $('main').html(html);
    }
    else {
        $('main').html(generateResultsScreen());
    }
}

/********** EVENT HANDLER FUNCTIONS **********/

// These functions handle events (submit, click, etc)
function handleStartClick() {
    // starts quiz when clicked
    $('main').on('click', '#start', function(event) {
        STORE.quizStarted = true;
        render();
    });
}

function handleNextQuestionClick() {
    $('main').on('click', '#next-question-btn', function(event){
        render();
    })
}

function handleQuestionFormSubmission() {
    $('body').on('submit' , '#question-form', function(event){
        event.preventDefault();
        
        const currentQuestion = STORE.questions[STORE.currentQuestion];
        let selectedOption = $('input[name=options]:checked').val();
        // Identifying answer option div to append feedback via generateHtmlFeedback()
        let optionContainerId = '#option-container-' + (currentQuestion.answers.findIndex(i => i === selectedOption));
        
        if (selectedOption === currentQuestion.correctAnswer) {
            STORE.score++;
            $(optionContainerId).append(generateHtmlFeedback('correct'));
        }
        else {
            $(optionContainerId).append(generateHtmlFeedback('incorrect'));
        }
        STORE.currentQuestion++; //progresses to next question

        $('#submit-answer-btn').hide(); //removes submit option after answered
        $('input[type=radio]').each(()=> {
            $('input[type=radio]').attr('disabled', true); //disables selection of a different answer after submit
        });
        $('#next-question-btn').show(); //shows next button

    });
}

function resetQuizValues(){
    STORE.quizStarted = false;
    STORE.currentQuestion = 0;
    STORE.score = 0;
}

function handleRestartButtonClick(){
    $('body').on('click', '#restart', function(event){
        resetQuizValues();
        render();
    })
}


/********* DOCUMENT READY FUNCTIONS ********/
function handeleQuizApp() {
    render();
    handleStartClick();
    handleNextQuestionClick();
    handleQuestionFormSubmission();
    handleRestartButtonClick();
}

$(handeleQuizApp)