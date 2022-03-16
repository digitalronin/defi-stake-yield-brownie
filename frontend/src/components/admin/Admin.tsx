import {useState, useEffect} from "react"
import {Box} from "@material-ui/core"
import {makeStyles} from "@material-ui/core"
import {Button, CircularProgress, Snackbar} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import {useNotifications} from "@usedapp/core"
import {useIssueTokens} from "../../hooks/useIssueTokens"

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: "white",
    borderRadius: "25px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4),
    padding: theme.spacing(4)
  },
  header: {
    color: "white"
  }
}))

export const Admin = () => {

  const classes = useStyles()

  const {issueTokens, state: issueTokensState} = useIssueTokens()

  const isMining = issueTokensState.status === "Mining"
  const [showIssueTokensSuccess, setShowIssueTokensSuccess] = useState(false)
  const {notifications} = useNotifications()

  const handleIssueTokensSubmit = () => {
    console.log("Issue tokens")
    return issueTokens()
  }

  const handleCloseSnack = () => {
    setShowIssueTokensSuccess(false)
  }

  useEffect(() => {
    if (notifications.filter(
      (notification) =>
        notification.type === "transactionSucceed" &&
        notification.transactionName === "Issue tokens").length > 0) {
      setShowIssueTokensSuccess(true)
    }
  }, [notifications, showIssueTokensSuccess])

  return (
    <Box>
      <h1 className={classes.header}>Administrator Functions</h1>
      <Box className={classes.box}>
        <Button
          onClick={handleIssueTokensSubmit}
          color="primary"
          disabled={isMining}
          size="large">
          {isMining ? <CircularProgress size={26} /> : "Issue Tokens!"}
        </Button>
        <Snackbar
          open={showIssueTokensSuccess}
          autoHideDuration={5000}
          onClose={handleCloseSnack}>
          <Alert onClose={handleCloseSnack} severity="success">
            Tokens issued successfully
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}
