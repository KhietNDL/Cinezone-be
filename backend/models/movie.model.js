const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Movie {
  // get all movies
  static async getAllMovies(page = 1, limit = 0) {
    // if limit = 0 ,get all movies
    if (limit <= 0) {
      const [rows] = await db
        .promise()
        .query(
          "SELECT * FROM Movies WHERE IsDeleted = 0 ORDER BY FromDate DESC"
        );
      return {
        movies: rows,
        pagination: {
          total: rows.length,
          currentPage: 1,
          totalPages: 1,
          limit: rows.length,
        },
      };
    }
    // if limit > 0, paginate the results
    else {
      const offset = (page - 1) * limit;

      // get movies with pagination
      const [rows] = await db
        .promise()
        .query(
          "SELECT * FROM Movies WHERE IsDeleted = 0 ORDER BY FromDate DESC LIMIT ? OFFSET ?",
          [limit, offset]
        );

      // count total movies
      const [countResult] = await db
        .promise()
        .query("SELECT COUNT(*) as total FROM Movies WHERE IsDeleted = 0");

      const totalMovies = countResult[0].total;

      return {
        movies: rows,
        pagination: {
          total: totalMovies,
          currentPage: page,
          totalPages: Math.ceil(totalMovies / limit),
          limit,
        },
      };
    }
  }

  static async getMoviesByName(name) {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM Movies WHERE (NameOfVietnamese LIKE ? OR NameOfEnglish LIKE ?) AND IsDeleted = 0",
        [`%${name}%`, `%${name}%`]
      );
    return rows;
  }

  static async getMovieById(movieId) {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM Movies WHERE MovieId = ? AND IsDeleted = 0", [
        movieId,
      ]);
    return rows[0];
  }

  static async getMoviesByGenre(genre, page = 1, limit = 0) {
    if (limit <= 0) {
      const [rows] = await db
        .promise()
        .query(
          "SELECT * FROM Movies WHERE Genres LIKE ? AND IsDeleted = 0 ORDER BY FromDate DESC",
          [`%${genre}%`]
        );
      return {
        movies: rows,
        pagination: {
          total: rows.length,
          currentPage: 1,
          totalPages: 1,
          limit: rows.length,
        },
      };
    } else {
      const offset = (page - 1) * limit;

      const [rows] = await db
        .promise()
        .query(
          "SELECT * FROM Movies WHERE Genres LIKE ? AND IsDeleted = 0 ORDER BY FromDate DESC LIMIT ? OFFSET ?",
          [`%${genre}%`, limit, offset]
        );

      const [countResult] = await db
        .promise()
        .query(
          "SELECT COUNT(*) as total FROM Movies WHERE Genres LIKE ? AND IsDeleted = 0",
          [`%${genre}%`]
        );

      const totalMovies = countResult[0].total;

      return {
        movies: rows,
        pagination: {
          total: totalMovies,
          currentPage: page,
          totalPages: Math.ceil(totalMovies / limit),
          limit,
        },
      };
    }
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
      Version,
      TrailerUrl,
      Genres,
      ContentSynopsis,
      PosterImage,
    } = movieData;

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO Movies (MovieId, NameOfVietnamese, NameOfEnglish, FromDate, ToDate, Actors, ProductionCompany, Director, RunningTime, Version, TrailerUrl, Genres, ContentSynopsis, PosterImage, IsDeleted, CreatedAt, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), ?)",
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
          Version,
          TrailerUrl,
          Genres,
          ContentSynopsis,
          PosterImage,
          movieData.CreatedBy,
        ]
      );
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
    const Version = keepOld(movieData.Version, current.Version);
    const TrailerUrl = keepOld(movieData.TrailerUrl, current.TrailerUrl);
    const Genres = keepOld(movieData.Genres, current.Genres);
    const ContentSynopsis = keepOld(
      movieData.ContentSynopsis,
      current.ContentSynopsis
    );
    const PosterImage = keepOld(movieData.PosterImage, current.PosterImage);

    const [result] = await db
      .promise()
      .query(
        "UPDATE Movies SET NameOfVietnamese = ?, NameOfEnglish = ?, FromDate = ?, ToDate = ?, Actors = ?, ProductionCompany = ?, Director = ?, RunningTime = ?, Version = ?, TrailerUrl = ?, Genres = ?, ContentSynopsis = ?, PosterImage = ?, UpdatedAt = NOW(), UpdatedBy = ? WHERE MovieId = ? AND IsDeleted = 0",
        [
          NameOfVietnamese,
          NameOfEnglish,
          FromDate,
          ToDate,
          Actors,
          ProductionCompany,
          Director,
          RunningTime,
          Version,
          TrailerUrl,
          Genres,
          ContentSynopsis,
          PosterImage,
          movieData.UpdatedBy,
          movieId,
        ]
      );
    return result.affectedRows > 0;
  }

  static async patchMovie(movieId, movieData) {
    if (!movieId || !movieData) {
      console.log("Missing movieId or movieData");
      return false;
    }

    const updateFields = [];
    const values = [];

    console.log("Patching movie with data:", JSON.stringify(movieData));

    for (const [field, value] of Object.entries(movieData)) {
      if (value !== undefined && field !== "UpdatedBy") {
        updateFields.push(`${field} = ?`);
        values.push(value);
      }
    }

    updateFields.push("UpdatedAt = NOW()");

    if (movieData.UpdatedBy) {
      updateFields.push("UpdatedBy = ?");
      values.push(movieData.UpdatedBy);
    }

    if (updateFields.length === 0) {
      console.log("No fields to update");
      return true;
    }

    values.push(movieId);

    const sql = `UPDATE Movies SET ${updateFields.join(
      ", "
    )} WHERE MovieId = ? AND IsDeleted = 0`;
    console.log("SQL:", sql);
    console.log("Values:", values);

    try {
      const [result] = await db.promise().query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("SQL Error:", error);
      return false;
    }
  }

  static async getCurrentMovies(page = 1, limit = 0) {
    if (limit <= 0) {
      const [rows] = await db
        .promise()
        .query(
          "SELECT * FROM Movies WHERE FromDate <= CURDATE() AND ToDate >= CURDATE() AND IsDeleted = 0 ORDER BY FromDate DESC"
        );
      return {
        movies: rows,
        pagination: {
          total: rows.length,
          currentPage: 1,
          totalPages: 1,
          limit: rows.length,
        },
      };
    } else {
      const offset = (page - 1) * limit;

      const [rows] = await db
        .promise()
        .query(
          "SELECT * FROM Movies WHERE FromDate <= CURDATE() AND ToDate >= CURDATE() AND IsDeleted = 0 ORDER BY FromDate DESC LIMIT ? OFFSET ?",
          [limit, offset]
        );

      const [countResult] = await db
        .promise()
        .query(
          "SELECT COUNT(*) as total FROM Movies WHERE FromDate <= CURDATE() AND ToDate >= CURDATE() AND IsDeleted = 0"
        );

      const totalMovies = countResult[0].total;

      return {
        movies: rows,
        pagination: {
          total: totalMovies,
          currentPage: page,
          totalPages: Math.ceil(totalMovies / limit),
          limit,
        },
      };
    }
  }

  static async getUpcomingMovies(page = 1, limit = 0) {
    if (limit <= 0) {
      const [rows] = await db
        .promise()
        .query(
          "SELECT * FROM Movies WHERE FromDate > CURDATE() AND IsDeleted = 0 ORDER BY FromDate ASC"
        );
      return {
        movies: rows,
        pagination: {
          total: rows.length,
          currentPage: 1,
          totalPages: 1,
          limit: rows.length,
        },
      };
    } else {
      const offset = (page - 1) * limit;

      const [rows] = await db
        .promise()
        .query(
          "SELECT * FROM Movies WHERE FromDate > CURDATE() AND IsDeleted = 0 ORDER BY FromDate ASC LIMIT ? OFFSET ?",
          [limit, offset]
        );

      const [countResult] = await db
        .promise()
        .query(
          "SELECT COUNT(*) as total FROM Movies WHERE FromDate > CURDATE() AND IsDeleted = 0"
        );

      const totalMovies = countResult[0].total;

      return {
        movies: rows,
        pagination: {
          total: totalMovies,
          currentPage: page,
          totalPages: Math.ceil(totalMovies / limit),
          limit,
        },
      };
    }
  }
  static async getMovieShowtimes(movieId) {
    const sql = `
      SELECT 
        mv.MovieId, mv.Version, 
        st.ShowtimeId, st.Day, st.Duration, 
        cr.CinemaRoomId, cr.Name
      FROM Movies mv
      JOIN Showtimes st ON mv.MovieId = st.MovieId
      JOIN CinemaRooms cr ON st.CinemaRoomId = cr.CinemaRoomId
      WHERE mv.MovieId = ? and mv.IsDeleted = 0
      ORDER BY mv.MovieId, st.Day
    `;
    try {
      const [rows] = await db.promise().query(sql, [movieId]);
      return rows;
    } catch (error) {
      throw new Error("Error getting movie showtimes: " + error.message);
    }
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
}

module.exports = Movie;
