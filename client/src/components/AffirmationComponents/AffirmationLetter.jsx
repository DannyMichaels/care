import { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import { Switch, Route, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AffirmationDetail from '../Dialogs/AffirmationDialogs/AffirmationDetail';
import AffirmationEdit from '../Dialogs/AffirmationDialogs/AffirmationEdit';
import CircularProgress from '@material-ui/core/CircularProgress';
import GlassCard from '../shared/GlassCard';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 4,
    paddingTop: theme.spacing(1),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
}));

export default function AffirmationLetter({
  affirmation,
  openOptions,
  handleDelete,
  handleUpdate,
  affirmations,
  setAffirmations,
}) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const onSave = (id, formData) => {
    handleUpdate(id, formData);
    setIsRefreshed(true);
    setTimeout(async () => {
      setIsRefreshed(false);
      setOpenEdit(false);
    }, 800);
    setAffirmations(affirmations);
  };

  const handleOpen = () => {
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpenEdit(false);
  };

  const onDelete = (id) => {
    handleDelete(id);
    setOpenDetail(false);
  };

  const handleDetailOpen = () => {
    setOpenDetail(true);
  };

  const handleDetailClose = () => {
    setOpenDetail(false);
  };

  return (
    <>
      {!isRefreshed ? (
        <>
          <GlassCard>
            <div className={classes.container}>
              <img
                style={{ cursor: 'pointer' }}
                onClick={handleDetailOpen}
                width="80px"
                height="80px"
                src="https://www.pngrepo.com/download/180697/love-letter-hearts.png"
                alt="closed affirmation letter"
              />
              {openOptions && (
                <>
                  <Divider style={{ margin: '8px 0' }} />
                  <div className={classes.actions}>
                    <IconButton
                      component={Link}
                      to={`/affirmations/${affirmation.id}/edit`}
                      onClick={handleOpen}
                      color="primary"
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      size="small"
                      onClick={() => handleDelete(affirmation.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
          {openDetail && (
            <AffirmationDetail
              affirmation={affirmation}
              openDetail={openDetail}
              onDelete={onDelete}
              handleDetailClose={handleDetailClose}
            />
          )}
        </>
      ) : (
        <div className={classes.loading}>
          <CircularProgress style={{ height: '80px', width: '80px' }} />
        </div>
      )}
      {openEdit && (
        <Switch>
          <Route path="/affirmations/:id/edit">
            <AffirmationEdit
              handleOpen={handleOpen}
              affirmations={affirmations}
              onSave={onSave}
              handleClose={handleClose}
            />
          </Route>
        </Switch>
      )}
    </>
  );
}
