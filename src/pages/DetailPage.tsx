import { Grid, Link } from '@mui/material'
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mock, urlCharacter } from '../App';
import axios from 'axios';

export const DetailPage = () => {

    const historyBack = useHistory();
    const params: any = useParams();
    const [detail, setDetail] = useState(mock);

    const getDetail = async () => {
        const id = params.id;
        const urlDetail = `${urlCharacter}${id}`;

        await axios
            .get(urlDetail)
            .then((res) => {
                setDetail(res.data);
            })
            .catch((error) => {
                console.log('error', error);
            });
    };

    useEffect(() => {
        getDetail();
        // eslint-disable-next-line
    }, []);

    const handleBackClick = () => {
        historyBack.push(`/`);
    }

    return (
        <Grid>
            <Grid>
                <Link
                    sx={{ cursor: 'pointer' }}
                    onClick={handleBackClick}
                >Zpět</Link>
            </Grid>

            <Grid>
                <p>ID: {detail.id}</p>
                <p>Name: {detail.name}</p>
                <p>Status: {detail.status}</p>
                <p>Species: {detail.species}</p>
                <p>Type: {detail.type}</p>
                <p>Gender: {detail.gender}</p>
                <img src={detail.image} alt={detail.name} />
            </Grid>
        </Grid>
    )

}
