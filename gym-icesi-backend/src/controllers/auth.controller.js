const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/postgres').User;
const Employee = require('../models/postgres').Employee; // Import Employee model

exports.register = async (req, res) => {
  const { name, email, password, role, department, program } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role,
      program,
    });

    let employeeType = null;
    if (user.role === 'EMPLOYEE' && user.employee_id) {
      const employee = await Employee.findByPk(user.employee_id);
      if (employee) {
        employeeType = employee.employee_type;
      }
    }

    const payload = {
      user: {
        id: user.username,
        role: user.role,
        employee_type: employeeType, // Include employee_type in payload
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    let employeeType = null;
    if (user.role === 'EMPLOYEE' && user.employee_id) {
      const employee = await Employee.findByPk(user.employee_id);
      if (employee) {
        employeeType = employee.employee_type;
      }
    }

    const payload = {
      user: {
        id: user.username,
        role: user.role,
        employee_type: employeeType, // Include employee_type in payload
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.username, email: user.email, role: user.role, employee_type: employeeType } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
