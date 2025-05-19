import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlayListDetails, removeProblemFromPlaylist } from "../controllers/playlist.controller.js";

const playlistRoutes = Router()

playlistRoutes.route("/").get(isAuthenticated, getAllListDetails)
playlistRoutes.route("/:playlistId").get(isAuthenticated, getPlayListDetails)
playlistRoutes.route("/create-playlist").post(isAuthenticated, createPlaylist)
playlistRoutes.route("/:playlistId/add-problem").post(isAuthenticated, addProblemToPlaylist)
playlistRoutes.route("/:playlistId").delete(isAuthenticated, deletePlaylist)
playlistRoutes.route("/:playlistId/remove-problem").delete(isAuthenticated, removeProblemFromPlaylist)

export default playlistRoutes