import React from 'react'
import {DAppProvider, Rinkeby} from "@usedapp/core"
import {Header} from "./components/Header"
import {Main} from "./components/Main"
import {Container} from "@material-ui/core"

function App() {
  return (
    <DAppProvider config={{
      networks: [Rinkeby]
    }}>
      <Header></Header>
      <Container maxWidth="md">
        <Main />
      </Container>
    </DAppProvider>
  )
}

export default App
