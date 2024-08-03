/* eslint-disable react-refresh/only-export-components */
import { createReactOidc } from "oidc-spa/react";
import { z } from "zod";
import CircularProgress from "@mui/material/CircularProgress";


const {
    OidcProvider: OidcProvider_base,
    useOidc,
    getOidc
} = createReactOidc({
    isAuthGloballyRequired: true,
    issuerUri: import.meta.env.VITE_OIDC_ISSUER,
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
    publicUrl: import.meta.env.BASE_URL,
    decodedIdTokenSchema: z.object({
        sub: z.string(),
        preferred_username: z.string()
    }),
});

export { useOidc, getOidc };

export function OidcProvider(props: { children: React.ReactNode; }) {
    const { children } = props;
    return (
        <OidcProvider_base
            fallback={<CircularProgress />}
            ErrorFallback={({ initializationError }) => (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh"
                }}>
                    <h1 style={{ color: "red" }}>
                        An error occurred while initializing the OIDC client:
                        {initializationError.message}
                        {initializationError.type}

                    </h1>
                </div>
            )}
        >
            {children}
        </OidcProvider_base>
    );
}
