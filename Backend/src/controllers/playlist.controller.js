import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../libs/db.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { id: userId } = req.userId;

  const playlist = await db.playlist.create({
    data: {
      name,
      description,
      userId,
    },
  });

  if (!playlist) {
    return res.status(400).json(new ApiError(400, "Failed to create playlist"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(201, true, "Playlist created successfully", { playlist }),
    );
});

const getAllListDetails = asyncHandler(async (req, res) => {
  const { id: userId } = req.userId;

  const playlists = await db.playlist.findMany({
    where: {
      userId,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlists) {
    return res.status(404).json(new ApiError(404, "Playlist not found"));
  }

  res.status(200).json(
    new ApiResponse(200, true, "Playlist fetched Successfully", {
      playlists,
    }),
  );
});

const getPlayListDetails = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { id: userId } = req.user;

  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
      userId,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, true, "Playlist fetched successfully", { playlist }),
    );
});

const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid or missing problemId"));
  }

  const problemsInPlaylist = await db.problemInPlaylist.createMany({
    data: problemIds.map((problemId) => {
      playlistId, problemId;
    }),
  });

  if (!problemsInPlaylist) {
    return res
      .status(400)
      .json(new ApiError(400, "Faild to add problem to the playlist"));
  }

  res.status(201).json(
    new ApiResponse(201, true, "Problem added to playlist successfully", {
      problemsInPlaylist,
    }),
  );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const deletedPlaylist = await db.playlist.delete({
    where: {
      id: playlistId,
    },
  });

  res.status(200).json(
    new ApiResponse(200, true, "Playlist deleted successfully", {
      deletedPlaylist,
    }),
  );
});

const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid or missing problemsId"));
  }

  const deletedProblem = await db.problemInPlaylist.deleteMany({
    where: {
      playlistId,
      problemId: {
        in: problemIds,
      },
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, true, "Problem removed from playlist successfully", {
        deletedProblem,
      }),
    );
});

export {
  createPlaylist,
  getAllListDetails,
  getPlayListDetails,
  addProblemToPlaylist,
  deletePlaylist,
  removeProblemFromPlaylist,
};
