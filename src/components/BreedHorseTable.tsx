import React from 'react';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import {DataGrid, GridColDef, GridSortDirection} from '@material-ui/data-grid';

interface Props {
  horses: BreedHorse[];
}

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: '名前',
    width: 200,
  },
  {
    field: 'year',
    headerName: '歳',
    width: 70,
  },
  {
    field: 'speed',
    headerName: 'SP',
    width: 70,
  },
  {
    field: 'stamina',
    headerName: 'ST',
    width: 70,
  },
];

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
  },
});

export const BreedHorseTable: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <DataGrid
        getRowId={(row) => row.name}
        rows={props.horses}
        columns={columns}
        headerHeight={30}
        rowHeight={30}
        disableColumnMenu
        sortModel={[
          {
            field: 'year',
            sort: 'desc' as GridSortDirection,
          },
        ]}
      />
    </Box>
  );
};
