const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getAllMovies,
  getMoviesByName,
  getMovieById,
  getMoviesByGenre,
  createMovie,
  deleteMovie,
  updateMovie,
  patchMovie,
  getCurrentMovies,
  getUpcomingMovies,
  getTopMoviesByRatingOrImdb // Thêm controller mới
} = require('../controllers/movie.controller');
const { auth, isAdmin } = require('../middlewares/auth.middleware');
const { validateMovie, validatePatchMovie } = require('../middlewares/movie.validator');

// config Multer to process upload file
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // check type file
    if (file.fieldname === 'poster' || file.fieldname === 'posterHorizontal') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Poster must be an image file'));
      }
    } else if (file.fieldname === 'trailer') {
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Trailer must be a video file'));
      }
    } else {
      cb(null, true);
    }
  }
});

/**
 * @swagger
 * /api/movie:
 *   get:
 *     summary: Get movies with flexible pagination and sorting
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of movies per page (0 = all movies)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [NameOfVietnamese, NameOfEnglish, FromDate, ToDate]
 *           default: FromDate
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (asc or desc)
 *     responses:
 *       200:
 *         description: List of movies with pagination info
 *       500:
 *         description: Server error
 */
router.get('/', getAllMovies);

/**
 * @swagger
 * /api/movie/search:
 *   get:
 *     summary: Search movies by name with pagination and sorting
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie name (Vietnamese or English) to search for
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of movies per page (0 = all)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [NameOfVietnamese, NameOfEnglish, FromDate, ToDate]
 *           default: FromDate
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (asc or desc)
 *     responses:
 *       200:
 *         description: Successfully found movies
 *       400:
 *         description: Missing movie name parameter
 *       500:
 *         description: Server error
 */
router.get('/search', getMoviesByName);

/**
 * @swagger
 * /api/movie/genre:
 *   get:
 *     summary: Filter movies by genre with pagination
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre to filter by
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of movies per page (0 = all movies)
 *     responses:
 *       200:
 *         description: Successfully filtered movies
 *       400:
 *         description: Missing genre parameter or invalid page
 *       500:
 *         description: Server error
 */
router.get('/genre', getMoviesByGenre);

/**
 * @swagger
 * /api/movie/current:
 *   get:
 *     summary: Get currently showing movies with pagination
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of movies per page (0 = all movies)
 *     responses:
 *       200:
 *         description: List of currently showing movies
 *       500:
 *         description: Server error
 */
router.get('/current', getCurrentMovies);

/**
 * @swagger
 * /api/movie/upcoming:
 *   get:
 *     summary: Get upcoming movies with pagination
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of movies per page (0 = all movies)
 *     responses:
 *       200:
 *         description: List of upcoming movies
 *       500:
 *         description: Server error
 */
router.get('/upcoming', getUpcomingMovies);

/**
 * @swagger
 * /api/movie/top:
 *   get:
 *     summary: Get top movies by rating or imdb
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [rating, imdb]
 *           default: rating
 *         description: "Type of ranking (rating: internal, imdb: external)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Number of top movies to return (max 50)"
 *     responses:
 *       200:
 *         description: Top movies by rating or imdb
 *       500:
 *         description: Server error
 */
router.get('/top', getTopMoviesByRatingOrImdb);

