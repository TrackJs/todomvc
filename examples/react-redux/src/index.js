import { render } from "react-dom";
import { createStore, compose } from "redux";
import { Provider } from "react-redux";
import { HashRouter, Route } from "react-router-dom";
import { TrackJS } from "trackjs";
import App from "./app";
import reducer from "./reducers";
import trackJSEnhancer from "./trackJSEnhancer";

import "todomvc-app-css/index.css";
import "todomvc-common/base.css";

TrackJS.install({
    token: "redux-example"
});

const initialState = {};
const store = createStore(reducer, initialState, compose(
    trackJSEnhancer()
    /* other enhancers */
));

render(
    <Provider store={store}>
        <HashRouter>
            <Route path="*" component={App} />
        </HashRouter>
    </Provider>,
    document.getElementById("root")
);