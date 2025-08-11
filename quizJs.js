        document.addEventListener('DOMContentLoaded', function () {
            const urlParams = new URLSearchParams(window.location.search);
            const quizId = urlParams.get('id');

            const quizContainer = document.getElementById('quizContainer');
            const scoreContainer = document.getElementById('scoreContainer');
            const quizTitleEl = document.getElementById('quizTitle');
            const questionsListEl = document.getElementById('questionsList');
            const takeQuizForm = document.getElementById('takeQuizForm');
            const resultsContentEl = document.getElementById('resultsContent');
            const messageBox = document.getElementById('messageBox');
            const messageText = document.getElementById('messageText');

            const storedQuizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
            const quiz = storedQuizzes.find(q => String(q.id) === String(quizId));

            if (quiz) {
                quizTitleEl.textContent = quiz.title || "Untitled Quiz";
                quizContainer.style.display = 'block';
                renderQuiz(quiz);
            } else {
                messageText.textContent = 'Error: Quiz not found.';
                messageBox.style.display = 'block';
            }

            function renderQuiz(quizData) {
                questionsListEl.innerHTML = '';
                quizData.questions.forEach((question, index) => {
                    const qId = question.id || index;
                    const answers = question.answers || [];
                    const questionBlock = document.createElement('div');
                    questionBlock.className = 'question-block';

                    questionBlock.innerHTML = `
                <h3>Question ${index + 1}: ${question.text || ''}</h3>
                ${answers.map(answer => `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="question-${qId}" 
                            id="q${qId}ans${answer.option}" 
                            value="${answer.option}" required>
                        <label class="form-check-label" for="q${qId}ans${answer.option}">
                            ${answer.option}. ${answer.text}
                        </label>
                    </div>
                `).join('')}
            `;
                    questionsListEl.appendChild(questionBlock);
                });
            }

            takeQuizForm.addEventListener('submit', function (event) {
                event.preventDefault();
                let score = 0;
                const totalQuestions = quiz.questions.length;
                const userAnswers = {};

                quiz.questions.forEach((question, index) => {
                    const qId = question.id || index;
                    const selectedOption = document.querySelector(`input[name="question-${qId}"]:checked`);
                    if (selectedOption) {
                        userAnswers[qId] = selectedOption.value;
                    }
                });

                if (Object.keys(userAnswers).length < totalQuestions) {
                    alert('Please answer all questions before submitting.');
                    return;
                }

                quiz.questions.forEach((question, index) => {
                    const qId = question.id || index;
                    if (userAnswers[qId] === question.correctAnswer) {
                        score++;
                    }
                });

                quizContainer.style.display = 'none';
                scoreContainer.style.display = 'block';
                displayResults(score, totalQuestions, quiz);
            });

            function displayResults(score, total, quizData) {
                let resultsHtml = `<p>You scored <strong>${score} out of ${total}</strong>!</p>`;
                resultsHtml += '<hr class="my-4"><h4>Review your answers:</h4>';

                quizData.questions.forEach((question, index) => {
                    const qId = question.id || index;
                    const selectedOption = document.querySelector(`input[name="question-${qId}"]:checked`);
                    const userAnswer = selectedOption ? selectedOption.value : 'Not answered';
                    const isCorrect = userAnswer === question.correctAnswer;
                    const alertClass = isCorrect ? 'alert-success' : 'alert-danger';

                    resultsHtml += `
                <div class="alert ${alertClass} mb-3" role="alert">
                    <strong>Question ${index + 1}:</strong> ${question.text}
                    <br>
                    Your Answer: <strong>${userAnswer}</strong>
                    <br>
                    Correct Answer: <strong>${question.correctAnswer}</strong>
                </div>
            `;
                });

                resultsContentEl.innerHTML = resultsHtml;
            }
        }); 
