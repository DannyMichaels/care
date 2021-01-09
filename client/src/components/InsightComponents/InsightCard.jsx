import Moment from "react-moment";
import "moment-timezone";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { useStateValue } from "../Context/CurrentUserContext";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DeleteInsight from "../Modals/DeleteInsight";
import { useStyles } from "./insightCardStyles.js";
import UnlikedIcon from "@material-ui/icons/FavoriteBorder";
import LikedIcon from "@material-ui/icons/Favorite";
import React, { useState, useEffect } from "react";
import { destroyLike, postLike } from "../../services/likes";

function InsightCard({
  insight,
  handleDelete,
  handleOpen,
  handleClose,
  openDelete,
  onDelete,
  darkMode,
}) {
  const [{ currentUser }] = useStateValue();
  const [allLikes, setAllLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState([]); // for a live feel if using 2 tabs open, not necessary for 1 tab...
  const [likeDisabled, setLikeDisabled] = useState(false);

  const classes = useStyles({ darkMode, liked, likeDisabled });

  useEffect(() => {
    const fetchLikes = async () => {
      setAllLikes(insight.likes);
      setLikeCount(insight.likes.length);
    };
    fetchLikes();
  }, [insight?.likes]);

  useEffect(() => {
    const likeFound = allLikes?.find(
      (like) =>
        like?.insight_id === insight?.id && currentUser?.id === like?.user_id
    );
    likeFound ? setLiked(true) : setLiked(false);

    localStorage.setItem("update", likeFound ? "true" : "false"); // when liking with 2 tabs open to avoid an exploit (syncing the data between multiple tabs)
  }, [allLikes, currentUser?.id, insight?.id]);

  const handleLike = async () => {
    if (!likeDisabled) {
      setLiked(true);
      setLikeCount((prevCount) => (prevCount += 1)); // for when a user tries to unlike/like with 2 tabs open

      const newLike = await postLike({
        user_id: currentUser.id,
        insight_id: insight.id,
      });
      setAllLikes((prevState) => [...prevState, newLike]);

      setLikeDisabled(true);
      setTimeout(async () => {
        setLikeDisabled(false);
      }, 500);
    }
  };

  const handleUnlike = async () => {
    if (!likeDisabled) {
      setLiked(false);
      if (insight.likes.length > 0) {
        setLikeCount((prevCount) => (prevCount -= 1));
      } else {
        setLikeCount((prevCount) => (prevCount += 0));
        // if user is spamming likes on 2 tabs open,
        // the backend will reject the likes, but it'll still give him the feel of liking something on 2 tabs open.
      }

      const likeToDelete = allLikes?.find(
        (like) =>
          like?.insight_id === insight?.id && currentUser?.id === like?.user_id
      );
      await destroyLike(likeToDelete?.id);
      setAllLikes((prevState) =>
        prevState.filter((like) => like?.id !== likeToDelete?.id)
      );
      setLikeDisabled(true);
      setTimeout(async () => {
        setLikeDisabled(false);
      }, 500);
    }
  };

  return (
    <>
      <Card className={classes.root}>
        <Link className={classes.link} to={`/insights/${insight?.id}`}>
          <Typography className={classes.title}>{insight?.title}</Typography>
        </Link>
        <div className={classes.userContainer}>
          <Link className={classes.link} to={`/users/${insight?.user?.id}`}>
            {insight?.user?.image ? (
              <img
                src={insight?.user?.image}
                className={classes.userImage}
                alt={insight.user.name}
              />
            ) : (
              <AccountCircleIcon className={classes.userIcon} />
            )}
            <Typography className={classes.userName}>
              {insight?.user?.name ? insight?.user?.name : <>Anonymous</>}
            </Typography>
          </Link>
        </div>
        <div>
          <Typography className={classes.date}>
            Created at:&nbsp;
            <Moment format="MMM-DD-yyyy hh:mm A">{insight?.created_at}</Moment>
          </Typography>
        </div>
        <div>
          <Typography>{insight?.description}</Typography>
        </div>
        <br />

        <div className={classes.likeContainer}>
          {!liked ? (
            <UnlikedIcon
              className={classes.unLikedInsight}
              onClick={handleLike}
            />
          ) : (
            <LikedIcon
              className={classes.likedInsight}
              onClick={handleUnlike}
            />
          )}
          &nbsp;
          {likeCount}
        </div>

        {insight?.user.id === currentUser?.id && (
          <>
            <div className={classes.buttons}>
              <Link to={`/insights/${insight.id}/edit`}>
                <Button variant="contained" color="primary">
                  Edit
                </Button>
              </Link>
              <Button
                className={classes.delete}
                variant="contained"
                color="secondary"
                onClick={() => handleOpen(insight.id)}>
                Delete
              </Button>
            </div>
          </>
        )}
      </Card>
      <DeleteInsight
        insight={insight}
        openDelete={openDelete === insight.id}
        onDelete={onDelete}
        handleOpen={handleOpen}
        handleDelete={handleDelete}
        handleClose={handleClose}
      />
    </>
  );
}

export default InsightCard;
