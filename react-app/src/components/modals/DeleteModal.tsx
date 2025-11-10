import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import type { AddressResponse, CustomerResponse, InvoiceResponse, ItemResponse } from "../../generated";

interface DeleteModalProps {
    data: AddressResponse | ItemResponse | ItemResponse | CustomerResponse | InvoiceResponse;
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}
const DeleteModal = (props: DeleteModalProps) => {
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
                        component="h2"
                        sx={{ fontWeight: "bold" }}
                    >
                        Confirmer la suppression
                    </Typography>
                </Box>
                <Typography component="span">
                    Êtes-vous sûr de vouloir supprimer cet élément ?
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic", color: "grey.600" }}>
                        Type: {props.data && (
                            (props.data as AddressResponse).country ? "Adresse"
                                : (props.data as ItemResponse).price ? "Article"
                                    : (props.data as CustomerResponse).email ? "Client"
                                        : (props.data as InvoiceResponse).invoiceNumber ? "Facture"
                                            : "Inconnu"
                        )}
                        &nbsp;|&nbsp;
                        {props.data && (
                            "invoiceNumber" in props.data
                                ? `Numéro: ${props.data.invoiceNumber}`
                                : "id" in props.data
                                    ? `ID: ${props.data.id}`
                                    : null
                        )}
                    </Typography>
                </Typography>
                <Box
                    mt={2}
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        gap: 2,
                        width: "100%"
                    }}
                >
                    <Box
                        component="button"
                        sx={{
                            bgcolor: "grey.300",
                            border: "none",
                            borderRadius: 1,
                            px: 2,
                            py: 1,
                            cursor: "pointer",
                            "&:hover": {
                                bgcolor: "grey.400"
                            }
                        }}
                        onClick={props.onClose}
                    >
                        Cancel
                    </Box>
                    {props.loading ?
                        <CircularProgress color="error" size={24} />
                        : <Box
                            component="button"
                            sx={{
                                bgcolor: "error.main",
                                color: "white",
                                border: "none",
                                borderRadius: 1,
                                px: 2,
                                py: 1,
                                cursor: "pointer",
                                "&:hover": {
                                    bgcolor: "error.dark"
                                }
                            }}
                            onClick={() => {
                                props.onConfirm();
                            }}
                        >
                            Supprimer
                        </Box>
                    }
                </Box>
            </Box>
        </Modal>
    )
}

export default DeleteModal;
