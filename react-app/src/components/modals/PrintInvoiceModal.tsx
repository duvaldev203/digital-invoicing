import { Print } from '@mui/icons-material';
import type { InvoiceResponse } from '../../generated';
import {
  Box,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

interface PrintInvoiceModal {
  invoice: InvoiceResponse;
  opened: boolean;
  onClose: () => void;
}

const PrintInvoiceModal = (props: PrintInvoiceModal) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Facture-${props.invoice?.invoiceNumber}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
  });

  return (
    <Modal
      open={props.opened}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transition: 'all 0.5s ease-in-out',
          transform: 'translate(-50%, -50%)',
          minWidth: 400,
          width: { xs: '90%', sm: '70%' },
          bgcolor: 'background.paper',
          border: '2px solid #ccc',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: '#444',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {/* Contenu à imprimer */}
        <Box ref={componentRef} sx={{ width: '100%' }}>
          <Box
            mb={2}
            sx={{
              px: 2,
              display: 'flex',
              gap: 1,
              width: '100%',
              fontWeight: 'bold',
              justifyContent: 'space-between',
              borderBottom: '1px solid #bbb',
            }}
          >
            <Typography
              variant="h6"
              component="h6"
              sx={{
                display: 'flex',
                gap: 1,
                fontWeight: 'bold',
              }}
            >
              Facture
            </Typography>
            <Typography variant="body1">
              #{props.invoice?.invoiceNumber}
            </Typography>
          </Box>

          <Box
            component="div"
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Client :</Typography>
              <Box sx={{ px: 2, color: 'gray' }}>
                <Typography variant="body1">
                  {props.invoice?.customer?.name}
                </Typography>
                <Typography variant="body1">
                  {props.invoice?.customer?.email}
                </Typography>
                <Typography variant="body1">
                  {`${props.invoice?.customer?.address?.city}, ${props.invoice?.customer?.address?.state} ${props.invoice?.customer?.address?.zipCode}`}
                </Typography>
                <Typography variant="body1">
                  {`${props.invoice?.customer?.address?.country}`}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                color: 'gray',
                flexDirection: 'column',
              }}
            >
              <Typography variant="body1">
                {`${props.invoice?.createdAt?.toLocaleDateString('fr-FR', {
                  dateStyle: 'medium',
                })}`}
              </Typography>
              <Typography variant="body1">
                {`${props.invoice?.address?.city}, ${props.invoice?.address?.state} ${props.invoice?.address?.zipCode}`}
              </Typography>
              <Typography variant="body1">
                {`${props.invoice?.address?.country}`}
              </Typography>
            </Box>
          </Box>

          <Paper sx={{ mt: 2, width: '100%' }}>
            <Table aria-label="sticky table" size="small">
              <TableHead color="green" sx={{ backgroundColor: '#ddd' }}>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prix Unitaire</TableCell>
                  <TableCell>Quantite</TableCell>
                  <TableCell>Prix Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.invoice.invoiceItems &&
                  props.invoice.invoiceItems?.length > 0 ? (
                  <>
                    {props.invoice.invoiceItems?.map((invItem) => (
                      <TableRow key={invItem.item?.id} hover>
                        <TableCell>{invItem.item?.name}</TableCell>
                        <TableCell>{invItem.item?.price || 0} €</TableCell>
                        <TableCell>{invItem.quantity}</TableCell>
                        <TableCell>
                          {((invItem.item?.price || 0) * (invItem.quantity || 1)).toFixed(2)} €
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
                        fontStyle: 'italic',
                        color: '#888',
                        padding: 3,
                      }}
                    >
                      Aucuns produits...!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>

          <Box
            component="div"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              bgcolor: '#bbb',
              width: { xs: '100%', sm: '50%' },
              py: 0.5,
              pr: 4,
              pl: 2,
              mt: 2,
              ml: 'auto',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
              }}
            >
              Total:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
              }}
            >
              {props.invoice.invoiceItems
                ?.reduce((acc, curr) => {
                  return acc + (curr.item?.price || 0) * (curr.quantity || 1);
                }, 0)
                .toFixed(2)} €
            </Typography>
          </Box>
        </Box>
        <Tooltip
          title="Imprimer"
          className="no-print"
          sx={{
            position: 'fixed',
            bottom: 10,
            left: 10,
          }}
        >
          <IconButton onClick={handlePrint}>
            <Print color="action" />
          </IconButton>
        </Tooltip>
      </Box>
    </Modal>
  );
};

export default PrintInvoiceModal;