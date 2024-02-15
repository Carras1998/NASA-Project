import { useState, useEffect } from 'react'
import './App.css'

const NASA_URL = "https://api.nasa.gov/"
const NASA_API_KEY = "bjE0p7a9fpk3Jrwz4tgwtjWthIG7LsBMefwx4cq0"

function App() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAPI, setSelectedAPI] = useState('apod'); // APOD por defecto
  const [imageData, setImageData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url;
        if (selectedAPI === 'apod') {
          url = `${NASA_URL}planetary/apod?api_key=${NASA_API_KEY}&date=${selectedDate}`;
        } else if (selectedAPI === 'rovers') {
          url = `${NASA_URL}mars-photos/api/v1/rovers/curiosity/photos?earth_date=${selectedDate}&api_key=${NASA_API_KEY}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('No hay fotografía disponible.');
        }
        const data = await response.json();
        setImageData(data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setErrorMessage(error.message);
        setImageData(null);
      }
    };

    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      const today = new Date();
      if (selectedDateObj > today) {
        setErrorMessage('No puedes seleccionar una fecha mayor a la de hoy.');
        setImageData(null);
        return;
      }
      fetchData();
    }
  }, [selectedDate, selectedAPI]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleAPIChange = (event) => {
    setSelectedAPI(event.target.value);
  };

  return (
    <div>
      <h1>Imagen astronómica del día</h1>
      <select value={selectedAPI} onChange={handleAPIChange}>
        <option value="apod">APOD</option>
        <option value="rovers">Mars Rovers</option>
      </select>
      <input type="date" max={new Date().toISOString().slice(0, 10)} value={selectedDate} onChange={handleDateChange} />
      {errorMessage && <p>{errorMessage}</p>}
      {imageData && (
        <div>
          <h2>{selectedAPI === 'apod' ? imageData.title : 'Mars Rover Image'}</h2>
          <img src={selectedAPI === 'apod' ? imageData.url : imageData.img_src} alt={selectedAPI === 'apod' ? imageData.title : 'Mars Rover Image'} />
          <p>{selectedAPI === 'apod' ? imageData.explanation : 'Mars Rover Image Description'}</p>
          <p>Fecha: {selectedDate}</p>
        </div>
      )}
    </div>
  );
}

export default App;