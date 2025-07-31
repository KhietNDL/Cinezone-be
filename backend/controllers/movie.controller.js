const Movie = require("../models/movie.model");
const bucket = require('../config/firebase');
const axios = require('axios'); // Thêm nếu chưa có

const getAllMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 0;
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder;

    const result = await Movie.getAllMovies(
      parseInt(page),
      parseInt(limit),
      sortBy,
      sortOrder);

    if (limit > 0 && page > 1 && result.movies.length === 0) {
      return res.status(400).json({
        error: "Page number exceeds available pages"
      });
    }

    if (result.movies.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No movies found",
        data: [],
        pagination: result.pagination
      });
    }

    res.status(200).json({
      status: "success",
      data: result.movies,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("Get all movies error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getMoviesByName = async (req, res) => {
  const { name, page = 1, limit = 0, sortBy = 'FromDate', sortOrder = 'desc' } = req.query;
  try {
    if (!name) {
      return res.status(400).json({ error: "Movie name is required" });
    }
    const movies = await Movie.getMoviesByName(name, parseInt(page), parseInt(limit), sortBy, sortOrder);

    if (movies.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No movies found matching the search criteria",
        data: []
      });
    }

    res.status(200).json({
      status: "success",
      data: movies
    });
  } catch (error) {
    console.error("Get movies by name error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getMovieById = async (req, res) => {
  const { movieId } = req.params;
  try {
    const movie = await Movie.getMovieById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.status(200).json({
      status: "success",
      data: movie
    });
  } catch (error) {
    console.error("Get movie by ID error:", error);
    res.status(500).json({ error: error.message });
  }
};



const getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.query;
    if (!genre) {
      return res.status(400).json({ error: "Genre is required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 0;

    const result = await Movie.getMoviesByGenre(genre, page, limit);

    if (limit > 0 && page > 1 && result.movies.length === 0) {
      return res.status(400).json({
        error: "Page number exceeds available pages"
      });
    }

    if (result.movies.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No movies found in this genre",
        data: [],
        pagination: result.pagination
      });
    }

    res.status(200).json({
      status: "success",
      data: result.movies,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("Get movies by genre error:", error);
    res.status(500).json({ error: error.message });
  }
};


const createMovie = async (req, res) => {
  try {
    const movieData = req.body;

    movieData.CreatedBy = req.user.UserId;

    // upload poster (if provided)
    if (req.files && req.files.poster && req.files.poster[0]) {
      const posterFile = req.files.poster[0];
      const posterFileName = `posters/${Date.now()}-${posterFile.originalname.replace(/\s+/g, '_')}`;
      const posterBlob = bucket.file(posterFileName);

      // Upload poster to Firebase
      const posterStream = posterBlob.createWriteStream({
        metadata: { contentType: posterFile.mimetype }
      });

      await new Promise((resolve, reject) => {
        posterStream.on('error', reject);
        posterStream.on('finish', resolve);
        posterStream.end(posterFile.buffer);
      });

      const [url] = await posterBlob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      // Update URL poster into movie data
      movieData.PosterImage = url;
    }

    // upload horizontal poster (if provided)
    if (req.files && req.files.posterHorizontal && req.files.posterHorizontal[0]) {
      const posterFile = req.files.posterHorizontal[0];
      const posterFileName = `posters-horizontal/${Date.now()}-${posterFile.originalname.replace(/\s+/g, '_')}`;
      const posterBlob = bucket.file(posterFileName);

      // Upload horizontal poster to Firebase
      const posterStream = posterBlob.createWriteStream({
        metadata: { contentType: posterFile.mimetype }
      });

      await new Promise((resolve, reject) => {
        posterStream.on('error', reject);
        posterStream.on('finish', resolve);
        posterStream.end(posterFile.buffer);
      });

      const [url] = await posterBlob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      // Update URL horizontal poster into movie data
      movieData.PosterImageHorizontal = url;
    }

    // upload trailer (if provided)
    if (req.files && req.files.trailer && req.files.trailer[0]) {
      const trailerFile = req.files.trailer[0];
      const trailerFileName = `trailers/${Date.now()}-${trailerFile.originalname.replace(/\s+/g, '_')}`;
      const trailerBlob = bucket.file(trailerFileName);

      // Upload trailer to Firebase
      const trailerStream = trailerBlob.createWriteStream({
        metadata: { contentType: trailerFile.mimetype }
      });

      await new Promise((resolve, reject) => {
        trailerStream.on('error', reject);
        trailerStream.on('finish', resolve);
        trailerStream.end(trailerFile.buffer);
      });

      const [trailerUrl] = await trailerBlob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      movieData.TrailerUrl = trailerUrl;
    }

    if (movieData.RunningTime) {
      movieData.RunningTime = parseInt(movieData.RunningTime);
    }

    // cretye movie after update
    const movieId = await Movie.createMovie(movieData);
    const movie = await Movie.getMovieById(movieId);

    res.status(201).json({
      status: "success",
      message: "Movie created successfully",
      data: movie
    });
  } catch (error) {
    console.error("Create movie error:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteMovie = async (req, res) => {
  const { movieId } = req.params;
  try {
    const deletedBy = req.user.UserId;
    const success = await Movie.deleteMovie(movieId, deletedBy);
    if (!success) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Movie deleted successfully"
    });
  } catch (error) {
    console.error("Delete movie error:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteFirebaseFileByUrl = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    // Find file path in URL, including posters-horizontal
    const match = fileUrl.match(/(?:posters|posters-horizontal|trailers)\/[^?]+/);
    if (match && match[0]) {
      // Check if file exists before trying to delete
      const file = bucket.file(match[0]);
      const [exists] = await file.exists();
      
      if (exists) {
        await file.delete();
        console.log("Deleted old file from Firebase:", match[0]);
      } else {
        console.log("File not found in Firebase, skipping deletion:", match[0]);
      }
    }
  } catch (err) {
    // Log but don't throw error to prevent interrupting the update process
    console.log("Failed to delete old file from Firebase:", err.message);
  }
};

const updateMovie = async (req, res) => {
  const { movieId } = req.params;
  try {
    const movieData = req.body;

    // Delete these fields from body to prevent conflicts with file uploads
    delete movieData.poster;
    delete movieData.trailer;
    delete movieData.posterHorizontal;

    movieData.UpdatedBy = req.user.UserId;

    const existingMovie = await Movie.getMovieById(movieId);
    if (!existingMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Handle vertical poster upload
    if (req.files && req.files.poster && req.files.poster[0]) {
      await deleteFirebaseFileByUrl(existingMovie.PosterImage);

      const posterFile = req.files.poster[0];
      const posterFileName = `posters/${Date.now()}-${posterFile.originalname.replace(/\s+/g, '_')}`;
      const posterBlob = bucket.file(posterFileName);
      const posterStream = posterBlob.createWriteStream({
        metadata: { contentType: posterFile.mimetype }
      });
      await new Promise((resolve, reject) => {
        posterStream.on('error', reject);
        posterStream.on('finish', resolve);
        posterStream.end(posterFile.buffer);
      });
      const [url] = await posterBlob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });
      movieData.PosterImage = url;
    }

    // Handle horizontal poster upload
    if (req.files && req.files.posterHorizontal && req.files.posterHorizontal[0]) {
      await deleteFirebaseFileByUrl(existingMovie.PosterImageHorizontal);

      const posterFile = req.files.posterHorizontal[0];
      const posterFileName = `posters-horizontal/${Date.now()}-${posterFile.originalname.replace(/\s+/g, '_')}`;
      const posterBlob = bucket.file(posterFileName);
      const posterStream = posterBlob.createWriteStream({
        metadata: { contentType: posterFile.mimetype }
      });
      await new Promise((resolve, reject) => {
        posterStream.on('error', reject);
        posterStream.on('finish', resolve);
        posterStream.end(posterFile.buffer);
      });
      const [url] = await posterBlob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });
      movieData.PosterImageHorizontal = url;
    }

    // Handle trailer upload
    if (req.files && req.files.trailer && req.files.trailer[0]) {
      await deleteFirebaseFileByUrl(existingMovie.TrailerUrl);

      const trailerFile = req.files.trailer[0];
      const trailerFileName = `trailers/${Date.now()}-${trailerFile.originalname.replace(/\s+/g, '_')}`;
      const trailerBlob = bucket.file(trailerFileName);
      const trailerStream = trailerBlob.createWriteStream({
        metadata: { contentType: trailerFile.mimetype }
      });
      await new Promise((resolve, reject) => {
        trailerStream.on('error', reject);
        trailerStream.on('finish', resolve);
        trailerStream.end(trailerFile.buffer);
      });
      const [trailerUrl] = await trailerBlob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });
      movieData.TrailerUrl = trailerUrl;
    } else {
      // If no new trailer is uploaded, preserve the existing one
      if (existingMovie.TrailerUrl) {
        movieData.TrailerUrl = existingMovie.TrailerUrl;
      }
    }

    if (movieData.RunningTime) {
      movieData.RunningTime = parseInt(movieData.RunningTime);
    }

    console.log("Final movie data before update:", {
      ...movieData,
      PosterImageHorizontal: movieData.PosterImageHorizontal
    });

    const success = await Movie.updateMovie(movieId, movieData);
    if (!success) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const updatedMovie = await Movie.getMovieById(movieId);
    
    // Thêm ghi nhật ký này
    console.log("Retrieved movie after update:", {
      PosterImage: updatedMovie.PosterImage,
      PosterImageHorizontal: updatedMovie.PosterImageHorizontal,
      TrailerUrl: updatedMovie.TrailerUrl
    });
    
    res.status(200).json({
      status: "success",
      message: "Movie updated successfully",
      data: updatedMovie
    });
  } catch (error) {
    console.error("Update movie error:", error);
    res.status(500).json({ error: error.message });
  }
};

const patchMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movieData = req.body;
    delete movieData.poster;
    delete movieData.trailer;
    delete movieData.posterHorizontal;

    Object.keys(movieData).forEach(key => {
      if (movieData[key] === "") {
        delete movieData[key];
      }
    });

    movieData.UpdatedBy = req.user.UserId;

    const existingMovie = await Movie.getMovieById(movieId);
    if (!existingMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    if (req.files && req.files.poster && req.files.poster[0]) {
      await deleteFirebaseFileByUrl(existingMovie.PosterImage);

      const posterFile = req.files.poster[0];
      const posterFileName = `posters/${Date.now()}-${posterFile.originalname.replace(/\s+/g, '_')}`;
      const posterBlob = bucket.file(posterFileName);
      const posterStream = posterBlob.createWriteStream({
        metadata: { contentType: posterFile.mimetype }
      });
      await new Promise((resolve, reject) => {
        posterStream.on('error', reject);
        posterStream.on('finish', resolve);
        posterStream.end(posterFile.buffer);
      });
      const [url] = await posterBlob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });
      movieData.PosterImage = url;
    }

    // Handle horizontal poster
    if (req.files && req.files.posterHorizontal && req.files.posterHorizontal[0]) {
      await deleteFirebaseFileByUrl(existingMovie.PosterImageHorizontal);

      const posterFile = req.files.posterHorizontal[0];
      const posterFileName = `posters-horizontal/${Date.now()}-${posterFile.originalname.replace(/\s+/g, '_')}`;
      const posterBlob = bucket.file(posterFileName);
      const posterStream = posterBlob.createWriteStream({
        metadata: { contentType: posterFile.mimetype }
      });
      await new Promise((resolve, reject) => {
        posterStream.on('error', reject);
        posterStream.on('finish', resolve);
        posterStream.end(posterFile.buffer);
      });
      const [url] = await posterBlob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });
      movieData.PosterImageHorizontal = url;
    }

    if (req.files && req.files.trailer && req.files.trailer[0]) {
      await deleteFirebaseFileByUrl(existingMovie.TrailerUrl);

      const trailerFile = req.files.trailer[0];
      const trailerFileName = `trailers/${Date.now()}-${trailerFile.originalname.replace(/\s+/g, '_')}`;
      const trailerBlob = bucket.file(trailerFileName);
      const trailerStream = trailerBlob.createWriteStream({
        metadata: { contentType: trailerFile.mimetype }
      });
      await new Promise((resolve, reject) => {
        trailerStream.on('error', reject);
        trailerStream.on('finish', resolve);
        trailerStream.end(trailerFile.buffer);
      });
      const [trailerUrl] = await trailerBlob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });
      movieData.TrailerUrl = trailerUrl;
    }

    if (movieData.RunningTime) {
      movieData.RunningTime = parseInt(movieData.RunningTime);
    }

    const success = await Movie.patchMovie(movieId, movieData);

    if (!success) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const updatedMovie = await Movie.getMovieById(movieId);

    res.status(200).json({
      status: "success",
      message: "Movie updated successfully",
      data: updatedMovie
    });
  } catch (error) {
    console.error("Patch movie error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getCurrentMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 0;

    const result = await Movie.getCurrentMovies(page, limit);

    if (limit > 0 && page > 1 && result.movies.length === 0) {
      return res.status(400).json({
        error: "Page number exceeds available pages"
      });
    }

    if (result.movies.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No movies are currently showing",
        data: [],
        pagination: result.pagination
      });
    }

    res.status(200).json({
      status: "success",
      data: result.movies,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("Get current movies error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUpcomingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 0;

    const result = await Movie.getUpcomingMovies(page, limit);

    if (limit > 0 && page > 1 && result.movies.length === 0) {
      return res.status(400).json({
        error: "Page number exceeds available pages"
      });
    }

    if (result.movies.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No upcoming movies found",
        data: [],
        pagination: result.pagination
      });
    }

    res.status(200).json({
      status: "success",
      data: result.movies,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("Get upcoming movies error:", error);
    res.status(500).json({ error: error.message });
  }
};

// API: GET /api/movie/top?type=rating|imdb&limit=10
const getTopMoviesByRatingOrImdb = async (req, res) => {
  try {
    const { type = 'rating', limit = 10 } = req.query;
    const topLimit = Math.max(1, Math.min(Number(limit) || 10, 50));
    const result = await Movie.getAllMovies(1, 0);
    let movies = result.movies;

    if (type === 'imdb') {
      const imdbApiUrl = 'https://api.imdbapi.dev/search/titles';
      movies = movies.slice(0, 50);

      const imdbResults = await Promise.all(movies.map(async (movie) => {
        let imdbRating = null;
        let imdbTitle = null;
        let imdbYear = null;
        let imdbId = null;
        let imdbImage = null;
        try {
          const resp = await axios.get(imdbApiUrl, {
            params: { query: encodeURIComponent(movie.NameOfEnglish), limit: 1 }
          });
          if (resp.data && Array.isArray(resp.data.titles) && resp.data.titles.length > 0) {
            const first = resp.data.titles[0];
            imdbRating = first.rating && first.rating.aggregateRating ? Number(first.rating.aggregateRating) : null;
            imdbTitle = first.primaryTitle;
            imdbYear = first.startYear;
            imdbId = first.id;
            imdbImage = first.primaryImage?.url;
          } else if (movie.NameOfVietnamese) {
            const respVN = await axios.get(imdbApiUrl, {
              params: { query: encodeURIComponent(movie.NameOfVietnamese), limit: 1 }
            });
            if (respVN.data && Array.isArray(respVN.data.titles) && respVN.data.titles.length > 0) {
              const firstVN = respVN.data.titles[0];
              imdbRating = firstVN.rating && firstVN.rating.aggregateRating ? Number(firstVN.rating.aggregateRating) : null;
              imdbTitle = firstVN.primaryTitle;
              imdbYear = firstVN.startYear;
              imdbId = firstVN.id;
              imdbImage = firstVN.primaryImage?.url;
            }
          }
        } catch (err) {
          // Bỏ qua lỗi, chỉ lấy phim có imdbRating
        }
        // Chỉ trả về các trường cần thiết
        return {
          MovieId: movie.MovieId,
          NameOfVietnamese: movie.NameOfVietnamese,
          NameOfEnglish: movie.NameOfEnglish,
          PosterImage: movie.PosterImage,
          TrailerUrl: movie.TrailerUrl,
          Genres: movie.Genres,
          Director: movie.Director,
          Actors: movie.Actors,
          RunningTime: movie.RunningTime,
          FromDate: movie.FromDate,
          ToDate: movie.ToDate,
          imdbRating,
          imdbTitle,
          imdbYear,
          imdbId,
          imdbImage
        };
      }));

      const sorted = imdbResults
        .filter(m => m.imdbRating !== null)
        .sort((a, b) => b.imdbRating - a.imdbRating)
        .slice(0, topLimit);

      return res.json({
        type: 'imdb',
        top: topLimit,
        movies: sorted
      });
    } else {
      // Sắp xếp theo AverageRating giảm dần
      const sorted = movies
        .filter(m => m.AverageRating !== undefined && m.AverageRating !== null)
        .sort((a, b) => Number(b.AverageRating) - Number(a.AverageRating))
        .slice(0, topLimit);

      return res.json({
        type: 'rating',
        top: topLimit,
        movies: sorted
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
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
  getTopMoviesByRatingOrImdb
};
