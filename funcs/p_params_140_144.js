// Code from a NodeRed function node, "On Message" function, provided separately for browsing

// Normalize array to use register number instead of starting at index 0
const indexBase = Number(msg.modbusRequest.address);
let newArray = Array(indexBase);
msg.payload = newArray.concat(msg.payload);

const cx34map = [
  { index: 140, name: "run", measurement: "mode", modes: ["off", "on"] },
  { index: 141, name: "mode", measurement: "mode", modes: ["off", "cool", "heat", "dhw"] },
]

let newMsg = {payload: msg.payload};

// Store and translate modbus register values
for (const register of cx34map) {
  let val = msg.payload[register.index];

  if (register.measurement=="temperature")
    val = val * 9 / 5 + 32;

  if (register.measurement == "deltaTemperature")
    val = Math.round(val * 9 / 5 * 10) / 10;

  if (register.measurement == "switch")
    val = val > 0;

  if (register.measurement == "flow")
    val = Math.round(val * 0.26417);

  if (register.measurement == "current")
    val = val;

  if (register.measurement == "mode")
    val = register.modes[val];

  newMsg[register.name] = val;
}

let cx34 = flow.get("cx34");
cx34.run = newMsg.run;
cx34.mode = newMsg.mode;
flow.set("cx34", cx34);

return newMsg;
