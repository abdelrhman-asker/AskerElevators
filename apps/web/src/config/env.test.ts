import { describe, expect, it } from "vitest";

import { parseWebEnv, WebConfigurationError } from "./env";

describe("parseWebEnv", () => {
  it.each([
    ["http://localhost:3100", "http://localhost:3100"],
    ["https://api.example.test/", "https://api.example.test"],
    ["https://api.example.test///", "https://api.example.test"],
  ])("accepts and normalizes %s", (input, expected) => {
    expect(parseWebEnv({ VITE_API_BASE_URL: input })).toEqual({
      apiBaseUrl: expected,
    });
  });

  it.each([undefined, "relative/path", "ftp://example.test"])(
    "rejects an invalid public API URL",
    (value) => {
      expect(() => parseWebEnv({ VITE_API_BASE_URL: value })).toThrow(
        WebConfigurationError,
      );
    },
  );

  it("names the variable without echoing its invalid value", () => {
    const secretLikeValue = "not-a-url-with-sensitive-text";

    expect(() =>
      parseWebEnv({ VITE_API_BASE_URL: secretLikeValue }),
    ).toThrow(/VITE_API_BASE_URL/);
    expect(() =>
      parseWebEnv({ VITE_API_BASE_URL: secretLikeValue }),
    ).not.toThrow(secretLikeValue);
  });
});
