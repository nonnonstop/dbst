import React from 'react';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import {DataGrid, GridColDef, GridSortDirection, GridValueFormatterParams}
  from '@material-ui/data-grid';

interface Props {
  horses: RaceHorse[];
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
    field: 'sex',
    headerName: '性',
    width: 70,
    valueFormatter: (params: GridValueFormatterParams) => {
      switch (params.value) {
        case 0:
          return '牡';
        case 1:
          return '牝';
        case 2:
          return '騙';
        default:
          return '';
      }
    },
  },
  {
    field: 'weight',
    headerName: '体重',
    width: 100,
    valueGetter: (params: GridValueFormatterParams) => {
      const bestWeight = params.getValue('bestWeight');
      const diffWeight = params.getValue('diffWeight')!;
      if (diffWeight == 0) {
        return `${bestWeight}±0`;
      } else if (diffWeight > 0) {
        return `${bestWeight}+${diffWeight}`;
      } else {
        return `${bestWeight}${diffWeight}`;
      }
    },
  },
  {
    field: 'speed',
    headerName: 'SP',
    width: 70,
  },
  {
    field: 'speedMax',
    headerName: 'SP(最大)',
    width: 100,
  },
  {
    field: 'stamina',
    headerName: 'ST',
    width: 70,
  },
  {
    field: 'staminaMax',
    headerName: 'ST(最大)',
    width: 100,
  },
  {
    field: 'guts',
    headerName: '根性',
    width: 70,
  },
  {
    field: 'gutsMax',
    headerName: '根性(最大)',
    width: 100,
  },
  {
    field: 'temper',
    headerName: '気性',
    width: 70,
  },
  {
    field: 'temperMax',
    headerName: '気性(最大)',
    width: 100,
  },
  {
    field: 'dirt',
    headerName: 'ダート',
    width: 100,
  },
  {
    field: 'health',
    headerName: '体質',
    width: 70,
  },
  {
    field: 'growth',
    headerName: '成長',
    width: 70,
    valueFormatter: (params: GridValueFormatterParams) => {
      switch (params.value) {
        case 0:
          return '超早';
        case 1:
          return '早';
        case 2:
          return '普';
        case 3:
          return '遅普';
        case 4:
          return '晩';
        case 5:
          return '超晩';
        default:
          return '';
      }
    },
  },
  {
    field: 'xMonth',
    headerName: 'X月',
    width: 70,
    valueFormatter: (params: GridValueFormatterParams) => {
      switch (params.value) {
        case 0:
          return '4.3';
        case 1:
          return '4.7';
        case 2:
          return '5.5';
        case 3:
          return '6.3';
        case 4:
          return '7.1';
        case 5:
          return '7.7';
        default:
          return '';
      }
    },
  },
  {
    field: 'cond',
    headerName: '調子',
    width: 70,
  },
  {
    field: 'tired',
    headerName: '疲労',
    width: 70,
  },
  {
    field: 'recovery',
    headerName: '回復',
    width: 70,
  },
];

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
  },
});

export const RaceHorseTable: React.FC<Props> = (props) => {
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
