import * as React from "react";
import { BrowserHistory } from "history";
import { Router, Navigator } from "react-router-dom";

type CustomRouterProps = {
    basename?: string;
    children?: React.ReactNode;
    history: BrowserHistory;
}

const CustomRouter = ({ basename, children, history }: CustomRouterProps) => {
    const [state, setState] = React.useState({
        action: history.action,
        location: history.location,
    });

    React.useLayoutEffect(() => history.listen(setState), [history])

    return (
        <Router
            basename={basename}
            location={state.location}
            navigator={history}
            navigationType={state.action}
        >
            {children}
        </Router>
    );
};

export default CustomRouter;