import {Header} from "./Header"
import {Main} from "./Main"
import {Container} from "@material-ui/core"

export const Home = () => {
  return (
    <div>
      <Header></Header>
      <Container maxWidth="md">
        <Main />
      </Container>
    </div>
  )
}
