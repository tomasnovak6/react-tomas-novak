import { useHistory } from 'react-router-dom'
import { CharacterCard } from '../components/CharacterCard'
import {Button, Grid, InputLabel, MenuItem, Select, Paper} from '@mui/material'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { mock, urlCharacter } from '../App';

import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export const ListPage = () => {
    const history = useHistory();

    const [currentPage, setCurrentPage] = useState(1);
    if (localStorage.getItem('currentPage') === null) {
        localStorage.setItem('currentPage', '1');
    }

    const [previousPageDisabled, setPreviousPageDisabled] = useState(false);
    const [nextPageDisabled, setNextPageDisabled] = useState(false);

    const [filterValue, setFilterValue] = useState({'status': '', 'gender': ''});
    const [filterRequestGet, setFiltersRequestGet] = useState('');
    if (localStorage.getItem('filterRequestGet') === null) {
        localStorage.setItem('filterRequestGet', '');
    }

    const [results, setResults] = useState([mock]);

    const handleCharacterClick = (id: number) => {
        history.push(`/detail/${id}`);
    };

    const getResults = async () => {
        const page = localStorage.getItem('currentPage');
        const filterRequest = localStorage.getItem('filterRequestGet')
        const urlList = `${urlCharacter}?page=${page}${filterRequest}`;

        await axios
            .get(urlList)
            .then((res) => {
                if (res.data.info.prev === null) {
                    setPreviousPageDisabled(true);
                } else {
                    setPreviousPageDisabled(false);
                }

                if (res.data.info.next === null) {
                    setNextPageDisabled(true);
                } else {
                    setNextPageDisabled(false);
                }

                setResults(res.data.results);
            })
            .catch((error) => {
                console.log('error', error);
            });
    };

    useEffect(() => {
        getResults();
        // eslint-disable-next-line
    }, []);

    const handlePageClick = (e: any) => {
        const pageButton = e.target.name;
        let currentPageNew = currentPage;

        if (pageButton === 'prev') {
            currentPageNew--;
        } else if (pageButton === 'next') {
            currentPageNew++;
        }

        localStorage.setItem('currentPage', (currentPageNew).toString());
        setCurrentPage(currentPageNew)
        getResults();
    }

    const onFilterSubmit = () => {
        let requestGetWhole = '';

        for (let [property, value] of Object.entries(filterValue)) {
            if (value !== '') {
                requestGetWhole = requestGetWhole + '&' + property + '=' + value;
            }
        }

        if (requestGetWhole !== '') {
            localStorage.setItem('filterRequestGet', requestGetWhole);
            setFiltersRequestGet(requestGetWhole);
            getResults();
        }
    }

    const onFilterRemove = () => {
        localStorage.setItem('filterRequestGet', '');
        setFilterValue({'status': '', 'gender': ''});
        setFiltersRequestGet('');
        getResults();
    }

    const onFilterChange = (e: any) => {
        if (e.target.value && e.target.value !== '') {
            const property = e.target.name;
            const value = e.target.value;
            setFilterValue({...filterValue, [property]: value});
        }
    }

  return (
      <Grid>
          <Grid>
              <Grid item>
                  <Item>
                      <InputLabel id="status-label">Status:</InputLabel>
                      <Select
                        labelId="status-label"
                        id="status-select"
                        name="status"
                        value={filterValue.status}
                        label="Status"
                        onChange={onFilterChange}
                        sx={{ minWidth: '30%' }}
                      >
                          <MenuItem value={'alive'}>Alive</MenuItem>
                          <MenuItem value={'dead'}>Dead</MenuItem>
                          <MenuItem value={'unknown'}>Unknown</MenuItem>
                      </Select>
                  </Item>
                  <Item>
                      <InputLabel id="gender-label">Gender:</InputLabel>
                      <Select
                          labelId="gender-label"
                          id="gender-select"
                          name="gender"
                          value={filterValue.gender}
                          label="Gender"
                          onChange={onFilterChange}
                          sx={{ minWidth: '30%'}}
                      >
                          <MenuItem value={'female'}>Female</MenuItem>
                          <MenuItem value={'male'}>Male</MenuItem>
                          <MenuItem value={'genderless'}>Genderless</MenuItem>
                          <MenuItem value={'unknown'}>Unknown</MenuItem>
                      </Select>
                  </Item>
              </Grid>

              <Grid item>
                  <Item>
                      <Button
                          variant="contained"
                          onClick={onFilterSubmit}
                          sx={{margin: '1em'}}
                      >Použít filtry</Button>
                      <Button
                          variant="outlined"
                          onClick={onFilterRemove}
                          sx={{margin: '1em'}}
                          disabled={filterRequestGet === ''}
                      >Vymazat filtry</Button>
                  </Item>
              </Grid>
          </Grid>


          <Grid mt={2}>
              {results.map((item) => (
                  <CharacterCard key={item.id} character={item} onClick={handleCharacterClick} />
              ))}
          </Grid>

          <Grid mt={1} item>
              <Item>
                  <Button sx={{margin: '1em'}} name="prev" disabled={previousPageDisabled} variant="outlined" onClick={handlePageClick}>Předchozí stránka</Button>
                  <Button sx={{margin: '1em'}} name="next" disabled={nextPageDisabled} variant="outlined" onClick={handlePageClick}>Další stránka</Button>
              </Item>
          </Grid>
      </Grid>
  );
}