/**
 * @swagger
 * /api/movie/{movieId}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie
 *     responses:
 *       200:
 *         description: Successfully retrieved movie information
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.get('/:movieId', getMovieById);

/**
 * @swagger
 * /api/movie/create:
 *   post:
 *     summary: Create a new movie with poster, horizontal poster, and trailer
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               NameOfVietnamese:
 *                 type: string
 *               NameOfEnglish:
 *                 type: string
 *               FromDate:
 *                 type: string
 *                 format: date
 *               ToDate:
 *                 type: string
 *                 format: date
 *               Actors:
 *                 type: string
 *               ProductionCompany:
 *                 type: string
 *               Director:
 *                 type: string
 *               RunningTime:
 *                 type: integer
 *               Genres:
 *                 type: string
 *               ContentSynopsis:
 *                 type: string
 *               versions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     VersionType:
 *                       type: string
 *                     Language:
 *                       type: string
 *                 description: List of versions
 *                 example:
 *                   - VersionType: "2D"
 *                     Language: "Vietnamese"
 *                   - VersionType: "3D"
 *                     Language: "English"
 *               poster:
 *                 type: string
 *                 format: binary
 *                 description: Will be saved as PosterImage in database (vertical format)
 *               posterHorizontal:
 *                 type: string
 *                 format: binary
 *                 description: Horizontal format poster image for banners and wide displays
 *               trailer:
 *                 type: string
 *                 format: binary
 *                 description: Will be saved as TrailerUrl in database
 *               IframeUrl:
 *                 type: string
 *                 description: YouTube embed link
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */
router.post('/create', auth, isAdmin, upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'posterHorizontal', maxCount: 1 },
  { name: 'trailer', maxCount: 1 }
]), validateMovie, createMovie);

/**
 * @swagger
 * /api/movie/{movieId}:
 *   put:
 *     summary: Update movie information with files
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to update
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               NameOfVietnamese:
 *                 type: string
 *               NameOfEnglish:
 *                 type: string
 *               FromDate:
 *                 type: string
 *               ToDate:
 *                 type: string
 *               Actors:
 *                 type: string
 *               ProductionCompany:
 *                 type: string
 *               Director:
 *                 type: string
 *               RunningTime:
 *                 type: string
 *               Genres:
 *                 type: string
 *               ContentSynopsis:
 *                 type: string
 *               versions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     VersionType:
 *                       type: string
 *                     Language:
 *                       type: string
 *                 description: List of versions
 *               poster:
 *                 type: string
 *                 format: binary
 *                 description: Vertical poster image
 *               posterHorizontal:
 *                 type: string
 *                 format: binary
 *                 description: Horizontal poster image for banners and carousels
 *               trailer:
 *                 type: string
 *                 format: binary
 *                 description: Movie trailer video
 *               IframeUrl:
 *                 type: string
 *                 description: YouTube embed link
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.put('/:movieId', auth, isAdmin, upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'posterHorizontal', maxCount: 1 },
  { name: 'trailer', maxCount: 1 }
]), validateMovie, updateMovie);

/**
 * @swagger
 * /api/movie/{movieId}:
 *   patch:
 *     summary: Update movie partially with specific fields
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to update
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               NameOfVietnamese:
 *                 type: string
 *                 description: Vietnamese title of the movie
 *               NameOfEnglish:
 *                 type: string
 *                 description: English title of the movie
 *               FromDate:
 *                 type: string
 *                 format: date
 *                 description: Release date 
 *               ToDate:
 *                 type: string
 *                 format: date
 *                 description: End of screening date
 *               Actors:
 *                 type: string
 *                 description: List of actors
 *               ProductionCompany:
 *                 type: string
 *                 description: Production company name
 *               Director:
 *                 type: string
 *                 description: Movie director
 *               RunningTime:
 *                 type: integer
 *                 description: Movie duration in minutes
 *               Genres:
 *                 type: string
 *                 description: Movie genres (comma separated)
 *               ContentSynopsis:
 *                 type: string
 *                 description: Movie description/synopsis
 *               versions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     VersionType:
 *                       type: string
 *                     Language:
 *                       type: string
 *                 description: List of versions
 *               poster:
 *                 type: string
 *                 format: binary
 *                 description: Vertical poster image
 *               posterHorizontal:
 *                 type: string
 *                 format: binary
 *                 description: Horizontal poster image for banners and wide displays
 *               trailer:
 *                 type: string
 *                 format: binary
 *                 description: Movie trailer video
 *               IframeUrl:
 *                 type: string
 *                 description: YouTube embed link
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.patch('/:movieId', auth, isAdmin, upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'posterHorizontal', maxCount: 1 },
  { name: 'trailer', maxCount: 1 }
]), validatePatchMovie, patchMovie);

/**
 * @swagger
 * /api/movie/{movieId}:
 *   delete:
 *     summary: Delete a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to delete
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.delete('/:movieId', auth, isAdmin, deleteMovie);

module.exports = router;
