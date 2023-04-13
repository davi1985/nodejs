const express = require('express');

const app = express();

let courses = [
  { name: 'NodeJS' },
  { name: 'ReactJS' },
  { name: 'React Native' },
];

app.get('/courses', (req, res) => res.status(200).json(courses));

app.post('/courses', (req, res) => {
  const newCourse = { name: 'NextJS' };
  courses.push(newCourse);

  return res.status(201).json(newCourse);
});

app.put('/courses/:id', (req, res) => {
  const { id } = req.params;
  const courseIndex = courses.findIndex((_, index) => index === Number(id));

  courses[courseIndex] = { name: 'React JS' };

  return res.status(201).json(courses[courseIndex]);
});

app.delete('/courses/:id', (req, res) => {
  const { id } = req.params;
  const courseIndex = courses.findIndex((_, index) => index === Number(id));

  courses = courses.filter((_, index) => index !== Number(id));

  return res.status(201).json(courses);
});

app.listen(3000, () => console.log('Server is running'));
