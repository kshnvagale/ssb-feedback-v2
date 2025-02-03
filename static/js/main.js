// Dark mode toggle
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

// Handle theme switch
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);

// Create ratings table
function createRatingsTable(ratings, title) {
    const table = document.createElement('table');
    table.className = 'ratings-table';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Parameter', 'Rating'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    Object.entries(ratings).forEach(([param, rating]) => {
        const row = document.createElement('tr');
        const paramCell = document.createElement('td');
        const ratingCell = document.createElement('td');
        
        paramCell.textContent = param;
        ratingCell.textContent = rating;
        
        row.appendChild(paramCell);
        row.appendChild(ratingCell);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    
    const container = document.createElement('div');
    const heading = document.createElement('h2');
    heading.textContent = title;
    container.appendChild(heading);
    container.appendChild(table);
    
    return container;
}

// Create feedback section
function createFeedbackSection(data, title) {
    const section = document.createElement('div');
    section.className = 'feedback-section';
    
    const heading = document.createElement('h2');
    heading.textContent = title;
    section.appendChild(heading);
    
    Object.entries(data).forEach(([param, feedback]) => {
        const paramSection = document.createElement('div');
        paramSection.className = 'parameter-section';
        
        const paramHeading = document.createElement('h3');
        paramHeading.textContent = param;
        paramSection.appendChild(paramHeading);
        
        if (feedback.Notes) {
            const notes = document.createElement('div');
            notes.className = 'feedback-notes';
            notes.innerHTML = `<strong>Notes:</strong><br>${feedback.Notes}`;
            paramSection.appendChild(notes);
        }
        
        if (feedback['Good Parts']) {
            const goodParts = document.createElement('div');
            goodParts.className = 'good-parts';
            goodParts.innerHTML = `<strong>Good Parts:</strong><br>${feedback['Good Parts']}`;
            paramSection.appendChild(goodParts);
        }
        
        if (feedback['Bad Parts']) {
            const badParts = document.createElement('div');
            badParts.className = 'bad-parts';
            badParts.innerHTML = `<strong>Bad Parts:</strong><br>${feedback['Bad Parts']}`;
            paramSection.appendChild(badParts);
        }
        
        section.appendChild(paramSection);
    });
    
    return section;
}

// Parse feedback content
function parseFeedback(content) {
    const lines = content.split('\n');
    let currentSection = '';
    let currentParam = '';
    const feedback = {
        finalDecision: '',
        evaluationRatings: {},
        questionRatings: {},
        evaluationFeedback: {},
        questionFeedback: {}
    };
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === 'Feedback') {
            continue;
        }
        
        if (line === 'Final Decision') {
            feedback.finalDecision = lines[i + 1].trim();
            i++;
            continue;
        }
        
        if (line === 'Evaluation Parameters Ratings') {
            currentSection = 'evaluationRatings';
            continue;
        }
        
        if (line === 'Question Answers Ratings') {
            currentSection = 'questionRatings';
            continue;
        }
        
        if (line === 'Detailed Feedback on Evaluation Parameters') {
            currentSection = 'evaluationFeedback';
            continue;
        }
        
        if (line === 'Detailed Feedback on Question Answers') {
            currentSection = 'questionFeedback';
            continue;
        }
        
        // Parse ratings
        if (line.includes(':')) {
            const [param, value] = line.split(':').map(s => s.trim());
            if (currentSection === 'evaluationRatings' || currentSection === 'questionRatings') {
                feedback[currentSection][param] = value;
            }
        }
        
        // Parse detailed feedback
        if (currentSection === 'evaluationFeedback' || currentSection === 'questionFeedback') {
            if (!line.includes(':') && line !== '') {
                currentParam = line;
                feedback[currentSection][currentParam] = {
                    Notes: '',
                    'Good Parts': '',
                    'Bad Parts': ''
                };
            } else if (line.startsWith('Notes')) {
                i++;
                let notes = '';
                while (i < lines.length && lines[i].trim() !== '' && 
                       !lines[i].includes('Good Parts') && 
                       !lines[i].startsWith('Bad Parts')) {
                    notes += lines[i].trim() + ' ';
                    i++;
                }
                i--;
                if (currentParam) feedback[currentSection][currentParam].Notes = notes.trim();
            } else if (line.startsWith('Good Parts')) {
                i++;
                let goodParts = '';
                while (i < lines.length && lines[i].trim() !== '' && 
                       !lines[i].includes('Bad Parts') && 
                       !lines[i].startsWith('Notes')) {
                    goodParts += lines[i].trim() + ' ';
                    i++;
                }
                i--;
                if (currentParam) feedback[currentSection][currentParam]['Good Parts'] = goodParts.trim();
            } else if (line.startsWith('Bad Parts')) {
                i++;
                let badParts = '';
                while (i < lines.length && lines[i].trim() !== '' && 
                       !lines[i].startsWith('Notes') &&
                       !lines[i].includes('Good Parts')) {
                    badParts += lines[i].trim() + ' ';
                    i++;
                }
                i--;
                if (currentParam) feedback[currentSection][currentParam]['Bad Parts'] = badParts.trim();
            }
        }
    }
    
    return feedback;
}

