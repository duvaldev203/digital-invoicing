import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import CustomerModal from "../components/modals/CustomerModal";
import { CustomerControllerApi, type CustomerResponse, type PageCustomerResponse } from "../generated";
import { ModeEdit, Add, Delete } from "@mui/icons-material";
import DeleteModal from "../components/modals/DeleteModal";
import { useLoaderData } from "react-router-dom";


const Customers = () => {
  const data = useLoaderData<PageCustomerResponse>();
  const [customers, setCustomers] = useState<PageCustomerResponse | undefined>(data);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log("Not used variable: ", loading);

  const api = new CustomerControllerApi();



  const handleOpenCustomerModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(undefined);
    setOpenDeleteModal(false);
    setOpenModal(false);
  };

  const handleEdit = (customer: CustomerResponse) => {
    setSelectedCustomer(customer);
    setOpenModal(true);
  };

  const handleOpenDeleteModal = (customer: CustomerResponse) => {
    setSelectedCustomer(customer);
    setOpenDeleteModal(true);
  };

  const onSuccess = () => {
    api.index2().then((response) => {
      setCustomers(response);
    });
  }

  const filtered = customers?.content ? customers.content.filter(
    (cust: CustomerResponse) =>
      cust.name!.toLowerCase().includes(query.toLowerCase()) ||
      cust.email!.toLowerCase().includes(query.toLowerCase()) ||
      cust.phone!.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = () => {
    setLoading(true);

    api.delete2({ id: selectedCustomer!.id! })
      .then((resp) => {
        console.log("Response: ", resp)
        onSuccess();
        handleCloseModal();
      })
      .catch((err) => {
        console.error("Error deleting address: ", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box
      component="main"
      sx={{
        px: 2,
        width: "100%",
        height: "100%",
      }}>
      <Box
        display="flex"
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent={{ xs: "flex-start", sm: "space-between" }}
        flexDirection={{ xs: "column", sm: "row" }}
        mb={1}
      >
        <Typography variant="h5">Clients</Typography>
        <Box
          display="flex"
          gap={1}
          width={{ xs: "100%", sm: "auto" }}
          justifyContent="flex-end"
        >
          <TextField
            size="small"
            placeholder="Rechercher un client"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="contained"
            startIcon={<Add sx={{ mr: { xs: "-8px", sm: "auto" } }} />}
            sx={{
              whiteSpace: "nowrap",
              borderRadius: { xs: "999px", sm: "5px" },
              minWidth: { xs: "auto", sm: "auto" },
              px: { xs: 1.5, sm: 2 },
            }}
            title="Créer un nouveau client"
            onClick={handleOpenCustomerModal}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Nouveau client
            </Box>
          </Button>
        </Box>
      </Box>
      <CustomerModal
        customer={selectedCustomer}
        opened={openModal}
        onClose={handleCloseModal}
        onSuccess={onSuccess}
      />
      <DeleteModal
        data={selectedCustomer!}
        opened={openDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        loading={loading}
      />
      <Paper>
        <Table size="small">
          <TableHead
            sx={{ backgroundColor: "#bbb" }}
          >
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Telephone</TableCell>
              <TableCell>Addresse</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cust: CustomerResponse) => (
              <TableRow key={cust.id} hover>
                <TableCell>{cust.id}</TableCell>
                <TableCell>{cust.email}</TableCell>
                <TableCell>{cust.name}</TableCell>
                <TableCell>{cust.phone}</TableCell>
                <TableCell>{cust.address?.city + `,` + cust.address?.country}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Modifier">
                    <IconButton size="small" onClick={() => handleEdit(cust)}>
                      <ModeEdit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton color="error" size="small" onClick={() => handleOpenDeleteModal(cust)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    fontStyle: "italic",
                    color: "#888",
                    padding: 3,
                  }}
                >
                  Aucuns client..!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={customers?.pageable?.pageNumber || page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Box>
  );
}

export default Customers;