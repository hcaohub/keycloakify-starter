import { useOidc, OidcProvider } from "./oidc";

export function Header() {

    return (
        <OidcProvider>
            <HeaderContextualized />
        </OidcProvider>
    );

}

function HeaderContextualized() {

    const { logout, goToAuthServer, oidcTokens } = useOidc();

    return (
        <>
            <h1>Welcome {oidcTokens.decodedIdToken.preferred_username}</h1>
            <button onClick={() => goToAuthServer({ extraQueryParams: { kc_action: "UPDATE_PASSWORD" } })}>Update password</button>
            <button onClick={() => goToAuthServer({ extraQueryParams: { kc_action: "UPDATE_PROFILE" } })}>Update account infos</button>
            <button onClick={() => logout({ redirectTo: "home" })}>Update account infos</button>
        </>
    );

}