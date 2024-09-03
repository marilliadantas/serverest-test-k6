import { sleep, group } from "k6";
import login from "./tests/login.js";
import register from "./tests/register.js";
import registerLoad from "./tests/register-load.js";
import registerSmoke from "./tests/register-smoke.js";
import registerStress from "./tests/register-stress.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "./logs/report.html": htmlReport(data),
    };
}

export default () => {
    group('Login', () => {
        login();
    })

    sleep(1);
    
    group('Register', () => {
        register();
        registerLoad();
        registerSmoke();
        registerStress();
    })

    sleep(1);
}