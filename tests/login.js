import http from "k6/http";
import { sleep, check } from "k6";

// import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// export function handleSummary(data) {
//   return {
//     "./logs/report.html": htmlReport(data),
//   }
// }

export default function () {
  const url = "https://serverest.dev/login";

  const payload = JSON.stringify({
    email: "fulano@qa.com",
    password: "teste",
  })

  const headers = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const res = http.post(url, payload, headers);

  check(res, {
    'status should be 200': (r) => r.status === 200,
    'valida mensagem de sucesso': (r) => r.json('message') === 'Login realizado com sucesso',  
  })

  sleep(1)
}