import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { DetailPage } from './pages/DetailPage'
import { ListPage } from './pages/ListPage'
import store from './store'
import {Character, CharacterGender, CharacterStatus} from "./api/types";

export const mock: Character = {
    id: 2,
    name: 'Morty Smith',
    status: CharacterStatus.ALIVE,
    species: 'Human',
    type: '',
    gender: CharacterGender.MALE,
    origin: { name: 'unknown', url: '' },
    location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    episode: [],
    url: 'https://rickandmortyapi.com/api/character/2',
    created: '2017-11-04T18:50:21.651Z'
};
export const urlCharacter = 'https://rickandmortyapi.com/api/character/';

export const App = () => (
  <Provider store={store}>
    <AppLayout>
      <BrowserRouter>
        <Switch>
          <Route path="/detail/:id" component={DetailPage} />
          <Route path="/" component={ListPage} />
        </Switch>
      </BrowserRouter>
    </AppLayout>
  </Provider>
)
