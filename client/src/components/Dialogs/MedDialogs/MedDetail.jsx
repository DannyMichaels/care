import { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import "moment-timezone";
import { compareDateWithCurrentTime } from "@care/shared";
import {
  DialogContent,
  DialogActions,
} from "../../Form/DialogComponents";
import MedImage from "../../MedComponents/MedImage";

export default function MedDetail({
  med,
  openDetail,
  handleDetailClose,
  onDelete,
  onTake,
  medIsTaken,
  occurrence,
}) {
  const [medData, setMedData] = useState({});
  const taken = medIsTaken !== undefined ? medIsTaken : !!med.is_taken;

  let currentTime = new Date();

  useEffect(() => {
    const getMedData = () => {
      const { name, medication_class, reason, time } = med;
      setMedData({
        name,
        medication_class,
        time,
        reason,
        is_taken: true,
        taken_date: new Date().toISOString(),
      });
    };
    if (med.id) {
      getMedData();
    }
  }, [med]);

  return (
    <Dialog onClose={handleDetailClose} open={openDetail}>
      <MuiDialogTitle disableTypography style={{ position: "relative", padding: "16px", paddingRight: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <MedImage
            icon={med.icon}
            iconColor={med.icon_color}
            alt={med.name}
            style={{ height: "30px", width: "30px" }}
          />
          <div>
            <Typography style={{ fontSize: "1.3rem", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
              {med.name}
            </Typography>
            {med.medication_class && (
              <Typography variant="body2" color="textSecondary">
                {med.medication_class}
              </Typography>
            )}
          </div>
        </div>
        <IconButton
          aria-label="close"
          onClick={handleDetailClose}
          style={{ position: "absolute", right: 8, top: 8, color: "#9e9e9e" }}
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <DialogContent
        dividers
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          overflowWrap: "break-word",
        }}
      >
        {compareDateWithCurrentTime(med?.time) < 0 ? (
          <Typography>I take {med.name} because...</Typography>
        ) : (
          <Typography>I am supposed to take {med.name} because...</Typography>
        )}
        <Typography style={{ marginTop: "2px" }}>
          <small>{med.reason}</small>
        </Typography>
      </DialogContent>
      <div style={{ padding: "8px 16px" }}>
        {compareDateWithCurrentTime(med?.time) < 0 && !taken ? (
          <Typography>
            You have to take {med?.name}&nbsp;
            <Moment from={currentTime?.toISOString()}>{med?.time}</Moment>
          </Typography>
        ) : compareDateWithCurrentTime(med?.time) === 1 && !taken ? (
          <Typography>Did you take {med?.name}?</Typography>
        ) : compareDateWithCurrentTime(med?.time) === 1 && taken ? (
          <Typography>
            You took {med?.name} at&nbsp;
            <Moment format="MMM/DD/yyyy hh:mm A">{occurrence?.taken_date || med?.taken_date}</Moment>
          </Typography>
        ) : (
          <Typography>
            You have to take {med?.name}&nbsp;
            <Moment from={currentTime?.toISOString()}>{med?.time}</Moment>
          </Typography>
        )}
      </div>
      <DialogActions>
        {compareDateWithCurrentTime(med?.time) === 1 &&
        !taken ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleDetailClose}
          >
            <>Not yet</>
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleDetailClose}
          >
            <>Exit</>
          </Button>
        )}
        {compareDateWithCurrentTime(med?.time) === 1 && !taken ? (
          <Button
            variant="contained"
            color="secondary"
            className="delete-button"
            onClick={() => onTake(med.id, medData)}
          >
            Yes
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            className="delete-button"
            onClick={() => onDelete(med.id)}
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
