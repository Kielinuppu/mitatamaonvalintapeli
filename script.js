document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const endScreen = document.getElementById('endScreen');
    const startButton = document.getElementById('startButton');
    const playAgainButton = document.getElementById('playAgainButton');
    const question = document.getElementById('question');
    const nalleImage = document.getElementById('nalleImage');
    const trueButton = document.getElementById('trueButton');
    const falseButton = document.getElementById('falseButton');
    const stars = document.getElementById('stars');
    const finalStars = document.getElementById('finalStars');
    const finalFeedback = document.getElementById('finalFeedback');
    const scoreText = document.getElementById('scoreText');
    const nextArrow = document.getElementById('nextArrow');
    const speakerIcon = document.getElementById('speakerIcon');

    const statements = [
        { text: "HAME ON TEHTY KANKAASTA.", imageId: 1, correct: true },
        { text: "HAME ON TEHTY PAPERISTA.", imageId: 1, correct: false },
        { text: "JUOMALASI ON TEHTY LASISTA.", imageId: 2, correct: true },
        { text: "JUOMALASI ON TEHTY PUUSTA.", imageId: 2, correct: false },
        { text: "KATTILA ON TEHTY METALLISTA.", imageId: 3, correct: true },
        { text: "KATTILA ON TEHTY MUOVISTA.", imageId: 3, correct: false },
        { text: "KÄSIPYYHE ON TEHTY KANKAASTA.", imageId: 4, correct: true },
        { text: "KÄSIPYYHE ON TEHTY KIVESTÄ.", imageId: 4, correct: false },
        { text: "PIKKUAUTO ON TEHTY KIVESTÄ.", imageId: 5, correct: false },
        { text: "PIKKUAUTO ON TEHTY METALLISTA.", imageId: 5, correct: true },
        { text: "SANOMALEHTI ON TEHTY MUOVISTA.", imageId: 6, correct: false },
        { text: "SANOMALEHTI ON TEHTY PAPERISTA.", imageId: 6, correct: true },
        { text: "TISKIHARJA ON TEHTY MUOVISTA.", imageId: 7, correct: true },
        { text: "TISKIHARJA ON TEHTY PAPERISTA.", imageId: 7, correct: false },
        { text: "TUOLI ON TEHTY KIVESTÄ.", imageId: 8, correct: false },
        { text: "TUOLI ON TEHTY PUUSTA.", imageId: 8, correct: true }
    ];

    let currentRound = 0;
    let score = 0;
    let gameQuestions = [];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function generateQuestions() {
        let questions = [];
        let selectedItems = new Set();
        
        while (questions.length < 2) {
            let statement = statements[Math.floor(Math.random() * statements.length)];
            if (statement.correct && !selectedItems.has(statement.imageId)) {
                questions.push(statement);
                selectedItems.add(statement.imageId);
            }
        }
        
        let shuffledStatements = [...statements];
        shuffleArray(shuffledStatements);
        
        for (let statement of shuffledStatements) {
            if (questions.length >= 5) break;
            if (!questions.some(q => q.imageId === statement.imageId)) {
                questions.push(statement);
                selectedItems.add(statement.imageId);
            }
        }
        
        shuffleArray(questions);
        return questions;
    }

    function startGame() {
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        currentRound = 0;
        score = 0;
        stars.innerHTML = '';
        gameQuestions = generateQuestions();
        loadQuestionContent(gameQuestions[currentRound]);
        playAudio('avaiv.mp3', () => {
            playQuestionAudio();
        });
    }

    function loadQuestionContent(questionObj) {
        nalleImage.src = `kuva${questionObj.imageId}.png`;
        nalleImage.style.display = 'block';
        question.textContent = questionObj.text;
        nextArrow.classList.add('hidden');
        trueButton.disabled = false;
        falseButton.disabled = false;
    }

    function playQuestionAudio() {
        const audioIndex = statements.findIndex(s => 
            s.text === gameQuestions[currentRound].text) + 1;
        playAudio(`aani${audioIndex}.mp3`);
    }

    function nextQuestion() {
        if (currentRound < 4) {
            currentRound++;
            loadQuestionContent(gameQuestions[currentRound]);
            playQuestionAudio();
        } else {
            endGame();
        }
    }

    function checkAnswer(isTrue) {
        const correctAnswer = gameQuestions[currentRound].correct;
        if (isTrue === correctAnswer) {
            score++;
            playAudio('oikein.mp3');
            addStar();
        } else {
            playAudio('vaarin.mp3');
        }
        trueButton.disabled = true;
        falseButton.disabled = true;
        if (currentRound < 4) {
            nextArrow.classList.remove('hidden');
        } else {
            setTimeout(endGame, 1000);
        }
    }

    function addStar() {
        const star = document.createElement('img');
        star.src = 'tahti.png';
        star.classList.add('star');
        stars.appendChild(star);
    }

    function endGame() {
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        finalStars.innerHTML = '';
        for (let i = 0; i < score; i++) {
            const star = document.createElement('img');
            star.src = 'tahti.png';
            star.classList.add('star');
            finalStars.appendChild(star);
        }
        finalFeedback.textContent = 'HIENOA!';
        scoreText.textContent = `${score}/5 OIKEIN`;
    }

    function playAudio(filename, callback) {
        const audio = new Audio(filename);
        audio.play();
        if (callback) {
            audio.onended = callback;
        }
    }

    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
    trueButton.addEventListener('click', () => checkAnswer(true));
    falseButton.addEventListener('click', () => checkAnswer(false));
    nextArrow.addEventListener('click', nextQuestion);
    speakerIcon.addEventListener('click', playQuestionAudio);
});