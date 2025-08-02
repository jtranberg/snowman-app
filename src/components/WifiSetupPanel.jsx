import React, { useState } from 'react';

export default function WiFiSetupPanel() {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const sendWiFiCredentials = async () => {
    const serviceUUID = '12345678-1234-1234-1234-1234567890ab';
    const characteristicUUID = 'abcd1234-ab12-cd34-ef56-1234567890ab';

    try {
      setStatus('🔍 Scanning for Snowman device...');
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'SnowmanConfig' }],
        optionalServices: [serviceUUID],
      });

      setStatus('🔗 Connecting...');
      const server = await device.gatt.connect();

      const service = await server.getPrimaryService(serviceUUID);
      const characteristic = await service.getCharacteristic(characteristicUUID);

      const json = JSON.stringify({ ssid, password });
      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(json));

      setStatus('✅ Credentials sent successfully!');
    } catch (err) {
      console.error('❌ BLE Error:', err);
      setStatus(`❌ Failed to send credentials: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '1rem', background: '#1e293b', color: '#fff', borderRadius: '12px', maxWidth: '400px', marginTop: '2rem' }}>
      <h2 style={{ color: '#38bdf8' }}>📶 Wi-Fi Setup via BLE</h2>
      <p>Enter the SSID and password to send to your Snowman device over Bluetooth.</p>

      <input
        type="text"
        placeholder="Wi-Fi SSID"
        value={ssid}
        onChange={(e) => setSsid(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Wi-Fi Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      <button onClick={sendWiFiCredentials} style={buttonStyle}>
        📲 Send to Device
      </button>

      {status && <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>{status}</p>}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  margin: '0.5rem 0',
  borderRadius: '8px',
  border: '1px solid #94a3b8',
  fontSize: '1rem',
};

const buttonStyle = {
  backgroundColor: '#38bdf8',
  color: '#0f172a',
  border: 'none',
  borderRadius: '8px',
  padding: '0.5rem 1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '0.5rem',
};
