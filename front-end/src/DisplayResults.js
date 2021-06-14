import { useDispatch, useSelector } from "react-redux";

import { PER_PAGE } from "./consts";
import { DataGrid } from "@material-ui/data-grid";
import { sendSearch, useDebounce } from "./utils.js";
import { move_page } from "./searchSlice";

function DisplayResults() {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search);
  const { query_result, page, total } = search;
  const columns = [
    {
      field: "action",
      headerName: "Verdict",
      flex: 1,
      sortable: false,
      valueGetter: (params) => (params.row.action ? "Accepted" : "Dropped"),
    },
    { field: "source_ip", headerName: "Source IPV4", flex: 1 },
    { field: "source_port", headerName: "Source port", flex: 1 },
    { field: "dest_ip", headerName: "Dest IPV4", flex: 1 },
    { field: "dest_port", headerName: "Dest port", flex: 1 },
    { field: "protocol", headerName: "Protocol", flex: 1 },
  ];
  const rows = query_result;
  useDebounce({
    dependencies: [page],
    callBack: ({ search }) => sendSearch({ search, dispatch }),
    callBackArg: { search },
  });

  return (
    <div style={{ height: "70vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        pageSize={PER_PAGE}
        rowCount={total}
        paginationMode="server"
        onPageChange={(changes) => dispatch(move_page({ value: changes.page }))}
      />
    </div>
  );
}

export default DisplayResults;
