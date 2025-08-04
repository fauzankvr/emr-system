// import { Diagnosis } from '../models/diagnosis.model';
// import { Frequency } from '../models/frequency.model';
// import { Instruction } from '../models/instruction.model';
// import { Days } from '../models/days.model';

// export const seedInitialData = async () => {
//   try {
//     // Seed Diagnoses
//     const diagnoses = [
//       { name: 'Abdominal Pain' },
//       { name: 'Acute Bronchitis' },
//       { name: 'Hypertension' },
//       { name: 'Diabetes Mellitus' },
//       { name: 'Migraine' },
//       { name: 'Depression' },
//       { name: 'Asthma' },
//       { name: 'Osteoarthritis' },
//       { name: 'Gastritis' },
//       { name: 'Anxiety Disorder' }
//     ];

//     for (const diagnosis of diagnoses) {
//       await Diagnosis.findOneAndUpdate(
//         { name: diagnosis.name },
//         diagnosis,
//         { upsert: true, new: true }
//       );
//     }

//     // Seed Frequencies
//     const frequencies = [
//       { name: 'Once daily (Morning)' },
//       { name: 'Once daily (Afternoon)' },
//       { name: 'Once daily (Night)' },
//       { name: 'Twice daily (Morning & Afternoon)' },
//       { name: 'Twice daily (Morning & Night)' },
//       { name: 'Twice daily (Afternoon & Night)' },
//       { name: 'Three times daily' },
//       { name: 'As needed (SOS)' },
//       { name: 'Immediately (STAT)' },
//       { name: 'Four times daily' }
//     ];

//     for (const frequency of frequencies) {
//       await Frequency.findOneAndUpdate(
//         { code: frequency},
//         frequency,
//         { upsert: true, new: true }
//       );
//     }

//     // Seed Instructions
//     const instructions = [
//       { name: 'Before food' },
//       { name: 'After food' },
//       { name: 'With food' },
//       { name: 'Empty stomach' },
//       { name: 'With plenty of water' },
//       { name: 'Avoid dairy products' },
//       { name: 'Avoid alcohol' },
//       { name: 'Take with milk' },
//       { name: 'Sublingual' },
//       { name: 'Topical application' }
//     ];

//     for (const instruction of instructions) {
//       await Instruction.findOneAndUpdate(
//         { name: instruction.name },
//         instruction,
//         { upsert: true, new: true }
//       );
//     }

//     // Seed Days
//     const days = [
//       { name: '1 Day' },
//       { name: '3 Days' },
//       { name: '5 Days' },
//       { name: '7 Days' },
//       { name: '10 Days' },
//       { name: '14 Days' },
//       { name: '21 Days' },
//       { name: '30 Days' },
//       { name: '1 Week' },
//       { name: '2 Weeks' },
//       { name: '1 Month' },
//       { name: '3 Months' }
//     ];

//     for (const day of days) {
//       await Days.findOneAndUpdate(
//         { name: day.name },
//         day,
//         { upsert: true, new: true }
//       );
//     }

//     console.log('✅ Database seeded successfully!');
//   } catch (error) {
//     console.error('❌ Error seeding database:', error);
//   }
// }; 