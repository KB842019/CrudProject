import {
  Button,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import useDebounce from "./useDebounce"; 

const Search = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // zero-based index for TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchData = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    setData(response.data);
  };

  const sorting = () => {
    const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
    setData(sortedData);
  };

  const debouncedSearch = useDebounce(search, 500);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Pagination slice
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page
  };

  return (
    <Grid display="flex" flexDirection="column" p={2} gap={2}>
      <Grid display="flex" justifyContent="center">
        <h1>Debouncing, Fetch, Search, Sorting, Pagination</h1>
      </Grid>

      {data.length > 0 ? (
        <>
          <Button color="error" variant="contained" onClick={sorting}>
            Sort
          </Button>

          <Grid my={2}>
            <TextField
              fullWidth
              placeholder="Search by name"
              value={search}
              onChange={(e) => {
                setPage(0); // reset to first page on search
                setSearch(e.target.value);
              }}
            />
          </Grid>

          <TableContainer sx={{ border: "1px solid grey", borderRadius: "4px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>ID</b></TableCell>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="h6" color="error">
                        No match found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredData.length > 0 && (
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 15, 20]}
              labelRowsPerPage="Rows per page"
              sx={{ mt: 1, alignSelf: "flex-end" }}
            />
          )}
        </>
      ) : (
        <Button color="primary" variant="contained" onClick={fetchData}>
          Fetch
        </Button>
      )}
    </Grid>
  );
};

export default Search;
