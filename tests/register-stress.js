import http from "k6/http";
import { sleep, check } from "k6";

import uuid from './libs/uuid.js';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 }, 
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 },
    { duration: '5m', target: 400 }, 
    { duration: '10m', target: 0 },
    { duration: '10m', target: 200 },
    { duration: '30m', target: 200 },
    { duration: '5m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01']
  }
}

export default function () {
  const loginUrl = "https://serverest.dev/login";

  const loginPayload = JSON.stringify({
    email: "fulano@qa.com",
    password: "teste",
  })

  const loginHeaders = {
    headers: { "Content-Type": "application/json" },
  }

  const loginRes = http.post(loginUrl, loginPayload, loginHeaders);
  const token = loginRes.json("authorization");

  check(token, {
    "token is retrieved": (t) => t !== undefined && t !== "",
  })

  const url = "https://serverest.dev/usuarios";
  
  const payload = JSON.stringify({
    nome: "Fulano da Silva",
    email: `${uuid.v4().substring(24)}@qa.com.br`,
    password: "teste",
    administrador: "true"
  })

  const headers = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`,
    },
  }

  const res = http.post(url, payload, headers);

  check(res, {
    "status should be 201": (r) => r.status === 201,
  })

  sleep(1);
}