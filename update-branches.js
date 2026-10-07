const fs = require('fs');
const path = require('path');

const seedFile = path.join(__dirname, 'frontend/lib/credentials/seed-data.ts');
let content = fs.readFileSync(seedFile, 'utf8');

// Abhishek Kumar
content = content.replace(
  /name: "Abhishek Kumar",\s*email: "ananya@rvscet.ac.in",\s*program: "Bachelor of Technology \(B\.Tech\)",\s*branch: "Electronics & Communication Engineering"/g,
  `name: "Abhishek Kumar",\n    email: "ananya@rvscet.ac.in",\n    program: "Bachelor of Technology (B.Tech)",\n    branch: "Artifical Intelligence And Machine Learning"`
);
content = content.replace(
  /studentName: "Abhishek Kumar",\s*registrationNumber: "JUT-RVSCET-2023-ECE-027",\s*rollNumber: "23ECE027",\s*program: "B\.Tech",\s*branch: "Electronics & Communication Engineering"/g,
  `studentName: "Abhishek Kumar",\n    registrationNumber: "JUT-RVSCET-2023-ECE-027",\n    rollNumber: "23ECE027",\n    program: "B.Tech",\n    branch: "Artifical Intelligence And Machine Learning"`
);
// Make sure to also update the comment if needed
content = content.replace(
  /\(5th Semester B\.Tech ECE\)/g,
  "(5th Semester B.Tech AI & ML)"
);

// Ankit Kumar
content = content.replace(
  /name: "Ankit Kumar",\s*email: "aarav\.demo@rvscet\.ac\.in",\s*program: "B\.Tech Computer Science and Engineering",\s*branch: "Computer Science and Engineering"/g,
  `name: "Ankit Kumar",\n    email: "aarav.demo@rvscet.ac.in",\n    program: "B.Tech Electrical and Electronic Engineering",\n    branch: "Electrical and Electronic Engineering"`
);
content = content.replace(
  /studentName: "Ankit Kumar",\s*registrationNumber: "RVSCET-DEMO-017",\s*rollNumber: "25CSE017",\s*program: "B\.Tech",\s*branch: "Computer Science and Engineering"/g,
  `studentName: "Ankit Kumar",\n    registrationNumber: "RVSCET-DEMO-017",\n    rollNumber: "25CSE017",\n    program: "B.Tech",\n    branch: "Electrical and Electronic Engineering"`
);

fs.writeFileSync(seedFile, content, 'utf8');
console.log('Branches updated in seed-data.ts');
