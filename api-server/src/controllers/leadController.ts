import { Request, Response } from "express";
import { leadService } from "../services/leadService.js";

export const leadController = {
  create: async (req: Request, res: Response) => {
    try {
      const lead = await leadService.createLead(req.body);
      res.status(201).json(lead);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  list: async (req: Request, res: Response) => {
    try {
      const orgId = req.user?.org_id;
      if (!orgId) return res.status(401).json({ error: "Unauthorized! No organization linked to this account." });

      const leads = await leadService.getLeadsByOrg(orgId);
      res.json(leads);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
