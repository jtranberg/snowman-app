import React, { useMemo, useState } from 'react';
import '../components/WifiSetupPanel.css';

export default function WiFiSetupPanel() {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);

  const statusType = useMemo(() => {
    if (status.startsWith('✅')) return 'success';
    if (status.startsWith('❌')) return 'error';
    if (status.startsWith('🔍') || status.startsWith('🔗')) return 'info';
    return 'idle';
  }, [status]);

  const sendWiFiCredentials = async () => {
    const serviceUUID = '12345678-1234-1234-1234-1234567890ab';
    const characteristicUUID = 'abcd1234-ab12-cd34-ef56-1234567890ab';

    if (!ssid.trim()) {
      setStatus('❌ Please enter a Wi-Fi SSID.');
      return;
    }

    if (!password.trim()) {
      setStatus('❌ Please enter a Wi-Fi password.');
      return;
    }

    if (!navigator.bluetooth) {
      setStatus('❌ Web Bluetooth is not available in this browser.');
      return;
    }

    try {
      setIsSending(true);
      setStatus('🔍 Scanning for Snowman device...');

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'SnowmanConfig' }],
        optionalServices: [serviceUUID],
      });

      setStatus('🔗 Connecting...');

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(serviceUUID);
      const characteristic = await service.getCharacteristic(characteristicUUID);

      const json = JSON.stringify({ ssid: ssid.trim(), password }) + '\n';
      const encoder = new TextEncoder();

      await characteristic.writeValue(encoder.encode(json));

      setStatus('✅ Credentials sent successfully!');
    } catch (err) {
      console.error('❌ BLE Error:', err);
      const message =
        err instanceof Error ? err.message : 'Unknown Bluetooth error';
      setStatus(`❌ Failed to send credentials: ${message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="wifi-setup-panel">
      <div className="wifi-panel-header">
        <h2>📶 Wi-Fi Setup via BLE</h2>
        <span className="wifi-panel-badge">Snowman Config</span>
      </div>

      <p className="wifi-panel-copy">
        Enter the Wi-Fi network details and send them directly to your Snowman
        device over Bluetooth.
      </p>

      <div className="wifi-form-group">
        <label className="wifi-label" htmlFor="wifi-ssid">
          Network Name
        </label>
        <input
          id="wifi-ssid"
          type="text"
          placeholder="Wi-Fi SSID"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          className="wifi-input"
          autoComplete="off"
        />
      </div>

      <div className="wifi-form-group">
        <label className="wifi-label" htmlFor="wifi-password">
          Password
        </label>
        <input
          id="wifi-password"
          type="password"
          placeholder="Wi-Fi Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="wifi-input"
          autoComplete="current-password"
        />
      </div>

      <button
        onClick={sendWiFiCredentials}
        className="wifi-send-button"
        disabled={isSending}
      >
        {isSending ? 'Connecting...' : '📲 Send to Device'}
      </button>

      {status && (
        <div className={`wifi-status wifi-status-${statusType}`}>
          {status}
        </div>
      )}
    </div>
  );
}