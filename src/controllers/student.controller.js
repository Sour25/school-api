import db from '../models/index.js';

/**
 * Utility to build Sequelize query options for pagination, sorting, and eager loading.
 */
function buildQueryOptions(query = {}) {
  // Pagination
  const limit = Math.max(parseInt(query.limit) || 10, 1);
  const page = Math.max(parseInt(query.page) || 1, 1);
  const offset = (page - 1) * limit;

  // Sorting
  const sortDir = (query.sort || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const order = [['createdAt', sortDir]];

  // Eager loading
  const include = [];
  if (query.populate) {
    const relations = query.populate.split(',').map(r => r.trim().toLowerCase());
    if (relations.includes('course') || relations.includes('all')) include.push(db.Course);
    // add more relations here if needed, e.g.: teacher → include.push(db.Teacher)
  }

  return { limit, offset, order, include };
}

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management
 */

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Created
 */
export const createStudent = async (req, res) => {
  try {
    const student = await db.Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of records per page
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [asc, desc], default: asc }
 *         description: Sort direction of created time
 *       - in: query
 *         name: populate
 *         schema: { type: string, example: "course" }
 *         description: Relations to include (course or all)
 *     responses:
 *       200:
 *         description: Paginated list of students
 */
export const getAllStudents = async (req, res) => {
  try {
    const opts = buildQueryOptions(req.query);
    const { count, rows } = await db.Student.findAndCountAll(opts);
    res.json({
      total: count,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      totalPages: Math.ceil(count / (Number(req.query.limit) || 10)),
      data: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: populate
 *         schema: { type: string, example: "course" }
 *         description: Relations to include (course or all)
 *     responses:
 *       200:
 *         description: A student
 *       404:
 *         description: Not found
 */
export const getStudentById = async (req, res) => {
  try {
    const opts = buildQueryOptions(req.query);
    const student = await db.Student.findByPk(req.params.id, opts);
    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Updated
 */
export const updateStudent = async (req, res) => {
  try {
    const student = await db.Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Not found' });
    await student.update(req.body);
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 */
export const deleteStudent = async (req, res) => {
  try {
    const student = await db.Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Not found' });
    await student.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
