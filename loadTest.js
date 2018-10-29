import http from "k6/http";
import { check, sleep } from "k6";

let baseURL = "http://ec2-18-197-243-11.eu-central-1.compute.amazonaws.com";

export let options = {
  vus: 50,
  duration: "90s"
};

export default function() {
  let res = http.get(baseURL + "/getEmergencies");
  check(res, {
    "get success": (r) => r.status == 200
  });

  let formdata = {
    name: "Hardit",
    mobile: 93970544,
    postcode: "623814",
    bldgNumber: "045-04-654",
    emergencyType: "WaterEmergencie",
    location: {
      latitude: 1.3521974,
      longitude: 103.6853002
    }
  };

  res = http.post(baseURL + "/emergency", formdata);

  check(res, {
    "post success": (r) => r.status == 200
  });
};
