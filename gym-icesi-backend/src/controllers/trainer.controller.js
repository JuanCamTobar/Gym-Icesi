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
      attributes: { exclude: ['password_hash'] },
      include: [Student, Employee]
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/trainer/assigned-students
// @desc    Get students assigned to the logged-in instructor
// @access  Private (Instructor only)
exports.getAssignedStudents = async (req, res) => {
  try {
    const instructorUsername = req.user.id;

    // 1. Find the User record for the logged-in instructor
    const instructorUser = await User.findOne({ where: { username: instructorUsername } });
    if (!instructorUser || instructorUser.role !== 'EMPLOYEE' || !instructorUser.employee_id) {
      return res.status(403).json({ msg: 'Not authorized: User is not an instructor' });
    }

    // 2. Find the Employee record for this instructor
    const instructorEmployee = await Employee.findByPk(instructorUser.employee_id);
    if (!instructorEmployee || instructorEmployee.employee_type !== 'Instructor') {
      return res.status(403).json({ msg: 'Not authorized: Employee is not an instructor type' });
    }

    // 3. Find the Trainer record associated with this Employee
    const trainer = await Trainer.findOne({ where: { employee_id: instructorEmployee.id } });
    if (!trainer) {
      return res.status(404).json({ msg: 'Trainer profile not found for this instructor' });
    }

    // 4. Find all User records (students) assigned to this Trainer
    const assignedStudents = await User.findAll({
      where: {
        trainerId: trainer.id,
        role: 'STUDENT',
      },
      attributes: { exclude: ['password_hash'] },
      include: [Student], // Include Student details
    });

    res.json(assignedStudents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};