import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import WiFiSetupPanel from "./WifiSetupPanel";

describe("WiFiSetupPanel", () => {
  const originalBluetooth = navigator.bluetooth;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalBluetooth) {
      navigator.bluetooth = originalBluetooth;
    } else {
      delete navigator.bluetooth;
    }
  });

  it("renders the Wi-Fi setup form", () => {
    render(<WiFiSetupPanel />);

    expect(screen.getByText(/wi-fi setup via ble/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/network name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send to device/i })
    ).toBeInTheDocument();
  });

  it("shows an error if SSID is missing", async () => {
    render(<WiFiSetupPanel />);

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send to device/i }));

    expect(
      screen.getByText(/please enter a wi-fi ssid/i)
    ).toBeInTheDocument();
  });

  it("shows an error if password is missing", async () => {
    render(<WiFiSetupPanel />);

    fireEvent.change(screen.getByLabelText(/network name/i), {
      target: { value: "MyWifi" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send to device/i }));

    expect(
      screen.getByText(/please enter a wi-fi password/i)
    ).toBeInTheDocument();
  });

  it("shows an error if Web Bluetooth is unavailable", async () => {
    delete navigator.bluetooth;

    render(<WiFiSetupPanel />);

    fireEvent.change(screen.getByLabelText(/network name/i), {
      target: { value: "MyWifi" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send to device/i }));

    expect(
      screen.getByText(/web bluetooth is not available/i)
    ).toBeInTheDocument();
  });

  it("sends credentials successfully over BLE", async () => {
    const writeValue = vi.fn().mockResolvedValue(undefined);
    const getCharacteristic = vi.fn().mockResolvedValue({ writeValue });
    const getPrimaryService = vi.fn().mockResolvedValue({ getCharacteristic });
    const connect = vi.fn().mockResolvedValue({ getPrimaryService });
    const requestDevice = vi.fn().mockResolvedValue({
      gatt: { connect },
    });

    navigator.bluetooth = { requestDevice };

    render(<WiFiSetupPanel />);

    fireEvent.change(screen.getByLabelText(/network name/i), {
      target: { value: "MyWifi" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send to device/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/credentials sent successfully/i)
      ).toBeInTheDocument();
    });

    expect(requestDevice).toHaveBeenCalledWith({
      filters: [{ name: "SnowmanConfig" }],
      optionalServices: ["12345678-1234-1234-1234-1234567890ab"],
    });

    expect(connect).toHaveBeenCalled();
    expect(getPrimaryService).toHaveBeenCalledWith(
      "12345678-1234-1234-1234-1234567890ab"
    );
    expect(getCharacteristic).toHaveBeenCalledWith(
      "abcd1234-ab12-cd34-ef56-1234567890ab"
    );
    expect(writeValue).toHaveBeenCalledTimes(1);
  });

  it("shows an error if BLE send fails", async () => {
    const requestDevice = vi.fn().mockRejectedValue(new Error("User cancelled"));

    navigator.bluetooth = { requestDevice };

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<WiFiSetupPanel />);

    fireEvent.change(screen.getByLabelText(/network name/i), {
      target: { value: "MyWifi" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send to device/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/failed to send credentials: user cancelled/i)
      ).toBeInTheDocument();
    });

    errorSpy.mockRestore();
  });
});