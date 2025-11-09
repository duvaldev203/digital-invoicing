import { SaveAlt } from "@mui/icons-material";
import "./modal.css";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography
} from "@mui/material";
import { AddressControllerApi, type AddressRequest, type AddressResponse } from "../../generated";
import { useEffect, useState } from "react";

interface AddressModalProps {
  address?: AddressResponse;
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}


const AddressModal: React.FC<AddressModalProps> = (props: AddressModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<AddressRequest>({
    country: "",
    street: "",
    state: "",
    city: "",
    zipCode: "",
  });

  const api = new AddressControllerApi();

  useEffect(() => {
    setFormValues({
      country: props.address?.country || "",
      street: props.address?.street || "",
      state: props.address?.state || "",
      city: props.address?.city || "",
      zipCode: props.address?.zipCode || "",
    });

  }, [props.address, props.opened]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    // console.log("Creating address: ", formValues);
    api.create3({ addressRequest: formValues }).then((response) => {
      props.onSuccess?.();
      props.onClose();
      console.log("Address created: ", response);
    }).catch((error) => {
      console.error("Error creating address: ", error);
    }).finally(() => {
      setLoading(false);
    });
  }
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("Editing address: ", formValues);
    api.update3({ id: props.address!.id!, addressRequest: formValues })
      .then(() => {
        console.log("Address updated: ", formValues);
        props.onSuccess?.();
        props.onClose();
      })
      .catch((error) => {
        console.error("Error updating address: ", error);
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
            Adresses
            <Typography
              variant="caption"
              fontSize={12}
              sx={{
                fontWeight: "normal",
                color: "blue",
                textDecoration: "underline",
              }}
            >
              {props.address ? "Modifier" : "Creer"}
            </Typography>
          </Typography>
          {props.address &&
            <Box
              component="span"
              sx={{ fontSize: 12, fontWeight: "bold", color: "#666" }}
            >#  <Typography variant="overline" fontWeight="normal">{props.address.id}  </Typography></Box>}
        </Box>
        <form
          action=""
          className="parentForm"
          onSubmit={props.address ? handleEdit : handleCreate}
        >
          {/* Country - Street */}
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
              size="small"
              id="outlined-basic"
              label="Country"
              variant="outlined"
              name="country"
              fullWidth
              value={formValues?.country}
              onChange={(e) => handleFormChange(e)}
            />
            <TextField
              size="small"
              id="outlined-basic"
              label="Street"
              variant="outlined"
              name="street"
              fullWidth
              value={formValues?.street}
              onChange={(e) => handleFormChange(e)}
            />
          </Box>
          {/* State - City - Zip Code */}
          <Box
            component="div"
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" }
            }}
          >
            <TextField
              size="small"
              id="outlined-basic"
              label="State"
              variant="outlined"
              name="state"
              fullWidth
              value={formValues?.state}
              onChange={(e) => handleFormChange(e)}
            />
            <TextField
              required
              size="small"
              id="outlined-basic"
              label="City"
              variant="outlined"
              name="city"
              fullWidth
              value={formValues?.city}
              onChange={(e) => handleFormChange(e)}
            />
            <TextField
              size="small"
              id="outlined-basic"
              label="Zip Code"
              variant="outlined"
              name="zipCode"
              fullWidth
              value={formValues?.zipCode}
              onChange={(e) => handleFormChange(e)}
            />
          </Box>
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

export default AddressModal
