import { useEffect } from "react";
import { set_query_result, set_auto_complete } from "./searchSlice";
import {
  SERVER_URL,
  AUTO_COMPLETE,
  SEARCH_MATCH,
  DEBOUNCE_VALUE,
} from "./consts";
import objectHash from "object-hash";

function makeFields({ source_port = "", dest_port = "", protocols, actions }) {
  let fields = {}; // mutate props
  if (!!dest_port && dest_port !== "")
    fields["dest_port"] = [Number(dest_port)];
  if (!!source_port && source_port !== "")
    fields["source_port"] = [Number(source_port)];
  if (actions && actions.length !== 0) fields["action"] = actions;
  if (protocols && protocols.length !== 0) fields["protocol"] = protocols;
  return fields;
}

async function fetchJson(params) {
  const { body, route } = params;
  const _hash =
    objectHash.MD5(params); /* hash params, used to cache fetch response  */
  let str_json = window.sessionStorage.getItem(_hash); /* json or null */
  if (str_json !== null) {
    return JSON.parse(str_json);
  }

  return fetch(`${SERVER_URL}/${route}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then((respJson) => {
      window.sessionStorage.setItem(
        _hash,
        JSON.stringify(respJson)
      ); /* store response */
      return respJson;
    })
    .catch((e) => console.error(e));
}

async function getAutoComplete({ dispatch, complete_field, word, search }) {
  if (!complete_field) return;
  const { protocols, actions } = search;
  const { data } = await fetchJson({
    route: AUTO_COMPLETE,
    body: {
      complete_field: complete_field,
      word: word || "",
      fields: makeFields({ protocols, actions }),
    },
  });
  dispatch(
    set_auto_complete({
      value: data.map((item) => item[complete_field].toString()),
    })
  );
  sendSearch({ search, dispatch }); // trigger search, to update the data table while typing
}

async function sendSearch({ search, dispatch }) {
  const { source_port, dest_port, protocols, actions, page } = search;
  const { total: newTotal, data: newQueryResults } = await fetchJson({
    route: SEARCH_MATCH,
    body: {
      page: page,
      fields: makeFields({ source_port, dest_port, protocols, actions }),
    },
  });

  dispatch(
    set_query_result({ total: newTotal, page, results: newQueryResults })
  );
}

function useDebounce({ dependencies, callBack, callBackArg }) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      callBack(callBackArg); /* timed out, call callBack */
    }, DEBOUNCE_VALUE);
    return () => {
      window.clearTimeout(timer); /* another call before timeout, reset counter */
    };
    // eslint-disable-next-line
  }, [...dependencies, callBack, callBackArg]);
}

export { sendSearch, getAutoComplete, useDebounce };
