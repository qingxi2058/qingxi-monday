import test from "node:test";
import assert from "node:assert/strict";

import { createMondayKit, MONDAY_MODES } from "../logic.js";

test("returns a full monday survival kit for a known mode", () => {
  const kit = createMondayKit(
    { mode: "meeting", detail: "早会", intensity: "sharp" },
    () => 0,
  );

  assert.equal(kit.mode, "meeting");
  assert.equal(kit.modeLabel, MONDAY_MODES.meeting.label);
  assert.ok(kit.headline.length > 0);
  assert.ok(kit.excuse.length > 0);
  assert.ok(kit.reply.length > 0);
  assert.ok(kit.caption.length > 0);
  assert.ok(kit.shareText.includes("早会"));
});

test("falls back to a safe mode when an unknown mode is passed in", () => {
  const kit = createMondayKit({ mode: "???", intensity: "low" }, () => 0);

  assert.equal(kit.mode, "soul");
  assert.equal(kit.modeLabel, MONDAY_MODES.soul.label);
});

test("uses the provided detail in at least one output block", () => {
  const kit = createMondayKit(
    { mode: "leave", detail: "述职会", intensity: "feral" },
    () => 0,
  );

  const combined = [kit.headline, kit.excuse, kit.reply, kit.caption].join(" ");
  assert.match(combined, /述职会/);
});
