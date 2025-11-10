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
import AddIcon from "@mui/icons-material/Add";
import { useLoaderData } from "react-router-dom";
import { InvoiceControllerApi, type InvoiceResponse, type PageInvoiceResponse } from "../generated";
import { Delete, ModeEdit, Print } from "@mui/icons-material";
import DeleteModal from "../components/modals/DeleteModal";
import InvoiceModal from "../components/modals/InvoiceModal";

const Invoices = () => {
  const data = useLoaderData<PageInvoiceResponse>();
  const [invoices, setInvoices] = useState<PageInvoiceResponse | undefined>(data);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponse | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log("Not used variable: ", loading);

  const api = new InvoiceControllerApi();



  const handleOpenInvoiceModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedInvoice(undefined);
    setOpenDeleteModal(false);
    setOpenModal(false);
  };

  const handleEdit = (invoice: InvoiceResponse) => {
    setSelectedInvoice(invoice);
    setOpenModal(true);
  };

  const handleOpenDeleteModal = (invoice: InvoiceResponse) => {
    setSelectedInvoice(invoice);
    setOpenDeleteModal(true);
  };

  const onSuccess = () => {
    api.index1().then((response) => {
      setInvoices(response);
    });
  }

  const filtered = invoices?.content ? invoices.content.filter(
    (inv: InvoiceResponse) =>
      inv.invoiceNumber!.toLowerCase().includes(query.toLowerCase()) ||
      inv.customer!.name!.toLowerCase().includes(query.toLowerCase()) ||
      inv.createdAt!.toDateString().toLowerCase().includes(query.toLowerCase())
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

    api.delete1({ invoiceNumber: selectedInvoice!.invoiceNumber! })
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

  const handlePrint = (invoice: InvoiceResponse) => {
    console.log("Invoice to print: ", invoice)
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
        <Typography variant="h5">Factures</Typography>
        <Box
          display="flex"
          gap={1}
          width={{ xs: "100%", sm: "auto" }}
          justifyContent="flex-end"
        >
          <TextField
            size="small"
            placeholder="Rechercher facture ou client"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ mr: { xs: "-8px", sm: "auto" } }} />}
            sx={{
              whiteSpace: "nowrap",
              borderRadius: { xs: "999px", sm: "5px" },
              minWidth: { xs: "auto", sm: "auto" },
              px: { xs: 1.5, sm: 2 },
            }}
            title="Créer une nouvelle facture"
            onClick={handleOpenInvoiceModal}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Nouvelle facture
            </Box>
          </Button>
        </Box>
      </Box>
      <InvoiceModal
        invoice={selectedInvoice}
        opened={openModal}
        onClose={handleCloseModal}
        onSuccess={onSuccess}
      />
      <DeleteModal
        data={selectedInvoice!}
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
              <TableCell>N° facture</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Montant</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((inv) => (
              <TableRow key={inv.invoiceNumber} hover>
                <TableCell>{inv.invoiceNumber}</TableCell>
                <TableCell>{inv.customer?.name}</TableCell>
                <TableCell>{inv.createdAt?.toDateString()}</TableCell>
                <TableCell align="right">{inv.totalAmount?.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Imprimer / Télécharger PDF">
                    <IconButton size="small" onClick={() => handlePrint(inv)}>
                      <Print />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Modifier">
                    <IconButton size="small" onClick={() => handleEdit(inv)}>
                      <ModeEdit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton color="error" size="small" onClick={() => handleOpenDeleteModal(inv)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{
                    fontStyle: "italic",
                    color: "#888",
                    padding: 3,
                  }}
                >
                  Aucune facture..!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Box>
  );
}

export default Invoices;