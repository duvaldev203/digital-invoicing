import { SaveAlt } from "@mui/icons-material";
import "./modal.css";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { AddressControllerApi, CustomerControllerApi, type AddressResponse, type CustomerRequest, type CustomerResponse } from "../../generated";

interface CustomerModalProps {
  customer?: CustomerResponse;
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = (props: CustomerModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<CustomerRequest>({
    email: "",
    name: "",
    phone: "",
    address: undefined,
  });
  const [addresses, setAddresses] = useState<AddressResponse[]>([])

  const addressApi = new AddressControllerApi();
  const api = new CustomerControllerApi();

  const fetchAddresses = () => {
    addressApi.index3()
      .then((resp) => {
        if (resp.content) setAddresses(resp.content!);
      })
      .catch((err) => console.error("Erreur de recuperation des Adresses : ", err));
  }

  useEffect(() => {
    fetchAddresses();
    setFormValues({
      email: props.customer?.email || "",
      name: props.customer?.name || "",
      phone: props.customer?.phone || "",
      address: props.customer?.address || undefined,
    });
  }, [props.customer, props.opened]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log(e.target)
    const elt = e.target.name
    setFormValues({
      ...formValues,
      [elt]: e.target.value
    })
    // console.log("Changed: ", formValues)
  }
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("Creating Customer: ", formValues);
    api.create2({ customerRequest: formValues }).then((response) => {
      props.onSuccess?.();
      props.onClose();
      console.log("Customer created: ", response);
    }).catch((error) => {
      console.error("Error creating customer: ", error);
    }).finally(() => {
      setLoading(false);
    });
  }
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("Editing customer: ", formValues);
    api.update2({ id: props.customer!.id!, customerRequest: formValues })
      .then(() => {
        console.log("Customer updated: ", formValues);
        props.onSuccess?.();
        props.onClose();
      })
      .catch((error) => {
        console.error("Error updating customer: ", error);
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
            Clients
            <Typography
              variant="caption"
              fontSize={12}
              sx={{
                fontWeight: "normal",
                color: "blue",
                textDecoration: "underline",
              }}
            >
              {props.customer ? "Modifier" : "Creer"}
            </Typography>
          </Typography>
          {props.customer &&
            <Box
              component="span"
              sx={{ fontSize: 12, fontWeight: "bold", color: "#666" }}
            >#  <Typography variant="overline" fontWeight="normal">{props.customer.id}  </Typography></Box>}
        </Box>
        <form
          action=""
          className="parentForm"
          onSubmit={props.customer ? handleEdit : handleCreate}
        >
          {/* Email - Name - Phone */}
          <Box
            component="div"
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" }
            }}
          >
            <TextField
              required
              type="email"
              size="small"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              name="email"
              fullWidth
              value={formValues?.email}
              onChange={(e) => handleFormChange(e)}
            />
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
              size="small"
              id="outlined-basic"
              label="Telephone"
              variant="outlined"
              name="phone"
              fullWidth
              value={formValues?.phone}
              onChange={(e) => handleFormChange(e)}
            />
          </Box>
          {/* Address */}
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
          {/* <Box
            component="div"
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              flexDirection: { xs: "column", sm: "row" }
            }}
          >


            <TextField
              required
              size="small"
              id="outlined-basic"
              label="Adresse"
              variant="outlined"
              name="address"
              fullWidth
              value={formValues?.address?.zipCode + ` `
                + formValues?.address?.city + `, `
                + formValues.address?.street + `, `
                + formValues.address?.state + ` `
                + formValues.address?.country}
              onChange={(e) => handleFormChange(e)}
            />
          </Box> */}
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
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
                <CircularProgress size={24} />
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

export default CustomerModal;
