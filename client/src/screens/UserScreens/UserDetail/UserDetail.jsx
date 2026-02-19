import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Moment from "react-moment";
import Typography from "@material-ui/core/Typography";
import {
  checkInsights,
  checkLikedInsights,
} from "../../../utils/checkInsights";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { toTitleCase, getAge, getAllBlocks, postBlock, unblockUser } from '@care/shared';
import Wrapper from "./styledUserDetail";
import LinearProgressLoading from "../../../components/Loading/LinearProgressLoading";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import IconButton from "@material-ui/core/IconButton";
import { useStateValue } from "../../../context/CurrentUserContext";

export default function UserDetail({ getOneUser }) {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [{ currentUser }] = useStateValue();
  const { id } = useParams();

  const { goBack } = useHistory();

  useEffect(() => {
    const getData = async () => {
      const getUser = await getOneUser(id);
      setUser(getUser);
      setLoaded(true);
    };
    getData();
  }, [getOneUser, id]);

  useEffect(() => {
    const checkBlocked = async () => {
      try {
        const blocks = await getAllBlocks();
        setIsBlocked(blocks.some((b) => b.blocked_id === Number(id)));
      } catch {}
    };
    if (currentUser && Number(id) !== currentUser.id) {
      checkBlocked();
    }
  }, [id, currentUser]);

  const handleBlock = async () => {
    await postBlock(Number(id));
    setIsBlocked(true);
  };

  const handleUnblock = async () => {
    await unblockUser(Number(id));
    setIsBlocked(false);
  };

  const INSIGHTS = user?.insights?.map((insight) => (
    <Link
      key={insight.id}
      className="insights-link"
      to={`./../insights/${insight.id}`}>
      {insight?.title}
    </Link>
  ));

  const LIKED_INSIGHTS = React.Children.toArray(
    user?.liked_insights?.map((likedInsight) => (
      <Link
        className="insights-link"
        to={`./../insights/${likedInsight.id}`}>
        {likedInsight?.title}
      </Link>
    ))
  );

  if (!loaded) {
    return <LinearProgressLoading />;
  }

  const userDate = user?.created_at?.toLocaleString();

  return (
    <Wrapper>
      <div className="content-container">
        <div className="title-container">
          <div className="arrow-container">
            <IconButton className="arrow-icon" onClick={() => goBack()}>
              <ArrowBackIcon className="arrow-icon" />
            </IconButton>
          </div>
          <Typography className="title">
            {!user?.image && <AccountCircleIcon className="user-icon" />}
            {user?.name}
          </Typography>
          {user?.image && (
            <img className="user-image" src={user?.image} alt={user?.name} />
          )}
          {user?.birthday && (
            <Typography className="age">
              Age: {getAge(user.birthday)} years old
            </Typography>
          )}
          <Typography className="gender">
            Gender: {toTitleCase(user.gender)}
          </Typography>
          <Typography className="date">
            Joined:&nbsp;
            <Moment format="dddd, MMMM Do yyyy">{userDate}</Moment>
          </Typography>
        </div>
        <hr className="top-hr" />
        <div className="inner-column">
          <div className="check-insights">{checkInsights(user)}</div>
          <div className="insights-container">{INSIGHTS}</div>
          <div className="check-likes">{checkLikedInsights(user)}</div>
          <div className="likes-container">{LIKED_INSIGHTS}</div>
        </div>
        <br />
        <br />
        <hr className="bottom-hr" />
        <div className="buttons">
          {currentUser && Number(id) !== currentUser.id && (
            <Button
              variant="outlined"
              onClick={isBlocked ? handleUnblock : handleBlock}
              style={{ marginRight: 8 }}>
              {isBlocked ? 'Unblock User' : 'Block User'}
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => goBack()}>
            Go Back
          </Button>
        </div>
      </div>
    </Wrapper>
  );
}
