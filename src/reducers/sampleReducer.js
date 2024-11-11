export default function sample(state = [], action) {
    switch (action.type) {
        case "SAMPLE":
            return state.concat([action.value]);
        default:
            return state;
    }
}
