import { TrackJS } from "trackjs";

// TrackJSEnhancer is included inline for simplicity of this example. You probably
// want to move this into a utility file in your own codebase.
const trackJSEnhancer = () => (createStore) => (reducer, initialState) => {
    const store = createStore(reducer, initialState);

    // Wrap the dispatch function to add TrackJS hooks
    const originalDispatch = store.dispatch;
    store.dispatch = (action) => {

        // Log all actions to TrackJS Telemetry.
        TrackJS.console.info(action);

        try {
            // Update TrackJS metadata and configuration with state properties so we
            // get the latest info if an error occurs.
            const state = store.getState();
            TrackJS.addMetadata('todosCount', state.todos?.length || 0);
            if (state.user?.id) {
                TrackJS.configure({ userId: state.user.id });
            }

            return originalDispatch(action);
        }
        catch (error) {
            // Include the current state in the error Telemetry. You may want to filter
            // out sensitive data before sending
            TrackJS.console.warn(store.getState());

            TrackJS.track(error);
            throw error; // Re-throw to maintain normal error handling
        }
    };

    return store;
};

export default trackJSEnhancer;