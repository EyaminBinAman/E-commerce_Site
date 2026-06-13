const express = require("express");
const router = express.Router();
const {
  getAnimals,
  postAnimal,
  updateAnimal,
  deleteAnimal,
  toggleAnimalActive,
} = require("../../controllers/v1/animalController.js");

router.get("/get-animals", getAnimals);
router.post("/post-animals", postAnimal);
router.patch("/update-animals/:id", updateAnimal);
router.delete("/delete-animals/:id", deleteAnimal);
router.patch("/active-on-off-animals/:id", toggleAnimalActive);

module.exports = router;
