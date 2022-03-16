import {Box} from "@material-ui/core"
import {makeStyles} from "@material-ui/core"
import {Button, Input, CircularProgress, Snackbar} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
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

  const handleIssueTokensSubmit = () => {
    console.log("Issue tokens")
    return issueTokens()
  }

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
      </Box>
    </Box>
  )
}
