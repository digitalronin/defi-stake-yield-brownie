import React, {useState} from "react"
import {Box} from "@material-ui/core"
import {TabContext, TabList, TabPanel} from "@material-ui/lab"
import {Tab} from "@material-ui/core"
import {Token} from "../Main"
import {StakedBalance} from "./StakedBalance"
import {makeStyles} from "@material-ui/core"

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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTokenIndex(parseInt(newValue))
  }

  const classes = useStyles()

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
          {supportedTokens.map((token, index) => {
            const selectedToken = supportedTokens[selectedTokenIndex]
            return (
              <TabPanel value={index.toString()} key={index}>
                <div className={classes.tabContent}>
                  <StakedBalance token={selectedToken} />
                </div>
              </TabPanel>
            )
          })}
        </TabContext>
      </Box>
    </Box>
  )
}

