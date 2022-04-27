import React, { useCallback } from "react";
import Async from "react-async";
import { Navigate } from "react-router-dom";
import { SecurityCtx } from "./types";

export const LogoutPage: React.FC<SecurityCtx> = (rx) => {
    const loginFailed = useCallback(async () => {
        await rx.manager.clearStaleState();
        await rx.manager.revokeAccessToken();
        await rx.manager.removeUser();
    }, [rx.manager]);

    return (
        <Async promiseFn={loginFailed}>
            <Async.Settled>
                <Navigate to="/signedout" />
            </Async.Settled>
        </Async>
    );
};
