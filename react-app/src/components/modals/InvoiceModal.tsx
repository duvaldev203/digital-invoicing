import { Add, Delete, SaveAlt } from "@mui/icons-material";
import "./modal.css";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  AddressControllerApi,
  CustomerControllerApi,
  InvoiceControllerApi,
  ItemControllerApi,
  type AddressResponse,
  type CustomerResponse,
  type InvoiceItemRequest,
  type InvoiceRequest,
  type InvoiceResponse,
  type ItemResponse,
} from "../../generated";

interface InvoiceModalProps {
  invoice?: InvoiceResponse;
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = (props: InvoiceModalProps) => {
  const [loading, setLoading] = useState(false);
  // const [invItems, setInvItems] = useState<InvoiceItemResponse[]>([])
  const [addresses, setAddresses] = useState<AddressResponse[]>([])
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [formValues, setFormValues] = useState<InvoiceRequest>({
    address: undefined,
    customer: undefined,
    invoiceItems: undefined,
    totalAmount: 0,
  });

  const api = new InvoiceControllerApi();
  const itemApi = new ItemControllerApi();
  const addressApi = new AddressControllerApi();
  const customerApi = new CustomerControllerApi();

  const fetchData = () => {
    addressApi.index3()
      .then((resp) => {
        if (resp.content) setAddresses(resp.content!);
      })
      .catch((err) => console.error("Erreur de recuperation des Adresses : ", err));
    customerApi.index2()
      .then((resp) => {
        if (resp.content) setCustomers(resp.content)
      })
      .catch((err) => console.error("Erreur e recuperation des clients", err));
    itemApi.index()
      .then((resp) => {
        if (resp.content) setItems(resp.content)
      })
      .catch((err) => console.error("Erreur e recuperation des clients", err));
  }

  useEffect(() => {
    fetchData();
    setFormValues({
      address: props.invoice?.address || undefined,
      customer: props.invoice?.customer || undefined,
      invoiceItems: props.invoice?.invoiceItems || undefined,
      totalAmount: props.invoice?.totalAmount || 0,
    });
  }, [props.invoice, props.opened]);

  const handleAddItem = () => {
    const newItem: InvoiceItemRequest[] = formValues.invoiceItems ? formValues.invoiceItems : [];
    newItem.push({ item: { name: "" }, quantity: 1, totalPrice: 0 });
    setFormValues({
      ...formValues,
      invoiceItems: newItem
    });
  };

  const handleRemoveItem = (item: ItemResponse) => {
    const newValue: InvoiceItemRequest[] = formValues.invoiceItems || [];
    const index: number = formValues.invoiceItems?.indexOf({ item: item }) || -1
    newValue.splice(index)
    setFormValues({ ...formValues, invoiceItems: newValue })
  }

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("Creating Invoice: ", formValues);
    api.create1({ invoiceRequest: formValues }).then((response) => {
      props.onSuccess?.();
      props.onClose();
      console.log("Invoice created: ", response);
    }).catch((error) => {
      console.error("Error creating Invoice: ", error);
    }).finally(() => {
      setLoading(false);
    });
  }
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("Editing invoice: ", formValues);
    api.update1({ invoiceNumber: props.invoice!.invoiceNumber!, invoiceRequest: formValues })
      .then(() => {
        console.log("Invoice updated: ", formValues);
        props.onSuccess?.();
        props.onClose();
      })
      .catch((error) => {
        console.error("Error updating invoice: ", error);
      }).finally(() => {
        setLoading(false);
      });
  }

  return (
    <Modal
      open={props.opened}

      onClose={props.onClose}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transition: "all 0.5s ease-in-out",
          transform: "translate(-50%, -50%)",
          minWidth: 400,
          width: { xs: "90%", sm: "70%" },
          bgcolor: "background.paper",
          border: "2px solid #ccc",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#444"
        }}
      >
        <Box
          mb={2}
          sx={{
            px: 2,
            display: "flex",
            gap: 1,
            width: "100%",
            fontWeight: "bold",
            justifyContent: "space-between",
            borderBottom: "1px solid #bbb"
          }}>
          <Typography
            variant="h6"
            component="h6"
            sx={{
              display: "flex",
              gap: 1,
              fontWeight: "bold",
            }}
          >
            Factures
            <Typography
              variant="caption"
              fontSize={12}
              sx={{
                fontWeight: "normal",
                color: "blue",
                textDecoration: "underline",
              }}
            >
              {props.invoice ? "Modifier" : "Creer"}
            </Typography>
          </Typography>
          {props.invoice && <Typography variant="body1">#{props.invoice?.invoiceNumber}</Typography>}
        </Box>
        <form
          action=""
          className="parentForm"
          onSubmit={props.invoice ? handleEdit : handleCreate}
        >
          {/* Customer and address */}
          <Box
            component="div"
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" }
            }}
          >
            <Autocomplete
              fullWidth
              size="small"
              disablePortal
              options={addresses}
              getOptionLabel={(option) =>
                `${option.zipCode} ${option.street}, ${option.city} ${option.state} (${option.country})`
              }
              value={formValues.address || null}
              onChange={(_, newValue) => {
                setFormValues((prev) => ({
                  ...prev,
                  address: newValue ? newValue : undefined,
                }));
              }}
              renderInput={(params) => (
                <TextField required {...params} label="Adresse" />
              )}
            />
            {/* <TextField size="small" id="outlined-basic" label="Adresse" variant="outlined" fullWidth /> */}
            <Autocomplete
              fullWidth
              size="small"
              disablePortal
              options={customers}
              getOptionLabel={(option) => `${option.email} ${option.name} ${option.phone}`}
              value={formValues.customer || null}
              onChange={(_, newValue) => {
                setFormValues((prev) => ({
                  ...prev,
                  customer: newValue ? newValue : undefined,
                }));
              }}
              renderInput={(params) => (
                <TextField required {...params} label="Client" />
              )}
            />
            {/* <TextField size="small" id="outlined-basic" label="Client" variant="outlined" fullWidth /> */}
          </Box>
          {/* Products */}
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                width: "100%",
                borderBottom: "1px solid #ddd"
              }}
            >
              Produits
            </Typography>
            <Paper>
              <TableContainer
                sx={{
                  maxHeight: "250px"
                }}
              >
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  size="small"
                >
                  <TableHead
                    color="green"
                    sx={{ backgroundColor: "#111" }}
                  >
                    <TableRow>
                      <TableCell>Nom</TableCell>
                      <TableCell>Prix Unitaire</TableCell>
                      <TableCell>Quantite</TableCell>
                      <TableCell>Prix Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Map products here */}
                    {formValues.invoiceItems && formValues.invoiceItems?.length > 0 ? (
                      <>
                        {formValues.invoiceItems?.map((invItem) => (
                          <TableRow
                            key={invItem.item?.id}
                            hover
                          >
                            <TableCell>
                              <Autocomplete
                                fullWidth
                                size="small"
                                disablePortal
                                options={items}
                                getOptionLabel={(option) => `${option.name}`}
                                value={invItem.item || null}
                                onChange={(_, value) => {
                                  const newValue: InvoiceItemRequest[] = formValues.invoiceItems || [];
                                  newValue.fill({ item: value || undefined }, formValues.invoiceItems?.indexOf({ item: value || undefined }))
                                  setFormValues((prev) => ({
                                    ...prev,
                                    invoiceItems: newValue,
                                  }));
                                }}
                                renderInput={(params) => (
                                  <TextField required {...params} label="" variant="standard" />
                                )}
                              />
                              {/* <TextField
                                size="small"
                                // label="Nom"
                                variant="standard"
                                // fullWidth
                                value={invItem.item?.name}
                                onChange={(e) => handleItemChange(e, "name", invItem)}
                              /> */}
                            </TableCell>
                            <TableCell>
                              {/* <TextField
                                size="small"
                                // label="Prix Unitaire"
                                variant="standard"
                                fullWidth
                                value={item.price}
                                onChange={(e) => handleItemChange(e, "price", item)}
                              /> */
                                invItem.item?.price || 0}
                            </TableCell>
                            <TableCell width={10}>
                              <TextField
                                required
                                size="small"
                                // label="Quantité"
                                name="quantity"
                                variant="standard"
                                fullWidth
                                value={invItem?.quantity ?? 1}
                                onChange={(e) => {
                                  const newValue: InvoiceItemRequest[] = formValues.invoiceItems || [];
                                  const index = formValues.invoiceItems?.findIndex(
                                    (item) => item.item?.id === invItem.item?.id
                                  ) ?? -1;
                                  newValue[index] = {
                                    ...invItem,
                                    quantity: parseInt(e.target.value),
                                  };
                                  setFormValues({
                                    ...formValues,
                                    invoiceItems: newValue,
                                  })
                                  console.log("Changed item quantity: ", formValues.invoiceItems);
                                }}
                              />
                            </TableCell>
                            <TableCell>{(invItem.item?.price || 0) * (invItem.quantity || 1)}</TableCell>
                            <TableCell>
                              <Tooltip title="Supprimer">
                                <IconButton size="small" onClick={() => { handleRemoveItem(invItem.item!) }}>
                                  <Delete color="action" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    ) : (
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
                          Aucuns produits ajoutés.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                size="small"
                sx={{
                  margin: 1,
                  width: "fit-content",
                  color: "action.active",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
                startIcon={<Add color="action" />}
                onClick={handleAddItem}
              >
                Ajouter un produit
              </Button>
              <Box
                component="div"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  bgcolor: "#bbb",
                  width: { xs: "100%", sm: "50%" },
                  py: .5,
                  pr: 4,
                  pl: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Total:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {formValues.invoiceItems?.reduce((acc, curr) => {
                    return acc + ((curr.item?.price || 0) * (curr.quantity || 1));
                  }, 0).toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                mt: 2,
              }}
            >
              {loading ?
                <CircularProgress />
                : <Button
                  variant="contained"
                  type="submit"
                  startIcon={<SaveAlt />}
                >
                  Enregistrer
                </Button>}
            </Box>
          </Box>
        </form>
      </Box>
    </Modal >
  )
}

export default InvoiceModal
