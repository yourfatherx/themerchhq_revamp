import { describe, expect, it } from "vitest";
import {
  isSlugAvailableShape,
  isSlugShaped,
  RESERVED_SLUGS,
  resolveSurface,
} from "@/lib/hostname";

describe("STO-1 — the storefront resolves by subdomain", () => {
  it("routes a tenant subdomain to that storefront", () => {
    expect(resolveSurface("music.themerchhq.in")).toEqual({
      kind: "storefront",
      slug: "music",
    });
  });

  it("ignores the port", () => {
    expect(resolveSurface("music.themerchhq.in:3000")).toEqual({
      kind: "storefront",
      slug: "music",
    });
  });

  it("is case-insensitive", () => {
    expect(resolveSurface("MUSIC.TheMerchHQ.in")).toEqual({
      kind: "storefront",
      slug: "music",
    });
  });

  it("routes the apex to marketing", () => {
    expect(resolveSurface("themerchhq.in")).toEqual({ kind: "marketing" });
  });

  it("routes www to marketing, not a tenant called www", () => {
    expect(resolveSurface("www.themerchhq.in")).toEqual({ kind: "marketing" });
  });

  it("treats a missing Host as marketing rather than throwing", () => {
    expect(resolveSurface(null)).toEqual({ kind: "marketing" });
    expect(resolveSurface("")).toEqual({ kind: "marketing" });
  });
});

describe("local development exercises the same path", () => {
  it("localhost is the marketing site", () => {
    expect(resolveSurface("localhost:3000")).toEqual({ kind: "marketing" });
  });

  it("a subdomain of localhost is a storefront", () => {
    expect(resolveSurface("music.localhost:3000")).toEqual({
      kind: "storefront",
      slug: "music",
    });
  });
});

describe("hostnames that must never become a tenant", () => {
  it("rejects every reserved subdomain", () => {
    for (const slug of RESERVED_SLUGS) {
      expect(
        resolveSurface(`${slug}.themerchhq.in`),
        `${slug} must not resolve to a storefront`,
      ).toEqual({ kind: "marketing" });
    }
  });

  it("rejects a nested subdomain", () => {
    expect(resolveSurface("a.b.themerchhq.in")).toEqual({ kind: "marketing" });
  });

  it("rejects a lookalike domain that merely ends in the same letters", () => {
    // notthemerchhq.in must not be read as a tenant of themerchhq.in.
    expect(resolveSurface("evil-notthemerchhq.in")).toEqual({
      kind: "marketing",
    });
    expect(resolveSurface("music.notthemerchhq.in")).toEqual({
      kind: "marketing",
    });
  });

  it("treats a preview deployment as marketing, not a tenant", () => {
    expect(resolveSurface("merch-hq-abc123.vercel.app")).toEqual({
      kind: "marketing",
    });
  });

  it("rejects a slug with characters DNS would not carry", () => {
    for (const bad of ["Music", "mu_sic", "-music", "music-", "m", "a.b"]) {
      expect(isSlugShaped(bad), `${bad} should not be slug-shaped`).toBe(false);
    }
  });
});

describe("OPS-1 — slug validation on save", () => {
  it("accepts the shapes a tenant may take", () => {
    for (const ok of ["music", "music-club", "hostel-night-2026", "bits24"]) {
      expect(isSlugShaped(ok), `${ok} should be slug-shaped`).toBe(true);
    }
  });

  it("refuses reserved names even when well-formed", () => {
    expect(isSlugShaped("dashboard")).toBe(true);
    expect(isSlugAvailableShape("dashboard")).toBe(false);
  });

  it("holds the DNS label limit of 63 characters", () => {
    expect(isSlugShaped("a".repeat(63))).toBe(true);
    expect(isSlugShaped("a".repeat(64))).toBe(false);
  });
});
