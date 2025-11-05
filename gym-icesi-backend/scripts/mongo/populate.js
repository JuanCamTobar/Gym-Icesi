require('dotenv').config();
const mongoose = require('mongoose');
const connectMongoDB = require('../../src/config/db.mongo');
const Exercise = require('../../src/models/mongo/Exercise');
const PredefinedRoutine = require('../../src/models/mongo/PredefinedRoutine');
const CustomRoutine = require('../../src/models/mongo/CustomRoutine');
const Event = require('../../src/models/mongo/Event');
const ProgressTracking = require('../../src/models/mongo/ProgressTracking');
const Recommendation = require('../../src/models/mongo/Recommendation');

const exercises = [
  {
    name: 'Press de Banca',
    type: 'Fuerza',
    description: 'Acuéstese en un banco plano, baje la barra hasta el pecho y luego empújela hacia arriba.',
    duration: '5-10 min',
    difficulty: 'Intermedio',
    video_url: 'https://www.youtube.com/watch?v=gRVjAtPip0Y',
  },
  {
    name: 'Sentadilla',
    type: 'Fuerza',
    description: 'Baje las caderas desde una posición de pie y luego vuelva a levantarse.',
    duration: '5-10 min',
    difficulty: 'Principiante',
    video_url: 'https://www.youtube.com/watch?v=aclHkV_2M3E',
  },
  {
    name: 'Correr en Cinta',
    type: 'Cardio',
    description: 'Correr en una cinta a un ritmo constante.',
    duration: '20-30 min',
    difficulty: 'Principiante',
    video_url: 'https://www.youtube.com/watch?v=gRVjAtPip0Y',
  },
];

const populate = async () => {
  try {
    await connectMongoDB();
    console.log('MongoDB connected');

    // Clear all MongoDB collections
    await Exercise.deleteMany();
    await PredefinedRoutine.deleteMany();
    await CustomRoutine.deleteMany();
    await Event.deleteMany();
    await ProgressTracking.deleteMany();
    await Recommendation.deleteMany();
    console.log('All MongoDB collections cleared');

    const createdExercises = await Exercise.insertMany(exercises);
    console.log('Exercises populated');

    const predefinedRoutines = [
      {
        name: 'Rutina de Fuerza para Principiantes',
        exercises: [createdExercises[0]._id, createdExercises[1]._id],
        difficulty: 'Principiante',
        description: 'Una rutina de fuerza para todo el cuerpo para principiantes.',
      },
    ];

    await PredefinedRoutine.insertMany(predefinedRoutines);
    console.log('Predefined Routines populated');

    console.log('MongoDB populated successfully!');
  } catch (error) {
    console.error('Error populating MongoDB:', error);
  } finally {
    mongoose.connection.close();
  }
};

populate();