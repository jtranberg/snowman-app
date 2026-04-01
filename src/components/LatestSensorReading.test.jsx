import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import LatestSensorReading from "./LatestSensorReading";

function seedStorage() {
  sessionStorage.setItem(
    "snowman_latest_reading",
    JSON.stringify({
      alpha: 21.1,
      bravo: 22.2,
      charlie: 23.3,
      delta: 24.4,
      echo: 25.5,
      voltA: 12.4,
      voltB: 12.3,
      voltC: 12.2,
      timestamp: new Date().toISOString(),
      state: "IDLE",
    })
  );

  sessionStorage.setItem(
    "snowman_latest_env",
    JSON.stringify({
      co2ppm: 612,
      scdTemp: 20.15,
      scdRH: 45.2,
      timestamp: new Date().toISOString(),
    })
  );

  sessionStorage.setItem(
    "snowman_latest_runtime",
    JSON.stringify({
      totalOnMs: 3600000,
      lastState: "IDLE",
      lastTs: new Date().toISOString(),
    })
  );
}

describe("LatestSensorReading", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders cached reading from sessionStorage", () => {
    sessionStorage.setItem(
      "snowman_latest_reading",
      JSON.stringify({
        alpha: 21.1,
        bravo: 22.2,
        charlie: 23.3,
        delta: 24.4,
        echo: 25.5,
        voltA: 12.4,
        voltB: 12.3,
        voltC: 12.2,
        timestamp: new Date().toISOString(),
        state: "ACTIVE",
      })
    );

    sessionStorage.setItem(
      "snowman_latest_env",
      JSON.stringify({
        co2ppm: 612,
        scdTemp: 20.15,
        scdRH: 45.2,
        timestamp: new Date().toISOString(),
      })
    );

    sessionStorage.setItem(
      "snowman_latest_runtime",
      JSON.stringify({
        totalOnMs: 3600000,
        lastState: "IDLE",
        lastTs: new Date().toISOString(),
      })
    );

    render(<LatestSensorReading />);

    expect(screen.getByText(/latest sensor readings/i)).toBeInTheDocument();
    expect(screen.getByText("612")).toBeInTheDocument();
    expect(screen.getByText(/21\.1/)).toBeInTheDocument();
    expect(screen.getByText("12.40")).toBeInTheDocument();
  });

  it("sends refresh request and keeps showing cached data when no new firmware reading arrives", async () => {
    seedStorage();

    global.fetch = vi.fn((url) => {
      if (url.includes("request-data")) {
        return Promise.resolve({
          ok: true,
          text: async () => JSON.stringify({ ok: true }),
        });
      }

      if (url.includes("latest/env")) {
        return Promise.resolve({
          ok: true,
          text: async () =>
            JSON.stringify({
              co2ppm: 612,
              scdTemp: 20.15,
              scdRH: 45.2,
              timestamp: new Date().toISOString(),
            }),
        });
      }

      if (url.includes("runtime")) {
        return Promise.resolve({
          ok: true,
          text: async () =>
            JSON.stringify({
              totalOnMs: 3600000,
              lastState: "IDLE",
              lastTs: new Date().toISOString(),
            }),
        });
      }

      if (url.includes("latest")) {
        return Promise.resolve({
          ok: true,
          text: async () =>
            JSON.stringify({
              alpha: 21.1,
              bravo: 22.2,
              charlie: 23.3,
              delta: 24.4,
              echo: 25.5,
              voltA: 12.4,
              voltB: 12.3,
              voltC: 12.2,
              co2ppm: 612,
              scdTemp: 20.15,
              scdRH: 45.2,
              timestamp: new Date().toISOString(),
              state: "IDLE",
            }),
        });
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });

    render(<LatestSensorReading />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(
      global.fetch.mock.calls.some(([url]) => url.includes("request-data"))
    ).toBe(true);

    expect(screen.getByText("612")).toBeInTheDocument();
    expect(screen.getByText("12.40")).toBeInTheDocument();
  });

  it(
    "shows an error when latest fetch fails",
    async () => {
      seedStorage();

      global.fetch = vi.fn((url) => {
        if (url.includes("request-data")) {
          return Promise.resolve({
            ok: true,
            text: async () => JSON.stringify({ ok: true }),
          });
        }

        if (url.includes("latest")) {
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            text: async () => "boom",
          });
        }

        return Promise.resolve({
          ok: true,
          text: async () => JSON.stringify({}),
        });
      });

      render(<LatestSensorReading />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(
        () => {
          expect(
            screen.getByText(/500 internal server error/i)
          ).toBeInTheDocument();
        },
        { timeout: 4000 }
      );

      expect(screen.getByText("612")).toBeInTheDocument();
      expect(screen.getByText("12.40")).toBeInTheDocument();
    },
    8000
  );

  it("toggles auto refresh", () => {
    render(<LatestSensorReading />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});