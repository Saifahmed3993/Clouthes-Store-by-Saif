import { formatCurrency, formatDate } from "@/utils/format";

describe("format utilities", () => {
  it("formats USD values without cents", () => {
    expect(formatCurrency(128)).toBe("$128");
  });

  it("formats ISO dates for storefront display", () => {
    expect(formatDate("2026-04-18")).toBe("Apr 18, 2026");
  });
});
