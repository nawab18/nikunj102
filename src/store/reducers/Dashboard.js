import * as actions from "../actions";

const initialState = {
  metrics: [],
  measurements: []
};

const metricsDataReceived = (state, action) => {
  const { getMetrics } = action;

  return {
    ...state,
    metrics: getMetrics
  };
};

const measurementsDataReceived = (state, action) => {
  const { getMultipleMeasurements } = action;
  return {
    ...state,
    measurements: getMultipleMeasurements
  };
};

const handlers = {
  [actions.METRICS_DATA_RECEIVED]: metricsDataReceived,
  [actions.MEASUREMENTS_DATA_RECEIVED]: measurementsDataReceived
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
