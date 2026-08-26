const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Models
const Skill = require('./models/Skill');
const JobRole = require('./models/JobRole');
const Recommendation = require('./models/Recommendation');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const skills = [
  { name: 'HTML', category: 'Frontend' },
  { name: 'CSS', category: 'Frontend' },
  { name: 'JavaScript', category: 'Frontend' },
  { name: 'React', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'SQL', category: 'Database' },
  { name: 'Python', category: 'Backend' },
  { name: 'Java', category: 'Backend' },
  { name: 'Git', category: 'Tools' },
  { name: 'Docker', category: 'Tools' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Kubernetes', category: 'Tools' },
  { name: 'GraphQL', category: 'Backend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Vue.js', category: 'Frontend' },
  { name: 'CI/CD', category: 'Tools' },
  { name: 'Agile', category: 'Soft Skills' }
];

const importData = async () => {
  try {
    await Skill.deleteMany();
    await JobRole.deleteMany();
    await Recommendation.deleteMany();

    const createdSkills = await Skill.insertMany(skills);

    // Map skills by name for easy reference
    const skillMap = {};
    createdSkills.forEach((skill) => {
      skillMap[skill.name] = skill._id;
    });

    const jobRoles = [
      {
        roleName: 'Frontend Developer',
        description: 'Builds the user interface and user experience of web applications.',
        requiredSkills: [skillMap['HTML'], skillMap['CSS'], skillMap['JavaScript'], skillMap['React'], skillMap['Git']],
      },
      {
        roleName: 'Backend Developer',
        description: 'Develops server-side logic, databases, and APIs.',
        requiredSkills: [skillMap['Node.js'], skillMap['Express.js'], skillMap['MongoDB'], skillMap['SQL'], skillMap['Git']],
      },
      {
        roleName: 'Full Stack Developer',
        description: 'Handles both frontend and backend development.',
        requiredSkills: [skillMap['HTML'], skillMap['CSS'], skillMap['JavaScript'], skillMap['React'], skillMap['Node.js'], skillMap['Express.js'], skillMap['MongoDB'], skillMap['Git']],
      },
      {
        roleName: 'Data Scientist',
        description: 'Analyzes data for actionable insights.',
        requiredSkills: [skillMap['Python'], skillMap['SQL']],
      },
      {
        roleName: 'DevOps Engineer',
        description: 'Bridges the gap between development and operations.',
        requiredSkills: [skillMap['AWS'], skillMap['Docker'], skillMap['Kubernetes'], skillMap['CI/CD'], skillMap['Git']],
      },
      {
        roleName: 'Full Stack Next.js Developer',
        description: 'Develops modern full-stack applications using Next.js.',
        requiredSkills: [skillMap['TypeScript'], skillMap['React'], skillMap['Next.js'], skillMap['TailwindCSS'], skillMap['Node.js'], skillMap['GraphQL']],
      },
      {
        roleName: 'Cloud Architect',
        description: 'Designs and manages cloud infrastructure.',
        requiredSkills: [skillMap['AWS'], skillMap['Docker'], skillMap['Kubernetes'], skillMap['Python']],
      }
    ];

    // Filter out undefined skills (like TailwindCSS if not in list)
    jobRoles.forEach(job => {
        job.requiredSkills = job.requiredSkills.filter(skillId => skillId !== undefined);
    });

    await JobRole.insertMany(jobRoles);

    const recommendations = [
      { skillId: skillMap['React'], resourceTitle: 'React Official Documentation', resourceLink: 'https://reactjs.org/docs/getting-started.html', type: 'Article' },
      { skillId: skillMap['React'], resourceTitle: 'React Crash Course 2024', resourceLink: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', type: 'Video' },
      { skillId: skillMap['Node.js'], resourceTitle: 'Node.js Tutorial for Beginners', resourceLink: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', type: 'Video' },
      { skillId: skillMap['JavaScript'], resourceTitle: 'JavaScript Info', resourceLink: 'https://javascript.info/', type: 'Course' },
      { skillId: skillMap['JavaScript'], resourceTitle: 'JavaScript Full Course', resourceLink: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', type: 'Video' },
      { skillId: skillMap['Python'], resourceTitle: 'Python for Beginners', resourceLink: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', type: 'Video' },
      { skillId: skillMap['MongoDB'], resourceTitle: 'MongoDB Crash Course', resourceLink: 'https://www.youtube.com/watch?v=ofme2o29ngU', type: 'Video' },
      { skillId: skillMap['TypeScript'], resourceTitle: 'TypeScript Crash Course', resourceLink: 'https://www.youtube.com/watch?v=BCg4U1FzODs', type: 'Video' },
      { skillId: skillMap['AWS'], resourceTitle: 'AWS Certified Cloud Practitioner Training', resourceLink: 'https://www.youtube.com/watch?v=3hLmDS179YE', type: 'Video' },
      { skillId: skillMap['Docker'], resourceTitle: 'Docker Tutorial for Beginners', resourceLink: 'https://www.youtube.com/watch?v=pTFZFxd4hOI', type: 'Video' },
      { skillId: skillMap['Kubernetes'], resourceTitle: 'Kubernetes Tutorial for Beginners', resourceLink: 'https://www.youtube.com/watch?v=X48VuDVv0do', type: 'Video' },
      { skillId: skillMap['Next.js'], resourceTitle: 'Next.js App Router Crash Course', resourceLink: 'https://www.youtube.com/watch?v=ZmPh5pGq2mE', type: 'Video' },
      { skillId: skillMap['GraphQL'], resourceTitle: 'GraphQL Crash Course', resourceLink: 'https://www.youtube.com/watch?v=ZQL7tL2S0oQ', type: 'Video' },
      { skillId: skillMap['CI/CD'], resourceTitle: 'What is CI/CD?', resourceLink: 'https://www.youtube.com/watch?v=scEDHsr3APg', type: 'Video' },
      { skillId: skillMap['Git'], resourceTitle: 'Git & GitHub Crash Course for Beginners', resourceLink: 'https://www.youtube.com/watch?v=RGOj5yH7evk', type: 'Video' },
    ];

    // Filter out recommendations for skills that might be missing
    const validRecommendations = recommendations.filter(rec => rec.skillId !== undefined);

    await Recommendation.insertMany(validRecommendations);

    console.log('Data Imported successfully with new skills and YouTube links!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // destroyData(); // Can be implemented if needed
} else {
  importData();
}
