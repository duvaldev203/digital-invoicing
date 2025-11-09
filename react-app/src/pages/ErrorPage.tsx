import { useRouteError, type ErrorResponse } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Désolé! Quelque chose a mal tourne.</p>
            <p>
                <i>{(error as ErrorResponse).statusText} {(error as Error).message}</i>
            </p>
        </div>
    );
}
