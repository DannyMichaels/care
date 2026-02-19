import React, {useState, useEffect} from "react";
import {Link, useParams, useHistory} from "react-router-dom";
import Moment from "react-moment";

// components
import TextField from "@material-ui/core/TextField";
import CareCard from "../../../components/Card/CareCard";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LinearProgressLoading from "../../../components/Loading/LinearProgressLoading";

// Icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import FlagIcon from "@material-ui/icons/Flag";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

// Context
import {useStateValue} from "../../../context/CurrentUserContext";

// services
import {destroyComment, postComment, putComment, postReport} from '@care/shared';

// Views
import DeleteInsightFromDetail from "../../../components/Modals/DeleteInsightFromDetail";
import DeleteCommentFromDetail from "../../../components/Modals/DeleteCommentFromDetail";
import EditCommentFromDetail from "../../../components/Modals/EditCommentFromDetail";

// Styles
import Wrapper from "./styledInsightDetail";

export default function InsightDetail({
                                          getOneInsight,
                                          handleDelete,
                                          setInsightsLoaded,
                                      }) {
    const [insight, setInsight] = useState(null);
    const [{currentUser}] = useStateValue();
    const [loaded, setLoaded] = useState(false);
    const [openInsightDelete, setOpenInsightDelete] = useState(false);
    const [openCommentDelete, setOpenCommentDelete] = useState(false);
    const [openCommentEdit, setOpenCommentEdit] = useState(false);
    const [formData, setFormData] = useState({
        content: "",
    });
    const [reportOpen, setReportOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");

    const {goBack} = useHistory();

    const {id} = useParams();

    const onInsightDelete = (id) => {
        handleDelete(id);
        if (openInsightDelete) {
            setOpenInsightDelete(false);
        }
    };

    const handleDeleteOpen = (id) => {
        setOpenInsightDelete(id);
    };

    const handleDeleteCommentOpen = (id) => {
        setOpenCommentDelete(id);
    };

    const handleDeleteClose = () => {
        setOpenInsightDelete(false);
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const getInsight = await getOneInsight(id);
                setInsight(getInsight);
            } catch {
                goBack();
            } finally {
                setLoaded(true);
            }
        };
        getData();
    }, [getOneInsight, id]);

    if (!loaded) {
        return <LinearProgressLoading/>;
    }

    if (!insight) {
        return null;
    }

    const COMMENTS = insight.comments.map((comment) => {
        const handleCommentDelete = async (insightId, commentId) => {
            await destroyComment(insightId, commentId);
            setInsight((prevState) => ({
                ...prevState,
                comments: prevState.comments.filter((comment) => {
                    return comment.id !== Number(commentId);
                }),
            }));
            setInsightsLoaded(false);
            setOpenCommentDelete(false);
        };

        const handleCommentUpdate = async (insightId, commentData, commentId) => {
            const editedComment = await putComment(insightId, commentData, commentId);

            const updatedComment = {
                ...editedComment,
                user: currentUser,
            };

            setInsight((prevState) => ({
                ...prevState,
                comments: prevState.comments.map((comment) => {
                    return comment.id === Number(commentId) ? updatedComment : comment;
                }),
            }));
            setOpenCommentEdit(false);
        };

        return (
            <>
                <CareCard
                    key={comment?.id}
                    user={comment?.user}
                    post={comment}
                    openDeleteModal={handleDeleteCommentOpen}
                    openEditModal={() => setOpenCommentEdit(comment.id)}
                    description={comment?.content}
                    commentStyles={true}
                    EditIsLink={false}
                />

                <DeleteCommentFromDetail
                    insight={insight}
                    comment={comment}
                    openDelete={openCommentDelete === comment.id}
                    handleOpen={handleDeleteOpen}
                    onDelete={handleCommentDelete}
                    handleClose={() => setOpenCommentDelete(false)}
                />

                <EditCommentFromDetail
                    insight={insight}
                    comment={comment}
                    openEdit={openCommentEdit === comment.id}
                    onSave={handleCommentUpdate}
                    setOpenEdit={setOpenCommentEdit}
                    handleClose={() => setOpenCommentEdit(false)}
                />
            </>
        );
    });

    const handleCommentChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCreateComment = async (formData, insightId) => {
        let createdComment = await postComment(formData, insightId);

        let newComment = {
            ...createdComment,
            user: currentUser,
        };

        setInsight((prevState) => ({
            ...prevState,
            comments: [...prevState.comments, newComment],
        }));
        setInsightsLoaded(false); // to refetch all Insights in insights page to recount the comment count for the icon.
    };

    const handleReportSubmit = async () => {
        try {
            const report = await postReport({insight_id: insight.id, reason: reportReason});
            setInsight((prev) => ({...prev, my_report: report}));
            setReportOpen(false);
            setReportReason("");
        } catch {
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        await handleCreateComment(formData, insight.id);

        return setFormData((prevState) => ({
            ...prevState,
            content: "",
        }));
    };

    return (
        <>
            <Wrapper>
                <div className="content-container">
                    <div className="title-container">
                        <div className="arrow-container">
                            <IconButton className="arrow-icon" onClick={() => goBack()}>
                                <ArrowBackIcon className="arrow-icon"/>
                            </IconButton>
                        </div>
                        <Typography className="title">&nbsp;{insight?.title}</Typography>
                        <Link className="link" to={`/users/${insight?.user?.id}`}>
                            <Typography className="user-name">
                                {!insight?.user?.image ? (
                                    <AccountCircleIcon className="user-icon"/>
                                ) : (
                                    <img
                                        className="user-image"
                                        src={insight?.user?.image}
                                        alt={insight?.user?.name}
                                    />
                                )}
                                &nbsp;{insight?.user?.name}
                            </Typography>
                        </Link>
                        <Typography>
                            Created At:&nbsp;
                            <Moment format="dddd, MMMM Do yyyy">
                                <small>{insight?.created_at}</small>
                            </Moment>
                        </Typography>
                    </div>
                    <div className="buttons">
                        {insight?.user.id === currentUser?.id && (
                            <>
                                <Button
                                    component={Link}
                                    to={`/insights/${insight?.id}/edit`}
                                    className="edit"
                                    variant="contained"
                                    color="primary">
                                    Edit
                                </Button>
                                <Button
                                    className="delete"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDeleteOpen(insight.id)}>
                                    Delete
                                </Button>
                            </>
                        )}
                        {insight?.user?.id !== currentUser?.id && !insight?.my_report && (
                            <Button
                                startIcon={<FlagIcon/>}
                                size="small"
                                onClick={() => setReportOpen(true)}
                                style={{marginTop: 8}}>
                                Report
                            </Button>
                        )}
                        {insight?.my_report && (
                            <Typography style={{marginTop: 8, opacity: 0.6}} variant="body2">
                                Report {insight.my_report.status}
                            </Typography>
                        )}
                    </div>

                    <hr/>
                    <main className="insight-page">
                        <div className="inner-column">
                            <p className="insight-text">{insight?.body}</p>
                        </div>

                        <hr/>

                        <section className="insight-comments">
                            <div className="inner-column">
                                <br/>
                                <Typography className="comments-title">
                                    Comment Section
                                </Typography>
                                <br/>
                                {insight.comments.length ? (
                                    <ol className="comment-list">{COMMENTS}</ol>
                                ) : (
                                    <Typography className="no-comments">
                                        No Comments...
                                    </Typography>
                                )}

                                <form onSubmit={handleSubmitComment} className="create-comment">
                                    <div className="input-container content">
                                        <TextField
                                            required
                                            multiline
                                            rowsMax={10}
                                            type="text"
                                            name="content"
                                            label="Write a comment"
                                            className="create-comment-input"
                                            value={formData.content}
                                            onChange={handleCommentChange}
                                            id="outlined-multiline-static"
                                            rows={4}
                                            variant="filled"
                                        />
                                    </div>
                                    <Button
                                        disabled={!formData.content}
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                        className="create-comment-button">
                                        Submit Comment
                                    </Button>
                                </form>
                            </div>
                        </section>
                    </main>

                    <br/>
                    <hr className="hr-bottom"/>
                    <footer>
                        <div className="inner-column-button">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => goBack()}>
                                Go Back
                            </Button>
                        </div>
                    </footer>
                </div>
            </Wrapper>
            <DeleteInsightFromDetail
                insight={insight}
                openDelete={openInsightDelete === insight.id}
                onDelete={onInsightDelete}
                handleOpen={handleDeleteOpen}
                handleDelete={handleDelete}
                handleClose={handleDeleteClose}
            />
            <Dialog open={reportOpen} onClose={() => setReportOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Report Insight</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        multiline
                        rows={3}
                        fullWidth
                        label="Reason for reporting"
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReportOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleReportSubmit}
                        color="primary"
                        variant="contained"
                        disabled={!reportReason.trim()}>
                        Submit Report
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
