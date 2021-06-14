const PROTOCOLS = ["TCP", "UDP"]
const ACTIONS = [true, false] // accepted or dropped  
const PORT_RANGE = 65535
const PER_PAGE = 30
const DEBOUNCE_VALUE = 500; // ms
const SERVER_PORT = 5000
const SERVER_URL = `http://localhost:${SERVER_PORT}`
const AUTO_COMPLETE = "autocomplete"
const SEARCH_MATCH = "search-match"


export {
    PROTOCOLS,
    ACTIONS,
    PORT_RANGE,
    PER_PAGE,
    DEBOUNCE_VALUE,
    SERVER_PORT,
    SERVER_URL,
    SEARCH_MATCH,
    AUTO_COMPLETE
}