// ============================================
// COLLEGE DATABASE - Universities & Requirements
// ============================================

export const collegeDatabase = [
    {
        id: 'college_001',
        name: 'University of Toronto',
        country: 'Canada',
        logo: '🍁',
        courses: [
            {
                id: 'course_001',
                name: 'MS Computer Science',
                level: 'Masters',
                ieltsRequirement: { overall: 7.0, writing: 6.5, reading: 6.5, listening: 6.5, speaking: 6.5 },
                deadline: '2026-03-15',
                admitTrends: { avgIELTS: 7.5, acceptanceRate: 0.15 }
            },
            {
                id: 'course_002',
                name: 'MBA',
                level: 'Masters',
                ieltsRequirement: { overall: 7.5, writing: 7.0, reading: 6.5, listening: 6.5, speaking: 7.0 },
                deadline: '2026-04-01',
                admitTrends: { avgIELTS: 8.0, acceptanceRate: 0.12 }
            }
        ]
    },
    {
        id: 'college_002',
        name: 'University of Melbourne',
        country: 'Australia',
        logo: '🦘',
        courses: [
            {
                id: 'course_003',
                name: 'MS Data Science',
                level: 'Masters',
                ieltsRequirement: { overall: 6.5, writing: 6.0, reading: 6.0, listening: 6.0, speaking: 6.0 },
                deadline: '2026-05-31',
                admitTrends: { avgIELTS: 7.0, acceptanceRate: 0.25 }
            }
        ]
    },
    {
        id: 'college_003',
        name: 'Imperial College London',
        country: 'UK',
        logo: '🇬🇧',
        courses: [
            {
                id: 'course_004',
                name: 'MS Artificial Intelligence',
                level: 'Masters',
                ieltsRequirement: { overall: 7.0, writing: 6.5, reading: 6.5, listening: 6.5, speaking: 6.5 },
                deadline: '2026-01-15',
                admitTrends: { avgIELTS: 7.5, acceptanceRate: 0.10 }
            }
        ]
    },
    {
        id: 'college_004',
        name: 'Stanford University',
        country: 'USA',
        logo: '🇺🇸',
        courses: [
            {
                id: 'course_005',
                name: 'MS Computer Science',
                level: 'Masters',
                ieltsRequirement: { overall: 7.0, writing: 6.5, reading: 6.5, listening: 6.5, speaking: 6.5 },
                deadline: '2026-12-15',
                admitTrends: { avgIELTS: 8.0, acceptanceRate: 0.05 }
            }
        ]
    },
    {
        id: 'college_005',
        name: 'ETH Zurich',
        country: 'Switzerland',
        logo: '🇨🇭',
        courses: [
            {
                id: 'course_006',
                name: 'MS Robotics',
                level: 'Masters',
                ieltsRequirement: { overall: 7.0, writing: 6.5, reading: 6.5, listening: 6.5, speaking: 6.5 },
                deadline: '2026-12-01',
                admitTrends: { avgIELTS: 7.5, acceptanceRate: 0.18 }
            }
        ]
    },
    {
        id: 'college_006',
        name: 'National University of Singapore',
        country: 'Singapore',
        logo: '🇸🇬',
        courses: [
            {
                id: 'course_007',
                name: 'MS Business Analytics',
                level: 'Masters',
                ieltsRequirement: { overall: 6.5, writing: 6.0, reading: 6.0, listening: 6.0, speaking: 6.0 },
                deadline: '2026-02-28',
                admitTrends: { avgIELTS: 7.0, acceptanceRate: 0.20 }
            }
        ]
    },
    {
        id: 'college_007',
        name: 'Technical University of Munich',
        country: 'Germany',
        logo: '🇩🇪',
        courses: [
            {
                id: 'course_008',
                name: 'MS Mechanical Engineering',
                level: 'Masters',
                ieltsRequirement: { overall: 6.5, writing: 6.0, reading: 6.0, listening: 6.0, speaking: 6.0 },
                deadline: '2026-05-15',
                admitTrends: { avgIELTS: 7.0, acceptanceRate: 0.22 }
            }
        ]
    },
    {
        id: 'college_008',
        name: 'University of British Columbia',
        country: 'Canada',
        logo: '🍁',
        courses: [
            {
                id: 'course_009',
                name: 'MS Environmental Science',
                level: 'Masters',
                ieltsRequirement: { overall: 6.5, writing: 6.0, reading: 6.5, listening: 6.0, speaking: 6.0 },
                deadline: '2026-01-31',
                admitTrends: { avgIELTS: 7.0, acceptanceRate: 0.28 }
            }
        ]
    }
];

// Helper functions
export function getCollegeById(id) {
    return collegeDatabase.find(c => c.id === id);
}

export function getCollegesByCountry(country) {
    return collegeDatabase.filter(c => c.country === country);
}

export function getCourseById(courseId) {
    for (const college of collegeDatabase) {
        const course = college.courses.find(c => c.id === courseId);
        if (course) {
            return { ...course, college };
        }
    }
    return null;
}

export function getCoursesMatchingIELTS(ieltsScore) {
    const matching = [];

    for (const college of collegeDatabase) {
        for (const course of college.courses) {
            const req = course.ieltsRequirement;
            if (ieltsScore.overall >= req.overall &&
                ieltsScore.writing >= req.writing &&
                ieltsScore.reading >= req.reading &&
                ieltsScore.listening >= req.listening &&
                ieltsScore.speaking >= req.speaking) {
                matching.push({ ...course, college });
            }
        }
    }

    return matching;
}

export function getUpcomingDeadlines(daysAhead = 90) {
    const now = new Date();
    const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    const upcoming = [];

    for (const college of collegeDatabase) {
        for (const course of college.courses) {
            const deadline = new Date(course.deadline);
            if (deadline >= now && deadline <= future) {
                upcoming.push({
                    ...course,
                    college,
                    daysUntil: Math.ceil((deadline - now) / (24 * 60 * 60 * 1000))
                });
            }
        }
    }

    return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
}
