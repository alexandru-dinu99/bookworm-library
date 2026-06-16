import { v4 as uuidv4 } from 'uuid'
import { CvContent } from './model'

export const SEED_CV: CvContent = {
  schemaVersion: 1,
  personal: {
    fullName: 'Alexandru Ionescu',
    title: 'Senior Software Engineer',
    email: 'alex.ionescu@example.com',
    phone: '+40 721 234 567',
    location: 'București, România',
    links: [
      { label: 'LinkedIn', url: 'linkedin.com/in/alexionescu' },
      { label: 'GitHub', url: 'github.com/alexionescu' },
    ],
  },
  summary:
    'Software engineer with 6+ years of experience building scalable mobile and web applications. ' +
    'Passionate about clean architecture, developer experience, and shipping products that users love. ' +
    'Fluent in Română, Engleză, and Deutsch.',
  experience: [
    {
      id: uuidv4(),
      role: 'Senior Android Engineer',
      company: 'TechCorp GmbH',
      location: 'Berlin, Deutschland',
      start: 'Mar 2022',
      end: '',
      current: true,
      bullets: [
        'Led a cross-functional team of 5 engineers to redesign the checkout flow, reducing drop-off by 18%.',
        'Migrated the codebase from MVP to MVI with Jetpack Compose, cutting the UI bug rate by 40%.',
        'Introduced snapshot testing pipeline, shrinking regression cycles from 2 days to 3 hours.',
      ],
    },
    {
      id: uuidv4(),
      role: 'Android Developer',
      company: 'StartupRO',
      location: 'Cluj-Napoca, România',
      start: 'Jun 2019',
      end: 'Feb 2022',
      current: false,
      bullets: [
        'Built the initial Android app from scratch; reached 50k downloads in the first 6 months.',
        'Integrated REST API and local Room database with an offline-first sync strategy.',
      ],
    },
  ],
  education: [
    {
      id: uuidv4(),
      degree: 'B.Sc. Computer Science',
      institution: 'Universitatea Babeș-Bolyai',
      location: 'Cluj-Napoca, România',
      start: '2015',
      end: '2019',
      notes: 'Thesis: Efficient Graph Traversal on Mobile Devices',
    },
  ],
  skills: [
    { id: uuidv4(), category: 'Mobile', items: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'Room', 'Coroutines / Flow'] },
    { id: uuidv4(), category: 'Web', items: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'] },
    { id: uuidv4(), category: 'Tools', items: ['Git', 'CI/CD', 'Figma', 'Jira'] },
  ],
  languages: [
    { id: uuidv4(), language: 'Română', level: 'Nativ' },
    { id: uuidv4(), language: 'Engleză', level: 'C1 – Avansat' },
    { id: uuidv4(), language: 'Deutsch', level: 'B2 – Avansat' },
  ],
  customSections: [],
}
