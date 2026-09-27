import {
  readAgentPermissionMode,
  writeAgentPermissionMode,
} from "@/lib/utils/client-storage";

describe("Agent permission storage migration", () => {
  beforeEach(() => window.localStorage.clear());

  it("resets an earlier implicit full-access preference", () => {
    window.localStorage.setItem("agent_permission_mode", "full_access");
    expect(readAgentPermissionMode()).toBe("ask_approval");
  });

  it("persists a deliberate choice after migration", () => {
    writeAgentPermissionMode("full_access");
    expect(readAgentPermissionMode()).toBe("full_access");
  });
});
