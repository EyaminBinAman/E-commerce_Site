const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../../middleware/auth.middleware.js");
const {
  getAnimals,
  postAnimal,
  updateAnimal,
  deleteAnimal,
  toggleAnimalActive,
} = require("../../controllers/v1/animalController.js");

router.get("/get-animals", getAnimals);
router.post("/post-animals", protect, adminOnly, postAnimal);
router.patch("/update-animals/:id", protect, adminOnly, updateAnimal);
router.delete("/delete-animals/:id", protect, adminOnly, deleteAnimal);
router.patch("/active-on-off-animals/:id", protect, adminOnly, toggleAnimalActive);

module.exports = router;
