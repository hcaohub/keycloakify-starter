import { OidcProvider, useOidc } from "./oidc";

export default function App() {

  return (
    <OidcProvider>
      <AppContextualized />
    </OidcProvider>
  );

}

function AppContextualized() {

  const { isUserLoggedIn, login, logout, goToAuthServer, oidcTokens } = useOidc();

  if (!isUserLoggedIn) {
    return <button onClick={() => login({ doesCurrentHrefRequiresAuth: false })}>Login</button>;
  }

  return (
    <>
      <h1>Welcome {oidcTokens.decodedIdToken.preferred_username}</h1>
      <button onClick={() => goToAuthServer({ extraQueryParams: { kc_action: "UPDATE_PASSWORD" } })}>Update password</button>
      <button onClick={() => goToAuthServer({ extraQueryParams: { kc_action: "UPDATE_PROFILE" } })}>Update account infos</button>
      <button onClick={() => logout({ redirectTo: "home" })}>Update account infos</button>
    </>
  );

}