// Handle feedback display
function displayFeedback(feedback) {
    const feedbackHtml = parseFeedback(feedback);
    
    // Display final decision
    const finalDecisionDiv = document.getElementById('final-decision');
    finalDecisionDiv.innerHTML = '';
    const decisionElement = document.createElement('div');
    decisionElement.className = 'final-decision';
    decisionElement.innerHTML = `<h2>Final Decision</h2><p>${feedbackHtml.finalDecision}</p>`;
    finalDecisionDiv.appendChild(decisionElement);
    
    // Display ratings
    const evaluationRatingsDiv = document.getElementById('evaluation-ratings');
    const questionRatingsDiv = document.getElementById('question-ratings');
    evaluationRatingsDiv.innerHTML = '';
    questionRatingsDiv.innerHTML = '';
    
    evaluationRatingsDiv.appendChild(createRatingsTable(feedbackHtml.evaluationRatings, 'Evaluation Parameters'));
    questionRatingsDiv.appendChild(createRatingsTable(feedbackHtml.questionRatings, 'Question Answers'));
    
    // Display detailed feedback
    const evaluationFeedbackDiv = document.getElementById('evaluation-feedback');
    const questionFeedbackDiv = document.getElementById('question-feedback');
    evaluationFeedbackDiv.innerHTML = '';
    questionFeedbackDiv.innerHTML = '';
    
    evaluationFeedbackDiv.appendChild(createFeedbackSection(feedbackHtml.evaluationFeedback, 'Evaluation Parameters Feedback'));
    questionFeedbackDiv.appendChild(createFeedbackSection(feedbackHtml.questionFeedback, 'Question Answers Feedback'));
}

// Handle form submission
function getFeedback() {
    const email = document.getElementById('email').value.trim();
    const feedbackContainer = document.getElementById('feedback-container');
    const errorMessage = document.getElementById('error-message');
    const loading = document.getElementById('loading');
    
    if (!email) {
        errorMessage.textContent = 'Please enter an email address';
        return;
    }
    
    // Show loading state
    loading.style.display = 'block';
    feedbackContainer.style.display = 'none';
    errorMessage.textContent = '';
    
    // Make API request
    fetch('/get_feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        loading.style.display = 'none';
        if (data.error) {
            errorMessage.textContent = data.error;
            feedbackContainer.style.display = 'none';
        } else {
            displayFeedback(data.feedback);
            feedbackContainer.style.display = 'block';
            errorMessage.textContent = '';
        }
    })
    .catch(error => {
        loading.style.display = 'none';
        errorMessage.textContent = 'An error occurred. Please try again.';
        feedbackContainer.style.display = 'none';
    });
}

// Event listeners
document.getElementById('email').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getFeedback();
    }
});

document.getElementById('viewFeedback').addEventListener('click', getFeedback);
