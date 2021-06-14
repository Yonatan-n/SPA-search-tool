import { PORT_RANGE, PROTOCOLS, ACTIONS } from "./consts";
import { useSelector, useDispatch } from "react-redux";
import {
  Checkbox,
  Card,
  CardContent,
  Grid,
  Box,
  FormGroup,
  FormControlLabel,
  FormLabel,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { sendSearch, getAutoComplete, useDebounce } from "./utils";
import {
  change_str_prop,
  toggle_list_value,
  set_complete_field,
  set_auto_complete,
} from "./searchSlice";

function CheckBoxInput({ labelName, immList, listName, namerFunc }) {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.search[listName]);
  const toggleListValue = (value) => (_event) => {
    _event.preventDefault();
    dispatch(toggle_list_value({ list: listName, value }));
  };
  return (
    <Box m={1}>
      <FormGroup>
        <Card>
          <CardContent>
            <FormLabel component="legend">{labelName}</FormLabel>
            {immList.map((item) => {
              const name = namerFunc(item); // used for the action verdict, true/false to Accepted/Dropped
              return (
                <FormControlLabel
                  key={`${item}${list.includes(item)}`}
                  control={
                    <Checkbox
                      checked={list.includes(item)}
                      onChange={toggleListValue(item)}
                      name={name}
                    />
                  }
                  label={name}
                />
              );
            })}
          </CardContent>
        </Card>
      </FormGroup>
    </Box>
  );
}

function InputText({ labelName, clearAutoComplete, options, ...rest }) {
  return (
    <Box marginTop={1} marginBottom={1}>
      <Autocomplete
        variant="filled"
        id={labelName}
        options={options}
        getOptionLabel={(option) => option}
        freeSolo
        onFocus={rest.onInputChange}
        onChange={rest.onInputChange}
        onBlur={clearAutoComplete}
        {...rest}
        renderInput={(params) => (
          <TextField {...params} variant="filled" label={labelName} />
        )}
      />
    </Box>
  );
}

export default function SearchBar() {
  const dispatch = useDispatch();
  const changeStrProp = (prop) => (value) => {
    dispatch(set_complete_field({ value: prop }));
    dispatch(change_str_prop({ prop, value }));
  };
  const search = useSelector((state) => state.search);
  const {
    source_port,
    dest_port,
    protocols,
    actions,
    auto_complete,
    complete_field,
  } = search;

  useDebounce({
    dependencies: [source_port, dest_port, complete_field, protocols, actions],
    callBack: ({ complete_field, search }) => {
      if (complete_field.length > 0) {
        getAutoComplete({
          complete_field,
          dispatch,
          word: search[complete_field],
          search,
        });
      } else {
        sendSearch({ search, dispatch });
      }
    },
    callBackArg: { search, complete_field },
  });

  const clearAutoComplete = (_) => {
    dispatch(set_auto_complete({ value: [] }));
  };
  return (
    <form>
      <Grid container direction={"column"}>
        <InputText
          clearAutoComplete={clearAutoComplete}
          options={auto_complete}
          labelName="Source Port"
          type="text"
          value={source_port}
          onInputChange={updateValidate(
            changeStrProp("source_port"),
            auto_complete
          )}
        />
        <InputText
          clearAutoComplete={clearAutoComplete}
          options={auto_complete}
          type="text"
          value={dest_port}
          onInputChange={updateValidate(
            changeStrProp("dest_port"),
            auto_complete
          )}
          labelName="Destination Port"
        />
        <CheckBoxInput
          labelName={"Protocols:"}
          immList={PROTOCOLS}
          listName={"protocols"}
          namerFunc={(name) => name}
        />
        <CheckBoxInput
          labelName={"Action verdict:"}
          immList={ACTIONS}
          listName={"actions"}
          namerFunc={(name) => (name ? "Accepted" : "Dropped")}
        />
      </Grid>
    </form>
  );
}

function updateValidate(set, auto_complete) {
  return (e, value) => {
    if (e === null) return; /* triggered null  after autocomplete, ignore  */
    e?.preventDefault();
    const re = /^[0-9]+$/g; /* only digits, check for range later */
    if (!value) set(""); /* empty string, triggered on delete input */
    if (typeof value === "number") {
      /* auto completed */
      return set(auto_complete[value]);
    }
    if (re.test(value) && Number(value) <= PORT_RANGE) set(value);
  };
}
