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
  CircularProgress,
} from "@mui/material";
import { ItemControllerApi, type ItemRequest, type ItemResponse, type PageItemResponse } from "../generated";
import { ModeEdit, Add, Delete } from "@mui/icons-material";
import DeleteModal from "../components/modals/DeleteModal";
import { useLoaderData } from "react-router-dom";


const Items = () => {
  const data = useLoaderData<PageItemResponse>();
  const [items, setItems] = useState<PageItemResponse | undefined>(data);
  const [selectedItem, setSelectedItem] = useState<ItemResponse | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createOrEdit, setCreateOrEddit] = useState(false);
  const [formValues, setFormValues] = useState<ItemRequest>({
    name: selectedItem?.name,
    price: selectedItem?.price
  })

  console.log("Not used variable: ", loading);

  const api = new ItemControllerApi();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const elt = e.target.name
    setFormValues({
      ...formValues,
      [elt]: e.target.value
    })
    // console.log("Changed: ", formValues)
  }

  const handleOpenItemModal = (item?: ItemResponse) => {
    if (item) setSelectedItem(item);
    setFormValues({
      name: item?.name || "",
      price: item?.price || 0
    });
    setCreateOrEddit(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(undefined);
    setOpenDeleteModal(false);
    // setOpenModal(false);
  };

  const handleOpenDeleteModal = (item: ItemResponse) => {
    setSelectedItem(item);
    setOpenDeleteModal(true);
  };

  const onSuccess = () => {
    api.index().then((response) => {
      setItems(response);
    });
  }

  const filtered = items?.content ? items.content.filter(
    (item: ItemResponse) =>
      item.name!.toLowerCase().includes(query.toLowerCase())
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

    api._delete({ id: selectedItem!.id! })
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

  const handleReset = () => {
    setSelectedItem(undefined);
    setCreateOrEddit(false);
    setFormValues({
      name: "",
      price: 0
    });
  }

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // console.log("Creating item: ", formValues);
    api.create({ itemRequest: formValues })
      .then(() => {
        onSuccess();
        handleReset();
        // console.log("Item created: ", response);
      }).catch((error) => {
        console.error("Error creating item: ", error);
      }).finally(() => {
        setLoading(false);
      });
  }

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // console.log("Editing item: ", formValues);
    api.update({ id: selectedItem!.id!, itemRequest: formValues })
      .then(() => {
        // console.log("Item updated: ", formValues);
        onSuccess();
        handleReset();
      })
      .catch((error) => {
        console.error("Error updating item: ", error);
      }).finally(() => {
        setLoading(false);
      });
  }

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
        <Typography variant="h5">Produits</Typography>
        <Box
          display="flex"
          gap={1}
          width={{ xs: "100%", sm: "auto" }}
          justifyContent="flex-end"
        >
          <TextField
            size="small"
            placeholder="Rechercher un produit"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            disabled={selectedItem && true}
            variant="contained"
            startIcon={<Add sx={{ mr: { xs: "-8px", sm: "auto" } }} />}
            sx={{
              whiteSpace: "nowrap",
              borderRadius: { xs: "999px", sm: "5px" },
              minWidth: { xs: "auto", sm: "auto" },
              px: { xs: 1.5, sm: 2 },
            }}
            title="Créer un nouveau produit"
            onClick={() => handleOpenItemModal(undefined)}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Nouveau produit
            </Box>
          </Button>
        </Box>
      </Box>
      <DeleteModal
        data={selectedItem!}
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
              <TableCell>Nom</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pdt: ItemResponse) => (
              <TableRow key={pdt.id} hover>
                <TableCell>{pdt.id}</TableCell>
                <TableCell>{pdt.name}</TableCell>
                <TableCell>{pdt.price}</TableCell>
                <TableCell
                  align="center"

                >
                  <Tooltip title="Modifier">
                    <IconButton size="small" onClick={() => handleOpenItemModal(pdt)}>
                      <ModeEdit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton color="error" size="small" onClick={() => handleOpenDeleteModal(pdt)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{
                    fontStyle: "italic",
                    color: "#888",
                    padding: 3,
                  }}
                >
                  Aucuns produit..!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={items?.pageable?.pageNumber || page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
      {/* Create or Edit component */}
      {createOrEdit &&
        <form
          onSubmit={selectedItem ? handleEdit : handleCreate}
        >
          <Box
            component="div"
            sx={{
              width: "100%",
              p: 2,
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              borderRadius: 1,
              flexDirection: { xs: "column", sm: "row" },
              backgroundColor: "#eee"
            }}
          >
            <TextField
              required
              size="small"
              id="outlined-basic"
              label="Nom"
              variant="outlined"
              name="name"
              fullWidth
              value={formValues?.name}
              onChange={(e) => handleFormChange(e)}
            />
            <TextField
              required
              size="small"
              id="outlined-basic"
              label="Prix"
              variant="outlined"
              name="price"
              fullWidth
              value={formValues?.price}
              onChange={(e) => handleFormChange(e)}
            />
            <Box
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                type="reset"
                color="error"
                onClick={handleReset}
              >
                Cancel
              </Button>
              {loading ?
                <CircularProgress size={24} />
                : <Button type="submit" variant="contained">
                  {selectedItem ? "Modifier" : "Ajouter"}
                </Button>}
            </Box>
          </Box>
        </form>}
    </Box>
  );
}

export default Items;