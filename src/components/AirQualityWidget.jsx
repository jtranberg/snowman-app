// inside a new component AirQualityWidget.jsx
import { useEffect, useState } from 'react';

export default function AirQualityWidget() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://api.api-ninjas.com/v1/airquality?city=Vancouver', {
      headers: { 'X-Api-Key': 'YOUR_API_KEY' }
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading air quality...</p>;

  return (
    <div className="air-widget">
      <h4>🌬️ Air Quality Index: {data.overall_aqi}</h4>
      <p>PM2.5: {data.pm2_5} | CO: {data.co}</p>
    </div>
  );
}
