import { IMissionCreator } from "../../abstractions/IMissionCreator";

export class MockMissionCreator implements IMissionCreator {
  CreateMission(req: any, res: any) {
    res.json({
      success: true,
      message: "Mission created"
    });
  }
}
