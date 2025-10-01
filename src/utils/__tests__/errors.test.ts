import { describe, it, expect } from "vitest";

const modulePath = "../errors";

describe("error utilities", () => {
  it("exposes known error messages", async () => {
    const { errorMap } = await import(modulePath);
    expect(errorMap.fetchRSSItems).toBe("There was an error updating your feed");
    expect(errorMap.sourceModalHandleSubmit).toBe("There was an error adding the source");
  });
});
