import React, {useState, useEffect} from "react"
import {Box} from "@material-ui/core"
import {Snackbar} from "@material-ui/core"
import {TabContext, TabList, TabPanel} from "@material-ui/lab"
import {Tab} from "@material-ui/core"
import {Token} from "../Main"
import {UnstakeForm} from "./UnstakeForm"
import {makeStyles} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import {useNotifications} from "@usedapp/core"
import {useUnstakeAll} from "../../hooks/useUnstakeAll"

interface TokenFarmProps {
  supportedTokens: Array<Token>
}

const useStyles = makeStyles((theme) => ({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4)
  },
  box: {
    backgroundColor: "white",
    borderRadius: "25px"
  },
  header: {
    color: "white"
  }
}))

export const TokenFarm = ({supportedTokens}: TokenFarmProps) => {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
  const [showUnstakeTokenSuccess, setShowUnstakeTokenSuccess] = useState(false)

  const {notifications} = useNotifications()

  const classes = useStyles()

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTokenIndex(parseInt(newValue))
  }

  const selectedToken = supportedTokens[selectedTokenIndex]
  const {unStakeAll, state: unStakeState} = useUnstakeAll(selectedToken.address)

  const isMining = unStakeState.status === "Mining"

  const handleUnstakeSubmit = () => {
    console.log("unstake all", selectedToken.name)
    return unStakeAll()
  }

  const handleCloseSnack = () => {
    setShowUnstakeTokenSuccess(false)
  }

  useEffect(() => {
    if (notifications.filter(
      (notification) =>
        notification.type === "transactionSucceed" &&
        notification.transactionName === "Unstake tokens").length > 0) {
      setShowUnstakeTokenSuccess(true)
    }
  }, [notifications, showUnstakeTokenSuccess])

  return (
    <Box>
      <h1 className={classes.header}>Token Farm</h1>
      <Box className={classes.box}>
        <TabContext value={selectedTokenIndex.toString()}>
          <TabList onChange={handleChange} aria-label="stake form tabs">
            {supportedTokens.map((token, index) => {
              return (
                <Tab label={token.name}
                  value={index.toString()}
                  key={index} />
              )
            })}
          </TabList>
          {supportedTokens.map((_token, index) => {
            return (
              <TabPanel value={index.toString()} key={index}>
                <UnstakeForm
                  className={classes.tabContent}
                  token={selectedToken}
                  handleUnstakeSubmit={handleUnstakeSubmit}
                  isMining={isMining}
                />
                <Snackbar
                  open={showUnstakeTokenSuccess}
                  autoHideDuration={5000}
                  onClose={handleCloseSnack}>
                  <Alert onClose={handleCloseSnack} severity="success">
                    {`Your ${selectedToken.name} have been unstaked`}
                  </Alert>
                </Snackbar>
              </TabPanel>
            )
          })}
        </TabContext>
      </Box>
    </Box>
  )
}

