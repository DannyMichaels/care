import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Link, Route, Switch } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment-timezone';
import { makeStyles } from '@material-ui/core/styles';
import getRating from '../../utils/getRating';
import CircularProgress from '@material-ui/core/CircularProgress';
import FoodEdit from '../Dialogs/FoodDialogs/FoodEdit';
import FoodDetail from '../Dialogs/FoodDialogs/FoodDetail';
import { foodNameJSX } from '../../utils/foodUtils';
import GlassCard from '../shared/GlassCard';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  clickArea: {
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 4,
    paddingTop: theme.spacing(1),
  },
}));

export default function FoodCard({
  foods,
  setFoods,
  handleUpdate,
  food,
  openOptions,
  handleDelete,
}) {
  const classes = useStyles();
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const onSave = async (id, formData) => {
    setIsRefreshed(true);
    try {
      await handleUpdate(id, formData);
    } finally {
      setIsRefreshed(false);
      setOpenEdit(false);
    }
  };

  const onDelete = (id) => {
    handleDelete(id);
    if (openDetail) {
      setOpenDetail(false);
    }
  };

  return (
    <>
      <GlassCard>
        <div className={classes.container}>
          <div className={classes.clickArea} onClick={() => setOpenDetail(true)}>
            {!isRefreshed ? foodNameJSX(food) : <CircularProgress />}
            <Typography variant="caption" color="textSecondary" component="div">
              <Moment format="MMM/DD/yyyy hh:mm A">
                {food?.time?.toLocaleString()}
              </Moment>
            </Typography>
            <div>{getRating(food.rating, "⭐")}</div>
          </div>
          {openOptions && (
            <>
              <Divider style={{ margin: '8px 0' }} />
              <div className={classes.actions}>
                <IconButton
                  component={Link}
                  onClick={() => setOpenEdit(true)}
                  to={`/foods/${food.id}/edit`}
                  color="primary"
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() => handleDelete(food.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </>
          )}
        </div>
      </GlassCard>
      {openEdit && (
        <Switch>
          <Route path="/foods/:id/edit">
            <FoodEdit foods={foods} onSave={onSave} setOpenEdit={setOpenEdit} />
          </Route>
        </Switch>
      )}
      {openDetail && (
        <FoodDetail
          food={food}
          openDetail={openDetail}
          onDelete={onDelete}
          setOpenDetail={setOpenDetail}
        />
      )}
    </>
  );
}
