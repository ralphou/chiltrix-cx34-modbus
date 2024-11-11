// Code from a NodeRed function node, "On Message" function, provided separately for browsing

// Mapping of modbus registers, limited selection of P-Parameters
var cx34map = [
  { index: 2, name: "hysteresisF", measurement: "deltaTemperatureF" },
  { index: 2, name: "hysteresisC", measurement: "deltaTemperature" },
  { index: 3, name: "defrostStartC", measurement: "temperatureC" },
  { index: 3, name: "defrostStartF", measurement: "temperatureF" },
  { index: 6, name: "defrostStopC", measurement: "temperatureC" },
  { index: 6, name: "defrostStopF", measurement: "temperatureF" },
  { index: 15, name: "coolingSetpointF", measurement: "temperatureF" },
  { index: 15, name: "coolingSetpointC", measurement: "temperatureC" },
  { index: 16, name: "heatingSetpointF", measurement: "temperatureF" },
  { index: 16, name: "heatingSetpointC", measurement: "temperatureC" },
  { index: 23, name: "eevControlMode", measurement: "mode", modes:["no","checking","manual","auto"] },
  { index: 26, name: "primaryPumpMode", measurement: "mode", modes: ["run continuously", "stop when setpoint met", "run 1 minute every 15 minutes"] },
  { index: 36, name: "compressorMaxSpeed", measurement: "speed" },
  { index: 44, name: "setpointTolerance", measurement: "deltaTemperature" },
  { index: 50, name: "flowSwitchThreshold", measurement: "flow" },
  { index: 50, name: "flowSwitchThresholdSI", measurement: "flowSI" },
  { index: 52, name: "flowSwitchType", measurement: "mode", modes:["on-off switch","YF-G1 meter","YF-DN50 meter","SEN-HZG1WA waterflow sensor","heat meter","DN40"] },
  { index: 68, name: "primaryPumpTargetDeltaTempF", measurement: "deltaTemperatureF" },
  { index: 68, name: "primaryPumpTargetDeltaTempC", measurement: "deltaTemperatureC" },
  { index: 69, name: "primaryPumpMinSpeed", measurement: "speed", maxSpeed:8 },
  { index: 77, name: "elecMeterAddress", measurement: "address" },
  { index: 103, name: "ambientTempAutoHeating", measurement: "temperatureC" },
  { index: 104, name: "ambientTempAutoCooling", measurement: "temperatureC" },
]

var newMsg = {payload: msg.payload};

for (const register of cx34map) {
  var val = msg.payload[register.index];

  if (register.measurement=="temperatureF")
    val = Math.round(val * 9 / 5 + 32);

  if (register.measurement == "deltaTemperatureF")
    val = Math.round(val * 9 / 5 * 10) / 10;

  if (register.measurement == "switch")
    val = val > 0;

  if (register.measurement == "flow")
    val = Math.round(val * 0.26417 * 10) / 10;

  if (register.measurement == "current")
    val = val;

  if (register.measurement == "mode")
    val = register.modes[val];

  newMsg[register.name] = val;
}

let cx34 = flow.get("cx34");
cx34.coolingSetpoint = newMsg.coolingSetpointC;
cx34.heatingSetpoint = newMsg.heatingSetpointC;
cx34.coolingSetpointF = newMsg.coolingSetpointF;
cx34.heatingSetpointF = newMsg.heatingSetpointF;
cx34.hysteresisF = newMsg.hysteresisF;
cx34.flowSwitchType = newMsg.flowSwitchType;
flow.set("cx34", cx34);

return newMsg;
