import { SerialPort } from "serialport";

const port = new SerialPort({
  path: "",
  baudRate: 57600,
});

port.write("Test to arduino", function (err) {
  if (err) {
    return console.log("Error on write: ", err.message);
  }
  console.log("message written");
});
