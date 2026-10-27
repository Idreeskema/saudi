import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideToastr } from "ngx-toastr";
import { provideEnvironmentNgxMask } from "ngx-mask";
import { routes } from "./app.routes";
import { AuthService } from "./services/auth.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr(),
    provideEnvironmentNgxMask(),
    AuthService,
  ],
};
