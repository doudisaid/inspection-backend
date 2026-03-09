import { Router } from "express";
import  EtabController from "../controllers/etablissement.controller.js";

const router = Router();

router.get("/", EtabController.getEtablissements);
router.get("/:id", EtabController.getEtablissement);
router.post("/", EtabController.addEtablissement);
router.put("/:id", EtabController.updateEtablissement);
router.delete("/:id", EtabController.deleteEtablissement);
router.get("/secteur/:secteurId", EtabController.getEtablissementBySecteur);

export default router;
