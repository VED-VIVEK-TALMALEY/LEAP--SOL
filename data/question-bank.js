// ============================================
// QUESTION BANK - IELTS Practice Questions
// ============================================

export const questionBank = [
    // READING QUESTIONS
    {
        id: 'r_001',
        skill: 'reading',
        difficulty: 3,
        question: 'The word "ubiquitous" in the passage most nearly means:',
        options: ['Rare', 'Everywhere', 'Important', 'Dangerous'],
        correctAnswer: 'Everywhere',
        explanation: 'Ubiquitous means present, appearing, or found everywhere.',
        tags: ['vocabulary']
    },
    {
        id: 'r_002',
        skill: 'reading',
        difficulty: 5,
        question: 'According to the passage, what is the primary cause of climate change?',
        options: ['Natural cycles', 'Human activities', 'Solar radiation', 'Ocean currents'],
        correctAnswer: 'Human activities',
        explanation: 'The passage indicates that greenhouse gas emissions from human activities are the primary driver.',
        tags: ['comprehension']
    },
    {
        id: 'r_003',
        skill: 'reading',
        difficulty: 4,
        question: 'The author\'s tone in the passage can best be described as:',
        options: ['Optimistic', 'Critical', 'Neutral', 'Humorous'],
        correctAnswer: 'Critical',
        explanation: 'The author presents concerns and critiques current approaches.',
        tags: ['tone']
    },
    {
        id: 'r_004',
        skill: 'reading',
        difficulty: 6,
        question: 'Which statement would the author most likely agree with?',
        options: [
            'Technology alone can solve environmental issues',
            'Individual actions are more important than policy',
            'Systemic change requires both policy and behavior shifts',
            'Environmental concerns are overexaggerated'
        ],
        correctAnswer: 'Systemic change requires both policy and behavior shifts',
        explanation: 'The passage emphasizes the need for comprehensive approaches.',
        tags: ['inference']
    },
    {
        id: 'r_005',
        skill: 'reading',
        difficulty: 2,
        question: 'The word "mitigate" most closely means:',
        options: ['Worsen', 'Reduce', 'Ignore', 'Celebrate'],
        correctAnswer: 'Reduce',
        explanation: 'Mitigate means to make less severe or serious.',
        tags: ['vocabulary']
    },

    // WRITING QUESTIONS
    {
        id: 'w_001',
        skill: 'writing',
        difficulty: 4,
        question: 'Which sentence uses correct parallel structure?',
        options: [
            'She enjoys reading, to write, and painting',
            'She enjoys reading, writing, and painting',
            'She enjoys to read, writing, and to paint',
            'She enjoys reading, to write, and to paint'
        ],
        correctAnswer: 'She enjoys reading, writing, and painting',
        explanation: 'Parallel structure requires consistent grammatical forms (all gerunds here).',
        tags: ['grammar', 'structure']
    },
    {
        id: 'w_002',
        skill: 'writing',
        difficulty: 5,
        question: 'Which transition word best fits: "The study was thorough; ____, the conclusions were questionable."',
        options: ['Therefore', 'However', 'Furthermore', 'Similarly'],
        correctAnswer: 'However',
        explanation: '"However" indicates contrast between thorough study and questionable conclusions.',
        tags: ['cohesion']
    },
    {
        id: 'w_003',
        skill: 'writing',
        difficulty: 3,
        question: 'Identify the sentence with correct subject-verb agreement:',
        options: [
            'The team are playing well',
            'The team is playing well',
            'The team were playing well',
            'The team have playing well'
        ],
        correctAnswer: 'The team is playing well',
        explanation: 'Collective nouns like "team" take singular verbs in standard English.',
        tags: ['grammar']
    },
    {
        id: 'w_004',
        skill: 'writing',
        difficulty: 6,
        question: 'Which sentence demonstrates the most sophisticated vocabulary?',
        options: [
            'The problem is very big',
            'The issue is significant',
            'The challenge is substantial',
            'The predicament is formidable'
        ],
        correctAnswer: 'The predicament is formidable',
        explanation: '"Predicament" and "formidable" show advanced vocabulary range.',
        tags: ['vocabulary', 'lexical-resource']
    },
    {
        id: 'w_005',
        skill: 'writing',
        difficulty: 4,
        question: 'Which sentence uses the comma correctly?',
        options: [
            'After the meeting we went home',
            'After the meeting, we went home',
            'After, the meeting we went home',
            'After the meeting we, went home'
        ],
        correctAnswer: 'After the meeting, we went home',
        explanation: 'Introductory phrases should be followed by a comma.',
        tags: ['punctuation']
    },

    // LISTENING QUESTIONS
    {
        id: 'l_001',
        skill: 'listening',
        difficulty: 3,
        question: 'In a conversation about booking a hotel, what does "fully booked" mean?',
        options: ['Very expensive', 'No rooms available', 'Highly rated', 'Requires booking'],
        correctAnswer: 'No rooms available',
        explanation: '"Fully booked" means all rooms are reserved.',
        tags: ['vocabulary', 'context']
    },
    {
        id: 'l_002',
        skill: 'listening',
        difficulty: 4,
        question: 'A speaker says "I\'m in two minds about it." This means:',
        options: ['I\'m very confused', 'I\'m undecided', 'I disagree strongly', 'I have two ideas'],
        correctAnswer: 'I\'m undecided',
        explanation: 'This idiom means being uncertain or unable to decide.',
        tags: ['idioms']
    },
    {
        id: 'l_003',
        skill: 'listening',
        difficulty: 5,
        question: 'When someone says "That\'s beside the point," they mean:',
        options: [
            'That\'s exactly right',
            'That\'s not relevant',
            'That\'s an interesting point',
            'That\'s the main issue'
        ],
        correctAnswer: 'That\'s not relevant',
        explanation: 'This phrase indicates something is irrelevant to the discussion.',
        tags: ['idioms', 'comprehension']
    },
    {
        id: 'l_004',
        skill: 'listening',
        difficulty: 2,
        question: 'If a lecture mentions "pros and cons," it\'s discussing:',
        options: ['Professionals', 'Advantages and disadvantages', 'Conflicts', 'Conclusions'],
        correctAnswer: 'Advantages and disadvantages',
        explanation: '"Pros and cons" refers to positive and negative aspects.',
        tags: ['vocabulary']
    },
    {
        id: 'l_005',
        skill: 'listening',
        difficulty: 6,
        question: 'A speaker\'s tone is described as "tentative." This suggests they are:',
        options: ['Very confident', 'Uncertain or hesitant', 'Angry', 'Enthusiastic'],
        correctAnswer: 'Uncertain or hesitant',
        explanation: 'Tentative tone indicates lack of confidence or hesitation.',
        tags: ['tone', 'inference']
    },

    // SPEAKING QUESTIONS
    {
        id: 's_001',
        skill: 'speaking',
        difficulty: 3,
        question: 'Which response shows better fluency for "Describe your hometown"?',
        options: [
            'My hometown is... um... it\'s nice... very nice',
            'My hometown is a vibrant coastal city known for its beaches and culture',
            'Hometown... I have... it is good',
            'I come from a place'
        ],
        correctAnswer: 'My hometown is a vibrant coastal city known for its beaches and culture',
        explanation: 'This response is fluent, specific, and uses descriptive language.',
        tags: ['fluency', 'vocabulary']
    },
    {
        id: 's_002',
        skill: 'speaking',
        difficulty: 5,
        question: 'Which phrase demonstrates advanced linking words?',
        options: [
            'And then... and also...',
            'Moreover, furthermore, in addition to that',
            'So... and... but...',
            'Yes, no, maybe'
        ],
        correctAnswer: 'Moreover, furthermore, in addition to that',
        explanation: 'These are sophisticated cohesive devices for IELTS Speaking.',
        tags: ['cohesion']
    },
    {
        id: 's_003',
        skill: 'speaking',
        difficulty: 4,
        question: 'For the question "Do you prefer reading or watching TV?", which answer shows better development?',
        options: [
            'I prefer reading',
            'Reading is better',
            'I prefer reading because it stimulates imagination and improves vocabulary',
            'I like both'
        ],
        correctAnswer: 'I prefer reading because it stimulates imagination and improves vocabulary',
        explanation: 'This answer provides reasons and extends the response.',
        tags: ['development']
    },
    {
        id: 's_004',
        skill: 'speaking',
        difficulty: 6,
        question: 'Which response demonstrates the best use of complex grammar?',
        options: [
            'I go to the park yesterday',
            'I went to the park yesterday',
            'Had I known about the event, I would have attended',
            'I am going park'
        ],
        correctAnswer: 'Had I known about the event, I would have attended',
        explanation: 'This uses inverted conditional structure, showing grammatical range.',
        tags: ['grammar', 'complexity']
    },
    {
        id: 's_005',
        skill: 'speaking',
        difficulty: 4,
        question: 'Which phrase is most appropriate for expressing opinion in IELTS Speaking?',
        options: [
            'I think maybe...',
            'From my perspective, I believe that...',
            'I don\'t know but...',
            'Maybe yes maybe no'
        ],
        correctAnswer: 'From my perspective, I believe that...',
        explanation: 'This phrase is formal and shows confidence in expressing opinions.',
        tags: ['opinion', 'formality']
    },

    // Additional questions for variety
    {
        id: 'r_006',
        skill: 'reading',
        difficulty: 5,
        question: 'The passage suggests that renewable energy is:',
        options: [
            'Too expensive to implement',
            'A viable alternative to fossil fuels',
            'Only useful in certain climates',
            'Harmful to the environment'
        ],
        correctAnswer: 'A viable alternative to fossil fuels',
        explanation: 'The passage presents renewable energy as a practical solution.',
        tags: ['inference']
    },
    {
        id: 'w_006',
        skill: 'writing',
        difficulty: 5,
        question: 'Which sentence shows the most effective use of a complex sentence?',
        options: [
            'The rain stopped. We went outside.',
            'The rain stopped and we went outside.',
            'When the rain stopped, we went outside.',
            'Rain stopped, outside we went.'
        ],
        correctAnswer: 'When the rain stopped, we went outside.',
        explanation: 'This uses a subordinate clause effectively.',
        tags: ['grammar', 'complexity']
    },
    {
        id: 'l_006',
        skill: 'listening',
        difficulty: 4,
        question: 'If a speaker says "I\'ll get back to you on that," they mean:',
        options: [
            'I\'ll return your item',
            'I\'ll respond later',
            'I disagree with you',
            'I\'m going backwards'
        ],
        correctAnswer: 'I\'ll respond later',
        explanation: 'This phrase means they will provide information or an answer later.',
        tags: ['idioms']
    },
    {
        id: 's_006',
        skill: 'speaking',
        difficulty: 5,
        question: 'Which response best demonstrates paraphrasing skills?',
        options: [
            'Question: "Do you like sports?" Answer: "Yes, I like sports"',
            'Question: "Do you like sports?" Answer: "Indeed, I enjoy physical activities"',
            'Question: "Do you like sports?" Answer: "Sports, yes"',
            'Question: "Do you like sports?" Answer: "Maybe"'
        ],
        correctAnswer: 'Question: "Do you like sports?" Answer: "Indeed, I enjoy physical activities"',
        explanation: 'This paraphrases "like sports" as "enjoy physical activities".',
        tags: ['paraphrasing', 'vocabulary']
    },
    {
        id: 'r_007',
        skill: 'reading',
        difficulty: 3,
        question: 'The word "comprehensive" most nearly means:',
        options: ['Partial', 'Complete', 'Difficult', 'Simple'],
        correctAnswer: 'Complete',
        explanation: 'Comprehensive means thorough and complete.',
        tags: ['vocabulary']
    },
    {
        id: 'w_007',
        skill: 'writing',
        difficulty: 3,
        question: 'Which sentence correctly uses an apostrophe?',
        options: [
            'The dogs bone was buried',
            'The dog\'s bone was buried',
            'The dogs\' bone was buried',
            'The dog\'s\' bone was buried'
        ],
        correctAnswer: 'The dog\'s bone was buried',
        explanation: 'Singular possessive uses apostrophe before s.',
        tags: ['punctuation']
    },
    {
        id: 'l_007',
        skill: 'listening',
        difficulty: 3,
        question: 'When someone says "It\'s a piece of cake," they mean:',
        options: ['It\'s delicious', 'It\'s very easy', 'It\'s a dessert', 'It\'s expensive'],
        correctAnswer: 'It\'s very easy',
        explanation: 'This idiom means something is very easy to do.',
        tags: ['idioms']
    },
    {
        id: 's_007',
        skill: 'speaking',
        difficulty: 4,
        question: 'Which opening is most effective for Part 2 (long turn)?',
        options: [
            'Um... let me think...',
            'I\'d like to talk about...',
            'This is difficult...',
            'I don\'t know much but...'
        ],
        correctAnswer: 'I\'d like to talk about...',
        explanation: 'This is confident and immediately engages with the topic.',
        tags: ['structure', 'confidence']
    }
];

// Helper function to get questions by skill
export function getQuestionsBySkill(skill, count = 10) {
    const filtered = questionBank.filter(q => q.skill === skill);
    return shuffleArray(filtered).slice(0, count);
}

// Helper function to get questions by difficulty
export function getQuestionsByDifficulty(minDiff, maxDiff, count = 10) {
    const filtered = questionBank.filter(q => q.difficulty >= minDiff && q.difficulty <= maxDiff);
    return shuffleArray(filtered).slice(0, count);
}

// Helper function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get mixed questions for balanced practice
export function getMixedQuestions(count = 20) {
    const perSkill = Math.floor(count / 4);
    const questions = [
        ...getQuestionsBySkill('reading', perSkill),
        ...getQuestionsBySkill('writing', perSkill),
        ...getQuestionsBySkill('listening', perSkill),
        ...getQuestionsBySkill('speaking', perSkill)
    ];
    return shuffleArray(questions);
}
