import { useEffect, useState } from "react";
import classes from "./styles/app.module.css";
import Navbar from "./components/Navbar";
import axios, { AxiosError } from "axios";
import { convertAllLowercaseToSentenceCase } from "./utils/textHelpers";
import clear from "./assets/cloudy.png";
import cloudy from "./assets/clear.png";
import cloudynight from "./assets/cloudatnight.png";
import mist from "./assets/mist.png";
import snow from "./assets/snow.png";
import thunderstorm from "./assets/thunderstorm.png";
import rain from "./assets/rain.png";

type RecordOrNull = Record<string, any> | null;

const renderLabel = (key: string, value: string | number) => (
  <>
    <div className={classes.weather_values}>
      <p>{key}</p>
      <p>{value}</p>
    </div>
  </>
);

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("Lagos");
  const [data, setData] = useState<RecordOrNull>(null);
  const [error, setError] = useState<string | null>(null);
  const date = new Date();
  const API_KEY = "dc528f8ead8652dee454bb7242a5a154";

  const fetchCurrentWeather = async (latitude: number, longitude: number) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );

      if (res) {
        setData(res.data);
      }
    } catch (error) {
      setData(null);
    } finally {
      setLoading(false);
    }
  };
  const fetchGeolocation = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        ` http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${API_KEY}`
      );
      if (res.data.length > 0) {
        fetchCurrentWeather(res.data[0].lat, res.data[0].lon);
      } else {
        setData(null);
        setError("Location not found");
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(
          error.response?.data.message || "Failed to fetch geolocation data"
        );
      } else {
        setError("An unknown error occurred");
      }
      setData(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeolocation();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocation(value);
  };

  const search = () => {
    fetchGeolocation();
  };

  const getBg = () => {
    switch (data?.weather[0].main) {
      case "Rain":
        return rain;

      case "Thunderstorm":
        return thunderstorm;

      case "Drizzle":
        return cloudynight;

      case "Snow":
        return snow;

      case "Clouds":
        return cloudy;

      case "Clear":
        return clear;

      case "Atmosphere":
        return mist;
      default:
        break;
    }
  };

  return (
    <>
      <div
        className={classes.body}
        style={{
          backgroundImage: `url("${getBg()}")`,
        }}
      >
        <Navbar
          location={location}
          onChange={handleInputChange}
          search={search}
        />
        {loading ? (
          <p style={{ color: "white", fontSize: "3rem" }}>Loading...</p>
        ) : data ? (
          <div className={classes.weather_data}>
            <div className={classes.main_weather}>
              <div className={classes.weather_value}>
                <div className={classes.weather_degrees}>
                  <p>{Math.floor(data?.main?.temp - 273.15)}°</p>
                </div>
                <div className={classes.weather_constraints}>
                  <p className={classes.weather_location}>{location}</p>
                  <p
                    className={classes.weather_date}
                  >{`${date.toLocaleDateString()}`}</p>
                </div>
              </div>
            </div>
            <div className={classes.weather_details}>
              <p style={{ fontSize: "2.5rem" }}>Weather Details...</p>
              <p>
                {convertAllLowercaseToSentenceCase(
                  data?.weather[0].description
                )}
              </p>

              {renderLabel(
                "Temperature Max",
                `${Math.floor(data?.main?.temp_max - 273.15) || ""}°`
              )}
              {renderLabel(
                "Temperature Min",
                `${Math.floor(data?.main?.temp_min - 273.15) || ""}°`
              )}
              {renderLabel("Humidity", `${data?.main?.humidity || ""}%`)}
              {renderLabel("Pressure", `${data?.main?.pressure || ""}`)}
              <div className={classes.weather_values}>
                <p>Icon</p>
                <img
                  src={`https://openweathermap.org/img/wn/${
                    data?.weather[0].icon || ""
                  }@${data?.cod.toString()[0]}x.png`}
                />
              </div>
            </div>
          </div>
        ) : (
          <p style={{ color: "white", fontSize: "3rem" }}>{error || "ERROR"}</p>
        )}
      </div>
    </>
  );
}

export default App;
