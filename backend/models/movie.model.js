const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Movie {
  static async getAllMovies(page = 1, limit = 0, sortBy = 'FromDate', sortOrder = 'desc') {
    const allowedSortFields = ['NameOfVietnamese', 'NameOfEnglish', 'FromDate', 'ToDate'];
    if (!allowedSortFields.includes(sortBy)) sortBy = 'FromDate';
    sortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    let moviesQuery = `SELECT * FROM Movies WHERE IsDeleted = 0 ORDER BY ${sortBy} ${sortOrder}`;
    let moviesParams = [];
    if (limit > 0) {
      const offset = (page - 1) * limit;
      moviesQuery += " LIMIT ? OFFSET ?";
      moviesParams = [limit, offset];
    }
    const [movies] = await db.promise().query(moviesQuery, moviesParams);

    const movieIds = movies.map(m => m.MovieId);
    let versions = [];
    if (movieIds.length > 0) {
      const [versionRows] = await db.promise().query(
        `SELECT * FROM Version WHERE MovieId IN (${movieIds.map(() => '?').join(',')}) AND IsDeleted = 0`,
        movieIds
      );
      versions = versionRows;
    }

    const moviesWithVersions = movies.map(movie => ({
      ...movie,
      versions: versions.filter(v => v.MovieId === movie.MovieId)
    }));

    let totalMovies = movies.length;
    if (limit > 0) {
      const [countResult] = await db.promise().query("SELECT COUNT(*) as total FROM Movies WHERE IsDeleted = 0");
      totalMovies = countResult[0].total;
    }

    return {
      movies: moviesWithVersions,
      pagination: {
        total: totalMovies,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(totalMovies / limit) : 1,
        limit: limit > 0 ? limit : movies.length,
      },
    };
  }

  static async getMoviesByName(name, page = 1, limit = 0, sortBy = 'FromDate', sortOrder = 'desc') {
    const allowedSortFields = ['NameOfVietnamese', 'NameOfEnglish', 'FromDate', 'ToDate'];
    if (!allowedSortFields.includes(sortBy)) sortBy = 'FromDate';
    sortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    let moviesQuery = `SELECT * FROM Movies WHERE (NameOfVietnamese LIKE ? OR NameOfEnglish LIKE ?) AND IsDeleted = 0 ORDER BY ${sortBy} ${sortOrder}`;
    let moviesParams = [`%${name}%`, `%${name}%`];
    if (limit > 0) {
      const offset = (page - 1) * limit;
      moviesQuery += " LIMIT ? OFFSET ?";
      moviesParams.push(limit, offset);
    }
    const [movies] = await db.promise().query(moviesQuery, moviesParams);

    const movieIds = movies.map(m => m.MovieId);
    let versions = [];
    if (movieIds.length > 0) {
      const [versionRows] = await db.promise().query(
        `SELECT * FROM Version WHERE MovieId IN (${movieIds.map(() => '?').join(',')}) AND IsDeleted = 0`,
        movieIds
      );
      versions = versionRows;
    }

    const moviesWithVersions = movies.map(movie => ({
      ...movie,
      versions: versions.filter(v => v.MovieId === movie.MovieId)
    }));

    let totalMovies = movies.length;
    if (limit > 0) {
      const [countResult] = await db
        .promise()
        .query(
          "SELECT COUNT(*) as total FROM Movies WHERE (NameOfVietnamese LIKE ? OR NameOfEnglish LIKE ?) AND IsDeleted = 0",
          [`%${name}%`, `%${name}%`]
        );
      totalMovies = countResult[0].total;
    }

    return {
      movies: moviesWithVersions,
      pagination: {
        total: totalMovies,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(totalMovies / limit) : 1,
        limit: limit > 0 ? limit : movies.length,
      },
    };
  }

  static async getMovieById(movieId) {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM Movies WHERE MovieId = ? AND IsDeleted = 0", [
        movieId,
      ]);
    const movie = rows[0];
    if (!movie) return null;

    const [versions] = await db
      .promise()
      .query("SELECT * FROM Version WHERE MovieId = ? AND IsDeleted = 0", [
        movieId,
      ]);

    return {
      ...movie,
      versions: versions,
    };
  }

  static async getMoviesByGenre(genre, page = 1, limit = 0) {
    let moviesQuery = "SELECT * FROM Movies WHERE Genres LIKE ? AND IsDeleted = 0 ORDER BY FromDate DESC";
    let moviesParams = [`%${genre}%`];
    if (limit > 0) {
      const offset = (page - 1) * limit;
      moviesQuery += " LIMIT ? OFFSET ?";
      moviesParams.push(limit, offset);
    }
    const [movies] = await db.promise().query(moviesQuery, moviesParams);

    const movieIds = movies.map(m => m.MovieId);
    let versions = [];
    if (movieIds.length > 0) {
      const [versionRows] = await db.promise().query(
        `SELECT * FROM Version WHERE MovieId IN (${movieIds.map(() => '?').join(',')}) AND IsDeleted = 0`,
        movieIds
      );
      versions = versionRows;
    }
    const moviesWithVersions = movies.map(movie => ({
      ...movie,
      versions: versions.filter(v => v.MovieId === movie.MovieId)
    }));

    let totalMovies = movies.length;
    if (limit > 0) {
      const [countResult] = await db
        .promise()
        .query("SELECT COUNT(*) as total FROM Movies WHERE Genres LIKE ? AND IsDeleted = 0", [`%${genre}%`]);
      totalMovies = countResult[0].total;
    }

    return {
      movies: moviesWithVersions,
      pagination: {
        total: totalMovies,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(totalMovies / limit) : 1,
        limit: limit > 0 ? limit : movies.length,
      },
    };
  }

  static async createMovie(movieData) {
    const MovieId = uuidv4();
    const {
      NameOfVietnamese,
      NameOfEnglish,
      FromDate,
      ToDate,
      Actors,
      ProductionCompany,
      Director,
      RunningTime,
      TrailerUrl,
      IframeUrl,
      Genres,
      ContentSynopsis,
      PosterImage,
      CreatedBy,
    } = movieData;
    let versions = movieData.versions;

    if (typeof versions === 'string') {
      try { versions = JSON.parse(versions); } catch { versions = []; }
    }

    if (Array.isArray(versions)) {
      versions = versions.flatMap(v => {
        if (typeof v === 'string') {
          try {
            const parsed = JSON.parse(v);
            return Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            return [];
          }
        }
        return [v];
      });
    }

    if (versions && !Array.isArray(versions)) {
      versions = [versions];
    }

    console.log('versions to insert:', versions, typeof versions, Array.isArray(versions));
    if (Array.isArray(versions)) {
      versions.forEach((v, i) => console.log(`version[${i}]`, v));
    }

    await db.promise().query(
      "INSERT INTO Movies (MovieId, NameOfVietnamese, NameOfEnglish, FromDate, ToDate, Actors, ProductionCompany, Director, RunningTime, TrailerUrl, IframeUrl, Genres, ContentSynopsis, PosterImage, IsDeleted, CreatedAt, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), ?)",
      [
        MovieId,
        NameOfVietnamese,
        NameOfEnglish,
        FromDate,
        ToDate,
        Actors,
        ProductionCompany,
        Director,
        RunningTime,
        TrailerUrl,
        IframeUrl,
        Genres,
        ContentSynopsis,
        PosterImage,
        CreatedBy,
      ]
    );

    if (Array.isArray(versions) && versions.length > 0) {
      for (const v of versions) {
        console.log('Insert version:', v);
        await db.promise().query(
          "INSERT INTO Version (VersionId, MovieId, VersionType, Language, IsDeleted, CreatedAt, CreatedBy) VALUES (?, ?, ?, ?, 0, NOW(), ?)",
          [uuidv4(), MovieId, v.VersionType, v.Language, CreatedBy]
        );
      }
    }

    return MovieId;
  }

  static async deleteMovie(movieId, deletedBy) {
    const [result] = await db
      .promise()
      .query(
        "UPDATE Movies SET IsDeleted = 1, DeletedAt = NOW(), DeletedBy = ? WHERE MovieId = ? AND IsDeleted = 0",
        [deletedBy, movieId]
      );
    return result.affectedRows > 0;
  }

  static async updateMovie(movieId, movieData) {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM Movies WHERE MovieId = ? AND IsDeleted = 0", [
        movieId,
      ]);
    const current = rows[0];
    if (!current) return false;

    function keepOld(newVal, oldVal) {
      return newVal === undefined || newVal === null || newVal === ""
        ? oldVal
        : newVal;
    }

    const NameOfVietnamese = keepOld(
      movieData.NameOfVietnamese,
      current.NameOfVietnamese
    );
    const NameOfEnglish = keepOld(
      movieData.NameOfEnglish,
      current.NameOfEnglish
    );
    const FromDate = keepOld(movieData.FromDate, current.FromDate);
    const ToDate = keepOld(movieData.ToDate, current.ToDate);
    const Actors = keepOld(movieData.Actors, current.Actors);
    const ProductionCompany = keepOld(
      movieData.ProductionCompany,
      current.ProductionCompany
    );
    const Director = keepOld(movieData.Director, current.Director);
    const RunningTime = keepOld(movieData.RunningTime, current.RunningTime);
    const TrailerUrl = keepOld(movieData.TrailerUrl, current.TrailerUrl);
    const IframeUrl = keepOld(movieData.IframeUrl, current.IframeUrl);
    const Genres = keepOld(movieData.Genres, current.Genres);
    const ContentSynopsis = keepOld(
      movieData.ContentSynopsis,
      current.ContentSynopsis
    );
    const PosterImage = keepOld(movieData.PosterImage, current.PosterImage);
    const PosterImageHorizontal = keepOld(movieData.PosterImageHorizontal, current.PosterImageHorizontal);

    const [result] = await db
      .promise()
      .query(
        "UPDATE Movies SET NameOfVietnamese = ?, NameOfEnglish = ?, FromDate = ?, ToDate = ?, Actors = ?, ProductionCompany = ?, Director = ?, RunningTime = ?, TrailerUrl = ?, IframeUrl = ?, Genres = ?, ContentSynopsis = ?, PosterImage = ?, PosterImageHorizontal = ?, UpdatedAt = NOW(), UpdatedBy = ? WHERE MovieId = ? AND IsDeleted = 0",
        [
          NameOfVietnamese,
          NameOfEnglish,
          FromDate,
          ToDate,
          Actors,
          ProductionCompany,
          Director,
          RunningTime,
          TrailerUrl,
          IframeUrl,
          Genres,
          ContentSynopsis,
          PosterImage,
          PosterImageHorizontal,
          movieData.UpdatedBy,
          movieId,
        ]
      );

    let versions = movieData.versions;
    console.log('[updateMovie] Input versions:', versions, typeof versions);

    if (typeof versions === 'string') {
      try { 
        versions = JSON.parse(versions); 
        console.log('[updateMovie] Parsed versions from string:', versions);
      } catch (e) { 
        console.error('[updateMovie] Error parsing versions string:', e);
        versions = []; 
      }
    }

    if (versions && !Array.isArray(versions)) {
      versions = [versions];
      console.log('[updateMovie] Converted to array:', versions);
    }

    if (Array.isArray(versions) && versions.length > 0) {
      console.log('[updateMovie] Versions to process:', versions.length);
      
      try {
        await db.promise().query("DELETE FROM Version WHERE MovieId = ?", [movieId]);
        console.log('[updateMovie] Deleted existing versions for movie:', movieId);
        
        for (const v of versions) {
          console.log('[updateMovie] Inserting version:', v);
          
          if (v && v.VersionType && v.Language) {
            await db.promise().query(
              "INSERT INTO Version (VersionId, MovieId, VersionType, Language, IsDeleted, CreatedAt, CreatedBy) VALUES (?, ?, ?, ?, 0, NOW(), ?)",
              [uuidv4(), movieId, v.VersionType, v.Language, movieData.UpdatedBy || 'system']
            );
            console.log('[updateMovie] Version inserted successfully');
          } else {
            console.error('[updateMovie] Invalid version data:', v);
          }
        }
      } catch (error) {
        console.error('[updateMovie] Error processing versions:', error);
      }
    } else {
      console.log('[updateMovie] No versions to process');
    }

    return result.affectedRows > 0;
  }

  static async patchMovie(movieId, movieData) {
    if (!movieId || !movieData) {
      console.log("Missing movieId or movieData");
      return false;
    }

    const updateFields = [];
    const values = [];

    for (const [field, value] of Object.entries(movieData)) {
      if (
        value !== undefined &&
        field !== "UpdatedBy" &&
        field !== "versions"
      ) {
        updateFields.push(`${field} = ?`);
        values.push(value);
      }
    }

    updateFields.push("UpdatedAt = NOW()");

    if (movieData.UpdatedBy) {
      updateFields.push("UpdatedBy = ?");
      values.push(movieData.UpdatedBy);
    }

    if (updateFields.length === 0 && !movieData.versions) {
      return true;
    }

    values.push(movieId);

    if (updateFields.length > 0) {
      const sql = `UPDATE Movies SET ${updateFields.join(
        ", "
      )} WHERE MovieId = ? AND IsDeleted = 0`;
      try {
        await db.promise().query(sql, values);
      } catch (error) {
        console.error("SQL Error:", error);
        return false;
      }
    }

    let versions = movieData.versions;
    console.log('[patchMovie] Input versions:', versions, typeof versions);

    if (typeof versions === 'string') {
      try { 
        versions = JSON.parse(versions); 
        console.log('[patchMovie] Parsed versions from string:', versions);
      } catch (e) { 
        console.error('[patchMovie] Error parsing versions string:', e);
        versions = []; 
      }
    }

    if (versions && !Array.isArray(versions)) {
      versions = [versions];
      console.log('[patchMovie] Converted to array:', versions);
    }

    if (Array.isArray(versions) && versions.length > 0) {
      console.log('[patchMovie] Versions to process:', versions.length);
      
      try {
        await db.promise().query("DELETE FROM Version WHERE MovieId = ?", [movieId]);
        console.log('[patchMovie] Deleted existing versions for movie:', movieId);
        
        for (const v of versions) {
          console.log('[patchMovie] Inserting version:', v);
          
          if (v && v.VersionType && v.Language) {
            await db.promise().query(
              "INSERT INTO Version (VersionId, MovieId, VersionType, Language, IsDeleted, CreatedAt, CreatedBy) VALUES (?, ?, ?, ?, 0, NOW(), ?)",
              [uuidv4(), movieId, v.VersionType, v.Language, movieData.UpdatedBy || 'system']
            );
            console.log('[patchMovie] Version inserted successfully');
          } else {
            console.error('[patchMovie] Invalid version data:', v);
          }
        }
      } catch (error) {
        console.error('[patchMovie] Error processing versions:', error);
      }
    } else {
      console.log('[patchMovie] No versions to process');
    }

    return true;
  }

  static async getCurrentMovies(page = 1, limit = 0) {
    let moviesQuery = "SELECT * FROM Movies WHERE FromDate <= CURDATE() AND ToDate >= CURDATE() AND IsDeleted = 0 ORDER BY FromDate DESC";
    let moviesParams = [];
    if (limit > 0) {
      const offset = (page - 1) * limit;
      moviesQuery += " LIMIT ? OFFSET ?";
      moviesParams.push(limit, offset);
    }
    const [movies] = await db.promise().query(moviesQuery, moviesParams);

    const movieIds = movies.map(m => m.MovieId);
    let versions = [];
    if (movieIds.length > 0) {
      const [versionRows] = await db.promise().query(
        `SELECT * FROM Version WHERE MovieId IN (${movieIds.map(() => '?').join(',')}) AND IsDeleted = 0`,
        movieIds
      );
      versions = versionRows;
    }
    const moviesWithVersions = movies.map(movie => ({
      ...movie,
      versions: versions.filter(v => v.MovieId === movie.MovieId)
    }));

    let totalMovies = movies.length;
    if (limit > 0) {
      const [countResult] = await db
        .promise()
        .query("SELECT COUNT(*) as total FROM Movies WHERE FromDate <= CURDATE() AND ToDate >= CURDATE() AND IsDeleted = 0");
      totalMovies = countResult[0].total;
    }

    return {
      movies: moviesWithVersions,
      pagination: {
        total: totalMovies,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(totalMovies / limit) : 1,
        limit: limit > 0 ? limit : movies.length,
      },
    };
  }

  static async getUpcomingMovies(page = 1, limit = 0) {
    let moviesQuery = "SELECT * FROM Movies WHERE FromDate > CURDATE() AND IsDeleted = 0 ORDER BY FromDate ASC";
    let moviesParams = [];
    if (limit > 0) {
      const offset = (page - 1) * limit;
      moviesQuery += " LIMIT ? OFFSET ?";
      moviesParams.push(limit, offset);
    }
    const [movies] = await db.promise().query(moviesQuery, moviesParams);

    const movieIds = movies.map(m => m.MovieId);
    let versions = [];
    if (movieIds.length > 0) {
      const [versionRows] = await db.promise().query(
        `SELECT * FROM Version WHERE MovieId IN (${movieIds.map(() => '?').join(',')}) AND IsDeleted = 0`,
        movieIds
      );
      versions = versionRows;
    }
    const moviesWithVersions = movies.map(movie => ({
      ...movie,
      versions: versions.filter(v => v.MovieId === movie.MovieId)
    }));

    let totalMovies = movies.length;
    if (limit > 0) {
      const [countResult] = await db
        .promise()
        .query("SELECT COUNT(*) as total FROM Movies WHERE FromDate > CURDATE() AND IsDeleted = 0");
      totalMovies = countResult[0].total;
    }

    return {
      movies: moviesWithVersions,
      pagination: {
        total: totalMovies,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(totalMovies / limit) : 1,
        limit: limit > 0 ? limit : movies.length,
      },
    };
  }

  static async getMovieShowtimesByVietnameseName(nameOfVietnamese) {
    const sql = `
      SELECT 
        mv.MovieId, mv.Version, 
        st.ShowtimeId, st.ShowDate, st.Duration, 
        cr.CinemaRoomId, cr.Name
      FROM Movies mv
      JOIN Showtimes st ON mv.MovieId = st.MovieId
      JOIN CinemaRooms cr ON st.CinemaRoomId = cr.CinemaRoomId
      WHERE mv.NameOfVietnamese = ?
      ORDER BY mv.MovieId, st.ShowDate
    `;
    try {
      const [rows] = await db.promise().query(sql, [nameOfVietnamese]);
      return rows;
    } catch (error) {
      throw new Error(
        "Error getting movie showtimes by Vietnamese name: " + error.message
      );
    }
  }

  static async getMovieShowtimesByEnglishName(nameOfEnglish) {
    const sql = `
      SELECT 
        mv.MovieId, mv.Version, 
        st.ShowtimeId, st.Day, st.Duration, 
        cr.CinemaRoomId, cr.Name
      FROM Movies mv
      JOIN Showtimes st ON mv.MovieId = st.MovieId
      JOIN CinemaRooms cr ON st.CinemaRoomId = cr.CinemaRoomId
      WHERE mv.NameOfEnglish = ?
      ORDER BY mv.MovieId, st.Day
    `;
    try {
      const [rows] = await db.promise().query(sql, [nameOfEnglish]);
      return rows;
    } catch (error) {
      throw new Error(
        "Error getting movie showtimes by English name: " + error.message
      );
    }
  }

  static async getMovieIdAndRunningTimeByVersionId(versionId) {
    const [rows] = await db.promise().query(
      `SELECT m.MovieId, m.RunningTime FROM Movies m
       JOIN Version v ON m.MovieId = v.MovieId
       WHERE v.VersionId = ? AND m.IsDeleted = 0 AND v.IsDeleted = 0`,
      [versionId]
    );
    return rows[0] || null;
  }

  static async updateMovieRatingStats(movieId, averageRating, totalRatings) {
    const sql = 'UPDATE Movies SET AverageRating = ?, TotalRatings = ? WHERE MovieId = ?';
    await db.promise().query(sql, [averageRating, totalRatings, movieId]);
    return true;
  }
}

module.exports = Movie;
