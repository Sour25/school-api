import db from '../models/index.js';

/* -------------------------------------------------------------------------- */
/*  Utility: build Sequelize query options for pagination, sorting, populate   */
/* -------------------------------------------------------------------------- */
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
    // if you have other relations (e.g. student), add here
  }

  return { limit, offset, order, include };
}

/* -------------------------------------------------------------------------- */
/*  @swagger tags                                                             */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Teacher management
 */

/* -------------------------------------------------------------------------- */
/*  Create                                                                    */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, department]
 *             properties:
 *               name: { type: string }
 *               department: { type: string }
 *     responses:
 *       201:
 *         description: Teacher created
 */
export const createTeacher = async (req, res) => {
  try {
    const teacher = await db.Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*  Get all                                                                   */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Teachers]
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
 *         description: Sort direction by created time
 *       - in: query
 *         name: populate
 *         schema: { type: string, example: "course" }
 *         description: Relations to include (course or all)
 *     responses:
 *       200:
 *         description: Paginated list of teachers
 */
export const getAllTeachers = async (req, res) => {
  try {
    const opts = buildQueryOptions(req.query);
    const { count, rows } = await db.Teacher.findAndCountAll(opts);
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

/* -------------------------------------------------------------------------- */
/*  Get by ID                                                                 */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Get a teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: populate
 *         schema: { type: string, example: "course" }
 *         description: Relations to include (course or all)
 *     responses:
 *       200:
 *         description: Teacher found
 *       404:
 *         description: Not found
 */
export const getTeacherById = async (req, res) => {
  try {
    const opts = buildQueryOptions(req.query);
    const teacher = await db.Teacher.findByPk(req.params.id, opts);
    if (!teacher) return res.status(404).json({ message: 'Not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*  Update                                                                    */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Update a teacher
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               department: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
export const updateTeacher = async (req, res) => {
  try {
    const teacher = await db.Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Not found' });

    await teacher.update(req.body);
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*  Delete                                                                    */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Delete a teacher
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 */
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await db.Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Not found' });

    await teacher.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
