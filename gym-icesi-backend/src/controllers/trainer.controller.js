const { Trainer, User, Employee, Faculty, Campus, Student } = require('../models/postgres');
const { sequelize } = require('../config/db.postgres');

// Get all trainers (employees with type 'Instructor')
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await sequelize.query(
      `SELECT 
        e.*, 
        t.id AS trainer_uuid,
        f.name AS "Faculty.name", 
        c.name AS "Campus.name"
      FROM 
        employees e
      LEFT JOIN
        trainers t ON e.id = t.employee_id
      LEFT JOIN 
        faculties f ON e.faculty_code = f.code
      LEFT JOIN 
        campuses c ON e.campus_code = c.code
      WHERE 
        e.employee_type = 'Instructor'`,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.json(trainers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get users assigned to a trainer
exports.getTrainerUsers = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) {
      return res.status(404).json({ msg: 'Trainer not found' });
    }

    const users = await User.findAll({ 
      where: { trainerId: req.params.id }, 
      attributes: { exclude: ['password'] },
      include: [Student, Employee]
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};