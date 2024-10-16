import { i18nRouter } from "next-i18n-router"
import i18nConfig from "./i18nConfig"

//The i18nRouter function will take the request, detect the user’s preferred language using the accept-language header, and then redirect them to the path with their preferred language. If we don’t support their language, it will fallback to the default language.

export function middleware(request) {
  return i18nRouter(request, i18nConfig)
}

// applies this middleware only to files in the app directory and ignore the below files
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
}
