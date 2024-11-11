// This is code from a NodeRed function node, "On Message" function, provided separately for browsing

// Mapping of modbus registers, limited selection of C-Parameters (read only)
var cx34map = [
  { index: 0, name: "coilTemp", measurement: "temperature" },
  { index: 1, name: "exhaustTemp", measurement: "temperature" },
  { index: 2, name: "ambientTemp", measurement: "temperature" },
  { index: 3, name: "outletWaterTemp", measurement: "temperature" },
  { index: 7, name: "heatingSwitch", measurement: "switch" },
  { index: 8, name: "coolingSwitch", measurement: "switch" },
  { index: 13, name: "stopNoWaterFlow", measurement: "switch" },
  { index: 15, name: "stopCompressorOvercurrent", measurement: "switch" },
  { index: 16, name: "defrost", measurement: "switch" },
  { index: 17, name: "antifreeze", measurement: "switch" },
  { index: 19, name: "compressorSpeed", measurement: "speed", maxSpeed:80 },
  { index: 20, name: "condenserFan", measurement: "switch" },
  { index: 21, name: "compressorHeater", measurement: "switch" },
  { index: 29, name: "primaryPump", measurement: "switch" },
  { index: 32, name: "current", measurement: "current" },
  { index: 34, name: "heatTargetTemp", measurement: "temperature" },
  { index: 40, name: "expansionValveOpening", measurement: "angle" },
  { index: 44, name: "lubricantStatus", measurement: "switch" },
  { index: 45, name: "indoorTemp", measurement: "temperature" },
  { index: 46, name: "acHeatTargetTemp", measurement: "temperature" },
  { index: 47, name: "waterFlow", measurement: "flow" },
  { index: 47, name: "waterFlowUnrounded", measurement: "flowUnrounded" },
  { index: 51, name: "primaryPumpSpeed", measurement: "speed", maxSpeed: 10 },
  { index: 52, name: "primaryPumpDuty", measurement: "duty" },
  { index: 53, name: "condenserFan1Speed", measurement: "speed", maxSpeed: 900 },
  { index: 54, name: "condenserFan2Speed", measurement: "speed", maxSpeed: 900 },
  { index: 55, name: "mode", measurement: "mode", modes:["off","cool","heat","dhw"] },
  { index: 56, name: "targetSpeed", measurement: "speed", maxSpeed: 80 },
  { index: 60, name: "inletWaterTemp", measurement: "temperature" },
  { index: 73, name: "acVoltage", measurement: "voltage" },
  { index: 76, name: "busVoltage", measurement: "voltage" },
]

// Initialize output message
var newMsg = {payload: msg.payload};

// Store and translate modbus register values
for (const register of cx34map) {
  var val = msg.payload[register.index];

  // Temperatures are communicated in celsius with 1 decimal
  if (register.measurement=="temperature")
    val = val / 10 * 9 / 5 + 32;

  if (register.measurement == "switch")
    val = val > 0;

  // Flows are communicated in L/min with 1 decimal
  if (register.measurement == "flow")
    val = Math.round(val * 0.26417) / 10;

  if (register.measurement == "flowUnrounded")
    val = val * 0.26417 / 10;

  if (register.measurement == "current")
    val = val / 10;

  if (register.measurement == "speed" && "maxSpeed" in register)
    val = Math.round(val / register.maxSpeed * 100);

  if (register.measurement == "mode")
    val = register.modes[val];

  newMsg[register.name] = val;
}

// Update flow context object with some selected values
let cx34 = flow.get("cx34");
cx34.mode = newMsg.mode;
cx34.compressorSpeed = newMsg.compressorSpeed;
cx34.flowSI = msg.payload[47] / 10;
flow.set("cx34", cx34);

// Return new message, which contains processed register values
return newMsg;
