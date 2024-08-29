import http from "k6/http";
import { sleep, check } from "k6";

import uuid from './libs/uuid.js';

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "./logs/report.html": htmlReport(data),
  }
}

export const options = {
  vus: 10,
  duration: '30s',
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

  const loginRes = http.post(loginUrl, loginPayload, loginHeaders)
  const token = loginRes.json("authorization")

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

  const res = http.post(url, payload, headers)

  check(res, {
    "status should be 201": (r) => r.status === 201,
    'valida mensagem de sucesso': (r) => r.json('message') === 'Cadastro refsdsa',
    'valida ID de cadastro': (r) => r.json('_id') !== undefined && r.json('_id').length > 0
  })

  // console.log(res.body)
  sleep(1)
}