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
    if (relations.includes('student') || relations.includes('all')) include.push(db.Student);
    if (relations.includes('teacher') || relations.includes('all')) include.push(db.Teacher);
  }

  return { limit, offset, order, include };
}

/* -------------------------------------------------------------------------- */
/*  @swagger tags                                                             */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

/* -------------------------------------------------------------------------- */
/*  Create                                                                    */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, TeacherId]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               TeacherId: { type: integer }
 *     responses:
 *       201:
 *         description: Course created
 */
export const createCourse = async (req, res) => {
  try {
    const course = await db.Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*  Get all                                                                   */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
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
 *         schema: { type: string, example: "student,teacher" }
 *         description: Relations to include (student, teacher, or all)
 *     responses:
 *       200:
 *         description: Paginated list of courses
 */
export const getAllCourses = async (req, res) => {
  try {
    const opts = buildQueryOptions(req.query);
    const { count, rows } = await db.Course.findAndCountAll(opts);

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
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: populate
 *         schema: { type: string, example: "student,teacher" }
 *         description: Relations to include (student, teacher, or all)
 *     responses:
 *       200:
 *         description: Course found
 *       404:
 *         description: Not found
 */
export const getCourseById = async (req, res) => {
  try {
    const opts = buildQueryOptions(req.query);
    const course = await db.Course.findByPk(req.params.id, opts);
    if (!course) return res.status(404).json({ message: 'Not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*  Update                                                                    */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
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
 *               title: { type: string }
 *               description: { type: string }
 *               TeacherId: { type: integer }
 *     responses:
 *       200:
 *         description: Course updated
 */
export const updateCourse = async (req, res) => {
  try {
    const course = await db.Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Not found' });

    await course.update(req.body);
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*  Delete                                                                    */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Course deleted
 */
export const deleteCourse = async (req, res) => {
  try {
    const course = await db.Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Not found' });

    await course.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
