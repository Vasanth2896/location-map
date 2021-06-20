import React, { useState } from "react";
import {
  Viewer,
  Entity,
  PointGraphics,
  EntityDescription,
  CameraFlyTo,
} from "resium";
import { Cartesian3 } from "cesium";
import { Container, Dropdown } from "react-bootstrap";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import tzlookup from "tz-lookup";
import DateFnsUtils from "@date-io/date-fns";
import { citiesList } from "./Constants/CityLists";


const App = () => {
  const [city, setCity] = useState(null);

  const handleChange = (cityName, long, lat) => {
    const timeZone = tzlookup(lat, long);
    let date = new Date(new Date().toLocaleString("en-US", { timeZone }));
    setCity({ city: cityName, long, lat, time: date });
  };

  return (
    <div>
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 30,
            margin: "20px 0px 20px 0px",
          }}
        >
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {city ? city?.city : "Cities"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {citiesList.map((city) => (
                <Dropdown.Item
                  onSelect={() => {
                    handleChange(city.name, city.longitude, city.latitude);
                  }}
                  key={city.id}
                >
                  {city.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {city?.time && (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker value={city?.time} readOnly />
            </MuiPickersUtilsProvider>
          )}
        </div>
        <Viewer>
          {city && (
            <div>
              <CameraFlyTo
                duration={5}
                destination={Cartesian3.fromDegrees(city.long, city.lat, 10000)}
              />
              <Entity
                position={Cartesian3.fromDegrees(city.long, city.lat, 10000)}
                name={city.city}
              >
                <PointGraphics pixelSize={10} />
                <EntityDescription>
                  <h1>{`This is ${city.city}`}</h1>
                </EntityDescription>
              </Entity>
            </div>
          )}
        </Viewer>
      </Container>
    </div>
  );
};

export default App;
