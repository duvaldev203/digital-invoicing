import React, { useEffect, useState } from "react";
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
import AddressModal from "../components/modals/AddressModal";
import { AddressControllerApi, type AddressResponse, type PageAddressResponse } from "../generated";
import { ModeEdit, Add, Delete } from "@mui/icons-material";
import DeleteModal from "../components/modals/DeleteModal";
import { useLoaderData } from "react-router-dom";


const Addresses = () => {
  const data = useLoaderData<PageAddressResponse>();
  const [addresses, setAddresses] = useState<PageAddressResponse | undefined>(data);
  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log("Not used variable: ", loading);

  const api = new AddressControllerApi();



  const handleOpenAddressModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAddress(undefined);
    setOpenDeleteModal(false);
    setOpenModal(false);
  };

  const handleEdit = (address: AddressResponse) => {
    setSelectedAddress(address);
    setOpenModal(true);
  };

  const handleOpenDeleteModal = (address: AddressResponse) => {
    setSelectedAddress(address);
    setOpenDeleteModal(true);
  };

  const onSuccess = () => {
    api.index3().then((response) => {
      setAddresses(response);
    });
  }

  useEffect(() => {
    // api.index3().then((response) => {
    //   setAddresses(response);
    //   // console.log("Fetched addresses: ", response);
    // });
    // console.log("Adresses: ", addresses);
  }, []);

  const filtered = addresses?.content ? addresses.content.filter(
    (addr: AddressResponse) =>
      addr.street!.toLowerCase().includes(query.toLowerCase()) ||
      addr.state!.toLowerCase().includes(query.toLowerCase()) ||
      addr.country!.toLowerCase().includes(query.toLowerCase()) ||
      addr.city!.toLowerCase().includes(query.toLowerCase())
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

    api.delete3({ id: selectedAddress!.id! })
    onSuccess();
    /**Rechercher l'id dans addresses s'il existe alors echec sinon success */

    if (addresses?.content?.findIndex(addr => addr.id === selectedAddress!.id!) !== -1) {
      console.error("Error deleting address: ", selectedAddress);
    } else {
      console.log("Address deleted: ", selectedAddress);
      handleCloseModal();
    }
    setLoading(false);
    /**echec */
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
        <Typography variant="h5">Adresses</Typography>
        <Box
          display="flex"
          gap={1}
          width={{ xs: "100%", sm: "auto" }}
          justifyContent="flex-end"
        >
          <TextField
            size="small"
            placeholder="Rechercher adresse"
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
            title="Créer une nouvelle adresse"
            onClick={handleOpenAddressModal}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Nouvelle adresse
            </Box>
          </Button>
        </Box>
      </Box>
      <AddressModal
        address={selectedAddress}
        opened={openModal}
        onClose={handleCloseModal}
        onSuccess={onSuccess}
      />
      <DeleteModal
        data={selectedAddress!}
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
              <TableCell>Street</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Zip Code</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((addr: AddressResponse) => (
              <TableRow key={addr.id} hover>
                <TableCell>{addr.id}</TableCell>
                <TableCell>{addr.street}</TableCell>
                <TableCell>{addr.city}</TableCell>
                <TableCell>{addr.state}</TableCell>
                <TableCell>{addr.zipCode}</TableCell>
                <TableCell>{addr.country}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Modifier">
                    <IconButton size="small" onClick={() => handleEdit(addr)}>
                      <ModeEdit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton color="error" size="small" onClick={() => handleOpenDeleteModal(addr)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{
                    fontStyle: "italic",
                    color: "#888",
                    padding: 3,
                  }}
                >
                  Aucune adresse..!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={addresses?.pageable?.pageNumber || page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Box>
  );
}

export default Addresses;