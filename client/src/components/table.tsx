import styles from '../styles/table.module.css';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NavDropdown from 'react-bootstrap/NavDropdown';
interface Props {
  columns: Column[];
  title: string;
  dummyData?: any;
  edit?: (userId: number) => void;
  _delete?: (userId: number) => void;
  handleCancelOrder?: (id: number) => void
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

function DeatailsTable({ _delete, edit, dummyData, columns, title, handleCancelOrder }: Props) {
  const router = useNavigate();

  // Sort dummyData based on createdAt before rendering
  const sortedData = React.useMemo(() => {
    return dummyData?.slice().sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime(); // Change to dateA.getTime() - dateB.getTime() for ascending order
    });
  }, [dummyData]);

  const handleClick = (value: string, item: any) => {
    if (title === 'Vendor Portal') {
      if (value !== 'Completed') {
        const idQueryParam = item?.id != null ? `id=${item.id}` : '';
        const inventoryIdQueryParam = item?.inventoryId != null ? `inventoryId=${item.inventoryId}` : '';

        const queryParams = [idQueryParam, inventoryIdQueryParam].filter(Boolean).join('&&');
        const url = `/vendor/progress-mode?${queryParams}`;

        router(url);
      }
    }
  };

  function formatDateTime(datetime: string | number | Date) {
    const dateObj = new Date(datetime);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    // const amOrPm = hours >= 12 ? 'PM' : 'AM';
    // const formattedHours = hours % 12 || 12;
    // const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    // const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    // return `${formattedDate} ${formattedHours}:${formattedMinutes} ${amOrPm}`;
    return datetime;
  }

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer
          sx={{
            maxHeight: '70vh',
            margin: '2px',
            '.MuiTableCell-root': {
              padding: '8px',
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    style={{ minWidth: column.minWidth }}
                    className={styles.tableHeadings}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData?.map((item: any, index: number) => (
                <TableRow key={index} hover tabIndex={-1}>
                  {columns.map((column) => (
                    <TableCell className={styles.cell} key={column.id} align="center">
                      {column.id === 'status' ? (
                        <Button
                          disableRipple
                          disableElevation
                          onClick={() => handleClick(item.status, item)}

                          className={
                            item.status === 'Approved' || item.status === 'completed'
                              ? `${styles.tableButtonApproved} btnText`
                              : item.status === 'canceled'
                                ? `${styles.tableButtonCancelled} btnText`
                                : `${styles.tableButton} btnText`
                          }
                        >
                          {
                            item.status === 'pending' ?
                              <NavDropdown title={item.status} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => handleCancelOrder && handleCancelOrder(item.id)}>
                                  Cancel
                                </NavDropdown.Item>
                              </NavDropdown>
                              : <>     {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</>
                          }
                        </Button>
                      ) : column.id === 'action' ? (
                        <div>
                          <IconButton onClick={() => edit && edit(item.id)}>
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton onClick={() => _delete && _delete(item.id)}>
                            <DeleteOutlinedIcon color="error" />
                          </IconButton>
                        </div>
                      ) : column.id === 'title' ? (
                        <Tooltip title={item[column.id]}><div>
                          {item[column.id]?.length > 23 ? item[column.id].slice(0, 22) + '...' : item[column.id]}
                        </div></Tooltip>
                      ) : (
                        (column.id === 'createdAt' || column.id === 'updatedAt') ? formatDateTime(item[column.id]) : item[column.id]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default DeatailsTable;
